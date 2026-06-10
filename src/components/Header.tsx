import React from "react";
import { ShieldCheck, Award, Users, BookOpen, MessageSquare, Calendar, FolderGit2, Star, Radio, Network, MapPin, Search } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationCount: number;
  onShowNotifications: () => void;
}

export default function Header({ activeTab, setActiveTab, notificationCount, onShowNotifications }: HeaderProps) {
  const tabs = [
    { id: "home", label: "Home", icon: BookOpen },
    { id: "leadership", label: "Leadership", icon: Users },
    { id: "departments", label: "Departments", icon: Radio },
    { id: "register", label: "Register / Join", icon: ShieldCheck },
    { id: "dashboard", label: "My Dashboard", icon: ShieldCheck },
    { id: "directory", label: "Directory & Verify", icon: Search },
    { id: "network", label: "Africa Network", icon: Network },
    { id: "events", label: "Events", icon: Calendar },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "apply-leadership", label: "Leadership App", icon: Award },
    { id: "awards", label: "Awards Board", icon: Award },
    { id: "chat", label: "Community Chat", icon: MessageSquare },
    { id: "partners", label: "Clubs & Partners", icon: MapPin },
    { id: "founder", label: "Founder Portal", icon: ShieldCheck }
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab("home")} 
          className="flex items-center gap-3 cursor-pointer group"
          id="poaf-logo-header"
        >
          <div className="w-12 h-12 rounded-full border border-stone-200 bg-stone-50 flex items-center justify-center font-extrabold text-stone-800 tracking-wide shadow-sm transition-transform group-hover:scale-105">
            P|AF
          </div>
          <div>
            <h1 className="text-stone-900 font-extrabold text-lg md:text-xl leading-none">POAF</h1>
            <span className="text-[10px] text-stone-500 block tracking-wider font-semibold uppercase mt-0.5">Pioneers of Africa's Future</span>
          </div>
        </div>

        {/* TOP INTERACTIVE GROUP */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3 justify-end">
          {/* Notifications area */}
          <button 
            onClick={onShowNotifications}
            className="relative px-3 py-1.5 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
            id="heading-btn-notif"
          >
            <span>🔔</span> Notifications
            {notificationCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                {notificationCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab("directory")}
            className="px-3 py-1.5 rounded bg-white border border-stone-200 hover:border-stone-400 text-stone-700 text-xs font-semibold transition-colors focus:outline-none"
            id="heading-btn-verify"
          >
            Verify ID
          </button>

          <button 
            onClick={() => setActiveTab("register")}
            className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors focus:outline-none"
            id="heading-btn-join"
          >
            Join POAF
          </button>

          <button 
            onClick={() => setActiveTab("founder")}
            className="px-3 py-1.5 rounded bg-stone-50 border border-dashed border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all focus:outline-none"
            id="heading-btn-founder"
          >
            Founder Portal
          </button>
        </div>
      </div>

      {/* HORIZONTAL TIMELINE OF PAGES */}
      <nav className="bg-stone-50 border-t border-stone-100 overflow-x-auto scrollbar-none" id="main-navigation-bar">
        <div className="max-w-7xl mx-auto flex px-2 whitespace-nowrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer focus:outline-none ${
                  isSelected 
                    ? "text-slate-900 border-slate-900 bg-stone-200/40" 
                    : "text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300"
                }`}
                id={`nav-link-${tab.id}`}
              >
                <Icon className="w-3.5 h-3.5 text-stone-500" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
