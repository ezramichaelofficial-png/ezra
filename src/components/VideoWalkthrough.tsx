import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Youtube, Video, ChevronRight, X, Volume2, VolumeX, Sparkles } from "lucide-react";

interface VideoWalkthroughProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

interface TutorialChapter {
  id: string;
  name: string;
  tabKey: string;
  duration: string;
  narrative: string[];
  visualSteps: string[];
}

const NARRATIVES: Record<string, TutorialChapter> = {
  home: {
    id: "chapter-1",
    name: "Home Tab Walkthrough",
    tabKey: "home",
    duration: "1:45",
    narrative: [
      "Welcome to Pioneers of Africa's Future, founded by Ezra Michael Jofe.",
      "This home page gives student pioneers an overview of our core principles: Building Solutions, Empowering Students, and Transforming Africa.",
      "Scroll down to see our Pan-African news ticker, dynamic department blocks, real-time activity metrics, and our strategic goals.",
      "Join the department that matches your interest to get started on your journey."
    ],
    visualSteps: [
      "Displaying Welcome Banner & Vision Statement",
      "Scanning Live Stats Dashboard Across 54 Nations",
      "Listing the 6 Core Operational Divisions",
      "Exploring Department Integration Tracks"
    ]
  },
  leadership: {
    id: "chapter-2",
    name: "Leadership Roster Tour",
    tabKey: "leadership",
    duration: "1:30",
    narrative: [
      "Welcome to the official POAF Cabinet Directory and Leadership Board.",
      "Here, you can examine verified pan-African leaders, directors, and ambassadors representing over dozens of countries.",
      "You can filter regional officers by operational departments or sort by active leadership milestones.",
      "Each leader possesses a unique leadership ID card and verifiable credentials issued by our executive assembly."
    ],
    visualSteps: [
      "Opening POAF Cabinet Roster",
      "Filtering Ambassadors by Academic Department",
      "Reviewing Verified Ambassador credentials",
      "Exploring administrative leader citations"
    ]
  },
  register: {
    id: "chapter-3",
    name: "Student Enrollment Register",
    tabKey: "register",
    duration: "2:10",
    narrative: [
      "In this tutorial chapter, we're registering for active POAF Membership.",
      "Fill in your name, contact phone, email, country, school, and current academic track details.",
      "Important: Your Motivation Essay must be between 150 to 300 words to secure executive approval.",
      "Upload a transparent profile photo to automatically generate your physical ID card & printable certificate.",
      "Create a secure numerical login PIN to access your student ledger later."
    ],
    visualSteps: [
      "Accessing Roster Registration Forms",
      "Typing Academic Profile & Country of Origin",
      "Validating Word Bounds on Motivation Essay (150-300 words)",
      "Uploading Member Profile Photo Identifier",
      "Confirming secure Clearance PIN setup"
    ]
  },
  dashboard: {
    id: "chapter-4",
    name: "Pioneer Portal Dashboard",
    tabKey: "dashboard",
    duration: "2:40",
    narrative: [
      "This is your primary Student Pioneer Portal and credentials synchronization center.",
      "Input your Approved Student ID and numerical PIN to securely sign in.",
      "Once logged in, compile and generate your physical 3D-styled POAF Membership Card.",
      "Generate and print your formal printable Pan-African Active Builder Certificate with numeric reference keys.",
      "Submit student innovative projects, propose community summits, or explore opportunities directly."
    ],
    visualSteps: [
      "Rendering User Security Clearance gate",
      "Verifying credentials against the general ledger",
      "Synthesizing 3D Active Member ID Card",
      "Drafting printable Academic PDF Certificate",
      "Opening options to file project blueprints"
    ]
  },
  directory: {
    id: "chapter-5",
    name: "General Student Ledger Search",
    tabKey: "directory",
    duration: "1:55",
    narrative: [
      "This chapter guides you through the live Pan-African Registry and verification directory.",
      "Type any name, student ID, or city to inspect approved members active across Africa.",
      "Every approved builder is logged in our real-time system database with active clearance indicators.",
      "Verify registration details to prevent coordinate fraud and ensure academic compliance."
    ],
    visualSteps: [
      "Opening Active Pioneer Roster Index",
      "Typing search queries in verification box",
      "Scanning live status indicators",
      "Inspecting verified regional biographies"
    ]
  },
  network: {
    id: "chapter-6",
    name: "Interactive Geolocation Map",
    tabKey: "network",
    duration: "1:20",
    narrative: [
      "Let's explore our interactive Pan-African Geolocation Network map.",
      "Every country coordinates projects and schedules gatherings under localized ambassadors.",
      "Hover over any highlight marker on the map to see active members, school hubs, and projects.",
      "See how POAF acts as a unified digital mesh interconnecting builders from Algiers to Cape Town."
    ],
    visualSteps: [
      "Loading Pan-African Geolocation Map",
      "Analyzing active country clusters",
      "Hovering over regional hubs & universities",
      "Checking coordinates of school chapters"
    ]
  },
  awards: {
    id: "chapter-7",
    name: "Honours & Milestone Board",
    tabKey: "awards",
    duration: "1:35",
    narrative: [
      "Welcome to the prestigious Honours Board and Student Excellence Gallery.",
      "Here, POAF officially celebrates exceptional builders selected for strategic categories.",
      "Explore categories like Student of the Month, Innovator of the Month, and Researcher of the Month.",
      "Honorees receive physical crest engravings, administrative score multiplier tags, and publication rights."
    ],
    visualSteps: [
      "Opening Honors Crest Roster",
      "Filtering by Innovation vs Research Categories",
      "Reading peer verification citations",
      "Reviewing visual accolades of outstanding students"
    ]
  },
  events: {
    id: "chapter-8",
    name: "Summit Calendar Coordinator",
    tabKey: "events",
    duration: "2:05",
    narrative: [
      "This is our active Summit Calendar and regional gathering coordinator.",
      "Browse upcoming seminars, workshop classes, local campus meetups, and continental summits.",
      "You can filter schedule cards by operational departments or register your attendance with one click.",
      "Need to proposal a student gathering? Submit the event name and description with 100-700 words."
    ],
    visualSteps: [
      "Accessing Continental Event Calendar",
      "Filtering by administrative division type",
      "Filing student meetup proposal configurations",
      "Verifying description character/word limits (100-700 words)"
    ]
  },
  projects: {
    id: "chapter-9",
    name: "Creative Resource Registry",
    tabKey: "projects",
    duration: "2:20",
    narrative: [
      "This chapter covers the Creative Resource Registry and Academic Blueprint Directory.",
      "Students share low-cost models, agricultural blueprints, software tools, and scientific journals.",
      "You can read physical documentation summaries, copy layout parameters, or search by tech categories.",
      "To submit your blueprint, fill in the metadata. Descriptions must be strictly between 100 and 700 words."
    ],
    visualSteps: [
      "Scanning student Innovation Registry",
      "Filing a design layout proposal",
      "Validating Project description constraints (100-700 words)",
      "Proposing prototype schematics for review"
    ]
  },
  "apply-leadership": {
    id: "chapter-10",
    name: "Cabinet Leadership Applications",
    tabKey: "apply-leadership",
    duration: "2:15",
    narrative: [
      "This tutorial guides you on joining the official leadership cabinet of POAF.",
      "Inquire on available openings like Country Representatives, Chapter Directors, and Tech Advisors.",
      "Input your Registered Student ID, select your targeted department, and draft your manifest proposal.",
      "Note: Your Leadership Motivation Manifesto must be strictly inside the 150 to 300 words category.",
      "Submit with your numerical credential application PIN to register your ambition."
    ],
    visualSteps: [
      "Exploring Leader Openings board",
      "Inputting Registered Pioneer ID link",
      "Drafting Motivation Manifesto (150-300 words check)",
      "Confirming Cabinet review queues"
    ]
  },
  chat: {
    id: "chapter-11",
    name: "Pan-African Communication Hub",
    tabKey: "chat",
    duration: "1:40",
    narrative: [
      "Welcome to our real-time peer communication channels and collaboration spaces.",
      "Approved general members can participate in public channels to brainstorm and coordinate operations.",
      "Cabinet leaders and regional coordinators access a secure private room to execute executive strategies.",
      "Read real-time announcements from Founder Ezra Michael Jofe to stay informed on continental directives."
    ],
    visualSteps: [
      "Opening Real-Time Student Assembly chat",
      "Switching between General and Cabinet channels",
      "Verifying user security and clearance filters",
      "Reviewing founder's pinned announcements"
    ]
  },
  partners: {
    id: "chapter-12",
    name: "Strategic Alliance Chambers",
    tabKey: "partners",
    duration: "1:50",
    narrative: [
      "Welcome to the Strategic Alliance and Partners Center.",
      "Here, POAF coordinates development work with NGOs, foundations, tech registries, and colleges.",
      "Propose cooperation agendas on behalf of your school or business.",
      "Partnership written proposals must be strictly validated between 100 and 700 words."
    ],
    visualSteps: [
      "Inspecting live alliance partnerships roster",
      "Filing formal cooperation blueprints",
      "Validating partnership proposal lengths (100-700 words)",
      "Submitting organization coordinates for executive review"
    ]
  },
  founder: {
    id: "chapter-13",
    name: "Presidential Administration Board",
    tabKey: "founder",
    duration: "3:10",
    narrative: [
      "This is Founder Ezra Michael Jofe's official Presidential Administration Board.",
      "Log in with authorized credentials to access administrative levers.",
      "Approve pending members, authorize project submissions, calendar events, and register chapters.",
      "Perform secure bulk data operations, seed rosters, or execute individual and full directory housecleaning."
    ],
    visualSteps: [
      "Bypassing Founder Security Verification login",
      "Scanning pending administrative approval queues",
      "Inspecting Direct Seeding and Bulk Roster Engines",
      "Validating individual and bulk deletion sweeps for all active data"
    ]
  }
};

