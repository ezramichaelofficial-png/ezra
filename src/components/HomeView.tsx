import React from "react";
import { Member, Project, Event, Club, Partner, Award, getDirectDriveUrl } from "../types";
import { DEPARTMENTS, DEPT_DESCRIPTIONS } from "../data";
import { Award as AwardIcon, Eye, Globe2, BookOpen, Clock, HeartHandshake, User, ShieldCheck } from "lucide-react";
// @ts-ignore
import founderDefaultPhoto from "../assets/images/founder_portrait_1780996644889.png";

interface HomeViewProps {
  members: Member[];
  projects: Project[];
  events: Event[];
  clubs: Club[];
  partnerships: Partner[];
  awards: Award[];
  onJoinDepartment: (dept: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function HomeView({
  members,
  projects,
  events,
  clubs,
  partnerships,
  awards,
  onJoinDepartment,
  setActiveTab
}: HomeViewProps) {
  const approvedMembersCount = members.filter((m) => m.status === "Approved").length;
  const pendingMembersCount = members.filter((m) => m.status === "Pending").length;
  const approvedProjects = projects.filter((p) => p.status === "Approved");
  const approvedEvents = events.filter((e) => e.status === "Approved");
  const approvedClubs = clubs ? clubs.filter((c) => c.status === "Approved") : [];
  const approvedPartners = partnerships ? partnerships.filter((p) => p.status === "Approved") : [];
  const approvedAwards = awards || [];
  const founder = members.find((m) => m.isFounder);

  return (
    <div className="space-y-8 text-stone-800" id="home-view-container">
      {/* Dynamic Simple Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-12 text-center text-white relative shadow-sm overflow-hidden" id="home-hero-banner">
        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-800/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full border border-slate-700 bg-slate-850 flex items-center justify-center font-black text-white text-lg tracking-widest mx-auto mb-6 shadow-sm">
          P|AF
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase max-w-2xl mx-auto leading-tight">
          Pioneers of Africa's Future
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm font-bold tracking-widest uppercase max-w-md mx-auto mt-3">
          "Building Leaders. Solving Real Problems. Creating Africa's Future."
        </p>

        <p className="text-slate-400 text-[11px] sm:text-xs max-w-2xl mx-auto py-4 leading-relaxed">
          PIONEERS OF AFRICA'S FUTURE (POAF) is a youth-led movement established to empower students and young leaders across Africa. By uniting passionate young hearts, we inspire lasting change-makers to lead, innovate, and thrive.
        </p>

        <div className="pt-4">
          <button 
            onClick={() => setActiveTab("register")}
            className="px-6 py-2.5 rounded bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer focus:outline-none"
          >
            Join the Pan-African Movement
          </button>
        </div>
      </div>

      {/* Dynamic Count Row - Grid Box */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-4 text-center" id="home-counters-row">
        {[
          { label: "Nations United", count: "54", color: "text-slate-900" },
          { label: "Total Members", count: members.length, color: "text-slate-900" },
          { label: "Active Leaders", count: approvedMembersCount, color: "text-slate-900" },
          { label: "Pending Apps", count: pendingMembersCount, color: "text-red-650" },
          { label: "Tech Projects", count: projects.length, color: "text-slate-900" },
          { label: "Hosted Events", count: events.length, color: "text-slate-900" }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col justify-center shadow-sm">
            <span className={`${item.color} font-extrabold text-xl sm:text-2xl leading-none`}>{item.count}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block mt-2">{item.label}</span>
          </div>
        ))}
      </div>

      {/* FOUNDER'S OFFICIAL KEYNOTE MESSAGE */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm" id="founder-address-box">
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-xs text-stone-600">
          {/* Portrait frame */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-stone-200 overflow-hidden shrink-0 bg-stone-100 shadow-sm relative">
            <img 
              src={(founder && getDirectDriveUrl(founder.photo)) || founderDefaultPhoto} 
              alt="President Ezra Michael Jofe" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>

          <div className="space-y-3.5 text-center md:text-left flex-1">
            <div className="border-b border-stone-100 pb-2">
              <span className="text-slate-800 uppercase text-[9px] font-black tracking-widest bg-slate-100 border border-slate-200 px-2.5 py-1 rounded inline-block">
                Executive Desk Address
              </span>
              <h3 className="text-stone-900 text-base font-extrabold uppercase mt-2">
                A Message to the Continental Pioneers from our Founder
              </h3>
              <p className="text-[10px] text-stone-400 mt-0.5">Issued by President Ezra Michael Jofe</p>
            </div>

            <p className="italic leading-relaxed text-stone-800">
              "To the Visionary Youth of Africa, our continent stands on the cusp of an intellectual, civic, and practical renaissance. This transformation cannot be driven by abstract, distant guidelines; it must be forged at the grassroots by the brilliant actions, creative minds, and boundless energy of its young pioneers. Pioneers of Africa's Future (POAF) was established to serve as the unified launchpad for this generation of scholars and organizers."
            </p>
            <p className="leading-relaxed text-stone-600">
              "We do not look to the historical limitations of our regions as terminal boundaries. Instead, we treat them as active catalysts for the physical engineering blueprints, policy frameworks, and local leadership forums that our departments actively develop. Whether you are building an agricultural system in Kenya, writing a research tract in Nigeria, organizing academic mentorship, or establishing a school club, your actions constitute the physical stones with which we create Africa's future. Keep the standards high, respect our constitutional pillars, and let us march toward a self-determined and prosperous continent."
            </p>

            <div className="pt-2">
              <span className="text-stone-900 font-extrabold font-serif block text-sm">Ezra Michael Jofe</span>
              <span className="text-[9.5px] uppercase text-stone-500 font-mono font-bold">Founder & Executive President of POAF</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE INSTITUTIONAL MANIFESTO */}
      <div className="space-y-6" id="home-manifesto-hub">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-slate-700" /> Constitution & Core Identity
          </h3>
          <p className="text-[10px] text-stone-500 mt-0.5">The values, principles, and operations binding our continental collective</p>
        </div>

        {/* Bento Grid: Core Vision, Mission & About columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Who We Are & Closing Visionary Movement */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">Our Essence</span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mt-2">A Pan-African Movement</h4>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                PIONEERS OF AFRICA'S FUTURE (POAF) is a youth-led organization established to empower students and young leaders across Africa. POAF brings together passionate young people who are committed to leadership, innovation, education, and community development. The organization believes that Africa's future depends on the ideas, talents, and actions of its youth.
              </p>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                POAF is more than an organization; it is a movement of young Africans working together to build a brighter future. Through unity, innovation, and service, we aim to create positive change and inspire the next generation of African leaders.
              </p>
            </div>
            
            <div className="pt-4 border-t border-stone-100 font-medium">
              <span className="text-[9px] text-stone-500 uppercase font-bold block mb-1">FOUNDER & EXECUTIVE PRESIDENT</span>
              <p className="text-stone-950 text-xs font-bold font-serif">Ezra Michael Jofe</p>
              <p className="text-[10px] text-stone-400 font-mono">Pioneers of Africa's Future • Est. 2024</p>
            </div>
          </div>

          {/* Card 2: Strategic Focus (Vision & Mission) */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">Executive Vision</span>
                <p className="text-stone-800 font-serif italic text-xs leading-relaxed pt-2">
                  "To create a generation of responsible, innovative, and impactful African leaders who are prepared to solve real challenges and contribute to the development of their communities and countries."
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">Executive Mission</span>
                <p className="text-stone-800 font-serif italic text-xs leading-relaxed pt-2">
                  "To inspire young people to become change-makers through leadership development, collaboration, education, and service."
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 bg-stone-50 p-3 rounded-lg text-center">
              <span className="text-[8px] uppercase tracking-widest text-stone-500 font-bold block mb-1">Official Anthem Outline</span>
              <strong className="text-xs uppercase text-slate-800 tracking-wider block font-sans">
                "Building Leaders. Solving Real Problems. Creating Africa's Future."
              </strong>
            </div>
          </div>

          {/* Card 3: Scope of Impact & Operations */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">Macro Scope</span>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mt-2">Operational Reach Across Africa</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              POAF operates through five departments that focus on different areas of growth and impact. These departments work together to develop leadership skills, encourage innovation, strengthen education, improve communication and problem-solving abilities, and promote community outreach and youth empowerment.
            </p>
            <p className="text-stone-600 text-[11px] leading-relaxed pb-2">
              The scope of POAF extends across Africa through educational initiatives, leadership programs, innovation projects, community service activities, and youth development opportunities. The organization seeks to identify real challenges facing African communities and encourage young people to develop practical solutions that create lasting impact.
            </p>
          </div>

        </div>

        {/* DETAILED MANIFESTO PARAGRAPHS */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded inline-block">
            Constitutional Thesis & Operational Parameters
          </span>
          <h4 className="text-stone-900 text-sm font-extrabold uppercase font-serif tracking-wide border-b border-stone-100 pb-2">
            The Sovereign Vision and Architectural Mandate of POAF
          </h4>

          <div className="text-[11.5px] text-stone-600 leading-relaxed space-y-4">
            <p>
              PIONEERS OF AFRICA'S FUTURE (POAF) represents a milestone of unified youth coordination, acting as both an educational alliance and a solutions incubator for the continent’s supreme student minds. Founded upon the non-negotiable pillars of cooperative action and professional merit, POAF operates with the explicit objective of shifting the developmental index of local African communities. By establishing specialized, highly collaborative chapters inside principal schools, higher institutes, and professional hubs across all 54 African countries, we facilitate the exchange of high-value scientific insight, digital literacy, and civic leadership paradigms.
            </p>
            <p>
              Our operational blueprint leverages the distinct contributions of five key internal departments (with a sixth honorary executive organ). These divisions encompass Youth Leadership, which trains students in ethics-first governance; Science & Tech Innovation, which hosts physical code repositories and hardware diagrams for sustainable energy or agricultural frameworks; Regional Education, which designs academic forums and research journals; Problem-Solving Leagues, which analyze localized logistics barriers; and Community Outreach, which organizes active physical aid and environmental interventions. Each division coordinates directly with chapter heads to execute tasks suited to local environments.
            </p>
            <p>
              To secure a registered status on our rolls, prospective student scholars undergo an exhaustive credentials audit. This process requires applicants to align their personal values directly with our official code of conduct, which explicitly emphasizes teamwork, absolute responsibility, transparency, and scientific excellence. Once sanctioned as approved Pioneers, members receive digitally verifiable ID cards, printable credentials, and continuous access to a curated directory of partner resources, academic grants, and collaborative forums. Ultimately, POAF is more than an association of individuals—it is a self-directed, sovereign youth engine built to solve actual African challenges through unity and relentless excellence.
            </p>
            <p>
              By maintaining this high standard of academic and practical execution, POAF bridging-agents connect international networks of researchers and leaders, elevating the voice of African youth in global policy circles. Each local chapter is empowered to act with autonomy, creating micro-solutions suited specifically to local geopolitical climates, while maintaining constant digital federation with the central executive command led by Founder Ezra Michael Jofe. In this manner, we foster a structured, robust, and highly dynamic environment where practical actions lead directly to continental progress, ensuring that our motto is lived rather than just recited: Building Leaders. Solving Real Problems. Creating Africa's Future.
            </p>
          </div>
        </div>

        {/* Second Row Grid: Membership Code & Growth Dividends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section: Membership Credentials & Conduct */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 border-l-4 border-l-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <AwardIcon className="w-4 h-4 text-slate-800" /> Membership Criteria & Ethical Code
            </h4>
            
            <div className="space-y-3.5 text-[11px] text-stone-600 leading-relaxed">
              <p>
                <strong>Eligibility Protocol:</strong> Membership is open to high school students, college students, young professionals, and other motivated young people who share the organization's vision. We welcome individuals from all African countries who are willing to learn, collaborate, and contribute positively to society.
              </p>
              
              <p>
                <strong>Commitment Agreement:</strong> To join POAF, interested individuals must complete the membership registration process, agree to follow the organization's rules and values, and actively participate in meetings, projects, and activities. Members are expected to represent themselves, their communities, and their countries with integrity and professionalism.
              </p>

              <div className="p-3 bg-stone-50 rounded border border-stone-200 mt-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-500 block mb-1">Our Core Pillars</span>
                <p className="font-sans font-semibold text-stone-900">Respect, Teamwork, Responsibility, Honesty, and Excellence.</p>
                <p className="text-[10px] text-stone-500 mt-1">
                  All members are expected to treat others with dignity, maintain professionalism in all activities, avoid discrimination and harmful behavior, and contribute positively to the organization's environment. We believe that strong character is the foundation of effective leadership.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Advantages (What You Gain) */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-slate-800" /> Capital Dividends of Joining
            </h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              By joining POAF, members gain opportunities to develop leadership experience, build international friendships and networks, improve communication and teamwork skills, participate in meaningful projects, and strengthen their college and scholarship applications through recognized extracurricular involvement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-[10.5px]">
              <div className="p-3 bg-stone-55 rounded border border-stone-200 hover:border-stone-400 transition-all">
                <strong className="text-stone-900 block font-bold mb-1">🌍 Global Connections</strong>
                <span className="text-stone-500 text-[10px]">Build international alliances across 54 sister nations.</span>
              </div>
              <div className="p-3 bg-stone-55 rounded border border-stone-200 hover:border-stone-400 transition-all">
                <strong className="text-stone-900 block font-bold mb-1">🛠️ Tactical Blueprints</strong>
                <span className="text-stone-500 text-[10px]">Construct practical local solutions and research models.</span>
              </div>
              <div className="p-3 bg-stone-55 rounded border border-stone-200 hover:border-stone-400 transition-all">
                <strong className="text-stone-900 block font-bold mb-1">🎓 Certified Standing</strong>
                <span className="text-stone-500 text-[10px]">Obtain recognized membership cards and certificates of merit.</span>
              </div>
              <div className="p-3 bg-stone-55 rounded border border-stone-200 hover:border-stone-400 transition-all">
                <strong className="text-stone-900 block font-bold mb-1">⚡ Dynamic Leadership</strong>
                <span className="text-stone-500 text-[10px]">Accelerate college, job, and scholarship eligibility bounds.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Six Departments list */}
      <div>
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Operational Organs</h3>
            <p className="text-[10px] text-stone-500">Discover where your skills and focus align best with POAF's continental objectives</p>
          </div>
          <span className="text-xs font-mono text-stone-850 font-bold bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">6 Divisions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="home-departments-container">
          {DEPARTMENTS.map((dept) => (
            <div 
              key={dept} 
              className="bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all animate-fade-in"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">{dept}</h4>
                <p className="text-[10.5px] text-stone-500 leading-relaxed mb-4">{DEPT_DESCRIPTIONS[dept]}</p>
              </div>
              <button 
                onClick={() => onJoinDepartment(dept)}
                className="w-full text-center py-2 rounded bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer focus:outline-none"
              >
                Join Division
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Upcoming events & Featured Projects previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="home-multimedia-showcase">
        {/* Approved Events Preview */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm animate-fade-in">
          <div>
            <div className="flex items-center justify-between border-b border-stone-150 pb-2 mb-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-800" /> Live Event Calendars
              </h4>
              <button 
                onClick={() => setActiveTab("events")} 
                className="text-[10px] text-slate-850 font-bold uppercase tracking-wider cursor-pointer hover:underline focus:outline-none"
              >
                All Events
              </button>
            </div>

            <div className="space-y-4">
              {approvedEvents.slice(0, 3).map((e) => (
                <div key={e.id} className="p-3 bg-stone-50 rounded-lg flex flex-col sm:flex-row gap-3 border border-stone-200 hover:border-stone-300 transition-colors">
                  {e.photo ? (
                    <div className="w-full sm:w-28 h-20 rounded border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                      <img src={e.photo} alt={e.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : null}
                  <div className="text-xs flex-1 text-stone-600">
                    <div className="flex items-center justify-between gap-1">
                      <strong className="text-stone-900 block text-[11.5px] font-bold">{e.name}</strong>
                      <span className="text-[8px] bg-stone-100 border border-stone-200 text-stone-500 px-2 py-0.5 rounded font-mono shrink-0">
                        Date: {e.date}
                      </span>
                    </div>
                    <span className="text-[9.5px] text-stone-550 block mt-0.5 font-semibold font-mono">{e.department}</span>
                    <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{e.description}</p>
                    <span className="text-[8.5px] text-stone-400 font-mono block mt-1">🕒 {e.startTime} - {e.endTime}</span>
                  </div>
                </div>
              ))}
              {approvedEvents.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 text-center">No summits or meetups listed at this time.</p>
              )}
            </div>
          </div>
        </div>

        {/* Featured Projects Preview */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm animate-fade-in">
          <div>
            <div className="flex items-center justify-between border-b border-stone-150 pb-2 mb-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-slate-800" /> Active Practical Solutions
              </h4>
              <button 
                onClick={() => setActiveTab("projects")} 
                className="text-[10px] text-slate-850 font-bold uppercase tracking-wider cursor-pointer hover:underline focus:outline-none"
              >
                All Projects
              </button>
            </div>

            <div className="space-y-4">
              {approvedProjects.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 bg-stone-50 rounded-lg flex flex-col sm:flex-row gap-3 border border-stone-200 hover:border-stone-300 transition-colors">
                  {p.photo ? (
                    <div className="w-full sm:w-28 h-20 rounded border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : null}
                  <div className="text-xs flex-1 text-stone-600">
                    <strong className="text-stone-900 font-bold block">{p.name}</strong>
                    <span className="text-[9.5px] text-stone-500 block mt-0.5">{p.department} • Originated: {p.country}</span>
                    <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">{p.description}</p>
                    <span className="text-[8.5px] italic text-stone-400 block mt-1 font-mono">Published by Pioneer {p.submittedBy}</span>
                  </div>
                </div>
              ))}
              {approvedProjects.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 text-center">No student innovations published yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approved Clubs, Partnerships, and Awards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="home-community-showcase">
        {/* Approved Clubs */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm animate-fade-in" id="home-clubs-section">
          <div>
            <div className="flex items-center justify-between border-b border-stone-150 pb-2 mb-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-slate-800" /> Sanctioned Clubs
              </h4>
            </div>
            <div className="space-y-3">
              {approvedClubs.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-slate-800 block">{c.clubName}</span>
                  <span className="text-[9px] text-stone-400 block mt-0.5">{c.school} • {c.country}</span>
                  {c.writtenProposal && (
                    <p className="text-[9.5px] text-stone-550 mt-1 line-clamp-2 italic">"{c.writtenProposal}"</p>
                  )}
                </div>
              ))}
              {approvedClubs.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 text-center animate-pulse">No school clubs approved yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Approved Partnerships / Partners */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm animate-fade-in" id="home-partnerships-section">
          <div>
            <div className="flex items-center justify-between border-b border-stone-150 pb-2 mb-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-slate-800" /> Official Partners
              </h4>
            </div>
            <div className="space-y-3">
              {approvedPartners.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-slate-800 block">{p.organization}</span>
                  <span className="text-[9px] text-stone-400 block mt-0.5">Origin: {p.country}</span>
                  {p.writtenProposal && (
                    <p className="text-[9.5px] text-stone-550 mt-1 line-clamp-2 italic">"{p.writtenProposal}"</p>
                  )}
                </div>
              ))}
              {approvedPartners.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 text-center">No corporate alliances logged.</p>
              )}
            </div>
          </div>
        </div>

        {/* Issued Awards */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm animate-fade-in" id="home-awards-section">
          <div>
            <div className="flex items-center justify-between border-stone-150 border-b pb-2 mb-4">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <AwardIcon className="w-4 h-4 text-slate-800" /> Laurels & Merits
              </h4>
            </div>
            <div className="space-y-3">
              {approvedAwards.slice(0, 4).map((aw) => (
                <div key={aw.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex gap-2">
                  {aw.photo ? (
                    <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                      <img src={aw.photo} alt={aw.category} className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  <div className="text-xs flex-1 text-stone-600">
                    <strong className="text-stone-900 font-bold block text-[10px] uppercase">{aw.category}</strong>
                    <span className="text-[9px] text-stone-400 block">{aw.memberName} • {aw.memberCountry}</span>
                    {aw.title && (
                      <span className="text-[9px] text-slate-850 font-semibold block mt-0.5">{aw.title}</span>
                    )}
                    {aw.description && (
                      <p className="text-[9px] text-stone-500 line-clamp-1 italic">"{aw.description}"</p>
                    )}
                  </div>
                </div>
              ))}
              {approvedAwards.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 text-center">No executive awards issued yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
