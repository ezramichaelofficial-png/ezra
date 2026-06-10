import React, { useState } from "react";
import { Member, Project, LeadershipApp, getDirectDriveUrl } from "../types";
import IDCard from "./IDCard";
import Certificate from "./Certificate";
import { User, Lock, FileCheck2, Projector, Briefcase, MessageSquare, Plus, CheckCircle, Clock } from "lucide-react";
// @ts-ignore
import founderDefaultPhoto from "../assets/images/founder_portrait_1780996644889.png";

interface DashboardViewProps {
  members: Member[];
  onLogin: (id: string) => void;
  onLogout: () => void;
  currentUser: Member | null;
  projects: Project[];
  onSubmitProject: (projName: string, dept: string, country: string, desc: string) => void;
  onSubmitLeadershipApp: (dept: string, position: string, country: string, motivation: string) => void;
  departments: string[];
  clearancePins?: {
    projectPin: string;
    eventPin: string;
    leadershipPin: string;
    awardPin: string;
    whatsappLink?: string;
  };
}

export default function DashboardView({
  members,
  onLogin,
  onLogout,
  currentUser,
  projects,
  onSubmitProject,
  onSubmitLeadershipApp,
  departments,
  clearancePins
}: DashboardViewProps) {
  // Login credentials states
  const [loginInput, setLoginInput] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");

  // Create Project form states
  const [showProjForm, setShowProjForm] = useState(false);
  const [projName, setProjName] = useState("");
  const [projDept, setProjDept] = useState(departments[0] || "");
  const [projCountry, setProjCountry] = useState("");
  const [projDesc, setProjDesc] = useState("");

  // Create Leadership App states
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadDept, setLeadDept] = useState(departments[0] || "");
  const [leadPos, setLeadPos] = useState("Country Ambassador");
  const [leadCountry, setLeadCountry] = useState("");
  const [leadMotiv, setLeadMotiv] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = loginInput.trim().toUpperCase();
    const match = members.find((m) => m.id.toUpperCase() === entry || m.email.toUpperCase() === entry);

    if (match) {
      let userPin = match.pin;
      
      // Enforce correct static PIN codes for the special seeded members
      if (match.id === "POAF-00001" || match.isFounder || match.email.toUpperCase() === "EZRA.MICHAEL.OFFICIAL@GMAIL.COM") {
        userPin = "8255";
      } else if (match.id === "POAF-11111" || match.email.toUpperCase() === "CHIDERA.OKAFOR@GMAIL.COM") {
        userPin = "1111"; // Sample Member 1 PIN
      } else if (match.id === "POAF-22222" || match.email.toUpperCase() === "FATOUMATA.DIALLO@GMAIL.COM") {
        userPin = "2222"; // Sample Member 2 PIN
      } else if (!userPin || userPin.trim() === "") {
        userPin = "1234";
      }

      const inputPin = loginPin.trim();

      // Allow correct pin or the master override PIN "1000"
      if (inputPin !== userPin && inputPin !== "1000") {
        setLoginError("Invalid Security Login PIN! Access Denied.");
        return;
      }
      onLogin(match.id);
      setLoginError("");
    } else {
      setLoginError("Membership ID or registered Email not found. Try POAF-00001 (Founder / PIN 8255), Chidera (POAF-11111 / PIN 1111), Fatoumata (POAF-22222 / PIN 2222), or Kwame (POAF-33333 / PIN 3333)!");
    }
  };

  const handleProjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !projCountry || !projDesc) return;
    onSubmitProject(projName, projDept, projCountry, projDesc);
    setShowProjForm(false);
    setProjName("");
    setProjDesc("");
    alert("Project proposal submitted successfully! Pending Executive Board Approval.");
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadCountry || !leadMotiv) return;
    onSubmitLeadershipApp(leadDept, leadPos, leadCountry, leadMotiv);
    setShowLeadForm(false);
    setLeadCountry("");
    setLeadMotiv("");
    alert("Leadership application submitted successfully! Ezra Michael Jofe will review your credentials.");
  };

  // Login view if not logged in
  if (!currentUser) {
    return (
      <div className="card max-w-md mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-6 sm:p-8 text-white text-center space-y-6" id="dashboard-login-box">
        <div className="w-12 h-12 rounded-full border border-[#C9A84C] bg-neutral-900 flex items-center justify-center text-[#C9A84C] mx-auto">
          <Lock className="w-5 h-5 shrink-0" />
        </div>

        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-[#C9A84C] mb-2">Member Workspace Login</h3>
          <p className="text-[10px] text-neutral-400">
            Gain access to your custom ID Card, printable Certificate, and submit development plans
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter Membership ID (e.g. POAF-00001) or Email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] text-center font-sans"
              required
            />
            <input
              type="password"
              placeholder="Enter Security Login PIN"
              value={loginPin}
              onChange={(e) => setLoginPin(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9A84C] text-center font-sans"
              required
            />
            {loginError && <p className="text-red-500 font-bold text-[9px] mt-1.5">{loginError}</p>}
          </div>

          <button
            type="submit"
            className="w-full text-center py-2.5 rounded-lg bg-[#C9A84C] hover:bg-[#8B6914] text-neutral-950 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            Authenticate Portal Session
          </button>
        </form>

        <div className="text-[9.5px] text-neutral-500 leading-normal">
          Don't have an authentication profile yet? Register on the <strong>"Register / Join"</strong> page first to auto-generate one!
        </div>
      </div>
    );
  }

  // Logged-in profile workspace
  const isApproved = currentUser.status === "Approved";
  const userProjects = projects.filter((p) => p.submittedBy === currentUser.fullName);

  return (
    <div className="space-y-8" id="dashboard-workspace">
      {/* Upper overview profile widget card */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#C9A84C] bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
              {currentUser.photo ? (
                <img src={getDirectDriveUrl(currentUser.photo) || founderDefaultPhoto} alt={currentUser.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-8 h-8 text-[#C9A84C]" />
              )}
            </div>

            <div className="space-y-0.5">
              <h3 className="text-base font-black text-white">{currentUser.fullName}</h3>
              <p className="font-mono text-xs text-[#C9A84C] font-semibold">REF: {currentUser.id}</p>
              <div className="flex items-center gap-2 pt-1 font-semibold text-[10px]">
                <span className="text-neutral-400">Division: {currentUser.department}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-[#C9A84C]">{currentUser.leadership || "General Pioneer"}</span>
              </div>
            </div>
          </div>

          {/* Status badge & action buttons */}
          <div className="flex flex-col items-start md:items-end justify-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Account status:</span>
              <span className={`px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                isApproved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/35" : "bg-orange-500/10 text-orange-400 border border-orange-500/25"
              }`}>
                {isApproved ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
                {currentUser.status}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-[#C9A84C] font-bold transition-all mt-1"
            >
              Sign Out Session →
            </button>
          </div>
        </div>
      </div>

      {/* WHATSAPP EXCLUSIVE APPROVED PIONEER BANNER */}
      {isApproved && clearancePins?.whatsappLink && (
        <div className="bg-emerald-950 border border-emerald-800/40 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-emerald-100 shadow-xl transition-all hover:bg-emerald-900/90" id="whatsapp-join-jumbo-banner">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-900 border border-emerald-700/50 flex items-center justify-center text-xl shrink-0">
              📞
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">Continental WhatsApp Group Invited</h4>
              <p className="text-[10.5px] text-emerald-300 leading-normal max-w-xl">
                Congratulations, verified Pioneer! You are cordially invited to enter the official approved network with President Ezra Michael Jofe, administrators, and peers to advance continental strategies.
              </p>
            </div>
          </div>
          <a
            href={clearancePins.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-lg bg-[#C9A84C] hover:bg-[#8B6914] text-neutral-950 hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-all shadow-md shrink-0 block text-center cursor-pointer border border-[#C9A84C]"
          >
            Join Official WhatsApp
          </a>
        </div>
      )}

      {/* Main split row - Render Attributes vs Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side elements: Card and Certificate Generators */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-neutral-900 pb-2 mb-2 font-bold uppercase tracking-wider text-[#C9A84C] text-[10.5px]">
            🎓 Pan-African Credentials
          </div>

          {isApproved ? (
            <div className="space-y-6">
              {/* ID Card Box */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Membership Identification Badge</h4>
                <IDCard member={currentUser} />
              </div>

              {/* Certificate Box */}
              <div className="pt-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Continental Membership Award Scroll</h4>
                <Certificate member={currentUser} />
              </div>
            </div>
          ) : (
            <div className="bg-neutral-950 border-2 border-dashed border-[#C9A84C]/40 p-10 rounded-2xl text-center space-y-4">
              <Clock className="w-10 h-10 text-orange-400 mx-auto animate-pulse" />
              <h4 className="text-[#C9A84C] font-bold text-sm uppercase tracking-wider">Account Awaiting Approval</h4>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mx-auto">
                Once approved, your ID card barcodes and graduation certificates will auto-compile. Join our community chat, submit project layouts, or check out directories in the meantime!
              </p>
            </div>
          )}
        </div>

        {/* Right Side elements: Actions Console */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border-b border-neutral-900 pb-2 mb-2 font-bold uppercase tracking-wider text-[#C9A84C] text-[10.5px]">
            ⚡ Actions & Executive Office
          </div>

          {/* Executive Founder Spotlight Widget */}
          {(() => {
            const founder = members.find((m) => m.isFounder);
            return founder && (
              <div className="bg-neutral-950 border border-neutral-900 p-5 rounded-2xl space-y-4 relative overflow-hidden shadow-xl" id="dashboard-founder-card">
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 text-[8px] font-black uppercase tracking-widest font-mono">
                  Executive Desk
                </div>
                
                <div className="border-b border-neutral-900 pb-2 mb-2">
                  <h4 className="font-extrabold text-[10px] text-[#C9A84C] uppercase tracking-wider">
                    POAF Executive Founder Profile
                  </h4>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-xl border-2 border-[#C9A84C] bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center">
                    {founder.photo ? (
                      <img 
                        src={getDirectDriveUrl(founder.photo) || founderDefaultPhoto} 
                        alt="Ezra Michael Jofe" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <User className="w-6 h-6 text-[#C9A84C]" />
                    )}
                  </div>

                  <div className="space-y-0.5 text-xs text-stone-300">
                    <h5 className="font-extrabold text-neutral-105 text-sm leading-tight text-white">{founder.fullName}</h5>
                    <p className="text-[10px] text-neutral-400 font-bold tracking-wide uppercase">{founder.leadership || "Founder & President"}</p>
                    <p className="text-[9px] text-[#C9A84C] font-mono font-bold">REF ID: {founder.id}</p>
                  </div>
                </div>

                <div className="text-[10.5px] text-neutral-400 leading-relaxed font-serif italic border-l-2 border-[#C9A84C]/45 pl-3 mt-2 whitespace-pre-line">
                  "{founder.essay || "To the Visionary Youth of Africa, our continent stands on the cusp of an intellectual, civic, and practical renaissance."}"
                </div>

                <div className="pt-2 text-[9px] text-neutral-500 font-bold tracking-wide uppercase flex justify-between border-t border-neutral-900 gap-1 flex-wrap">
                  <span>📍 Continent Headquarters</span>
                  <span className="text-[#C9A84C]">✉️ {founder.email}</span>
                </div>
              </div>
            );
          })()}

          {/* Quick Submit Project */}
          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
              <span>🚀 Submit Practical Project</span>
              <button 
                onClick={() => setShowProjForm(!showProjForm)}
                className="text-[#C9A84C] font-medium text-[10px] tracking-normal font-sans hover:underline flex items-center"
              >
                {showProjForm ? "Close Form" : <Plus className="w-4 h-4 text-[#C9A84C]" />}
              </button>
            </h4>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Present a solution outline to representing departments. All submissions require manual executive oversight.
            </p>

            {showProjForm && (
              <form onSubmit={handleProjSubmit} className="space-y-3 pt-2 border-t border-neutral-900">
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dry irrigation assembly, etc."
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Country Target</label>
                  <input
                    type="text"
                    required
                    placeholder="Uganda, etc."
                    value={projCountry}
                    onChange={(e) => setProjCountry(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Target Department</label>
                  <select
                    value={projDept}
                    onChange={(e) => setProjDept(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Abstract Outline</label>
                  <textarea
                    required
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Provide a brief physical description of the innovation target..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white h-20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#C9A84C] text-neutral-950 hover:bg-[#8B6914] hover:text-white transition-colors text-xs font-bold rounded uppercase tracking-wider"
                >
                  Submit Proposal
                </button>
              </form>
            )}
          </div>

          {/* Quick Apply Leadership */}
          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
              <span>👑 Apply for Leadership Role</span>
              <button 
                onClick={() => setShowLeadForm(!showLeadForm)}
                className="text-[#C9A84C] font-medium text-[10px] tracking-normal font-sans hover:underline flex items-center"
              >
                {showLeadForm ? "Close Form" : <Plus className="w-4 h-4 text-[#C9A84C]" />}
              </button>
            </h4>
            <p className="text-[10px] text-neutral-400 leading-normal">
              Support POAF activities by filling local leadership roles such as Country Ambassador or Department Director.
            </p>

            {showLeadForm && (
              <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2 border-t border-neutral-900">
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Assigned Target Division</label>
                  <select
                    value={leadDept}
                    onChange={(e) => setLeadDept(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-[#fff]"
                  >
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Target Position</label>
                  <select
                    value={leadPos}
                    onChange={(e) => setLeadPos(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                  >
                    <option>Country Ambassador</option>
                    <option>Department Coordinator</option>
                    <option>Director of Operations</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Target Country Representation</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Nigeria, Ethiopia..."
                    value={leadCountry}
                    onChange={(e) => setLeadCountry(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-0.5">Motivation Statement</label>
                  <textarea
                    required
                    value={leadMotiv}
                    onChange={(e) => setLeadMotiv(e.target.value)}
                    placeholder="Describe how you plan to curate local campaigns or drive student enrollment..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white h-20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-[#C9A84C] text-neutral-950 hover:bg-[#8B6914] hover:text-white transition-colors text-xs font-bold rounded uppercase tracking-wider"
                >
                  Submit Executive Request
                </button>
              </form>
            )}
          </div>

          {/* User Submitted Projects list */}
          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider">My Registered Works</h4>
            <div className="space-y-2">
              {userProjects.map((p) => (
                <div key={p.id} className="p-2 bg-neutral-900 rounded flex justify-between items-center text-[11px]">
                  <div>
                    <strong className="text-neutral-200 block truncate max-w-[150px] font-bold">{p.name}</strong>
                    <span className="text-[9px] text-[#C9A84C]">{p.department}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold text-[8.5px] border ${
                    p.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-orange-500/15 text-orange-400 border-orange-500/25"
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
              {userProjects.length === 0 && (
                <span className="text-xs text-neutral-500 block italic py-2">No projects compiled yet under your name.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