export default function VideoWalkthrough({ activeTab, onNavigateTab }: VideoWalkthroughProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(activeTab);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const playTimerRef = useRef<number | null>(null);

  const activeChap = NARRATIVES[selectedTopic] || NARRATIVES.home;

  // Auto select chapter when user switches tabs on main website or when opening walkthrough panel
  useEffect(() => {
    setSelectedTopic(activeTab);
    setCurrentTimeMs(0);
    setIsPlaying(false);
  }, [activeTab]);

  // Video progress timeline bar ticker loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = window.setInterval(() => {
        setCurrentTimeMs((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            return 100;
          }
          return prev + 1.5;
        });
      }, 150);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentTimeMs >= 100) {
      setCurrentTimeMs(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentTimeMs(0);
    setIsPlaying(false);
  };

  // Convert 0-100 percentage back to virtual clock timer seconds
  const totalSeconds = parseDuration(activeChap.duration);
  const currentSeconds = Math.round((currentTimeMs / 100) * totalSeconds);

  // Synchronize story subtitles text smoothly across our chronological play state percentage
  const totalNarratives = activeChap.narrative.length;
  const currentNarrativeIndex = Math.min(
    Math.floor((currentTimeMs / 100) * totalNarratives),
    totalNarratives - 1
  );
  const currentNarrativeText = activeChap.narrative[currentNarrativeIndex] || "";

  // Synchronize visual operational highlights based on timing
  const totalVisuals = activeChap.visualSteps.length;
  const currentVisualIndex = Math.min(
    Math.floor((currentTimeMs / 100) * totalVisuals),
    totalVisuals - 1
  );
  const currentVisualText = activeChap.visualSteps[currentVisualIndex] || "";

  function parseDuration(durStr: string): number {
    const parts = durStr.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function formatSeconds(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  return (
    <div className="bg-neutral-900 text-white rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-inner" id="system-video-guide-panel">
      {/* Short Summary Bar with expansion button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] animate-pulse">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-100 flex items-center gap-1.5 font-sans">
              POAF System Video Instruction Guide <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            </h3>
            <p className="text-[10px] text-neutral-400">Interactive live walkthrough of the entire POAF Platform</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3.5 py-1.5 rounded-lg bg-[#C9A84C] hover:bg-neutral-800 text-neutral-950 hover:text-[#C9A84C] font-extrabold text-[10px] uppercase tracking-wider transition-all border border-[#C9A84C] cursor-pointer"
        >
          {isOpen ? "Close Virtual Walkthrough" : "▶ Start Guided Website Video"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5 animate-slide-up">
          {/* Chapter Guide Panel */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-black text-[#C9A84C] tracking-widest">Select Video Lesson</h4>
              <p className="text-[9.5px] text-neutral-400 leading-relaxed mb-2">Each lesson dynamically guides you through a specific page setup and shows submission validation details.</p>
              
              <div className="space-y-1 max-h-[170px] overflow-y-auto pr-1 scrollbar-thin">
                {Object.keys(NARRATIVES).map((key) => {
                  const chap = NARRATIVES[key];
                  const isCurrent = selectedTopic === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedTopic(key);
                        setCurrentTimeMs(0);
                        setIsPlaying(false);
                        onNavigateTab(key);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isCurrent 
                          ? "bg-[#C9A84C]/10 text-white border-l-2 border-[#C9A84C] font-semibold" 
                          : "text-neutral-400 hover:bg-neutral-900 border-l border-transparent"
                      }`}
                    >
                      <span className="truncate">{chap.name}</span>
                      <span className="text-[9px] font-mono text-neutral-500">{chap.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-850 text-neutral-500 text-[9px] font-medium leading-normal">
              💡 <span className="text-neutral-300">Tip:</span> Navigating tabs inside the core menu automatically syncs this virtual video lesson pointer!
            </div>
          </div>

          {/* Expanded Video Simulator View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#0c0d0e] rounded-xl border border-neutral-800 overflow-hidden relative">
              {/* Header inside player */}
              <div className="bg-neutral-950/80 px-4 py-2 flex justify-between items-center text-[10px] font-mono border-b border-neutral-850/60 text-neutral-400 z-10 relative">
                <span className="flex items-center gap-1.5 uppercase font-bold text-[#C9A84C]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping shrink-0" />
                  MOCK RECORDING: ACTIVE LESSON
                </span>
                <span>CHAPTER: {activeChap.name}</span>
              </div>

              {/* The Mock Screen Animation Area */}
              <div className="h-44 flex flex-col justify-center items-center p-4 text-center bg-radial from-neutral-900 to-neutral-950 relative overflow-hidden">
                
                {/* Visual dynamic representations of app behavior */}
                <div className="space-y-2 z-10">
                  <div className="inline-block px-3 py-1 bg-neutral-900/90 border border-[#C9A84C]/30 text-white rounded-lg text-xs font-semibold shadow-lg uppercase tracking-wide">
                    🖥️ {currentVisualText}
                  </div>
                  
                  {/* Progress simulator */}
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[8px] font-mono rounded">URL: poaf.org/{selectedTopic}</span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[8px] font-mono rounded font-bold uppercase tracking-wider">SECURE SYNC</span>
                  </div>
                </div>

                {/* Simulated UI components elements animating based on play percent */}
                <div className="absolute inset-0 opacity-10 flex flex-col justify-around p-2 pointer-events-none select-none text-[8px] font-mono text-neutral-300 text-left">
                  <div>[GET] /api/data APPROVED MEMBERS</div>
                  <div>[POST] /api/chat PARAMS: Auto Ezra AI Advisor</div>
                  <div>[SECURE CLEARANCE CODE: APPROVED]</div>
                  <div>[FORM BOUNDS: ESSAY 150-300 | DESC 100-700]</div>
                </div>

                {/* Animated graphic matching video progress */}
                <div 
                  className="absolute bottom-1 bg-[#C9A84C]/20 h-0.5 transition-all duration-300" 
                  style={{ width: `${currentTimeMs}%`, left: 0 }}
                />
              </div>

              {/* Synchronized voice synthesis subtitles transcript overlay */}
              <div className="bg-black text-[#C9A84C] p-3 text-center text-xs border-t border-neutral-850/60 font-sans min-h-[50px] flex items-center justify-center font-semibold leading-relaxed px-5">
                "{currentNarrativeText}"
              </div>

              {/* Video control bars */}
              <div className="bg-neutral-950 p-3 flex flex-wrap items-center justify-between gap-3 text-xs border-i border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-neutral-200 cursor-pointer focus:outline-none"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#8B6914] transition-all text-neutral-200"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  
                  {/* Timer display */}
                  <span className="text-[11px] font-mono text-neutral-400 block shrink-0">
                    {formatSeconds(currentSeconds)} / {activeChap.duration}
                  </span>
                </div>

                {/* Timeline progress slider bar */}
                <div className="flex-1 min-w-[120px] h-1.5 bg-neutral-800 rounded-full relative group cursor-pointer overflow-hidden">
                  <div 
                    className="bg-[#C9A84C] h-full rounded-full transition-all" 
                    style={{ width: `${currentTimeMs}%` }}
                  />
                </div>

                {/* Audio speaker toggle simulator */}
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg hover:text-[#C9A84C] transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <span className="text-[9px] font-mono uppercase tracking-widest hidden sm:inline">
                    {isMuted ? "MUTED" : "AI SPEAKER NARRATION"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action buttons inside interactive guide */}
            <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-850 text-xs">
              <span className="text-neutral-400">Lesson context matches: <strong className="text-white capitalize font-bold">{selectedTopic} page</strong></span>
              <button
                onClick={() => onNavigateTab(selectedTopic)}
                className="px-3 py-1.5 rounded bg-white hover:bg-neutral-100 text-neutral-950 font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                Go to Actual Portal Page <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
