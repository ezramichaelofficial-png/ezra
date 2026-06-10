import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AIChat from "./components/AIChat";
import HomeView from "./components/HomeView";
import LeadershipView from "./components/LeadershipView";
import RegisterView from "./components/RegisterView";
import DashboardView from "./components/DashboardView";
import NetworkMap from "./components/NetworkMap";
import OpportunitiesAndAwardsView from "./components/OpportunitiesAndAwardsView";
import FounderView from "./components/FounderView";
import { Member, Project, Event, Club, Partner, ChatMessage, Award } from "./types";
import { DEPARTMENTS, DEPT_DESCRIPTIONS, AFRICAN_COUNTRIES } from "./data";
import { ShieldAlert, BookOpen, Clock, Calendar, CheckSquare, Search, Send, UserCheck, HeartHandshake } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [leadershipApps, setLeadershipApps] = useState<any[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [partnerships, setPartnerships] = useState<Partner[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [membersChat, setMembersChat] = useState<ChatMessage[]>([]);
  const [leadersChat, setLeadersChat] = useState<ChatMessage[]>([]);
  const [nextId, setNextId] = useState(2);
  const [clearancePins, setClearancePins] = useState({
    projectPin: "1000",
    eventPin: "1000",
    leadershipPin: "1000",
    awardPin: "1000",
    whatsappLink: "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M"
  });

  // Authentication session state
  const [currentUser, setCurrentUser] = useState<Member | null>(null);

  // Synchronize currentUser with its updated counterparts in members state (e.g. from approvals)
  useEffect(() => {
    if (currentUser) {
      const updatedUser = members.find((m) => m.id.toUpperCase() === currentUser.id.toUpperCase());
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    } else {
      // Lazy restoration fallback directly from localStorage
      const cachedUser = localStorage.getItem("poaf_user");
      if (cachedUser && members.length > 0) {
        const userObj = members.find((m) => m.id.toUpperCase() === cachedUser.toUpperCase());
        if (userObj) {
          setCurrentUser(userObj);
        }
      }
    }
  }, [members, currentUser]);

  // Directory verify tool input state
  const [verifyIdInput, setVerifyIdInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<{ status: "success" | "pending" | "error"; msg: string } | null>(null);

  // General Directory page search states
  const [directorySearch, setDirectorySearch] = useState("");
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Chat form states
  const [chatChannel, setChatChannel] = useState<"members" | "leaders">("members");
  const [chatMessageText, setChatMessageText] = useState("");

  // Event creation form states
  const [evtFormName, setEvtFormName] = useState("");
  const [evtFormDate, setEvtFormDate] = useState("");
  const [evtFormStartTime, setEvtFormStartTime] = useState("");
  const [evtFormEndTime, setEvtFormEndTime] = useState("");
  const [evtFormDept, setEvtFormDept] = useState(DEPARTMENTS[0]);
  const [evtFormDesc, setEvtFormDesc] = useState("");
  const [evtFormPhoto, setEvtFormPhoto] = useState("");
  const [evtFormPin, setEvtFormPin] = useState("");

  // Project creation form states
  const [projFormName, setProjFormName] = useState("");
  const [projFormCountry, setProjFormCountry] = useState("");
  const [projFormDept, setProjFormDept] = useState(DEPARTMENTS[0]);
  const [projFormDesc, setProjFormDesc] = useState("");
  const [projFormPhoto, setProjFormPhoto] = useState("");
  const [projFormPin, setProjFormPin] = useState("");
  const [projFormDocUrl, setProjFormDocUrl] = useState<string | null>(null);
  const [projFormDocName, setProjFormDocName] = useState<string | null>(null);

  // Leadership App form states
  const [leadAppName, setLeadAppName] = useState("");
  const [leadAppIdInput, setLeadAppIdInput] = useState("");
  const [leadAppDept, setLeadAppDept] = useState(DEPARTMENTS[0]);
  const [leadAppPos, setLeadAppPos] = useState("Country Ambassador");
  const [leadAppCountry, setLeadAppCountry] = useState("");
  const [leadAppMotiv, setLeadAppMotiv] = useState("");
  const [leadAppPin, setLeadAppPin] = useState("");

  // Club application states
  const [clubFormName, setClubFormName] = useState("");
  const [clubFormSchool, setClubFormSchool] = useState("");
  const [clubFormCountry, setClubFormCountry] = useState("Nigeria");
  const [clubFormEmail, setClubFormEmail] = useState("");
  const [clubFormPhone, setClubFormPhone] = useState("");
  const [clubFormProposal, setClubFormProposal] = useState("");

  // Partnership states
  const [partnerFormOrg, setPartnerFormOrg] = useState("");
  const [partnerFormCountry, setPartnerFormCountry] = useState("Nigeria");
  const [partnerFormEmail, setPartnerFormEmail] = useState("");
  const [partnerFormPhone, setPartnerFormPhone] = useState("");
  const [partnerFormProposal, setPartnerFormProposal] = useState("");

  // Fetch initial store data from server-side JSON store
  const refreshDatabaseSync = async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const data = await res.json();
        
        // Output clean database source logs (Supabase vs Fallback)
        if (data.dataSource === "supabase") {
          console.log("🟢 [POAF Cloud Ledger System] Real-time continental records synchronized directly from cloud-backed Supabase tables.");
        } else if (data.dataSource === "fallback") {
          console.warn("⚠️ [POAF Cloud Ledger System] Supabase is unconfigured or offline. Serving off fallback local data-store cached files.");
        } else {
          console.log("📡 [POAF Ledger] Synchronized with source type:", data.dataSource);
        }

        if (data.members) setMembers(data.members);
        if (data.projects) setProjects(data.projects);
        if (data.events) setEvents(data.events);
        if (data.leadershipApps) setLeadershipApps(data.leadershipApps);
        if (data.clubs) setClubs(data.clubs);
        if (data.partnerships) setPartnerships(data.partnerships);
        if (data.awards) setAwards(data.awards);
        if (data.membersChat) setMembersChat(data.membersChat);
        if (data.leadersChat) setLeadersChat(data.leadersChat);
        if (data.nextId) setNextId(data.nextId);
        if (data.clearancePins) {
          setClearancePins({
            ...data.clearancePins,
            whatsappLink: data.clearancePins.whatsappLink || "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M"
          });
        }

        // Auto authenticate session based on caching localStorage
        const cachedUser = localStorage.getItem("poaf_user");
        if (cachedUser && data.members) {
          const userObj = data.members.find((m: Member) => m.id.toUpperCase() === cachedUser.toUpperCase());
          if (userObj) {
            setCurrentUser(userObj);
          }
        }
      }
    } catch (e) {
      console.error("Sync fetch error:", e);
    }
  };

  useEffect(() => {
    refreshDatabaseSync();
  }, []);

  // Sync state mutations smoothly back to server-side JSON file
  const propagateStateUpdates = async (currentPayload: any) => {
    try {
      await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPayload)
      });
    } catch (e) {
      console.error("Sync push error:", e);
    }
  };

  // Callback to sync dynamic state directly
  const syncStore = (updatedFields: Partial<{
    members: Member[];
    projects: Project[];
    events: Event[];
    leadershipApps: any[];
    clubs: Club[];
    partnerships: Partner[];
    awards: Award[];
    membersChat: ChatMessage[];
    leadersChat: ChatMessage[];
    nextId: number;
    clearancePins: {
      projectPin: string;
      eventPin: string;
      leadershipPin: string;
      awardPin: string;
    };
  }>) => {
    const nextMembers = updatedFields.members !== undefined ? updatedFields.members : members;
    const nextProjects = updatedFields.projects !== undefined ? updatedFields.projects : projects;
    const nextEvents = updatedFields.events !== undefined ? updatedFields.events : events;
    const nextLeadershipApps = updatedFields.leadershipApps !== undefined ? updatedFields.leadershipApps : leadershipApps;
    const nextClubs = updatedFields.clubs !== undefined ? updatedFields.clubs : clubs;
    const nextPartnerships = updatedFields.partnerships !== undefined ? updatedFields.partnerships : partnerships;
    const nextAwards = updatedFields.awards !== undefined ? updatedFields.awards : awards;
    const nextMembersChat = updatedFields.membersChat !== undefined ? updatedFields.membersChat : membersChat;
    const nextLeadersChat = updatedFields.leadersChat !== undefined ? updatedFields.leadersChat : leadersChat;
    const nextIdValue = updatedFields.nextId !== undefined ? updatedFields.nextId : nextId;
    const nextClearancePins = updatedFields.clearancePins !== undefined ? updatedFields.clearancePins : clearancePins;

    if (updatedFields.members !== undefined) setMembers(updatedFields.members);
    if (updatedFields.projects !== undefined) setProjects(updatedFields.projects);
    if (updatedFields.events !== undefined) setEvents(updatedFields.events);
    if (updatedFields.leadershipApps !== undefined) setLeadershipApps(updatedFields.leadershipApps);
    if (updatedFields.clubs !== undefined) setClubs(updatedFields.clubs);
    if (updatedFields.partnerships !== undefined) setPartnerships(updatedFields.partnerships);
    if (updatedFields.awards !== undefined) setAwards(updatedFields.awards);
    if (updatedFields.membersChat !== undefined) setMembersChat(updatedFields.membersChat);
    if (updatedFields.leadersChat !== undefined) setLeadersChat(updatedFields.leadersChat);
    if (updatedFields.nextId !== undefined) setNextId(updatedFields.nextId);
    if (updatedFields.clearancePins !== undefined) setClearancePins(updatedFields.clearancePins);

    // Sync back to file
    propagateStateUpdates({
      members: nextMembers,
      projects: nextProjects,
      events: nextEvents,
      leadershipApps: nextLeadershipApps,
      clubs: nextClubs,
      partnerships: nextPartnerships,
      awards: nextAwards,
      membersChat: nextMembersChat,
      leadersChat: nextLeadersChat,
      nextId: nextIdValue,
      clearancePins: nextClearancePins
    });
  };

  const onJoinDepartment = (deptName: string) => {
    setActiveTab("register");
  };

  const handleRegisterSubmit = (formData: Omit<Member, "status" | "joinDate" | "expiryDate" | "cardGenerated" | "certGenerated">) => {
    const newMember: Member = {
      ...formData,
      status: "Pending", // Default is pending awaiting Founder Ezra's review
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: "2030-01-01",
      cardGenerated: false,
      certGenerated: false
    };

    const nextMembers = [...members, newMember];
    syncStore({ members: nextMembers });
  };

  const onUserLogin = (userId: string) => {
    const match = members.find((m) => m.id.toUpperCase() === userId.toUpperCase());
    if (match) {
      setCurrentUser(match);
      localStorage.setItem("poaf_user", match.id);
    }
  };

  const onUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("poaf_user");
  };

  // User submits a project proposal via dashboard action cards
  const onSubmitProjectDashboard = (pName: string, pDept: string, pCountry: string, pDesc: string) => {
    const newProj: Project = {
      id: `PROJ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: pName,
      department: pDept,
      country: pCountry,
      description: pDesc,
      submittedBy: currentUser ? currentUser.fullName : "Unknown Pioneer",
      status: "Pending"
    };

    syncStore({ projects: [...projects, newProj] });
  };

  // User submits leadership application
  const onSubmitLeadershipApp = (lDept: string, lPos: string, lCountry: string, lMotiv: string) => {
    const newApp = {
      id: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
      memberId: currentUser?.id || "Unknown ID",
      fullName: currentUser?.fullName || "Anonymous",
      department: lDept,
      position: lPos,
      country: lCountry,
      motivation: lMotiv,
      status: "Pending",
      dateSubmitted: new Date().toISOString().split("T")[0]
    };

    syncStore({ leadershipApps: [...leadershipApps, newApp] });
  };

  // --- MEMBER SUBMISSIONS WITH PIN ENCRYPTIONS ---

  // Project submission page form (PIN: POAFP)
  const handleProjectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Unauthorized: Please register or log in first to submit project blueprints.");
      return;
    }
    const isFounder = currentUser.isFounder || currentUser.fullName === "Ezra Michael Jofe" || currentUser.email === "Ezra.Michael.official@gmail.com";

    if (isFounder && projFormPin !== clearancePins.projectPin) {
      alert("Founder account verified. Please enter the valid executive clearance PIN.");
      return;
    }

    const newProj: Project = {
      id: `PROJ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: projFormName,
      department: projFormDept,
      country: projFormCountry,
      description: projFormDesc,
      submittedBy: currentUser.fullName,
      status: isFounder ? "Approved" : "Pending",
      photo: projFormPhoto ? projFormPhoto.trim() : null,
      docUrl: projFormDocUrl,
      docName: projFormDocName
    };

    syncStore({ projects: [...projects, newProj] });
    setProjFormName("");
    setProjFormCountry("");
    setProjFormDesc("");
    setProjFormPhoto("");
    setProjFormPin("");
    setProjFormDocUrl(null);
    setProjFormDocName(null);
    
    if (isFounder) {
      alert("Project blueprint successfully published under founder authority!");
    } else {
      alert("Project blueprint submitted for audit! Handled as 'Pending' and sent to President Ezra Michael Jofe for review.");
    }
  };

  // Event creation form (PIN: POAFE)
  const handleEventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Unauthorized: Please register or log in first to schedule events.");
      return;
    }
    const isFounder = currentUser.isFounder || currentUser.fullName === "Ezra Michael Jofe" || currentUser.email === "Ezra.Michael.official@gmail.com";

    if (isFounder && evtFormPin !== clearancePins.eventPin) {
      alert("Founder account verified. Please enter the valid executive clearance PIN.");
      return;
    }
    if (!evtFormStartTime || !evtFormEndTime) {
      alert("Exact start time and end time are required!");
      return;
    }

    const newEvt: Event = {
      id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
      name: evtFormName,
      date: evtFormDate,
      startTime: evtFormStartTime,
      endTime: evtFormEndTime,
      department: evtFormDept,
      description: evtFormDesc,
      status: isFounder ? "Approved" : "Pending",
      photo: evtFormPhoto ? evtFormPhoto.trim() : null
    };

    syncStore({ events: [...events, newEvt] });
    setEvtFormName("");
    setEvtFormDate("");
    setEvtFormStartTime("");
    setEvtFormEndTime("");
    setEvtFormDesc("");
    setEvtFormPhoto("");
    setEvtFormPin("");

    if (isFounder) {
      alert("Event campaign successfully published under founder authority!");
    } else {
      alert("Event proposed for review! Handled as 'Pending' and sent to President Ezra Michael Jofe for calendar approval.");
    }
  };

  // Independent Leadership app form (PIN: POAFL)
  const handleLeadershipAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadAppPin !== clearancePins.leadershipPin) {
      alert("Invalid Leadership Application Clearance PIN!");
      return;
    }

    const newApp = {
      id: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
      memberId: leadAppIdInput,
      fullName: leadAppName,
      department: leadAppDept,
      position: leadAppPos,
      country: leadAppCountry,
      motivation: leadAppMotiv,
      status: "Pending",
      dateSubmitted: new Date().toISOString().split("T")[0]
    };

    syncStore({ leadershipApps: [...leadershipApps, newApp] });
    setLeadAppName("");
    setLeadAppIdInput("");
    setLeadAppCountry("");
    setLeadAppMotiv("");
    setLeadAppPin("");
    alert("Leadership application submitted successfully to Ezra Michael Jofe!");
  };

  // Club proposal submission form
  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubFormEmail || !clubFormPhone) {
      alert("Contact Email and Phone Number are required!");
      return;
    }
    const newClub: Club = {
      id: `CLB-${Math.floor(10000 + Math.random() * 90000)}`,
      clubName: clubFormName,
      school: clubFormSchool,
      country: clubFormCountry,
      contactEmail: clubFormEmail,
      contactPhone: clubFormPhone,
      writtenProposal: clubFormProposal ? clubFormProposal : undefined,
      status: "Pending"
    };

    syncStore({ clubs: [...clubs, newClub] });
    setClubFormName("");
    setClubFormSchool("");
    setClubFormEmail("");
    setClubFormPhone("");
    setClubFormProposal("");
    alert("Club chapter setup initiated! Required contact info and optional proposal submitted for review.");
  };

  // Partners submission form
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerFormEmail || !partnerFormPhone) {
      alert("Contact Email and Phone Number are required!");
      return;
    }
    const newPartner: Partner = {
      id: `PTN-${Math.floor(10000 + Math.random() * 90000)}`,
      organization: partnerFormOrg,
      country: partnerFormCountry,
      contactEmail: partnerFormEmail,
      contactPhone: partnerFormPhone,
      writtenProposal: partnerFormProposal ? partnerFormProposal : undefined,
      status: "Pending"
    };

    syncStore({ partnerships: [...partnerships, newPartner] });
    setPartnerFormOrg("");
    setPartnerFormEmail("");
    setPartnerFormPhone("");
    setPartnerFormProposal("");
    alert("Alliance partnership agenda filed! Required contact info and optional proposal registered.");
  };

  // Direct ID verification search matcher
  const handleVerifyIdSearch = () => {
    const input = verifyIdInput.trim().toUpperCase();
    const match = members.find((m) => m.id.toUpperCase() === input);

    if (match) {
      if (match.status === "Approved") {
        setVerifyResult({
          status: "success",
          msg: `VERIFIED PIONEER FOUND ✓\nName: ${match.fullName}\nDivision: ${match.department}\nRegion: ${match.country}\nRole: ${match.leadership || "General Member"}`
        });
      } else {
        setVerifyResult({
          status: "pending",
          msg: `PENDING REVIEW •\nMember ID exists but is currently undergoing credentials evaluation by President Ezra Michael Jofe.`
        });
      }
    } else {
      setVerifyResult({
        status: "error",
        msg: "RECORD ID NOT REGISTERED. Please verify alignment or ensure membership request was finalized."
      });
    }
  };

  // Community Chat form submissions
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const txt = chatMessageText.trim();
    if (!txt) return;

    const senderName = currentUser ? currentUser.fullName : "Visitor Guest";
    const senderRole = currentUser 
      ? (currentUser.isFounder ? "Founder" : (currentUser.leadership ? "Leader" : "Member"))
      : "Guest";

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser ? currentUser.id : "guest",
      senderName,
      senderRole,
      message: txt,
      timestamp: new Date().toLocaleString(),
      channel: chatChannel
    };

    if (chatChannel === "members") {
      syncStore({ membersChat: [...membersChat, newMsg] });
    } else {
      syncStore({ leadersChat: [...leadersChat, newMsg] });
    }

    setChatMessageText("");
  };

  // --- EXECUTIVE FOUNDER CONTROLS CALLBACKS ---

  const handleApproveMember = (mid: string) => {
    const resList = members.map((m) => {
      if (m.id === mid) {
        return {
          ...m,
          status: "Approved" as const,
          cardGenerated: true,
          certGenerated: true,
          certNumber: `CERT-0${m.id.substring(5)}`
        };
      }
      return m;
    });

    syncStore({ members: resList });
  };

  const handleUpdateMemberPin = (mid: string, newPin: string) => {
    const resList = members.map((m) => {
      if (m.id === mid) {
        return {
          ...m,
          pin: newPin
        };
      }
      return m;
    });
    syncStore({ members: resList });
  };

  const handleApproveProject = (pid: string) => {
    const updated = projects.map((p) => {
      if (p.id === pid) return { ...p, status: "Approved" as const };
      return p;
    });
    syncStore({ projects: updated });
  };

  const handleApproveEvent = (eid: string) => {
    const updated = events.map((e) => {
      if (e.id === eid) return { ...e, status: "Approved" as const };
      return e;
    });
    syncStore({ events: updated });
  };

  const handleApproveClub = (cid: string) => {
    const updated = clubs.map((c) => {
      if (c.id === cid) return { ...c, status: "Approved" as const };
      return c;
    });
    syncStore({ clubs: updated });
  };

  const handleApprovePartner = (paid: string) => {
    const updated = partnerships.map((partner) => {
      if (partner.id === paid) return { ...partner, status: "Approved" as const };
      return partner;
    });
    syncStore({ partnerships: updated });
  };

  const handleAddAward = (
    cat: any, 
    mId: string, 
    mName: string, 
    mCountry: string, 
    title?: string, 
    description?: string, 
    photo?: string
  ) => {
    const newAward: Award = {
      id: `AWD-${Math.floor(10000 + Math.random() * 90000)}`,
      category: cat,
      memberId: mId,
      memberName: mName,
      memberCountry: mCountry,
      date: new Date().toISOString().split("T")[0].substring(0, 7), // E.g. "2026-06"
      title,
      description,
      photo
    };

    syncStore({ awards: [newAward, ...awards] });
  };

  const handleEditMember = (id: string, updatedFields: Partial<Member>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
    syncStore({ members: updated });
  };

  const handleEditProject = (id: string, updatedFields: Partial<Project>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    syncStore({ projects: updated });
  };

  const handleEditEvent = (id: string, updatedFields: Partial<Event>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updatedFields } : e));
    syncStore({ events: updated });
  };

  const handleEditClub = (id: string, updatedFields: Partial<Club>) => {
    const updated = clubs.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    syncStore({ clubs: updated });
  };

  const handleEditPartner = (id: string, updatedFields: Partial<Partner>) => {
    const updated = partnerships.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    syncStore({ partnerships: updated });
  };

  const handleEditAward = (id: string, updatedFields: Partial<Award>) => {
    const updated = awards.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
    syncStore({ awards: updated });
  };

  const handleEditLeadershipApp = (id: string, updatedFields: Partial<any>) => {
    const updated = leadershipApps.map((l) => (l.id === id ? { ...l, ...updatedFields } : l));
    syncStore({ leadershipApps: updated });
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    syncStore({ members: updated });
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    syncStore({ projects: updated });
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    syncStore({ events: updated });
  };

  const handleDeleteClub = (id: string) => {
    const updated = clubs.filter((c) => c.id !== id);
    syncStore({ clubs: updated });
  };

  const handleDeletePartner = (id: string) => {
    const updated = partnerships.filter((p) => p.id !== id);
    syncStore({ partnerships: updated });
  };

  const handleDeleteAward = (id: string) => {
    const updated = awards.filter((a) => a.id !== id);
    syncStore({ awards: updated });
  };

  const handleDeleteLeadershipApp = (id: string) => {
    const updated = leadershipApps.filter((l) => l.id !== id);
    syncStore({ leadershipApps: updated });
  };

  const handleDeleteAllCategory = (category: 'members' | 'projects' | 'events' | 'clubs' | 'partnerships' | 'awards') => {
    if (category === 'members') {
      const founderOnly = members.filter((m) => m.isFounder || m.id === "POAF-00001");
      syncStore({ members: founderOnly });
    } else if (category === 'projects') {
      syncStore({ projects: [] });
    } else if (category === 'events') {
      syncStore({ events: [] });
    } else if (category === 'clubs') {
      syncStore({ clubs: [] });
    } else if (category === 'partnerships') {
      syncStore({ partnerships: [] });
    } else if (category === 'awards') {
      syncStore({ awards: [] });
    }
  };

  const handleAddMemberDirect = (newMem: Member) => {
    syncStore({ members: [...members, newMem] });
  };

  const handleAddProjectDirect = (newProj: Project) => {
    syncStore({ projects: [...projects, newProj] });
  };

  const handleAddEventDirect = (newEvt: Event) => {
    syncStore({ events: [...events, newEvt] });
  };

  const handleAddClubDirect = (newClub: Club) => {
    syncStore({ clubs: [...clubs, newClub] });
  };

  const handleAddPartnerDirect = (newPartner: Partner) => {
    syncStore({ partnerships: [...partnerships, newPartner] });
  };

  const handleAdminReset = async () => {
    if (confirm("Are you entirely sure you want to restore original store templates?")) {
      try {
        await fetch("/api/clean", { method: "POST" }); // triggers clear if supported or we just force custom state set
      } catch (e) {}

      // Overwrite/Force server reset
      syncStore({
        members: [
          {
            id: "POAF-00001",
            fullName: "Ezra Michael Jofe",
            gender: "Male",
            country: "Africa",
            school: "POAF HQ",
            email: "Ezra.Michael.official@gmail.com",
            phone: "+251911000000",
            department: "Executive Board",
            skills: "Strategic Operations, Public Relations",
            essay: "Founder and President of Pioneers of Africa's Future (POAF). Initiated this union in 2024 to promote practical solution designs, empower active students, and secure local development goals across all 54 African countries.",
            photo: "https://drive.google.com/file/d/11VYNonUNvAQ_sk2cHeGPZBdumyU_tnrm/view?usp=drivesdk",
            status: "Approved",
            joinDate: "2024-01-01",
            expiryDate: "2030-01-01",
            cardGenerated: true,
            certGenerated: true,
            certNumber: "CERT-00001",
            leadership: "Founder & President",
            leadershipId: "POAF-L-00001",
            awards: ["Organization Medal"],
            isFounder: true,
            pin: "8255"
          },
          {
            id: "POAF-11111",
            fullName: "Chidera Okafor",
            gender: "Female",
            country: "Nigeria",
            school: "University of Ibadan",
            email: "chidera.okafor@gmail.com",
            phone: "+2348031111111",
            department: "Technology and Innovation Department",
            skills: "React, Python, Data Science, AI Systems",
            essay: "I am extremely passionate about introducing custom mobile systems and lightweight models to under-resourced schools. By aligning high-impact technology goals with general civic challenges, we can build a stronger foundation for technical skills and regional development projects across West Africa.",
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
            status: "Approved",
            joinDate: "2025-05-10",
            expiryDate: "2030-01-01",
            cardGenerated: true,
            certGenerated: true,
            certNumber: "CERT-11111",
            pin: "1111"
          },
          {
            id: "POAF-22222",
            fullName: "Fatoumata Diallo",
            gender: "Female",
            country: "Senegal",
            school: "Université Cheikh Anta Diop",
            email: "fatoumata.diallo@gmail.com",
            phone: "+221772222222",
            department: "Research and engineering Department",
            skills: "Water Purification, Agro-ecology, Solar Energy",
            essay: "Developing dry-irrigation technology has been my life's research pursuit. By integrating affordable solar power cells and localized, low-cost clay-filter technology, our local university team aims to supply reliable irrigation plans that will prevent agricultural distress across sub-Saharan Africa.",
            photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300",
            status: "Approved",
            joinDate: "2025-11-15",
            expiryDate: "2030-01-01",
            cardGenerated: true,
            certGenerated: true,
            certNumber: "CERT-22222",
            pin: "2222"
          }
        ],
        projects: [
          {
            id: "PROJ-10001",
            name: "Agri-Tech Irrigation Hub",
            department: "Research and engineering Department",
            country: "Kenya",
            description: "Low-cost solar powered irrigation kit designed by students for smallholder farmers to combat droughts.",
            submittedBy: "Ezra Michael Jofe",
            status: "Approved"
          }
        ],
        events: [
          {
            id: "EVT-10001",
            name: "POAF 2026 Continental Youth Leadership Summit",
            date: "2026-08-15",
            startTime: "09:00",
            endTime: "17:00",
            department: "Youth Empowerment and Community Development Department",
            description: "Assembly uniting delegates to outline sustainable parameters for local challenges.",
            status: "Approved"
          }
        ],
        leadershipApps: [],
        clubs: [],
        partnerships: [],
        awards: [
          {
            id: "AWD-10001",
            category: "Student of the Month",
            memberId: "POAF-00001",
            memberName: "Ezra Michael Jofe",
            memberCountry: "Africa",
            date: "2026-05"
          }
        ],
        membersChat: [
          {
            id: "chat-1",
            senderId: "POAF-00001",
            senderName: "Ezra Michael Jofe",
            senderRole: "Founder",
            message: "Welcome to POAF! Fill membership forms to unlock your printable credentials.",
            timestamp: new Date().toLocaleString(),
            channel: "members"
          }
        ],
        leadersChat: [
          {
            id: "chat-2",
            senderId: "POAF-00001",
            senderName: "Ezra Michael Jofe",
            senderRole: "Founder",
            message: "Pioneer executives channel activated.",
            timestamp: new Date().toLocaleString(),
            channel: "leaders"
          }
        ],
        nextId: 2
      });

      alert("Original database presets successfully enforced!");
      location.reload();
    }
  };

  const handlePostAdminMessage = (channel: 'members' | 'leaders' | 'both', message: string) => {
    const baseMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "POAF-00001",
      senderName: "Ezra Michael Jofe",
      senderRole: "Founder",
      message: message,
      timestamp: new Date().toLocaleString(),
      channel: "members",
      isBroadcast: true
    };

    if (channel === 'members') {
      syncStore({ membersChat: [...membersChat, { ...baseMsg, channel: 'members' }] });
    } else if (channel === 'leaders') {
      syncStore({ leadersChat: [...leadersChat, { ...baseMsg, channel: 'leaders' }] });
    } else {
      syncStore({
        membersChat: [...membersChat, { ...baseMsg, channel: 'members' }],
        leadersChat: [...leadersChat, { ...baseMsg, channel: 'leaders' }]
      });
    }
  };

  // Filter lists based on input searches
  const approvedMembersOnly = members.filter((m) => m.status === "Approved");
  const filteredDirectoryMembers = approvedMembersOnly.filter((m) =>
    m.fullName.toLowerCase().includes(directorySearch.toLowerCase()) ||
    m.id.toLowerCase().includes(directorySearch.toLowerCase()) ||
    m.country.toLowerCase().includes(directorySearch.toLowerCase()) ||
    m.department.toLowerCase().includes(directorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100/40 text-neutral-900 flex flex-col font-sans" id="poaf-app-container">
      {/* HEADER COMPONENT */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationCount={members.filter((m) => m.status === "Pending").length}
        onShowNotifications={() => {
          setShowNotificationsModal(true);
        }}
      />

      {/* CORE DISPLAY MAIN PANEL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="poaf-main-canvas">
        <div className="animate-fade-in">
          {/* HOME PAGE */}
          {activeTab === "home" && (
            <HomeView
              members={members}
              projects={projects}
              events={events}
              clubs={clubs}
              partnerships={partnerships}
              awards={awards}
              onJoinDepartment={onJoinDepartment}
              setActiveTab={setActiveTab}
            />
          )}

          {/* LEADERSHIP PAGE */}
          {activeTab === "leadership" && (
            <LeadershipView 
              members={members} 
              projects={projects}
              events={events}
              leadershipApps={leadershipApps}
              clubs={clubs}
              partnerships={partnerships}
              onApproveMember={handleApproveMember}
              onApproveProject={handleApproveProject}
              onApproveEvent={handleApproveEvent}
              currentUser={currentUser}
            />
          )}

          {/* DEPARTMENTS VIEW */}
          {activeTab === "departments" && (
            <div className="space-y-6" id="dept-all-view">
              <div className="border-b border-stone-200 pb-3">
                <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">
                  Operational Division Departments
                </h2>
                <p className="text-xs text-neutral-500">
                  POAF activities are routed across six specific departments aligning technical outputs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded inline-block mb-3">
                        POAF Department Org
                      </span>
                      <h4 className="font-extrabold text-stone-900 text-sm uppercase tracking-wide mb-3">{dept}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed mb-6">{DEPT_DESCRIPTIONS[dept]}</p>
                    </div>

                    <button
                      onClick={() => onJoinDepartment(dept)}
                      className="w-full text-center py-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors rounded font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Join Department Council
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REGISTER PAGE */}
          {activeTab === "register" && (
            <RegisterView onRegisterSubmit={handleRegisterSubmit} departments={DEPARTMENTS} />
          )}

          {/* MEMBER DASHBOARD PORTAL */}
          {activeTab === "dashboard" && (
            <DashboardView
              members={members}
              onLogin={onUserLogin}
              onLogout={onUserLogout}
              currentUser={currentUser}
              projects={projects}
              onSubmitProject={onSubmitProjectDashboard}
              onSubmitLeadershipApp={onSubmitLeadershipApp}
              departments={DEPARTMENTS}
              clearancePins={clearancePins}
            />
          )}

          {/* DIRECTORY & VERIFY */}
          {activeTab === "directory" && (
            <div className="space-y-8" id="pioneer-directories">
              {/* Part 1: Verify member credentials */}
              <div className="card bg-white border border-stone-200 shadow-sm rounded-2xl p-6 text-stone-900 text-center max-w-lg mx-auto space-y-4">
                <span className="text-[10px] font-mono tracking-widest bg-stone-100 border border-stone-300 text-stone-700 px-2.5 py-0.5 rounded font-black uppercase">
                  PIONEER VERIFIER
                </span>
                <h3 className="font-bold text-sm uppercase tracking-wider">Credential Verification Tool</h3>
                <p className="text-[10px] text-stone-500">
                  Input any Membership ID (e.g. POAF-00001) to verify real-time Pan-African registration status and credentials
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ID Reference"
                    value={verifyIdInput}
                    onChange={(e) => setVerifyIdInput(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-300 text-stone-900 text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-slate-850 text-center font-mono"
                  />
                  <button 
                    onClick={handleVerifyIdSearch}
                    className="px-5 py-2.5 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer focus:outline-none"
                  >
                    Verify ID
                  </button>
                </div>

                {verifyResult && (
                  <div className={`p-4 rounded-xl text-left text-xs whitespace-pre-line border ${
                    verifyResult.status === "success" 
                      ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/30" 
                      : (verifyResult.status === "pending" ? "bg-orange-550/15 text-orange-400 border-orange-500/25" : "bg-red-950/20 text-red-400 border-red-550/30")
                  }`}>
                    {verifyResult.msg}
                  </div>
                )}
              </div>

              {/* Part 2: Global directory search */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                      Active Member Global Directory
                    </h3>
                    <p className="text-[11px] text-neutral-500">Live roster of approved active student pioneers</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search name, country..."
                      value={directorySearch}
                      onChange={(e) => setDirectorySearch(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded px-9 py-2 text-xs text-neutral-900 font-sans focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700 uppercase tracking-wider text-[9.5px] border-b border-stone-200">
                        <th className="p-3 font-semibold">Pioneer Name</th>
                        <th className="p-3 font-semibold">Membership ID</th>
                        <th className="p-3 font-semibold">University School</th>
                        <th className="p-3 font-semibold">Department Division</th>
                        <th className="p-3 font-semibold">Home Country</th>
                        <th className="p-3 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredDirectoryMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-bold text-neutral-800">{m.fullName}</td>
                          <td className="p-3 font-mono font-bold text-slate-800">{m.id}</td>
                          <td className="p-3 text-neutral-600">{m.school}</td>
                          <td className="p-3 text-neutral-500 font-medium">{m.department}</td>
                          <td className="p-3 text-neutral-600">{m.country}</td>
                          <td className="p-3 text-center">
                            <span className="text-[8px] tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold shadow-sm">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredDirectoryMembers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-400 italic">
                            No approved pioneers match query
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* AFRICA NETWORK MAP */}
          {activeTab === "network" && (
            <NetworkMap members={members} />
          )}

          {/* AWARDS BOARD */}
          {activeTab === "awards" && (
            <OpportunitiesAndAwardsView
              awards={awards}
              onAddAward={handleAddAward}
              membersList={members.filter((m) => m.status === "Approved")}
              currentUser={currentUser}
              awardPin={clearancePins.awardPin}
            />
          )}

          {/* EVENTS HUB */}
          {activeTab === "events" && (
            <div className="space-y-8" id="events-hub">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Submit Event Form */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm text-stone-900">
                  <div className="border-b border-stone-100 pb-2">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">Propose Continental Event</h4>
                    <span className="text-[9px] text-stone-550 block font-bold mt-0.5">Approved by Founder Board review</span>
                  </div>

                  {!currentUser ? (
                    <div className="p-5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-center space-y-3">
                      <div className="text-2xl">🔒</div>
                      <h5 className="font-bold text-stone-900 uppercase tracking-wide">Authentication Required</h5>
                      <p className="text-stone-500 leading-relaxed text-[11px]">
                        Please register or log in first as a Pioneer to propose events on the continental portal catalog.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEventFormSubmit} className="space-y-3 text-xs text-stone-800">
                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5">Event Title</label>
                        <input
                          type="text"
                          required
                          value={evtFormName}
                          onChange={(e) => setEvtFormName(e.target.value)}
                          placeholder="E.g. West African Meetup"
                          className="w-full bg-stone-50 border border-stone-300 text-stone-950 rounded px-2.5 py-2 font-sans placeholder-stone-400 focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">Scheduled Date</label>
                          <input
                            type="date"
                            required
                            value={evtFormDate}
                            onChange={(e) => setEvtFormDate(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 text-stone-950 rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">Start Time</label>
                          <input
                            type="time"
                            required
                            value={evtFormStartTime}
                            onChange={(e) => setEvtFormStartTime(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 text-stone-950 rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">End Time</label>
                          <input
                            type="time"
                            required
                            value={evtFormEndTime}
                            onChange={(e) => setEvtFormEndTime(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 text-stone-950 rounded px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5">Assigned Division</label>
                        <select
                          value={evtFormDept}
                          onChange={(e) => setEvtFormDept(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 text-stone-950 rounded px-2.5 py-1.5 focus:outline-none focus:border-slate-850"
                        >
                          {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5">Event Photo (Optional)</label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setEvtFormPhoto(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-xs font-sans file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-900 file:text-white file:text-[10px] file:font-semibold hover:file:bg-slate-800 cursor-pointer"
                          />
                          {evtFormPhoto && (
                            <div className="w-16 h-12 rounded border border-stone-350 overflow-hidden shrink-0 mt-1">
                              <img src={evtFormPhoto} alt="Upload Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5">Event Abstract / Medium</label>
                        <textarea
                          required
                          value={evtFormDesc}
                          onChange={(e) => setEvtFormDesc(e.target.value)}
                          placeholder="State coordinates or online medium format links..."
                          className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-2 text-stone-950 h-20 focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">
                          Clearance PIN
                        </label>
                        <input
                          type="password"
                          value={evtFormPin}
                          onChange={(e) => setEvtFormPin(e.target.value)}
                          placeholder="Enter clearance PIN"
                          className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-2 text-stone-950 font-sans focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-900 text-white font-black rounded uppercase text-xs tracking-wider hover:bg-slate-800 transition-all cursor-pointer focus:outline-none"
                      >
                        Publish Campaign
                      </button>
                    </form>
                  )}
                </div>

                {/* Live Events List */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white border border-stone-200 rounded-xl p-6 flex flex-col h-[520px]">
                  <div className="border-b border-stone-100 pb-2 mb-4">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-800" /> Active Continental Calendar
                    </h4>
                    <span className="text-[9px] text-neutral-400 font-bold block">Live schedules with exact times</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                    {events.filter((e) => e.status === "Approved").map((evt) => (
                      <div key={evt.id} className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row gap-4 text-xs shadow-sm hover:shadow transition-shadow">
                        {evt.photo && (
                          <div className="w-full sm:w-28 h-20 rounded border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                            <img src={evt.photo} alt={evt.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <strong className="text-stone-900 font-bold text-sm leading-snug">{evt.name}</strong>
                            <span className="text-[10px] bg-slate-900 text-white border border-slate-800 px-2 target-span py-0.5 rounded font-mono font-bold uppercase shrink-0">
                              🕒 {evt.startTime && evt.endTime ? `${evt.startTime} - ${evt.endTime}` : "Exact Time Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold">
                            <span className="text-slate-800">{evt.department} Division</span>
                            <span className="text-stone-400 font-mono">📅 {evt.date}</span>
                          </div>
                          <p className="text-stone-600 font-medium text-[10.5px] mt-2 leading-relaxed">{evt.description}</p>
                        </div>
                      </div>
                    ))}
                    {events.filter((e) => e.status === "Approved").length === 0 && (
                      <p className="text-xs text-neutral-400 italic text-center py-12">No active events listed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS DIRECTORY */}
          {activeTab === "projects" && (
            <div className="space-y-8" id="projects-division">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Project blueprint creator */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm text-stone-900">
                  <div className="border-b border-stone-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Publish Practical Solutions</h4>
                    <span className="text-[9px] text-stone-550 block font-bold mt-0.5">Subject to Founder Audit review</span>
                  </div>

                  {!currentUser ? (
                    <div className="p-5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-center space-y-3">
                      <div className="text-2xl">🔒</div>
                      <h5 className="font-bold text-slate-800 uppercase tracking-wider">Authentication Required</h5>
                      <p className="text-stone-550 leading-relaxed text-[11px]">
                        Please register or log in first as a Pioneer to submit project blueprints for continental execution bounds.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleProjectFormSubmit} className="space-y-3 text-xs text-stone-900">
                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5 font-bold">Project Title</label>
                        <input
                          type="text"
                          required
                          value={projFormName}
                          onChange={(e) => setProjFormName(e.target.value)}
                          placeholder="E.g. Agri Solar Irrigation Hub"
                          className="w-full bg-stone-50 border border-stone-350 rounded px-2.5 py-2 text-stone-950 font-sans placeholder-stone-400 focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-500 block mb-0.5 font-bold">Target School / Country</label>
                        <input
                          type="text"
                          required
                          value={projFormCountry}
                          onChange={(e) => setProjFormCountry(e.target.value)}
                          placeholder="E.g. Uganda Campus"
                          className="w-full bg-stone-50 border border-stone-350 rounded px-2.5 py-2 text-stone-950 font-sans placeholder-stone-400 focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">Primary Division</label>
                        <select
                          value={projFormDept}
                          onChange={(e) => setProjFormDept(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-350 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-slate-800"
                        >
                          {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">Project Photo (Optional)</label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProjFormPhoto(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full bg-stone-50 border border-stone-355 rounded px-2.5 py-1 text-stone-900 text-[11px] font-sans file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-900 file:text-white file:text-[10px] file:font-semibold hover:file:bg-slate-800 cursor-pointer"
                          />
                          {projFormPhoto && (
                            <div className="w-16 h-12 rounded border border-stone-300 overflow-hidden shrink-0 mt-1">
                              <img src={projFormPhoto} alt="Upload Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">
                          Project Proposal Document (PDF or Word)
                        </label>
                        <div className="flex flex-col gap-2">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="pdf-word-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProjFormDocUrl(reader.result as string);
                                  setProjFormDocName(file.name);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full bg-stone-50 border border-stone-355 rounded px-2.5 py-1 text-stone-900 text-[11px] font-sans file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-900 file:text-white file:text-[10px] file:font-semibold hover:file:bg-slate-800 cursor-pointer"
                          />
                          {projFormDocName && (
                            <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-flex items-center gap-1 font-sans font-bold">
                              📎 Attached: <span className="truncate max-w-[200px]">{projFormDocName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">Abstract Description</label>
                        <textarea
                          required
                          value={projFormDesc}
                          onChange={(e) => setProjFormDesc(e.target.value)}
                          placeholder="Detail physical mechanics, student contributions, and developmental projections..."
                          className="w-full bg-stone-50 border border-stone-350 rounded px-2.5 py-2 text-stone-950 h-24 font-sans placeholder-stone-400 focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[9.5px] uppercase tracking-wider text-stone-550 block mb-0.5 font-bold">
                          Clearance PIN
                        </label>
                        <input
                          type="password"
                          placeholder="Enter clearance PIN"
                          value={projFormPin}
                          onChange={(e) => setProjFormPin(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-350 rounded px-2.5 py-2 text-stone-950 font-sans focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-black uppercase rounded text-xs tracking-wider cursor-pointer font-sans focus:outline-none"
                      >
                        Publish Solution Blueprint
                      </button>
                    </form>
                  )}
                </div>

                {/* Approved Projects Board */}
                <div className="lg:col-span-12 xl:col-span-7 bg-white border border-stone-200 rounded-xl p-6 flex flex-col h-[520px]">
                  <div className="border-b border-stone-100 pb-2 mb-4">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-slate-800" /> Active Student Solutions Directory
                    </h4>
                    <span className="text-[9px] text-neutral-400 font-bold block">Pioneer solutions list</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                    {projects.filter((p) => p.status === "Approved").map((proj) => (
                      <div key={proj.id} className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs flex flex-col sm:flex-row gap-4 justify-between items-start shadow-sm hover:shadow transition-shadow">
                        {proj.photo && (
                          <div className="w-full sm:w-28 h-20 rounded border border-stone-200 overflow-hidden shrink-0 bg-stone-100">
                            <img src={proj.photo} alt={proj.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                        <div className="flex-1">
                          <strong className="text-stone-900 font-bold block text-sm">{proj.name}</strong>
                          <span className="text-[9.5px] text-slate-800 font-bold block mt-0.5">{proj.department} division</span>
                          <span className="text-[9px] text-neutral-400 mt-0.5 block font-serif italic">Submitted by: {proj.submittedBy} ({proj.country})</span>
                          <p className="text-stone-600 text-[10.5px] leading-relaxed mt-2.5">{proj.description}</p>
                          <div className="mt-3.5">
                            {proj.docUrl ? (
                              <a
                                href={proj.docUrl}
                                download={proj.docName || "project_proposal.pdf"}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded shadow transition-all cursor-pointer uppercase tracking-wider font-sans"
                              >
                                📎 Download Attached Proposal ({proj.docName?.split('.').pop()?.toUpperCase() || 'DOCUMENT'})
                              </a>
                            ) : (
                              <a
                                href="data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFBPQUYgUHJvamVjdCBCbHVlcHJpbnQpCi9BdXRob3IgKEV6cmEgTWljaGFlbCBKb2ZlKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgNCAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKn..."
                                download={`${proj.name.replace(/\s+/g, "_")}_Blueprint.pdf`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 text-[10px] font-bold rounded shadow-sm transition-all cursor-pointer uppercase tracking-wider font-sans"
                              >
                                📎 Download Proposal Details (PDF)
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded leading-none shrink-0 font-serif">
                          Active
                        </span>
                      </div>
                    ))}
                    {projects.filter((p) => p.status === "Approved").length === 0 && (
                      <p className="text-xs text-neutral-400 italic text-center py-12">No active solutions published.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INDEPENDENT LEADERSHIP APPLICATION PAGE */}
          {activeTab === "apply-leadership" && (
            <div className="card max-w-xl mx-auto bg-white border border-stone-200 p-5 sm:p-8 rounded-2xl text-stone-800 space-y-5" id="leadership-app-screen">
              <div className="border-b border-stone-100 pb-2">
                <h2 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">Independent Cabin Application</h2>
                <span className="text-[9px] text-stone-500 block tracking-wider uppercase font-bold">Clearance PIN Required</span>
              </div>

              <form onSubmit={handleLeadershipAppSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">Primary Name</label>
                    <input
                      type="text"
                      required
                      placeholder="My Register Name"
                      value={leadAppName}
                      onChange={(e) => setLeadAppName(e.target.value)}
                      className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-2 text-stone-900 font-sans focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">Membership ID Reference</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. POAF-00100"
                      value={leadAppIdInput}
                      onChange={(e) => setLeadAppIdInput(e.target.value)}
                      className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-2 text-stone-900 font-sans focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">Representing Division</label>
                    <select
                      value={leadAppDept}
                      onChange={(e) => setLeadAppDept(e.target.value)}
                      className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                    >
                      {DEPARTMENTS.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">Target Cabin Position</label>
                    <select
                      value={leadAppPos}
                      onChange={(e) => setLeadAppPos(e.target.value)}
                      className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                    >
                      <option>Country Ambassador</option>
                      <option>Department Coordinator</option>
                      <option>Director of Operations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5">Country Representation</label>
                  <input
                    type="text"
                    required
                    placeholder="Nigeria, Senegal, etc."
                    value={leadAppCountry}
                    onChange={(e) => setLeadAppCountry(e.target.value)}
                    className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-2 text-stone-900 font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-0.5 flex justify-between">
                    <span>Executive Motivation Manifesto</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={leadAppMotiv}
                    onChange={(e) => setLeadAppMotiv(e.target.value)}
                    placeholder="Describe your strategy to scale local student registries and execute region meetups..."
                    className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-2 text-stone-900 h-24 font-sans placeholder-stone-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9.5px] uppercase tracking-wider text-stone-400 block mb-0.5">Executive PIN Code</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter clearance PIN"
                    value={leadAppPin}
                    onChange={(e) => setLeadAppPin(e.target.value)}
                    className="w-full bg-stone-55 border border-stone-300 rounded px-2.5 py-2 text-stone-900 font-sans focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-black uppercase rounded tracking-wider cursor-pointer transition-colors focus:outline-none"
                >
                  Publish Leadership Credentials
                </button>
              </form>
            </div>
          )}

          {/* COMMUNITY CHAT SYSTEM */}
          {activeTab === "chat" && (
            <div className="space-y-6" id="community-chats-board">
              <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Pan-African Student Assembly Room</h3>
                  <p className="text-[9.5px] text-neutral-400 block mt-0.5">Coordinated multi-channel student chat services</p>
                </div>

                {/* Switch chat logs channel */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setChatChannel("members")}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                      chatChannel === "members" ? "bg-[#C9A84C] text-neutral-950" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    General Members Chat
                  </button>
                  <button
                    onClick={() => {
                      // Lock chat validation check
                      const eligible = currentUser?.isFounder || currentUser?.leadership;
                      if (!eligible) {
                        alert("RESTRICTED COUNCIL:\nLeaders channel is exclusive to Executive Founders, Regional Ambassadors and Coordinator Cabin Members.");
                        return;
                      }
                      setChatChannel("leaders");
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                      chatChannel === "leaders" ? "bg-[#C9A84C] text-neutral-950" : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Leaders Council Chat
                  </button>
                </div>
              </div>

              {/* Chat Viewport Area */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col h-[400px]">
                <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-stone-50/50 rounded-lg max-h-[300px]">
                  {chatChannel === "members" ? (
                    membersChat.filter((m) => m.channel === "members").map((m) => (
                      <div key={m.id} className="p-3 bg-white border border-stone-200 rounded-lg text-xs leading-normal">
                        <div className="flex items-center justify-between mb-1 text-[10px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-neutral-900">{m.senderName}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              m.senderRole === "Founder" ? "bg-amber-100 text-[#8B6914] border border-amber-300" : "bg-stone-100 text-neutral-600"
                            }`}>{m.senderRole}</span>
                          </div>
                          <span className="text-neutral-400 font-mono text-[8.5px]">{m.timestamp}</span>
                        </div>
                        <p className="text-stone-700">{m.message}</p>
                      </div>
                    ))
                  ) : (
                    leadersChat.filter((m) => m.channel === "leaders").map((m) => (
                      <div key={m.id} className="p-3 bg-white border border-stone-200 rounded-lg text-xs leading-normal">
                        <div className="flex items-center justify-between mb-1 text-[10px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-neutral-900">{m.senderName}</span>
                            <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-amber-300">
                              {m.senderRole}
                            </span>
                          </div>
                          <span className="text-neutral-400 font-mono text-[8.5px]">{m.timestamp}</span>
                        </div>
                        <p className="text-stone-700">{m.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input messaging box */}
                <form onSubmit={handleSendChatMessage} className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                  <input
                    type="text"
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    placeholder={`Write a message to ${chatChannel === "members" ? "General Members" : "Leaders Council"}...`}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded px-3 py-2 text-xs text-neutral-900 placeholder-neutral-500 font-sans focus:outline-none"
                    id="membersChatInput"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-950 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-colors rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SCHOOL CLUBS & PARTNERSHIPS */}
          {activeTab === "partners" && (
            <div className="space-y-8" id="campus-clovers">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* School Club setup form (No PIN) */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Configure POAF Club Chapter</h3>
                    <p className="text-[10px] text-neutral-500">Initiate club chapter representation at your school or campus</p>
                  </div>

                  <form onSubmit={handleClubSubmit} className="space-y-3.5 text-xs text-stone-700">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Chapters / School Name</label>
                      <input
                        type="text"
                        required
                        value={clubFormSchool}
                        onChange={(e) => setClubFormSchool(e.target.value)}
                        placeholder="E.g. University of Nairobi"
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Country representation</label>
                      <select
                        value={clubFormCountry}
                        onChange={(e) => setClubFormCountry(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs rounded focus:outline-none"
                      >
                        {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Club / Chapter Designate Name</label>
                      <input
                        type="text"
                        required
                        value={clubFormName}
                        onChange={(e) => setClubFormName(e.target.value)}
                        placeholder="UoN Builders Club"
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Contact Email (Required)</label>
                        <input
                          type="email"
                          required
                          value={clubFormEmail}
                          onChange={(e) => setClubFormEmail(e.target.value)}
                          placeholder="E.g. president@schoolclub.org"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded shadow-none focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Contact Phone (Required)</label>
                        <input
                          type="tel"
                          required
                          value={clubFormPhone}
                          onChange={(e) => setClubFormPhone(e.target.value)}
                          placeholder="E.g. +254 700 000 000"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded shadow-none focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Aspirations Proposal (Optional Written)</label>
                      <textarea
                        value={clubFormProposal}
                        onChange={(e) => setClubFormProposal(e.target.value)}
                        placeholder="Detail campus activities scope and growth objectives..."
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded h-16 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center py-2 bg-neutral-950 text-[#C9A84C] font-bold uppercase rounded hover:bg-[#C9A84C] hover:text-black transition-colors"
                    >
                      Propose Club Setup
                    </button>
                  </form>
                </div>

                {/* Partnership proposal setup (No PIN) */}
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-stone-100 pb-2">
                    <h3 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Execute Alliance Proposal</h3>
                    <p className="text-[10px] text-neutral-500">Provide organization alliance context for student sponsorships</p>
                  </div>

                  <form onSubmit={handlePartnerSubmit} className="space-y-3.5 text-xs text-stone-700">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Organization Entity</label>
                      <input
                        type="text"
                        required
                        value={partnerFormOrg}
                        onChange={(e) => setPartnerFormOrg(e.target.value)}
                        placeholder="E.g. Agri-Tech Alliance"
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Origin Country Location</label>
                      <select
                        value={partnerFormCountry}
                        onChange={(e) => setPartnerFormCountry(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs rounded focus:outline-none"
                      >
                        {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Official Email (Required)</label>
                        <input
                          type="email"
                          required
                          value={partnerFormEmail}
                          onChange={(e) => setPartnerFormEmail(e.target.value)}
                          placeholder="E.g. contact@agritech.org"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Official Phone (Required)</label>
                        <input
                          type="tel"
                          required
                          value={partnerFormPhone}
                          onChange={(e) => setPartnerFormPhone(e.target.value)}
                          placeholder="E.g. +234 800 0000 000"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">Synergy Scope Proposal (Optional Written)</label>
                      <textarea
                        value={partnerFormProposal}
                        onChange={(e) => setPartnerFormProposal(e.target.value)}
                        placeholder="Detail sponsorship goals and mutual benefits scope..."
                        className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-xs rounded h-16 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center py-2 bg-neutral-950 text-[#C9A84C] font-bold uppercase rounded hover:bg-[#C9A84C] hover:text-black transition-colors"
                    >
                      Submit Alliance Agenda
                    </button>
                  </form>
                </div>
              </div>

              {/* Clubs and Partners Ongoing boards (Approved ones) */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Sanctioned Campus Chapters & Partners</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  {clubs.filter((club) => club.status === "Approved").map((club) => (
                    <div key={club.id} className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col justify-between space-y-3 shadow-xs">
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-stone-900 font-extrabold text-sm block leading-tight">{club.clubName}</strong>
                          <span className="text-[8px] bg-amber-100 text-[#8B6914] font-extrabold px-1.5 py-0.5 rounded leading-none">CLUB</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wide mt-1">{club.school}</span>
                        
                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[10px] space-y-1 text-stone-600 font-mono">
                          {club.contactEmail && <p className="truncate">📧 {club.contactEmail}</p>}
                          {club.contactPhone && <p>📞 {club.contactPhone}</p>}
                        </div>

                        {club.writtenProposal && (
                          <div className="mt-2.5 bg-white p-2 border border-stone-100 rounded text-[9.5px] italic text-neutral-500 line-clamp-3">
                            "{club.writtenProposal}"
                          </div>
                        )}
                      </div>
                      <span className="text-[9.5px] italic text-[#8B6914] font-semibold block pt-1">📍 {club.country} (Active Chapter)</span>
                    </div>
                  ))}

                  {partnerships.filter((p) => p.status === "Approved").map((p) => (
                    <div key={p.id} className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col justify-between space-y-3 shadow-xs">
                      <div>
                        <div className="flex items-center justify-between">
                          <strong className="text-stone-900 font-extrabold text-sm block leading-tight">{p.organization}</strong>
                          <span className="text-[8px] bg-[#C9A84C] text-black font-extrabold px-1.5 py-0.5 rounded leading-none">ALLIANCE</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block mt-1">Institutional Partner</span>

                        <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-[10px] space-y-1 text-stone-600 font-mono">
                          {p.contactEmail && <p className="truncate">📧 {p.contactEmail}</p>}
                          {p.contactPhone && <p>📞 {p.contactPhone}</p>}
                        </div>

                        {p.writtenProposal && (
                          <div className="mt-2.5 bg-white p-2 border border-stone-100 rounded text-[9.5px] italic text-neutral-500 line-clamp-3">
                            "{p.writtenProposal}"
                          </div>
                        )}
                      </div>
                      <span className="text-[9.5px] italic text-[#8B6914] font-semibold block pt-1">📍 {p.country} (Affiliated)</span>
                    </div>
                  ))}

                  {clubs.filter((c) => c.status === "Approved").length === 0 && partnerships.filter((p) => p.status === "Approved").length === 0 && (
                    <p className="text-stone-400 italic py-2 col-span-3">No active institutional assemblies listed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EXECUTIVE FOUNDER VIEW */}
          {activeTab === "founder" && (
            <FounderView
              members={members}
              projects={projects}
              events={events}
              clubs={clubs}
              partnerships={partnerships}
              awards={awards}
              leadershipApps={leadershipApps}
              onApproveMember={handleApproveMember}
              onApproveProject={handleApproveProject}
              onApproveEvent={handleApproveEvent}
              onApproveClub={handleApproveClub}
              onApprovePartner={handleApprovePartner}
              onAdminReset={handleAdminReset}
              onPostAdminMessage={handlePostAdminMessage}
              onUpdateMemberPin={handleUpdateMemberPin}
              onEditMember={handleEditMember}
              onEditProject={handleEditProject}
              onEditEvent={handleEditEvent}
              onEditClub={handleEditClub}
              onEditPartner={handleEditPartner}
              onEditAward={handleEditAward}
              onEditLeadershipApp={handleEditLeadershipApp}
              onAddMember={handleAddMemberDirect}
              onAddProject={handleAddProjectDirect}
              onAddEvent={handleAddEventDirect}
              onAddClub={handleAddClubDirect}
              onAddPartner={handleAddPartnerDirect}
              onAddAward={handleAddAward}
              onDeleteMember={handleDeleteMember}
              onDeleteProject={handleDeleteProject}
              onDeleteEvent={handleDeleteEvent}
              onDeleteClub={handleDeleteClub}
              onDeletePartner={handleDeletePartner}
              onDeleteAward={handleDeleteAward}
              onDeleteLeadershipApp={handleDeleteLeadershipApp}
              onDeleteAllCategory={handleDeleteAllCategory}
              clearancePins={clearancePins}
              onUpdateClearancePins={(pins) => syncStore({ clearancePins: pins })}
            />
          )}
        </div>
      </main>

      {/* FOOTER CANVAS */}
      <footer className="bg-neutral-950 text-neutral-400 px-6 py-8 border-t-2 border-[#C9A84C] mt-24 text-center text-xs space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} POAF Pioneers | Executive Platform initiated by Founder Ezra Michael Jofe
          </p>
          <div className="flex gap-4 font-mono text-[10px] text-neutral-500">
            <span>Email: Ezra.Michael.official@gmail.com</span>
            <span>•</span>
            <span>State: Encrypted Database Persistent Vault</span>
          </div>
        </div>
      </footer>

      {/* FLOATING BOT ISRAEL COUNSEL ASST */}
      <AIChat currentUser={currentUser} />

      {/* DYNAMIC PIONEER NOTIFICATIONS CENTRE DRAWER */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex justify-end" id="notification-sheet-overlay">
          <div className="bg-neutral-950 border-l border-neutral-800 w-full max-w-md h-full flex flex-col justify-between text-xs text-stone-300 shadow-2xl animate-fade-in" id="notification-sheet-panel">
            {/* Header */}
            <div className="p-4 border-b border-[#C9A84C]/40 bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#C9A84C]">🔔</span>
                <div>
                  <h4 className="text-white font-extrabold uppercase tracking-wide">Pioneer Notifications Centre</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Live registry logs & approvals</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="text-stone-400 hover:text-white px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs cursor-pointer font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Combine pending status, approved credentials status, and solution audit status dynamically */}
              {(() => {
                const logs: { type: 'pending' | 'approved' | 'project' | 'event'; title: string; desc: string; time: string; color: string }[] = [];

                // Standard entries pending review
                members.filter(m => m.status === 'Pending').forEach(m => {
                  logs.push({
                    type: 'pending',
                    title: `PENDING APPLICATION`,
                    desc: `Pioneer Registration ID ${m.id} requested by "${m.fullName}" (${m.country}) is currently in review under the ${m.department} Division.`,
                    time: `In Audit Queue`,
                    color: 'border-orange-500/30 bg-orange-500/5 text-orange-400'
                  });
                });

                // Approved members active
                members.filter(m => m.status === 'Approved').slice(-6).forEach(m => {
                  logs.push({
                    type: 'approved',
                    title: `PIONEER ACTIVE STATUS`,
                    desc: `Pioneer "${m.fullName}" of ${m.country} has been accredited under verified ledger ID: ${m.id}. Your Double-Sided ID & Certificate are fully validated!`,
                    time: `Registry Active`,
                    color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                  });
                });

                // Pending Projects
                projects.filter(p => p.status === 'Pending').forEach(p => {
                  logs.push({
                    type: 'project',
                    title: `PROPOSAL BLUEPRINT AUDIT`,
                    desc: `Engineering solution "${p.name}" submitted by Pioneer "${p.submittedBy}" is currently awaiting board review.`,
                    time: `Review Pending`,
                    color: 'border-amber-500/30 bg-amber-500/5 text-amber-300'
                  });
                });

                // Approved Projects
                projects.filter(p => p.status === 'Approved').slice(-5).forEach(p => {
                  logs.push({
                    type: 'project',
                    title: `SOLUTION ACTIVE`,
                    desc: `Strategic solution blueprint "${p.name}" has been officially sanctioned and published under Founder Cabinet sign-off.`,
                    time: `Accredited`,
                    color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-300'
                  });
                });

                if (logs.length === 0) {
                  return (
                    <div className="py-20 text-center text-neutral-500 italic space-y-2">
                      <span className="text-3xl block">📭</span>
                      <p>Your notification stream is completely empty.</p>
                    </div>
                  );
                }

                return logs.map((log, idx) => (
                  <div key={idx} className={`border p-3.5 rounded-xl space-y-1.5 transition-all text-xs ${log.color}`}>
                    <div className="flex justify-between items-center font-bold">
                      <span className="font-extrabold uppercase tracking-wide text-[9px]">{log.title}</span>
                      <span className="font-mono text-[8px] opacity-85">{log.time}</span>
                    </div>
                    <p className="leading-relaxed text-[11px] text-stone-200">{log.desc}</p>
                  </div>
                ));
              })()}
            </div>

            {/* Bottom notification control status bar */}
            <div className="p-4 border-t border-neutral-900 bg-neutral-950 text-center text-[10px] text-neutral-500 font-mono flex items-center justify-between">
              <span>LEDGER: CERTIFICATE SYNCED</span>
              <span className="text-[#C9A84C] font-bold">FOUNDER BOARD CENTRAL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
