import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Member } from "../types";

interface AIChatProps {
  currentUser: Member | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat({ currentUser }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am Auto Ezra, your official automated POAF guidance counselor and academic solution advisor.

To access guidance, templates, or strategic coordination support, please follow these steps:
1. 💡 **Academic Project Blueprints**: Ask about our blueprint templates, design requirements, and how to submit them of academic divisions.
2. 🗓️ **Assemblies & Gatherings**: Request support on calendarizing local chapter assemblies or regional summits.
3. 🤝 **Campus Clubs & Alliances**: Learn how to successfully initiate registered clubs on school campi and secure executive alliances.
4. ⚙️ **Access & ID Card Sync**: Ask how to join the general ledger and synchronize your active member certificates and identity details!

I am modeled directly after president and founder Ezra Michael Jofe. How may I guide you on your journey to empower African youth today?`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = messageText.trim();
    if (!prompt) return;

    // Append user message
    const updatedMessages = [...messages, { role: "user" as const, content: prompt }];
    setMessages(updatedMessages);
    setMessageText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: currentUser ? {
            id: currentUser.id,
            fullName: currentUser.fullName,
            country: currentUser.country,
            department: currentUser.department,
            leadership: currentUser.leadership || "Member",
            status: currentUser.status
          } : null
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setMessages([...updatedMessages, { role: "assistant" as const, content: data.text }]);
      } else {
        setMessages([...updatedMessages, { role: "assistant" as const, content: data.error || "Auto Ezra experienced a communication gap. Let's try once more!" }]);
      }
    } catch (err: any) {
      setMessages([...updatedMessages, { role: "assistant" as const, content: `Error connecting to Auto Ezra: ${err.message || err}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="auto-ezra-ai-assistant">
      {/* Floating Chat Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer relative group border border-slate-800 focus:outline-none"
        id="btnToggleAi"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-900"></span>
        </span>
        {isOpen ? <X className="w-6 h-6 shrink-0" /> : <MessageSquare className="w-6 h-6 shrink-0" />}
        <span className="absolute right-16 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-800 scale-0 group-hover:scale-100 transition-all shadow-md pointer-events-none whitespace-nowrap">
          Chat with Auto Ezra
        </span>
      </button>

      {/* Chatbox Panel */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-white text-stone-900 rounded-2xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden animate-slide-up"
          id="ai-chat-box"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-slate-705 bg-slate-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">Auto Ezra</h4>
                <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider mt-0.5 font-sans">POAF AI Advisor</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick context / current status warning */}
          <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 text-[10px] text-stone-600 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse shrink-0" />
            Online & Ready • Interacts as Auto Ezra Advisor
          </div>

          {/* Chat Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/60 transition-all" id="chat-scroller">
            {messages.map((m, index) => (
              <div 
                key={index} 
                className={`flex gap-2.5 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border font-bold text-[10px] ${
                  m.role === "user" 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-stone-105 text-stone-700 border-stone-300"
                }`}>
                  {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Msg Content */}
                <div className={`p-3 rounded-2xl text-[12px] leading-relaxed relative ${
                  m.role === "user" 
                    ? "bg-slate-900 text-white rounded-tr-none shadow-sm" 
                    : "bg-white text-stone-800 border border-stone-200 shadow-sm rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-stone-105 text-stone-700 border border-stone-200 flex items-center justify-center animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-stone-200 text-stone-400 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask Auto Ezra about POAF guidance or blueprints..."
              className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-slate-800 text-stone-900 placeholder-stone-500 font-sans"
              disabled={isTyping}
              id="aiInput"
            />
            <button
              type="submit"
              disabled={isTyping || !messageText.trim()}
              className="p-2.5 rounded-xl bg-slate-900 text-white disabled:bg-stone-100 disabled:text-stone-400 shrink-0 transition-colors cursor-pointer focus:outline-none"
              id="btnSendAi"
            >
              <Send className="w-4 h-4 shrink-0" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
