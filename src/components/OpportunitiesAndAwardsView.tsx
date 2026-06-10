import React, { useState } from "react";
import { Award } from "../types";
import { Trophy, Star as StarIcon, Lock, Image as ImageIcon, AlertCircle } from "lucide-react";

interface OpportunitiesAndAwardsViewProps {
  awards: Award[];
  onAddAward: (
    category: "Student of the Month" | "Innovator of the Month" | "Researcher of the Month", 
    memberId: string, 
    name: string, 
    country: string,
    title?: string,
    description?: string,
    photo?: string
  ) => void;
  membersList: any[];
  currentUser?: any;
  awardPin: string;
}

export default function OpportunitiesAndAwardsView({
  awards,
  onAddAward,
  membersList,
  currentUser,
  awardPin: propAwardPin
}: OpportunitiesAndAwardsViewProps) {
  // Awards states
  const [awardCategory, setAwardCategory] = useState<"Student of the Month" | "Innovator of the Month" | "Researcher of the Month">("Student of the Month");
  const [targetId, setTargetId] = useState("");
  const [awardTitle, setAwardTitle] = useState("");
  const [awardDesc, setAwardDesc] = useState("");
  const [awardPhoto, setAwardPhoto] = useState("");
  const [awardPin, setAwardPin] = useState("");

  const isFounder = currentUser?.isFounder || currentUser?.fullName === "Ezra Michael Jofe";

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(awardDesc);

  const handlePhotoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAwardPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAwardsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFounder) {
      alert("Unauthorized! Only the Founder (Ezra Michael Jofe) can award monthly honors.");
      return;
    }
    if (awardPin !== propAwardPin) {
      alert("Invalid Award Clearance PIN! Please double check.");
      return;
    }

    if (wordCount > 150) {
      alert(`Description must be less than 150 words! (Currently at ${wordCount})`);
      return;
    }

    const match = membersList.find((m) => m.id.toUpperCase() === targetId.toUpperCase());
    if (!match) {
      alert("No active member found with ID: " + targetId);
      return;
    }

    onAddAward(
      awardCategory, 
      match.id, 
      match.fullName, 
      match.country, 
      awardTitle.trim(), 
      awardDesc.trim(), 
      awardPhoto
    );

    // Clear state
    setTargetId("");
    setAwardTitle("");
    setAwardDesc("");
    setAwardPhoto("");
    setAwardPin("");
    alert(`${awardCategory} Award successfully assigned to ${match.fullName}!`);
  };

  return (
    <div className="space-y-8" id="awards-view-panel">
      {/* Dynamic Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-serif text-neutral-900 font-extrabold uppercase tracking-wide">
          POAF Monthly Honours & Hall of Fame
        </h2>
        <p className="text-stone-600 text-[11.5px] leading-relaxed mt-2.5 max-w-2xl">
          We recognize the extraordinary progress of pioneers in our student union. Active leaders and student scholars who push bounds in local campus chapters across Africa are decorated here with premium digital badges and print-ready certificates signed directly by Founder Ezra Michael Jofe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Assign Award tool */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-neutral-900 pb-2 mb-4">
              <h4 className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#C9A84C]" /> Assign Monthly Honours
              </h4>
              <span className="text-[9px] text-neutral-400 font-bold block">Executive Platform Action</span>
            </div>

            {!isFounder ? (
              <div className="p-5 bg-neutral-900/50 border border-red-900/30 rounded-lg text-xs text-center space-y-3 my-4">
                <div className="text-2xl">🔒</div>
                <h5 className="font-bold text-red-500 uppercase tracking-wider">Executive Lock</h5>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Only the Founder and President, <strong>Ezra Michael Jofe</strong>, maintains the authority to assign student honors, innovators of the month, or researcher stamps. Please login with Founder credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAwardsSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block mb-1 font-bold">Award Category *</label>
                  <select
                    value={awardCategory}
                    onChange={(e: any) => setAwardCategory(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-white"
                  >
                    <option value="Student of the Month">Student of the Month</option>
                    <option value="Innovator of the Month">Innovator of the Month</option>
                    <option value="Researcher of the Month">Researcher of the Month</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block mb-1 font-bold">Recipient Membership ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. POAF-00001"
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-white font-sans placeholder-neutral-600"
                  />
                  <span className="text-[8.5px] text-neutral-400 block mt-1 font-mono">Ensure recipient is an approved member in the active directory</span>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block mb-1 font-bold">Awarded Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Excellence in Tech Leadership"
                    value={awardTitle}
                    onChange={(e) => setAwardTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-white font-sans placeholder-neutral-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block font-bold">Award Citation / Description * (Max 150 Words)</label>
                    <span className={`text-[9.5px] font-mono font-bold ${wordCount > 150 ? "text-rose-500" : "text-[#C9A84C]"}`}>
                      {wordCount} / 150
                    </span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a description of the recipient's milestone achievement..."
                    value={awardDesc}
                    onChange={(e) => setAwardDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-white font-sans placeholder-neutral-600 leading-relaxed"
                  />
                  {wordCount > 150 && (
                    <p className="text-rose-500 font-bold text-[9px] flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> Word count limit exceeded. Keep it below 150 words!
                    </p>
                  )}
                </div>

                {/* Secure base64 file uploader for award image */}
                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block mb-1 font-bold">Award Photo (Optional)</label>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between gap-3">
                    <div className="w-10 h-10 rounded border border-neutral-800 overflow-hidden bg-neutral-950 flex items-center justify-center shrink-0">
                      {awardPhoto ? (
                        <img src={awardPhoto} alt="Award Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-neutral-500" />
                      )}
                    </div>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoImageUpload}
                      className="text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-[#C9A84C] file:text-black hover:file:bg-[#8B6914] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-neutral-400 block mb-1 font-bold">Executive PIN Code *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter clearance PIN"
                    value={awardPin}
                    onChange={(e) => setAwardPin(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-white font-sans placeholder-neutral-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={wordCount > 150}
                  className={`w-full text-center py-2.5 text-neutral-950 font-black uppercase rounded text-xs tracking-wider transition-colors cursor-pointer shrink-0 font-sans ${wordCount > 150 ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-[#C9A84C] hover:bg-[#8B6914] hover:text-white'}`}
                  id="confirmAwardAssign"
                >
                  Issue Medal Stamp
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Honor Roll Board */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-xl p-5 flex flex-col h-[520px]">
          <div className="border-b border-neutral-900 pb-2 mb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <StarIcon className="w-4 h-4 text-[#C9A84C]" /> Hall of Honour Recipients
            </h4>
            <span className="text-[9px] text-neutral-400 font-bold block">Historic monthly allocations</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {awards.map((a) => (
              <div key={a.id} className="p-4 bg-neutral-900/50 rounded-lg flex flex-col sm:flex-row justify-between text-xs border border-neutral-800 border-l-4 border-l-[#C9A84C] hover:border-neutral-700 transition-colors gap-4">
                <div className="flex-1 space-y-2">
                  <div>
                    <strong className="text-neutral-100 font-bold text-sm block">{a.memberName}</strong>
                    <span className="text-[10px] text-[#C9A84C] font-semibold tracking-wider font-mono block mt-0.5">{a.category}</span>
                  </div>

                  {a.title && (
                    <div className="bg-neutral-950/80 rounded border border-neutral-900 p-2 border-l-2 border-l-[#C9A84C]">
                      <span className="text-[8.5px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Honour Title</span>
                      <strong className="text-white text-xs block">🏆 {a.title}</strong>
                    </div>
                  )}

                  {a.description && (
                    <div className="text-neutral-300 leading-relaxed text-[11px] font-sans">
                      "{a.description}"
                    </div>
                  )}

                  {a.photo && (
                    <div className="w-40 h-28 rounded border border-neutral-800 overflow-hidden bg-neutral-950 mt-1">
                      <img src={a.photo} alt={a.title || a.category} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-[9.5px] text-neutral-500 font-mono mt-1">
                    ID Ref: {a.memberId} • Region: {a.memberCountry}
                  </p>
                </div>
                <div className="text-right shrink-0 self-start">
                  <span className="text-[9.5px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded block">{a.date}</span>
                </div>
              </div>
            ))}
            {awards.length === 0 && (
              <p className="text-xs text-neutral-500 italic text-center py-12">No monthly allocations stored.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
