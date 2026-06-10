import React, { useState } from "react";
import { Member, Project, Event, Club, Partner, getDirectDriveUrl } from "../types";
import { User, ShieldAlert, Award, Star, Clock, HeartHandshake, Check, Globe2, Briefcase, FileText } from "lucide-react";
// @ts-ignore
import founderDefaultPhoto from "../assets/images/founder_portrait_1780996644889.png";

interface LeadershipViewProps {
  members: Member[];
  projects: Project[];
  events: Event[];
  leadershipApps: any[];
  clubs: Club[];
  partnerships: Partner[];
  onApproveMember?: (id: string) => void;
  onApproveProject?: (id: string) => void;
  onApproveEvent?: (id: string) => void;
  currentUser?: Member | null;
}

export default function LeadershipView({ 
  members, 
  projects, 
  events, 
  leadershipApps,
  clubs,
  partnerships,
  onApproveMember,
  onApproveProject,
  onApproveEvent,
  currentUser 
}: LeadershipViewProps) {
  const [activeLeaderView, setActiveLeaderView] = useState<'roster' | 'showcase' | 'requests'>('roster');
  
  const founder = members.find((m) => m.isFounder);
  const approvedMembers = members.filter((m) => m.status === "Approved" && !m.isFounder);
  const cabinetLeaders = approvedMembers.filter((m) => m.roleCategory === "Leader" || (m.leadership && m.leadership.trim() !== ""));
  const generalPioneers = approvedMembers.filter((m) => m.roleCategory !== "Leader" && (!m.leadership || m.leadership.trim() === ""));

  // Filter approved submits (projects / events)
  const approvedProjects = projects.filter((p) => p.status === "Approved");
  const approvedEvents = events.filter((e) => e.status === "Approved");

  // Filter pending membership applications & leadership applications
  const pendingRegistrations = members.filter((m) => m.status === "Pending");
  const pendingLeadershipApplications = (leadershipApps || []).filter((a) => a.status === "Pending");

  const isFounderUser = currentUser?.isFounder || currentUser?.fullName === "Ezra Michael Jofe" || currentUser?.email === "Ezra.Michael.official@gmail.com";

  return (
    <div className="space-y-8 text-stone-800" id="leadership-view">
      {/* Title */}
      <div className="border-b border-stone-200 pb-3 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-widest">
            POAF Pioneer Cabinet & Membership Board
          </h2>
          <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mt-0.5">
            Upholding academic solutions and continental integrity across student chapters
          </p>
        </div>

        {/* View Switch Tab Headers */}
        <div className="flex gap-1 bg-stone-100 p-1 border border-stone-200 rounded-lg shrink-0">
          {[
            { id: 'roster', label: 'Elders & Pioneers' },
            { id: 'showcase', label: 'Approved Showcase' },
            { id: 'requests', label: `Pending Requests (${pendingRegistrations.length + pendingLeadershipApplications.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLeaderView(tab.id as any)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeLeaderView === tab.id 
                  ? 'bg-slate-900 text-white font-black shadow-sm' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeLeaderView === 'roster' && (
        <div className="space-y-8" id="roster-view-partition">
          {/* Founder Spotlight Card */}
          {founder && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 relative overflow-hidden shadow-sm" id="founder-spotlight-box">
              {/* Aesthetic Background Stamp */}
              <div className="absolute top-4 right-4 w-12 h-12 border border-stone-200 flex items-center justify-center rounded-full text-stone-400 font-mono select-none pointer-events-none text-[8px] font-black tracking-widest uppercase rotate-12">
                Founder
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Round Avatar Container */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-stone-200 bg-stone-50 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
                  {founder.photo ? (
                    <img 
                      src={getDirectDriveUrl(founder.photo) || founderDefaultPhoto} 
                      alt={founder.fullName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <User className="w-10 h-10 text-stone-400" />
                  )}
                </div>

                {/* Profile fields */}
                <div className="text-center sm:text-left text-xs space-y-1">
                  <span className="text-[8px] tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded font-extrabold uppercase inline-block">
                    Movement Architect
                  </span>
                  <h3 className="text-lg font-black text-stone-900">{founder.fullName}</h3>
                  <p className="text-stone-600 font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Founder & President of POAF
                  </p>
                  
                  <div className="pt-2 border-t border-stone-100 max-w-2xl">
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {founder.essay}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-1">
                    <span className="text-[9px] bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded">
                      ✉️ {founder.email}
                    </span>
                    <span className="text-[9px] bg-stone-50 border border-stone-200 text-stone-700 px-2.5 py-1 rounded font-mono font-bold">
                      ID: {founder.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roster list is shown below with founder alone featured at the top cabinet block */}

          {/* Section 1: Cabinet Leaders & Officers */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">👑</span>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                POAF Executive Cabinet & Officers ({cabinetLeaders.length})
              </h3>
            </div>

            {cabinetLeaders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="cabinet-leaders-list">
                {cabinetLeaders.map((m) => (
                  <div 
                    key={m.id} 
                    className="bg-stone-50/50 border-2 border-amber-100 p-4 rounded-xl flex flex-col justify-between text-xs min-h-[160px] hover:border-amber-300 transition-all shadow-sm relative group"
                  >
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-50 border border-amber-250 flex items-center justify-center rounded-full text-amber-600 font-mono text-[9px] font-black shadow-xs">
                      ★
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 font-sans">
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center overflow-hidden shrink-0 font-bold text-amber-800 text-xs uppercase shadow-xs">
                          {m.photo ? (
                            <img src={m.photo} alt={m.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            m.fullName.charAt(0)
                          )}
                        </div>
                        <div className="truncate flex-1">
                          <strong className="text-stone-900 block truncate font-black text-[12px]">{m.fullName}</strong>
                          <span className="text-[8.5px] text-stone-500 block truncate font-medium">{m.universityTrack || m.school}</span>
                        </div>
                      </div>

                      <div className="text-left space-y-1 text-[9.5px]">
                        <p className="font-bold text-amber-800 uppercase tracking-wider bg-amber-50/70 py-1 px-2 rounded border border-amber-100 inline-block w-full text-center">
                          💼 {m.leadership || "Executive Cabinet Officer"}
                        </p>
                        <p className="text-stone-600 font-medium mt-1 block truncate">
                          <span className="text-stone-400">📍</span> {m.country} • <span className="text-[8.5px] font-bold text-stone-700">{m.department?.replace(" Department", "")}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-[8px] font-mono">
                      <span className="text-amber-800 font-bold">{m.id}</span>
                      <span className="bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded font-black uppercase text-[7.5px]">
                        OFFICER
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic py-4 bg-stone-50 rounded-lg text-center border border-stone-200 border-dashed">
                No cabinet leaders assigned at this moment. Standard members can apply for cabinet vacancies in the Apply tab.
              </p>
            )}
          </div>

          {/* Section 2: General Members & Pioneers */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 text-sm">👥</span>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Active Solution Members & Pioneers ({generalPioneers.length})
              </h3>
            </div>

            {generalPioneers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" id="general-pioneers-list">
                {generalPioneers.map((m) => (
                  <div 
                    key={m.id} 
                    className="bg-white border border-stone-200 p-3 rounded-lg flex flex-col justify-between text-xs min-h-[145px] hover:border-stone-400 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-2 font-sans">
                      <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0 font-bold text-stone-600 text-[10px] uppercase">
                        {m.photo ? (
                          <img src={m.photo} alt={m.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          m.fullName.charAt(0)
                        )}
                      </div>
                      <div className="truncate flex-1">
                        <strong className="text-stone-900 block truncate font-bold text-[11px]">{m.fullName}</strong>
                        <span className="text-[8.5px] text-stone-500 block truncate">{m.universityTrack || m.school}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-left space-y-0.5 text-[9px] text-stone-600">
                      <p className="truncate"><span className="text-stone-400 font-medium">📍</span> {m.country}</p>
                      <p className="truncate text-[8.5px] italic text-stone-500">🎯 {m.poafRoleAspiration || "Active Solution Member"}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[8px] font-mono">
                      <span className="text-stone-700 font-bold">{m.id}</span>
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-1 py-0.2 rounded font-black scale-90 uppercase">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic py-4 bg-stone-50 rounded-lg text-center border border-stone-200 border-dashed">
                No general pioneers registered at this moment.
              </p>
            )}
          </div>
        </div>
      )}

      {/* APPROVED SUBMITS SHOWCASE VIEW TAB */}
      {activeLeaderView === 'showcase' && (
        <div className="space-y-6" id="approved-showcase-view">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Cabinet Approved Student Solutions & Projects
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedProjects.map((p) => (
                <div key={p.id} className="bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-4 flex flex-col md:flex-row gap-4 transition-all text-xs text-stone-600 shadow-sm">
                  {p.photo ? (
                    <div className="w-full md:w-32 h-24 rounded border border-stone-200 shrink-0 overflow-hidden bg-stone-50">
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="w-full md:w-32 h-24 rounded border border-stone-200 shrink-0 flex items-center justify-center bg-stone-50">
                      <Briefcase className="w-8 h-8 text-stone-400" />
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-stone-900 text-[13px] font-bold">{p.name}</strong>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 border-emerald-200 border px-1.5 py-0.5 rounded select-none">Approved</span>
                    </div>
                    <p className="text-stone-500 font-semibold text-[9.5px] uppercase tracking-wider">{p.department} Division</p>
                    <p className="text-stone-600 line-clamp-2 mt-1">{p.description}</p>
                    <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-stone-500 border-t border-stone-100">
                      <span>By {p.submittedBy}</span>
                      <span>📍 {p.country}</span>
                    </div>
                  </div>
                </div>
              ))}
              {approvedProjects.length === 0 && (
                <p className="text-xs text-stone-500 italic py-12 text-center col-span-2 bg-stone-50 border border-stone-200 border-dashed rounded-xl">
                  No solutions blueprints currently published.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
              Cabinet Mandated Conferences & Assemblies Calendar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedEvents.map((e) => (
                <div key={e.id} className="bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-4 flex flex-col md:flex-row gap-4 transition-all text-xs text-stone-600 shadow-sm">
                  {e.photo ? (
                    <div className="w-full md:w-32 h-24 rounded border border-stone-200 shrink-0 overflow-hidden bg-stone-50">
                      <img src={e.photo} alt={e.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="w-full md:w-32 h-24 rounded border border-stone-200 shrink-0 flex items-center justify-center bg-stone-50">
                      <Clock className="w-8 h-8 text-stone-400" />
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-stone-900 text-[13px] font-bold">{e.name}</strong>
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 border-emerald-200 border px-1.5 py-0.5 rounded select-none">Approved</span>
                    </div>
                    <p className="text-stone-500 font-semibold text-[9.5px] uppercase tracking-wider">{e.department} Calendar</p>
                    <p className="text-stone-600 line-clamp-2 mt-1">{e.description}</p>
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between font-mono text-[9px] text-stone-500 border-t border-stone-100 gap-1">
                      <span>🕒 {e.startTime} - {e.endTime}</span>
                      <span>📅 {e.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              {approvedEvents.length === 0 && (
                <p className="text-xs text-stone-500 italic py-12 text-center col-span-2 bg-stone-50 border border-stone-200 border-dashed rounded-xl">
                  No conference events currently scheduled on the calendar.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEMBERSHIP & LEADERSHIP APPLICATIONS PENDING QUEUE */}
      {activeLeaderView === 'requests' && (
        <div className="space-y-6" id="applicants-administration-terminal">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-stone-600" /> Pioneers of Africa's Future Registrations Desk
            </h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Every membership application and leadership proposal submitted by standard accounts must be officially sanctioned by the Founder's Board under the supervision of President <strong>Ezra Michael Jofe</strong>. Standard members can view active proposals here, and the founder holds direct approval credentials.
            </p>
            {isFounderUser ? (
              <p className="text-emerald-800 font-bold block bg-emerald-50 border border-emerald-200 p-2 rounded mt-1.5">
                ● Founder Session Detected: President Ezra Michael Jofe, you have immediate clearance to approve student claims on this portal.
              </p>
            ) : (
              <p className="text-stone-500 font-medium block italic mt-1.5">
                (Note: You are currently signed in as a standard Pioneer. Direct approval can only be executed using President Jofe's administrative log.)
              </p>
            )}
          </div>

          {/* Standard Member Applicants list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-1.5 border-b border-stone-100 flex justify-between items-center">
              <span>Standard Registrations Queue ({pendingRegistrations.length})</span>
              <span className="text-[10px] font-mono text-stone-500">Awaiting Custom ID Issuance</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRegistrations.map((m) => (
                <div key={m.id} className="bg-white border border-stone-200 focus-within:border-stone-400 p-5 rounded-2xl space-y-4 relative text-xs text-stone-600 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-18 rounded border border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center shrink-0">
                      {m.photo ? (
                        <img src={m.photo} alt={m.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-6 h-6 text-stone-400" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <strong className="text-stone-900 text-base font-bold block truncate">{m.fullName}</strong>
                      <p className="text-[10px] text-stone-500 mt-0.5 truncate">{m.school} • {m.country}</p>
                      <p className="text-[10px] font-semibold text-stone-600 mt-1 uppercase tracking-wider">{m.department} Division</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <div>
                      <span className="text-stone-400 uppercase block font-bold text-[8px]">Course / Track</span>
                      <strong className="text-stone-850 block">{m.universityTrack || "Not Provided"}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase block font-bold text-[8px]">POAF Aspiration</span>
                      <strong className="text-stone-850 block">{m.poafRoleAspiration || "Pioneer Member"}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-stone-400 uppercase block font-bold text-[8px]">Skills</span>
                      <p className="text-stone-700">{m.skills || "None declared"}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-stone-400 uppercase block font-bold text-[8.5px]">Biography Background</span>
                      <p className="text-[11px] text-stone-600 bg-stone-50/50 p-2.5 rounded border border-stone-250 leading-relaxed font-sans">
                        {m.biography || "No biography provided."}
                      </p>
                    </div>

                    <div>
                      <span className="text-stone-400 uppercase block font-bold text-[8.5px]">Complete Motivation Essay</span>
                      <p className="text-[11px] text-stone-600 bg-stone-50/50 p-2.5 rounded border border-stone-250 whitespace-pre-wrap leading-relaxed font-sans">
                        "{m.essay}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-orange-600 font-bold">● Status: Awaiting Sign-off</span>
                    
                    {isFounderUser && onApproveMember && (
                      <button
                        onClick={() => {
                          onApproveMember(m.id);
                          alert(`Pioneer ${m.fullName} approved and registered into general ledger!`);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Grant Access
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {pendingRegistrations.length === 0 && (
                <p className="text-xs text-stone-500 italic py-6 text-center col-span-2">
                  No standard student registration applications pending.
                </p>
              )}
            </div>
          </div>

          {/* Leadership applications list */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-1.5 border-b border-stone-100 flex justify-between items-center">
              <span>Ambassador & Department Leader Applications ({pendingLeadershipApplications.length})</span>
              <span className="text-[10px] font-mono text-stone-500">Tactical Governance Proposals</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingLeadershipApplications.map((a) => (
                <div key={a.id} className="bg-white border border-stone-200 p-4 rounded-xl space-y-3 relative text-xs text-stone-650 shadow-sm">
                  <div>
                    <strong className="text-stone-900 text-sm font-bold block">{a.fullName}</strong>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[9px] bg-stone-100 border border-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-bold">
                        MEMBER ID: {a.memberId}
                      </span>
                      <span className="text-[9.5px] italic text-stone-500">📍 {a.country}</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] bg-stone-50 p-2 border border-stone-200 rounded">
                      <div>
                        <span className="text-stone-400 uppercase block font-bold text-[8.5px]">Proposed Position</span>
                        <strong className="text-stone-900 block">{a.position}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 uppercase block font-bold text-[8.5px]">Target Division</span>
                        <strong className="text-stone-900 block">{a.department}</strong>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-stone-650">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold mb-1">Statement of Motivation</span>
                      <p className="italic bg-stone-50/50 p-2.5 rounded border border-stone-200 font-sans">
                        "{a.motivation}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-stone-150 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-600 font-bold">● Status: Executive Audit</span>
                    
                    {isFounderUser ? (
                      <span className="text-stone-500 text-[9.5px]">
                        Please use Founder Console to approve Leadership keys.
                      </span>
                    ) : (
                      <span className="text-stone-500 text-[9px]">Submitted: {a.dateSubmitted}</span>
                    )}
                  </div>
                </div>
              ))}

              {pendingLeadershipApplications.length === 0 && (
                <p className="text-xs text-stone-500 italic py-6 text-center col-span-2">
                  No active leadership proposals pending audit.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
