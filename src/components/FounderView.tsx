import React, { useState } from "react";
import { Member, Project, Event, Club, Partner, Award, LeadershipApp } from "../types";
import { DEPARTMENTS } from "../data";
import { ShieldCheck, UserCheck, CheckCircle2, FileX, Projector, HelpCircle, HardDrive, RefreshCw, Edit, Save, XCircle, Trash2, Database } from "lucide-react";

interface FounderViewProps {
  members: Member[];
  projects: Project[];
  events: Event[];
  clubs: Club[];
  partnerships: Partner[];
  awards?: Award[];
  leadershipApps?: any[];
  onApproveMember: (id: string) => void;
  onApproveProject: (id: string) => void;
  onApproveEvent: (id: string) => void;
  onApproveClub: (id: string) => void;
  onApprovePartner: (id: string) => void;
  onAdminReset: () => void;
  onPostAdminMessage: (channel: 'members' | 'leaders' | 'both', message: string) => void;
  onUpdateMemberPin: (id: string, newPin: string) => void;
  onEditMember?: (id: string, updatedFields: Partial<Member>) => void;
  onEditProject?: (id: string, updatedFields: Partial<Project>) => void;
  onEditEvent?: (id: string, updatedFields: Partial<Event>) => void;
  onEditClub?: (id: string, updatedFields: Partial<Club>) => void;
  onEditPartner?: (id: string, updatedFields: Partial<Partner>) => void;
  onEditAward?: (id: string, updatedFields: Partial<Award>) => void;
  onEditLeadershipApp?: (id: string, updatedFields: Partial<any>) => void;
  onAddMember?: (newMem: Member) => void;
  onAddProject?: (newProj: Project) => void;
  onAddEvent?: (newEvt: Event) => void;
  onAddClub?: (newClub: Club) => void;
  onAddPartner?: (newPartner: Partner) => void;
  onAddAward?: (cat: any, mId: string, mName: string, mCountry: string, title?: string, description?: string, photo?: string) => void;
  onDeleteMember?: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
  onDeleteClub?: (id: string) => void;
  onDeletePartner?: (id: string) => void;
  onDeleteAward?: (id: string) => void;
  onDeleteLeadershipApp?: (id: string) => void;
  onDeleteAllCategory?: (category: 'members' | 'projects' | 'events' | 'clubs' | 'partnerships' | 'awards') => void;
  onBulkSeed?: () => void;
  clearancePins: {
    projectPin: string;
    eventPin: string;
    leadershipPin: string;
    awardPin: string;
    whatsappLink?: string;
  };
  onUpdateClearancePins: (pins: {
    projectPin: string;
    eventPin: string;
    leadershipPin: string;
    awardPin: string;
    whatsappLink?: string;
  }) => void;
}

export default function FounderView({
  members,
  projects,
  events,
  clubs,
  partnerships,
  awards = [],
  leadershipApps = [],
  onApproveMember,
  onApproveProject,
  onApproveEvent,
  onApproveClub,
  onApprovePartner,
  onAdminReset,
  onPostAdminMessage,
  onUpdateMemberPin,
  onEditMember,
  onEditProject,
  onEditEvent,
  onEditClub,
  onEditPartner,
  onEditAward,
  onEditLeadershipApp,
  onAddMember,
  onAddProject,
  onAddEvent,
  onAddClub,
  onAddPartner,
  onAddAward,
  onDeleteMember,
  onDeleteProject,
  onDeleteEvent,
  onDeleteClub,
  onDeletePartner,
  onDeleteAward,
  onDeleteLeadershipApp,
  onDeleteAllCategory,
  onBulkSeed,
  clearancePins,
  onUpdateClearancePins
}: FounderViewProps) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem("poaf_admin_logged_in") === "true";
  });
  const [loginError, setLoginError] = useState("");

  // Submissions clearances input states
  const [projectPinInput, setProjectPinInput] = useState(clearancePins?.projectPin || "1000");
  const [eventPinInput, setEventPinInput] = useState(clearancePins?.eventPin || "1000");
  const [leadershipPinInput, setLeadershipPinInput] = useState(clearancePins?.leadershipPin || "1000");
  const [awardPinInput, setAwardPinInput] = useState(clearancePins?.awardPin || "1000");
  const [whatsappLinkInput, setWhatsappLinkInput] = useState(clearancePins?.whatsappLink || "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M");

  React.useEffect(() => {
    if (clearancePins) {
      setProjectPinInput(clearancePins.projectPin);
      setEventPinInput(clearancePins.eventPin);
      setLeadershipPinInput(clearancePins.leadershipPin);
      setAwardPinInput(clearancePins.awardPin);
      setWhatsappLinkInput(clearancePins.whatsappLink || "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M");
    }
  }, [clearancePins]);

  const [broadcastChannel, setBroadcastChannel] = useState<'members' | 'leaders' | 'both'>('members');
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const [activeManagerTab, setActiveManagerTab] = useState<'members' | 'projects' | 'events' | 'awards' | 'leaders' | 'partnerships' | 'clubs'>('members');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const getWordCount = (text: string): number => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Buffer state variables for active inline edits
  const [memberEditFullName, setMemberEditFullName] = useState("");
  const [memberEditSchool, setMemberEditSchool] = useState("");
  const [memberEditCountry, setMemberEditCountry] = useState("");
  const [memberEditTrack, setMemberEditTrack] = useState("");
  const [memberEditGrade, setMemberEditGrade] = useState("");
  const [memberEditSkills, setMemberEditSkills] = useState("");
  const [memberEditEssay, setMemberEditEssay] = useState("");

  const [projectEditName, setProjectEditName] = useState("");
  const [projectEditDept, setProjectEditDept] = useState("");
  const [projectEditCountry, setProjectEditCountry] = useState("");
  const [projectEditDesc, setProjectEditDesc] = useState("");

  const [eventEditName, setEventEditName] = useState("");
  const [eventEditDate, setEventEditDate] = useState("");
  const [eventEditStart, setEventEditStart] = useState("");
  const [eventEditEnd, setEventEditEnd] = useState("");
  const [eventEditDesc, setEventEditDesc] = useState("");

  // States for Awards
  const [awardEditCategory, setAwardEditCategory] = useState<"Student of the Month" | "Innovator of the Month" | "Researcher of the Month">("Student of the Month");
  const [awardEditMemberName, setAwardEditMemberName] = useState("");
  const [awardEditMemberCountry, setAwardEditMemberCountry] = useState("");
  const [awardEditMemberId, setAwardEditMemberId] = useState("");
  const [awardEditDate, setAwardEditDate] = useState("");
  const [awardEditTitle, setAwardEditTitle] = useState("");
  const [awardEditDesc, setAwardEditDesc] = useState("");
  const [awardEditPhoto, setAwardEditPhoto] = useState("");

  // States for Leaders
  const [leadEditFullName, setLeadEditFullName] = useState("");
  const [leadEditMemberId, setLeadEditMemberId] = useState("");
  const [leadEditDepartment, setLeadEditDepartment] = useState("");
  const [leadEditPosition, setLeadEditPosition] = useState("");
  const [leadEditCountry, setLeadEditCountry] = useState("");
  const [leadEditMotivation, setLeadEditMotivation] = useState("");
  const [leadEditStatus, setLeadEditStatus] = useState<'Pending' | 'Approved' | 'Declined'>("Pending");

  // Expansion direct addition states
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemName, setNewMemName] = useState("");
  const [newMemEmail, setNewMemEmail] = useState("");
  const [newMemPhone, setNewMemPhone] = useState("");
  const [newMemCountry, setNewMemCountry] = useState("Nigeria");
  const [newMemSchool, setNewMemSchool] = useState("");
  const [newMemDept, setNewMemDept] = useState("Technology and Innovation Department");
  const [newMemEssay, setNewMemEssay] = useState("Authenticated direct registry override by Executive President's authorization.");

  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjDept, setNewProjDept] = useState("Technology and Innovation Department");
  const [newProjCountry, setNewProjCountry] = useState("Nigeria");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjAuthor, setNewProjAuthor] = useState("Executive Board");

  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventStart, setNewEventStart] = useState("18:00");
  const [newEventEnd, setNewEventEnd] = useState("20:00");
  const [newEventDept, setNewEventDept] = useState("Technology and Innovation Department");
  const [newEventDesc, setNewEventDesc] = useState("");

  const [showAddAwardForm, setShowAddAwardForm] = useState(false);
  const [newAwardCategory, setNewAwardCategory] = useState<"Student of the Month" | "Innovator of the Month" | "Researcher of the Month">("Student of the Month");
  const [newAwardMemberId, setNewAwardMemberId] = useState("");
  const [newAwardMemberName, setNewAwardMemberName] = useState("");
  const [newAwardMemberCountry, setNewAwardMemberCountry] = useState("Nigeria");
  const [newAwardTitle, setNewAwardTitle] = useState("");
  const [newAwardDesc, setNewAwardDesc] = useState("");

  const [showAddLeaderForm, setShowAddLeaderForm] = useState(false);
  const [newLeaderName, setNewLeaderName] = useState("");
  const [newLeaderCountry, setNewLeaderCountry] = useState("Nigeria");
  const [newLeaderDept, setNewLeaderDept] = useState("Executive Board");
  const [newLeaderRole, setNewLeaderRole] = useState("Country Ambassador");
  const [newLeaderEmail, setNewLeaderEmail] = useState("");
  const [newLeaderPhone, setNewLeaderPhone] = useState("");
  const [newLeaderSchool, setNewLeaderSchool] = useState("POAF HQ");

  const [showAddClubForm, setShowAddClubForm] = useState(false);
  const [newClubName, setNewClubName] = useState("");
  const [newClubSchool, setNewClubSchool] = useState("");
  const [newClubCountry, setNewClubCountry] = useState("Nigeria");
  const [newClubEmail, setNewClubEmail] = useState("");
  const [newClubPhone, setNewClubPhone] = useState("");
  const [newClubProposal, setNewClubProposal] = useState("");

  const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
  const [newPartnerOrg, setNewPartnerOrg] = useState("");
  const [newPartnerCountry, setNewPartnerCountry] = useState("Nigeria");
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");
  const [newPartnerProposal, setNewPartnerProposal] = useState("");

  // States for Clubs
  const [clubEditName, setClubEditName] = useState("");
  const [clubEditSchool, setClubEditSchool] = useState("");
  const [clubEditCountry, setClubEditCountry] = useState("");
  const [clubEditEmail, setClubEditEmail] = useState("");
  const [clubEditPhone, setClubEditPhone] = useState("");
  const [clubEditProposal, setClubEditProposal] = useState("");

  // States for Partnerships
  const [partnerEditOrg, setPartnerEditOrg] = useState("");
  const [partnerEditCountry, setPartnerEditCountry] = useState("");
  const [partnerEditEmail, setPartnerEditEmail] = useState("");
  const [partnerEditPhone, setPartnerEditPhone] = useState("");
  const [partnerEditProposal, setPartnerEditProposal] = useState("");

  const startEditingMember = (m: Member) => {
    setEditingItemId(m.id);
    setMemberEditFullName(m.fullName || "");
    setMemberEditSchool(m.school || "");
    setMemberEditCountry(m.country || "");
    setMemberEditTrack(m.universityTrack || "");
    setMemberEditGrade(m.grade || "");
    setMemberEditSkills(m.skills || "");
    setMemberEditEssay(m.essay || "");
  };

  const startEditingProject = (p: Project) => {
    setEditingItemId(p.id);
    setProjectEditName(p.name || "");
    setProjectEditDept(p.department || "");
    setProjectEditCountry(p.country || "");
    setProjectEditDesc(p.description || "");
  };

  const startEditingEvent = (e: Event) => {
    setEditingItemId(e.id);
    setEventEditName(e.name || "");
    setEventEditDate(e.date || "");
    setEventEditStart(e.startTime || "");
    setEventEditEnd(e.endTime || "");
    setEventEditDesc(e.description || "");
  };

  const startEditingAward = (a: Award) => {
    setEditingItemId(a.id);
    setAwardEditCategory(a.category);
    setAwardEditMemberName(a.memberName || "");
    setAwardEditMemberCountry(a.memberCountry || "");
    setAwardEditMemberId(a.memberId || "");
    setAwardEditDate(a.date || "");
    setAwardEditTitle(a.title || "");
    setAwardEditDesc(a.description || "");
    setAwardEditPhoto(a.photo || "");
  };

  const startEditingLeadApp = (l: any) => {
    setEditingItemId(l.id);
    setLeadEditFullName(l.fullName || "");
    setLeadEditMemberId(l.memberId || "");
    setLeadEditDepartment(l.department || "");
    setLeadEditPosition(l.position || "");
    setLeadEditCountry(l.country || "");
    setLeadEditMotivation(l.motivation || "");
    setLeadEditStatus(l.status || "Pending");
  };

  const startEditingClub = (c: Club) => {
    setEditingItemId(c.id);
    setClubEditName(c.clubName || "");
    setClubEditSchool(c.school || "");
    setClubEditCountry(c.country || "");
    setClubEditEmail(c.contactEmail || "");
    setClubEditPhone(c.contactPhone || "");
    setClubEditProposal(c.writtenProposal || "");
  };

  const startEditingPartner = (p: Partner) => {
    setEditingItemId(p.id);
    setPartnerEditOrg(p.organization || "");
    setPartnerEditCountry(p.country || "");
    setPartnerEditEmail(p.contactEmail || "");
    setPartnerEditPhone(p.contactPhone || "");
    setPartnerEditProposal(p.writtenProposal || "");
  };

  const handleMemberSave = (id: string) => {
    if (memberEditEssay) {
      const wc = getWordCount(memberEditEssay);
      if (wc < 150 || wc > 300) {
        alert(`Motivation essay must be between 150 and 300 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditMember) {
      onEditMember(id, {
        fullName: memberEditFullName,
        school: memberEditSchool,
        country: memberEditCountry,
        universityTrack: memberEditTrack,
        grade: memberEditGrade,
        skills: memberEditSkills,
        essay: memberEditEssay
      });
      alert(`Student profile ${id} custom credentials successfully updated!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleProjectSave = (id: string) => {
    if (projectEditDesc) {
      const wc = getWordCount(projectEditDesc);
      if (wc < 100 || wc > 700) {
        alert(`Project description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditProject) {
      onEditProject(id, {
        name: projectEditName,
        department: projectEditDept,
        country: projectEditCountry,
        description: projectEditDesc
      });
      alert(`Project outline ${id} successfully updated on Continental Directory!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleEventSave = (id: string) => {
    if (eventEditDesc) {
      const wc = getWordCount(eventEditDesc);
      if (wc < 100 || wc > 700) {
        alert(`Event description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditEvent) {
      onEditEvent(id, {
        name: eventEditName,
        date: eventEditDate,
        startTime: eventEditStart,
        endTime: eventEditEnd,
        description: eventEditDesc
      });
      alert(`Meeting/Summit event ${id} configurations updated live!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleAwardSave = (id: string) => {
    if (awardEditDesc) {
      const wc = getWordCount(awardEditDesc);
      if (wc < 100 || wc > 700) {
        alert(`Citation description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditAward) {
      onEditAward(id, {
        category: awardEditCategory,
        memberName: awardEditMemberName,
        memberCountry: awardEditMemberCountry,
        memberId: awardEditMemberId,
        date: awardEditDate,
        title: awardEditTitle,
        description: awardEditDesc,
        photo: awardEditPhoto
      });
      alert(`Honors & Award allocation ${id} updated successfully!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleLeadAppSave = (id: string) => {
    if (leadEditMotivation) {
      const wc = getWordCount(leadEditMotivation);
      if (wc < 150 || wc > 300) {
        alert(`Motivation manifesto must be between 150 and 300 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditLeadershipApp) {
      onEditLeadershipApp(id, {
        fullName: leadEditFullName,
        memberId: leadEditMemberId,
        department: leadEditDepartment,
        position: leadEditPosition,
        country: leadEditCountry,
        motivation: leadEditMotivation,
        status: leadEditStatus
      });
      alert(`Leadership application ${id} profile updated successfully!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleClubSave = (id: string) => {
    if (clubEditProposal) {
      const wc = getWordCount(clubEditProposal);
      if (wc < 100 || wc > 700) {
        alert(`Club written proposal description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditClub) {
      onEditClub(id, {
        clubName: clubEditName,
        school: clubEditSchool,
        country: clubEditCountry,
        contactEmail: clubEditEmail,
        contactPhone: clubEditPhone,
        writtenProposal: clubEditProposal
      });
      alert(`Pioneer Campus Club ${id} updated successfully!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handlePartnerSave = (id: string) => {
    if (partnerEditProposal) {
      const wc = getWordCount(partnerEditProposal);
      if (wc < 100 || wc > 700) {
        alert(`Partnership proposal description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onEditPartner) {
      onEditPartner(id, {
        organization: partnerEditOrg,
        country: partnerEditCountry,
        contactEmail: partnerEditEmail,
        contactPhone: partnerEditPhone,
        writtenProposal: partnerEditProposal
      });
      alert(`Alliance Partnership record ${id} modified successfully!`);
    } else {
      alert("Local state modified successfully.");
    }
    setEditingItemId(null);
  };

  const handleDirectAddMemberSubmit = () => {
    if (!newMemName || !newMemEmail) {
      alert("Name and email are required to bypass registry!");
      return;
    }
    if (newMemEssay) {
      const wc = getWordCount(newMemEssay);
      if (wc < 150 || wc > 300) {
        alert(`Motivation essay must be between 150 and 300 words. Currently at ${wc} words.`);
        return;
      }
    }
    const id = `POAF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: Member = {
      id,
      fullName: newMemName,
      email: newMemEmail,
      phone: newMemPhone,
      country: newMemCountry,
      school: newMemSchool,
      department: newMemDept,
      essay: newMemEssay,
      status: "Approved",
      gender: "Not Declared",
      photo: null,
      joinDate: new Date().toLocaleDateString(),
      expiryDate: new Date(Date.now() + 31536000000).toLocaleDateString(),
      cardGenerated: false,
      certGenerated: false,
      pin: "1234",
      skills: "Registered directly via Founders Board",
      biography: "Administrative direct roster entry"
    };
    if (onAddMember) {
      onAddMember(newMember);
      alert(`Pioneer ${newMemName} has been directly registered under standard ID: ${id}. Initial login PIN: 1234.`);
      setNewMemName("");
      setNewMemEmail("");
      setNewMemPhone("");
      setNewMemSchool("");
      setShowAddMemberForm(false);
    }
  };

  const handleDirectAddProjectSubmit = () => {
    if (!newProjName || !newProjDesc) {
      alert("Project title and description are mandatory!");
      return;
    }
    const wc = getWordCount(newProjDesc);
    if (wc < 100 || wc > 700) {
      alert(`Project description must be between 100 and 700 words. Currently at ${wc} words.`);
      return;
    }
    const id = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProject: Project = {
      id,
      name: newProjName,
      description: newProjDesc,
      department: newProjDept,
      country: newProjCountry,
      status: "Approved",
      submittedBy: newProjAuthor || "Executive Council"
    };
    if (onAddProject) {
      onAddProject(newProject);
      alert(`Project "${newProjName}" added directly into Continental Solution Directory!`);
      setNewProjName("");
      setNewProjDesc("");
      setShowAddProjectForm(false);
    }
  };

  const handleDirectAddEventSubmit = () => {
    if (!newEventName || !newEventDate) {
      alert("Event title and date are mandatory!");
      return;
    }
    if (newEventDesc) {
      const wc = getWordCount(newEventDesc);
      if (wc < 100 || wc > 700) {
        alert(`Event description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    const id = `EVT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEvent: Event = {
      id,
      name: newEventName,
      date: newEventDate,
      startTime: newEventStart,
      endTime: newEventEnd,
      department: newEventDept,
      description: newEventDesc,
      status: "Approved"
    };
    if (onAddEvent) {
      onAddEvent(newEvent);
      alert(`Summit Event "${newEventName}" added directly to live configurations!`);
      setNewEventName("");
      setNewEventDate("");
      setNewEventDesc("");
      setShowAddEventForm(false);
    }
  };

  const handleDirectAddAwardSubmit = () => {
    if (!newAwardMemberName || !newAwardTitle) {
      alert("Awardee name and award title are required!");
      return;
    }
    if (newAwardDesc) {
      const wc = getWordCount(newAwardDesc);
      if (wc < 100 || wc > 700) {
        alert(`Award citation description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    if (onAddAward) {
      onAddAward(
        newAwardCategory,
        newAwardMemberId || "POAF-AWD-REF",
        newAwardMemberName,
        newAwardMemberCountry,
        newAwardTitle,
        newAwardDesc
      );
      alert(`Honours Board Award "${newAwardTitle}" allocated directly to ${newAwardMemberName}!`);
      setNewAwardMemberName("");
      setNewAwardMemberId("");
      setNewAwardTitle("");
      setNewAwardDesc("");
      setShowAddAwardForm(false);
    }
  };

  const handleDirectAddLeaderSubmit = () => {
    if (!newLeaderName || !newLeaderEmail) {
      alert("Leader name and email are required!");
      return;
    }
    const id = `POAF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLeader: Member = {
      id,
      fullName: newLeaderName,
      email: newLeaderEmail,
      phone: newLeaderPhone,
      country: newLeaderCountry,
      school: newLeaderSchool,
      department: newLeaderDept,
      essay: "Direct administrative leader setup.",
      status: "Approved",
      gender: "Not Declared",
      photo: null,
      joinDate: new Date().toLocaleDateString(),
      expiryDate: new Date(Date.now() + 31536000000).toLocaleDateString(),
      cardGenerated: false,
      certGenerated: false,
      pin: "1234",
      leadership: newLeaderRole,
      leadershipId: `POAF-L-${Math.floor(100 + Math.random() * 900)}`,
      roleCategory: 'Leader',
      skills: "Executive level credentials"
    };
    if (onAddMember) {
      onAddMember(newLeader);
      alert(`Executive Leader ${newLeaderName} added to Pioneer Cabinet under title: ${newLeaderRole}. Account ID: ${id}, Login PIN: 1234.`);
      setNewLeaderName("");
      setNewLeaderEmail("");
      setNewLeaderPhone("");
      setNewLeaderSchool("");
      setNewLeaderRole("Country Ambassador");
      setShowAddLeaderForm(false);
    }
  };

  const handleDirectAddClubSubmit = () => {
    if (!newClubName || !newClubSchool) {
      alert("Club Name and School are required!");
      return;
    }
    if (newClubProposal) {
      const wc = getWordCount(newClubProposal);
      if (wc < 100 || wc > 700) {
        alert(`Written proposal description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    const id = `CLB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClub: Club = {
      id,
      clubName: newClubName,
      school: newClubSchool,
      country: newClubCountry,
      contactEmail: newClubEmail,
      contactPhone: newClubPhone,
      writtenProposal: newClubProposal || "Authorized setup by President Jofe",
      status: "Approved"
    };
    if (onAddClub) {
      onAddClub(newClub);
      alert(`Campus Club Chapter "${newClubName}" setup at ${newClubSchool} approved and registered live!`);
      setNewClubName("");
      setNewClubSchool("");
      setNewClubEmail("");
      setNewClubPhone("");
      setNewClubProposal("");
      setShowAddClubForm(false);
    }
  };

  const handleDirectAddPartnerSubmit = () => {
    if (!newPartnerOrg) {
      alert("Organization name is required!");
      return;
    }
    if (newPartnerProposal) {
      const wc = getWordCount(newPartnerProposal);
      if (wc < 100 || wc > 700) {
        alert(`Partnership proposal description must be between 100 and 700 words. Currently at ${wc} words.`);
        return;
      }
    }
    const id = `PTN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPartner: Partner = {
      id,
      organization: newPartnerOrg,
      country: newPartnerCountry,
      contactEmail: newPartnerEmail,
      contactPhone: newPartnerPhone,
      writtenProposal: newPartnerProposal || "Direct continental alliance partnership authorized by Founders Board.",
      status: "Approved"
    };
    if (onAddPartner) {
      onAddPartner(newPartner);
      alert(`Alliance Partnership of POAF with "${newPartnerOrg}" compiled directly into system records!`);
      setNewPartnerOrg("");
      setNewPartnerEmail("");
      setNewPartnerPhone("");
      setNewPartnerProposal("");
      setShowAddPartnerForm(false);
    }
  };

  // Handles Admin Login
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      emailInput.trim() === "Ezra.Michael.official@gmail.com" &&
      passwordInput === "1000"
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem("poaf_admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Incorrect credentials. Check password config.");
    }
  };

  const pendingMembers = members.filter((m) => m.status === "Pending");
  const pendingProjects = projects.filter((p) => p.status === "Pending");
  const pendingEvents = events.filter((e) => e.status === "Pending");
  const pendingClubs = clubs.filter((c) => c.status === "Pending");
  const pendingPartners = partnerships.filter((p) => p.status === "Pending");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    onPostAdminMessage(broadcastChannel, broadcastMessage);
    setBroadcastMessage("");
    alert("System broadcast successfully deployed to community channels!");
  };

  // If not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-sm mx-auto bg-white border border-stone-205 rounded-2xl p-6 text-center text-stone-800 space-y-6 shadow-sm" id="founder-login-viewport">
        <div className="w-12 h-12 rounded-full border border-stone-250 bg-stone-50 flex items-center justify-center text-slate-800 mx-auto font-bold text-lg">
          🔒
        </div>

        <div>
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-900 mb-2">Founder Login Portal</h3>
          <p className="text-[10px] text-stone-500 leading-relaxed">
            Authorized admin board for President Ezra Michael Jofe. Review and manage student member registries.
          </p>
        </div>

        <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
          <div>
            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Founder Email</label>
            <input
              type="email"
              required
              placeholder="Enter executive email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 text-xs text-stone-900 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-800 font-sans"
            />
          </div>

          <div>
            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Admin Cryptic Code</label>
            <input
              type="password"
              required
              placeholder="Enter PIN password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 text-xs text-stone-900 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-800"
            />
          </div>

          {loginError && <p className="text-red-600 font-bold text-[9px] text-center">{loginError}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-black rounded uppercase text-xs tracking-wider transition-colors cursor-pointer focus:outline-none"
          >
            Access Executive Council
          </button>
        </form>
      </div>
    );
  }

  // Loaded/Admin panel view
  return (
    <div className="space-y-8 text-stone-800" id="founder-dashboard-panel">
      {/* Welcome Board */}
      <div className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-stone-900 text-base font-black uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-700" /> Executive Admin Console
          </h2>
          <span className="text-xs text-stone-500">Welcome back, President Ezra Michael Jofe</span>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button 
            onClick={onAdminReset}
            className="px-4 py-2 rounded bg-red-650 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
            id="btn-admin-reset-db"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Purge & Restore Database Reset
          </button>
          
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to sign out from the Founder portal?")) {
                setIsAdminLoggedIn(false);
                localStorage.removeItem("poaf_admin_logged_in");
              }
            }}
            className="px-4 py-2 rounded bg-stone-850 hover:bg-stone-900 border border-stone-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
            id="btn-admin-sign-out"
          >
            🚪 Sign Out of Admin
          </button>
        </div>
      </div>

      {/* Main split: Pending lists VS Broadcast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Pending approvals */}
        <div className="lg:col-span-8 space-y-6">
          {/* Pending Registrants */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex justify-between items-center">
              <span>Pending Registrations ({pendingMembers.length})</span>
              <span className="text-[10px] text-stone-500">Awaiting Card Issuance</span>
            </h3>

            <div className="space-y-3">
              {pendingMembers.map((m) => (
                <div key={m.id} className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <strong className="text-stone-900 font-bold block">{m.fullName}</strong>
                    <span className="text-[10px] text-stone-550 block mt-0.5">{m.school} • {m.country}</span>
                    <span className="text-[10px] font-semibold text-slate-800 block mt-0.5 font-mono">{m.department} Division</span>
                    <p className="text-[9.5px] italic text-stone-500 mt-1 max-w-lg line-clamp-2">"Essay: {m.essay}"</p>
                  </div>

                  <button
                    onClick={() => {
                      onApproveMember(m.id);
                      alert(`Successfully approved and issued custom certificate details to: ${m.fullName}!`);
                    }}
                    className="self-start sm:self-center px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer shrink-0 focus:outline-none"
                    id={`btn-approve-member-${m.id}`}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Approve Student
                  </button>
                </div>
              ))}
              {pendingMembers.length === 0 && (
                <p className="text-xs text-stone-400 italic text-center py-6">All applicant accounts have been processed successfully!</p>
              )}
            </div>
          </div>

          {/* Pending Projects */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
              Pending Project Outlines ({pendingProjects.length})
            </h3>

            <div className="space-y-3">
              {pendingProjects.map((p) => (
                <div key={p.id} className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <strong className="text-stone-900 font-bold block">{p.name}</strong>
                    <span className="text-[10px] text-stone-550 block mt-0.5">{p.department} division • Submitted by: {p.submittedBy} ({p.country})</span>
                    <p className="text-[9.5px] text-stone-500 mt-1 line-clamp-1">{p.description}</p>
                    {p.docUrl && (
                      <a
                        href={p.docUrl}
                        download={p.docName || "project_proposal.pdf"}
                        className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer transition-all"
                      >
                        📎 Attached Doc: {p.docName || "proposal.pdf"}
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onApproveProject(p.id);
                      alert(`Project outlines successfully authorized across directories!`);
                    }}
                    className="self-start sm:self-center px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shrink-0 focus:outline-none"
                    id={`btn-approve-project-${p.id}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authorize Project
                  </button>
                </div>
              ))}
              {pendingProjects.length === 0 && (
                <p className="text-xs text-stone-400 italic text-center py-4">No pending innovative projects awaiting authorization.</p>
              )}
            </div>
          </div>

          {/* Pending Events */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
              Pending Events ({pendingEvents.length})
            </h3>

            <div className="space-y-3">
              {pendingEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-stone-55 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                  <div>
                    <strong className="text-stone-900 font-bold block">{evt.name}</strong>
                    <span className="text-[10px] text-stone-550 block mt-0.5">Date scheduled: {evt.date} • {evt.department}</span>
                  </div>

                  <button
                    onClick={() => {
                      onApproveEvent(evt.id);
                      alert("Summits and meetings set to live status!");
                    }}
                    className="self-start sm:self-center px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 focus:outline-none"
                    id={`btn-approve-event-${evt.id}`}
                  >
                    Approve Event
                  </button>
                </div>
              ))}
              {pendingEvents.length === 0 && (
                <p className="text-xs text-stone-400 italic text-center py-4">No pending scheduled meetups.</p>
              )}
            </div>
          </div>

          {/* Pending Club & Partners Proposals */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100">
              Club Proposals & Partnerships ({pendingClubs.length + pendingPartners.length})
            </h3>

            <div className="space-y-3">
              {pendingClubs.map((club) => (
                <div key={club.id} className="p-3 bg-stone-50 border border-stone-201 rounded flex justify-between items-center text-xs shadow-sm">
                  <div>
                    <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 border border-stone-200 rounded text-stone-600">Club request</span>
                    <strong className="text-stone-900 block mt-1">{club.clubName} ({club.school})</strong>
                    <span className="text-stone-505 text-[9.5px]">Region: {club.country}</span>
                  </div>
                  <button 
                    onClick={() => onApproveClub(club.id)}
                    className="px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold hover:bg-slate-900 hover:text-white transition-all cursor-pointer focus:outline-none"
                  >
                    Sanction Club
                  </button>
                </div>
              ))}

              {pendingPartners.map((partner) => (
                <div key={partner.id} className="p-3 bg-stone-50 border border-stone-201 rounded flex justify-between items-center text-xs shadow-sm">
                  <div>
                    <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 border border-stone-200 rounded text-stone-600">Partnership offer</span>
                    <strong className="text-stone-900 block mt-1">{partner.organization}</strong>
                    <span className="text-stone-505 text-[9.5px]">Region: {partner.country}</span>
                  </div>
                  <button 
                    onClick={() => onApprovePartner(partner.id)}
                    className="px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-800 text-[10px] font-bold hover:bg-slate-900 hover:text-white transition-all cursor-pointer focus:outline-none"
                  >
                    Partner
                  </button>
                </div>
              ))}

              {pendingClubs.length === 0 && pendingPartners.length === 0 && (
                <p className="text-xs text-stone-400 italic text-center py-4">No pending proposals listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Broadcast admin system message */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-4 shadow-sm">
            <div className="border-b border-stone-100 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Deploy Executive Message</h4>
              <span className="text-[9px] text-stone-500 font-bold block">Broadcast live notifications to chat logs</span>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Target Broadcast Channel</label>
                <select
                  value={broadcastChannel}
                  onChange={(e: any) => setBroadcastChannel(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-2 text-stone-900 focus:outline-none"
                >
                  <option value="members">Members Chat Logs</option>
                  <option value="leaders">Leaders Chat Logs</option>
                  <option value="both">Both Channels</option>
                </select>
              </div>

              <div>
                <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type broadcast message from President Ezra Michael Jofe..."
                  className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-2 text-stone-900 h-24 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white transition-colors text-xs font-bold rounded uppercase tracking-wider cursor-pointer focus:outline-none"
              >
                Launch Broadcast
              </button>
            </form>
          </div>

          {/* SUBMISSIONS PIN EDITING FUTURE */}
          <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-4 shadow-sm">
            <div className="border-b border-stone-100 pb-2 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-[11px]">Submissions PIN Editing</h4>
                <span className="text-[9px] text-stone-500 block mt-0.5">Edit system-wide verification clearances</span>
              </div>
              <span className="text-[8px] bg-red-100 text-red-700 border border-red-200 py-0.5 px-2 rounded font-black font-mono shrink-0">
                SECURE
              </span>
            </div>

            <div className="space-y-3 } text-xs">
              <div className="space-y-1">
                <label className="text-[9.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Scientific Project Submission PIN
                </label>
                <input 
                  type="text"
                  value={projectPinInput}
                  onChange={(e) => setProjectPinInput(e.target.value)}
                  className="w-full bg-stone-50 text-stone-900 font-mono border border-stone-300 p-2 rounded focus:outline-none placeholder-stone-400 font-bold text-[11px]"
                  placeholder="Enter custom Project PIN"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Hosted Event Calendar PIN
                </label>
                <input 
                  type="text"
                  value={eventPinInput}
                  onChange={(e) => setEventPinInput(e.target.value)}
                  className="w-full bg-stone-50 text-stone-900 font-mono border border-stone-300 p-2 rounded focus:outline-none placeholder-stone-400 font-bold text-[11px]"
                  placeholder="Enter custom Event PIN"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Leadership Applications PIN
                </label>
                <input 
                  type="text"
                  value={leadershipPinInput}
                  onChange={(e) => setLeadershipPinInput(e.target.value)}
                  className="w-full bg-stone-50 text-stone-900 font-mono border border-stone-300 p-2 rounded focus:outline-none placeholder-stone-400 font-bold text-[11px]"
                  placeholder="Enter custom Leadership PIN"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-stone-500 font-bold uppercase tracking-wider block">
                  Monthly Honors Award PIN
                </label>
                <input 
                  type="text"
                  value={awardPinInput}
                  onChange={(e) => setAwardPinInput(e.target.value)}
                  className="w-full bg-stone-50 text-stone-900 font-mono border border-stone-300 p-2 rounded focus:outline-none placeholder-stone-400 font-bold text-[11px]"
                  placeholder="Enter custom Award PIN"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateClearancePins({
                    ...clearancePins,
                    projectPin: projectPinInput.trim(),
                    eventPin: eventPinInput.trim(),
                    leadershipPin: leadershipPinInput.trim(),
                    awardPin: awardPinInput.trim()
                  });
                  alert("Executive submissions clearance PINs updated successfully across POAF continental databases.");
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white transition-colors text-[10.5px] font-black rounded uppercase tracking-wider cursor-pointer mt-2 focus:outline-none"
              >
                Save Clearance PINs
              </button>
            </div>
          </div>

          {/* WHATSAPP GROUP INTEGRATION CONTROL */}
          <div className="bg-white border border-emerald-200 p-5 rounded-xl space-y-4 shadow-sm bg-emerald-50/10">
            <div className="border-b border-emerald-150 pb-2">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-emerald-600 text-sm">📞</span> WhatsApp Community Join
              </h4>
              <span className="text-[9px] text-emerald-700 font-semibold block mt-0.5">Invite approved members to the WhatsApp group</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[9.5px] text-emerald-800 font-bold uppercase tracking-wider block">
                  WhatsApp Group Invite Link
                </label>
                <input 
                  type="text"
                  value={whatsappLinkInput}
                  onChange={(e) => setWhatsappLinkInput(e.target.value)}
                  className="w-full bg-white text-stone-905 border border-emerald-200 p-2 rounded focus:outline-none placeholder-emerald-400 font-semibold text-[11px]"
                  placeholder="https://chat.whatsapp.com/GogotacarePOAF2026"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onUpdateClearancePins({
                    ...clearancePins,
                    whatsappLink: whatsappLinkInput.trim()
                  });
                  alert("WhatsApp Group Link updated successfully on POAF servers!");
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-[10px] font-black rounded uppercase tracking-wider cursor-pointer focus:outline-none"
              >
                Update Group Invite URL
              </button>
              
              <div className="pt-2 border-t border-emerald-100/50 flex flex-col gap-1.5">
                <span className="text-[9.5px] text-stone-500 leading-normal block">
                  Press below to send an automatic message to approved members only in the General Members Chat.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!whatsappLinkInput.trim()) {
                      alert("Please specify and save a valid WhatsApp group invite link first.");
                      return;
                    }
                    const autoMsg = `📢 ATTENTION APPROVED MEMBERS: All approved student members are cordially invited to click the following link to join our official POAF WhatsApp Group for meetings: ${whatsappLinkInput.trim()}`;
                    onPostAdminMessage('members', autoMsg);
                    alert("Automated WhatsApp invite message successfully posted to General Members Chat!");
                  }}
                  className="w-full py-1.5 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[10px] font-bold rounded uppercase tracking-wider cursor-pointer transition-colors focus:outline-none"
                >
                  💬 Post Automatic WA Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOUNDER WORKSPACE MASTER EDITING REGISTRY PANEL */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-sm" id="founder-editing-master-panel">
        <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Edit className="w-4 h-4 text-slate-800" /> Active Directory & Content Editor
            </h3>
            <p className="text-[10px] text-stone-550 mt-0.5">Edit credentials, projects, and events live on the continental collective platform</p>
          </div>

          <div className="flex flex-wrap bg-stone-100 border border-stone-200 rounded p-1 text-[11px] font-bold gap-1">
            <button
              onClick={() => { setActiveManagerTab('members'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'members' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Students ({members.filter(m => m.status === 'Approved').length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('projects'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'projects' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Projects ({projects.filter(p => p.status === 'Approved').length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('events'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'events' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Events ({events.filter(e => e.status === 'Approved').length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('awards'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'awards' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Honours ({awards.length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('leaders'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'leaders' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Leadership Apps ({leadershipApps.length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('clubs'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'clubs' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Clubs ({clubs.length})
            </button>
            <button
              onClick={() => { setActiveManagerTab('partnerships'); setEditingItemId(null); }}
              className={`px-2.5 py-1 rounded transition-colors focus:outline-none ${activeManagerTab === 'partnerships' ? 'bg-slate-900 text-white' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Partnerships ({partnerships.length})
            </button>
          </div>
        </div>

        {/* Datastore & Seeding Command Center */}
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Database className="w-4 h-4 text-[#C9A84C]" /> Roster Bulk Population Engine
            </h4>
            <p className="text-stone-500 text-[10px] leading-relaxed">
              Instantly generate realistic, compliant records (300 students, 120 cabinet leaders, 50 solution projects, 30 events, 60 awards/honors, 10 campus chapters, and 50 partnerships) satisfying all word validation guidelines.
            </p>
            {onBulkSeed && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("This will seed 300 students, 120 leaders, 50 projects, 30 events, 60 honors, 10 clubs, and 50 partnerships, fully pre-validated. Proceed?")) {
                    onBulkSeed();
                  }
                }}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-wide rounded cursor-pointer transition-colors text-[10px]"
              >
                🚀 Populate 620+ Validated Items
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Trash2 className="w-4 h-4 text-rose-600" /> Administrative Category Sweep
            </h4>
            <p className="text-stone-500 text-[10px] leading-relaxed">
              Perform secure whole-directory housecleaning. Instantly delete all approved items in a selected folder. Note: Member deleting preserves the founder.
            </p>
            <div className="flex gap-2 text-stone-950 font-bold">
              <select
                id="deleteAllCategorySelector"
                className="bg-white border border-stone-300 text-stone-700 text-[10px] rounded px-2 py-1 focus:outline-none"
              >
                <option value="">Select Category to Sweep...</option>
                <option value="members">Approved Members/Students (Keep Founder)</option>
                <option value="projects">Approved Venture Projects</option>
                <option value="events">Approved Summit Events</option>
                <option value="clubs">Campus Club Chapters</option>
                <option value="partnerships">Strategic Partnerships</option>
                <option value="awards">Honours Board / Ribbons</option>
              </select>
              {onDeleteAllCategory && (
                <button
                  type="button"
                  onClick={() => {
                    const sel = (document.getElementById("deleteAllCategorySelector") as HTMLSelectElement)?.value;
                    if (!sel) {
                      alert("Please select a valid datastore category to sweep.");
                      return;
                    }
                    if (confirm(`CRITICAL: You are about to DELETE ALL approved records in Category: "${sel}". This action cannot be undone. Proceed?`)) {
                      if (confirm("FINAL WARNING: Are you absolutely certain you want to purge these datastore contents?")) {
                        onDeleteAllCategory(sel as any);
                        alert(`Datastore category "${sel}" successfully swept.`);
                      }
                    }
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wide rounded cursor-pointer transition-colors text-[10px]"
                >
                  Purge Folder
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members Management Tab */}
        {activeManagerTab === 'members' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Need to register a custom student profile bypassing normal application queues?</p>
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddMemberForm ? "Close Form" : "+ Register Executive Pioneer Student"}
                </button>
              </div>

              {showAddMemberForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Deploy Student Roster Override</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={newMemName}
                        onChange={(e) => setNewMemName(e.target.value)}
                        placeholder="E.g. Samuel Adegboyega" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Contact Email</label>
                      <input 
                        type="email" 
                        value={newMemEmail}
                        onChange={(e) => setNewMemEmail(e.target.value)}
                        placeholder="E.g. samuel@university.edu" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Contact Phone</label>
                      <input 
                        type="text" 
                        value={newMemPhone}
                        onChange={(e) => setNewMemPhone(e.target.value)}
                        placeholder="E.g. +234 812 345 6789" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Region / Country</label>
                      <input 
                        type="text" 
                        value={newMemCountry}
                        onChange={(e) => setNewMemCountry(e.target.value)}
                        placeholder="E.g. Nigeria" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Affiliated School / College</label>
                      <input 
                        type="text" 
                        value={newMemSchool}
                        onChange={(e) => setNewMemSchool(e.target.value)}
                        placeholder="E.g. University of Lagos" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Target Division</label>
                      <select 
                        value={newMemDept}
                        onChange={(e) => setNewMemDept(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddMemberSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Authorize and Register Standard Student
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.filter(m => m.status === 'Approved').map((m) => {
                const isItemEditing = editingItemId === m.id;
                return (
                  <div key={m.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{m.fullName}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">POAF Registry ID: {m.id} • Level: {m.roleCategory || "Member"}</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-150 px-2 py-0.5 rounded leading-none">
                            {m.department}
                          </span>
                        </div>
                        <p className="text-stone-600 mt-1"><span className="text-stone-400 font-semibold">School:</span> {m.school} ({m.country})</p>
                        <p className="text-stone-600"><span className="text-stone-400 font-semibold">Track:</span> {m.universityTrack || "Not Spec"} • <span className="text-stone-400 font-semibold">GPA:</span> {m.grade || "Not Spec"}</p>
                        {m.skills && <p className="text-stone-600"><span className="text-stone-400 font-semibold">Skills:</span> {m.skills}</p>}
                        {m.essay && <p className="text-[10.5px] italic text-stone-600 bg-white p-2.5 rounded border border-stone-150 mt-2 line-clamp-3">"Essay: {m.essay}"</p>}
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Full Legal Name</label>
                          <input
                            type="text"
                            value={memberEditFullName}
                            onChange={(e) => setMemberEditFullName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">School / Org</label>
                            <input
                              type="text"
                              value={memberEditSchool}
                              onChange={(e) => setMemberEditSchool(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Country</label>
                            <input
                              type="text"
                              value={memberEditCountry}
                              onChange={(e) => setMemberEditCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Academic Track</label>
                            <input
                              type="text"
                              value={memberEditTrack}
                              onChange={(e) => setMemberEditTrack(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">GPA / Grade Level</label>
                            <input
                              type="text"
                              value={memberEditGrade}
                              onChange={(e) => setMemberEditGrade(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Skills Keywords</label>
                          <input
                            type="text"
                            value={memberEditSkills}
                            onChange={(e) => setMemberEditSkills(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Motivation Essay</label>
                          <textarea
                            rows={3}
                            value={memberEditEssay}
                            onChange={(e) => setMemberEditEssay(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingMember(m)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Profile
                          </button>
                          {onDeleteMember && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete approved member "${m.fullName}"? This action is irreversible.`)) {
                                  onDeleteMember(m.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleMemberSave(m.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Stored
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {members.filter(m => m.status === 'Approved').length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No approved student profiles stored.</p>
              )}
            </div>
          </div>
        )}

        {/* Projects Management Tab */}
        {activeManagerTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Publish a new vetted solution blueprint project directly to directories?</p>
                <button
                  type="button"
                  onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddProjectForm ? "Close Form" : "+ Create Custom Project"}
                </button>
              </div>

              {showAddProjectForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Publish New Project Blueprint</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Project / Venture Name</label>
                      <input 
                        type="text" 
                        value={newProjName}
                        onChange={(e) => setNewProjName(e.target.value)}
                        placeholder="E.g. Solar Agri Irrigation Pump" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Author Name / Submitted By</label>
                      <input 
                        type="text" 
                        value={newProjAuthor}
                        onChange={(e) => setNewProjAuthor(e.target.value)}
                        placeholder="E.g. Tech Vanguard Team" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Country Origin</label>
                      <input 
                        type="text" 
                        value={newProjCountry}
                        onChange={(e) => setNewProjCountry(e.target.value)}
                        placeholder="E.g. Nigeria" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Academic division / Dept</label>
                      <select 
                        value={newProjDept}
                        onChange={(e) => setNewProjDept(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Venture Abstract / Solution Statement</label>
                      <textarea 
                        rows={3}
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        placeholder="Provide deep abstract of project capabilities..." 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddProjectSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Deploy Innovative Solution to Directory
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.filter(p => p.status === 'Approved').map((p) => {
                const isItemEditing = editingItemId === p.id;
                return (
                  <div key={p.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{p.name}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Project Ref: {p.id} • Head: {p.submittedBy} ({p.country})</span>
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-black text-slate-800 bg-stone-150 px-2 py-0.5 rounded leading-none">
                            {p.department}
                          </span>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-[11px] mt-2">"{p.description}"</p>
                        <div className="mt-2.5">
                          {p.docUrl ? (
                            <a
                              href={p.docUrl}
                              download={p.docName || "project_proposal.pdf"}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-white text-[9.5px] font-bold rounded shadow-sm transition-all"
                            >
                              📎 Attached Doc ({p.docName?.split('.').pop()?.toUpperCase() || 'DOCUMENT'})
                            </a>
                          ) : (
                            <a
                              href="data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKFBPQUYgUHJvamVjdCBCbHVlcHJpbnQpCi9BdXRob3IgKEV6cmEgTWljaGFlbCBKb2ZlKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFsgNCAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKn..."
                              download={`${p.name.replace(/\s+/g, "_")}_Blueprint.pdf`}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-250 text-stone-700 text-[9.5px] font-bold rounded shadow-sm transition-all"
                            >
                              📎 Sample Blueprint (PDF)
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Project Name</label>
                          <input
                            type="text"
                            value={projectEditName}
                            onChange={(e) => setProjectEditName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Division Segment</label>
                            <select
                              value={projectEditDept}
                              onChange={(e) => setProjectEditDept(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            >
                              {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Origin Country</label>
                            <input
                              type="text"
                              value={projectEditCountry}
                              onChange={(e) => setProjectEditCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Project Abstract</label>
                          <textarea
                            rows={3}
                            value={projectEditDesc}
                            onChange={(e) => setProjectEditDesc(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingProject(p)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Project
                          </button>
                          {onDeleteProject && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete approved project Blueprint "${p.name}"? This action is irreversible.`)) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleProjectSave(p.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Project
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {projects.filter(p => p.status === 'Approved').length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No active innovative projects outlines stored.</p>
              )}
            </div>
          </div>
        )}

        {/* Events Management Tab */}
        {activeManagerTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Schedule an authorized new meeting or assembly live on system calendars?</p>
                <button
                  type="button"
                  onClick={() => setShowAddEventForm(!showAddEventForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddEventForm ? "Close Form" : "+ Schedule Virtual Summit"}
                </button>
              </div>

              {showAddEventForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Schedule Virtual Summit / Briefing</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Event Name</label>
                      <input 
                        type="text" 
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="E.g. Horn of Africa Tech Summit" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Date of Summit</label>
                      <input 
                        type="date" 
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Start Time</label>
                      <input 
                        type="text" 
                        value={newEventStart}
                        onChange={(e) => setNewEventStart(e.target.value)}
                        placeholder="E.g. 18:00" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">End Time</label>
                      <input 
                        type="text" 
                        value={newEventEnd}
                        onChange={(e) => setNewEventEnd(e.target.value)}
                        placeholder="E.g. 20:00" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Academic division / Dept Focus</label>
                      <select 
                        value={newEventDept}
                        onChange={(e) => setNewEventDept(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Agenda Details & Description</label>
                      <textarea 
                        rows={3}
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="Enter direct virtual briefing objectives or linkage URL..." 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddEventSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Deploy Meetup on Official Calendar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.filter(e => e.status === 'Approved').map((e) => {
                const isItemEditing = editingItemId === e.id;
                return (
                  <div key={e.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{e.name}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Event Ref: {e.id} • Hub: {e.department}</span>
                          </div>
                          <span className="text-[10px] font-bold text-stone-600 font-mono bg-stone-200 px-2.5 py-0.5 border border-stone-300 rounded">
                            {e.date}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500"><span className="text-stone-400 font-semibold">Time Schedule:</span> 🕒 {e.startTime} - {e.endTime}</p>
                        <p className="text-stone-600 leading-relaxed text-[11px] mt-2">"{e.description}"</p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Event Name</label>
                          <input
                            type="text"
                            value={eventEditName}
                            onChange={(e) => setEventEditName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Event Date</label>
                            <input
                              type="text"
                              placeholder="YYYY-MM-DD"
                              value={eventEditDate}
                              onChange={(e) => setEventEditDate(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Start Time</label>
                            <input
                              type="text"
                              placeholder="09:00"
                              value={eventEditStart}
                              onChange={(e) => setEventEditStart(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">End Time</label>
                            <input
                              type="text"
                              placeholder="17:00"
                              value={eventEditEnd}
                              onChange={(e) => setEventEditEnd(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Event Description</label>
                          <textarea
                            rows={3}
                            value={eventEditDesc}
                            onChange={(e) => setEventEditDesc(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingEvent(e)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Event
                          </button>
                          {onDeleteEvent && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete event "${e.name}"? This action is irreversible.`)) {
                                  onDeleteEvent(e.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleEventSave(e.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Event
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {events.filter(e => e.status === 'Approved').length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No active student events or summits scheduled.</p>
              )}
            </div>
          </div>
        )}

        {/* Awards/Honours Management Tab */}
        {activeManagerTab === 'awards' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Bestow a new Monthly Honour Award/Opportunity dynamically on the system board?</p>
                <button
                  type="button"
                  onClick={() => setShowAddAwardForm(!showAddAwardForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddAwardForm ? "Close Form" : "+ Create Custom Award"}
                </button>
              </div>

              {showAddAwardForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Bestow New Monthly Award</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Honour Category</label>
                      <select 
                        value={newAwardCategory}
                        onChange={(e: any) => setNewAwardCategory(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        <option value="Student of the Month">Student of the Month</option>
                        <option value="Innovator of the Month">Innovator of the Month</option>
                        <option value="Researcher of the Month">Researcher of the Month</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Awardee Full Name</label>
                      <input 
                        type="text" 
                        value={newAwardMemberName}
                        onChange={(e) => setNewAwardMemberName(e.target.value)}
                        placeholder="E.g. Fatima Bello" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Registrant ID Reference (optional)</label>
                      <input 
                        type="text" 
                        value={newAwardMemberId}
                        onChange={(e) => setNewAwardMemberId(e.target.value)}
                        placeholder="E.g. POAF-5721" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Awardee Region / Country</label>
                      <input 
                        type="text" 
                        value={newAwardMemberCountry}
                        onChange={(e) => setNewAwardMemberCountry(e.target.value)}
                        placeholder="E.g. Nigeria" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Honour Title / Citation Outline</label>
                      <input 
                        type="text" 
                        value={newAwardTitle}
                        onChange={(e) => setNewAwardTitle(e.target.value)}
                        placeholder="E.g. Outstanding Breakthrough in Crop Biotech Research" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Award Narrative Citation Description</label>
                      <textarea 
                        rows={3}
                        value={newAwardDesc}
                        onChange={(e) => setNewAwardDesc(e.target.value)}
                        placeholder="Explain why this student has earned this high executive distinction..." 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddAwardSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Commit Distinction Award to Board
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map((a) => {
                const isItemEditing = editingItemId === a.id;
                return (
                  <div key={a.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{a.memberName}</strong>
                            <span className="text-[10px] text-[#C9A84C] font-semibold tracking-wider font-mono block mt-0.5">{a.category}</span>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Award Ref: {a.id} • Recipient ID: {a.memberId} ({a.memberCountry})</span>
                          </div>
                          <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded text-stone-700 font-mono">
                            {a.date}
                          </span>
                        </div>
                        {a.title && <p className="text-stone-800 font-bold mt-2">🏆 {a.title}</p>}
                        {a.description && <p className="text-stone-600 leading-relaxed text-[11px] mt-1">"{a.description}"</p>}
                        {a.photo && (
                          <div className="w-24 h-16 rounded overflow-hidden border border-stone-200 mt-2 bg-white">
                            <img src={a.photo} alt={a.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Recipient Name</label>
                          <input
                            type="text"
                            value={awardEditMemberName}
                            onChange={(e) => setAwardEditMemberName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Recipient Member ID</label>
                            <input
                              type="text"
                              value={awardEditMemberId}
                              onChange={(e) => setAwardEditMemberId(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Country</label>
                            <input
                              type="text"
                              value={awardEditMemberCountry}
                              onChange={(e) => setAwardEditMemberCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Category</label>
                            <select
                              value={awardEditCategory}
                              onChange={(e: any) => setAwardEditCategory(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            >
                              <option value="Student of the Month">Student of the Month</option>
                              <option value="Innovator of the Month">Innovator of the Month</option>
                              <option value="Researcher of the Month">Researcher of the Month</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Award Date (YYYY-MM)</label>
                            <input
                              type="text"
                              value={awardEditDate}
                              onChange={(e) => setAwardEditDate(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Award Title</label>
                          <input
                            type="text"
                            value={awardEditTitle}
                            onChange={(e) => setAwardEditTitle(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Citation Description</label>
                          <textarea
                            rows={3}
                            value={awardEditDesc}
                            onChange={(e) => setAwardEditDesc(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingAward(a)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Honour
                          </button>
                          {onDeleteAward && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete award "${a.title}"? This action is irreversible.`)) {
                                  onDeleteAward(a.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleAwardSave(a.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Stored
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {awards.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No allocated honors or awards recorded.</p>
              )}
            </div>
          </div>
        )}

        {/* Leadership Applications Management Tab */}
        {activeManagerTab === 'leaders' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Directly appoint an approved new Leader (Ambassador / Cabinet Director)?</p>
                <button
                  type="button"
                  onClick={() => setShowAddLeaderForm(!showAddLeaderForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddLeaderForm ? "Close Form" : "+ Appoint Cabinet Leader"}
                </button>
              </div>

              {showAddLeaderForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Appoint Executive Cabinet Leader</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Leader Full Name</label>
                      <input 
                        type="text" 
                        value={newLeaderName}
                        onChange={(e) => setNewLeaderName(e.target.value)}
                        placeholder="E.g. Dr. Kelechi Amadi" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Contact Email</label>
                      <input 
                        type="email" 
                        value={newLeaderEmail}
                        onChange={(e) => setNewLeaderEmail(e.target.value)}
                        placeholder="E.g. kelechi@poaf.org" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Representing Country</label>
                      <input 
                        type="text" 
                        value={newLeaderCountry}
                        onChange={(e) => setNewLeaderCountry(e.target.value)}
                        placeholder="E.g. Nigeria" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Affiliated Institution</label>
                      <input 
                        type="text" 
                        value={newLeaderSchool}
                        onChange={(e) => setNewLeaderSchool(e.target.value)}
                        placeholder="E.g. POAF HQ / Uni" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Target Academic Division</label>
                      <select 
                        value={newLeaderDept}
                        onChange={(e) => setNewLeaderDept(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Specific Cabinet Title</label>
                      <select 
                        value={newLeaderRole}
                        onChange={(e) => setNewLeaderRole(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      >
                        <option value="Country Ambassador">Country Ambassador</option>
                        <option value="Regional Governance Coordinator">Regional Governance Coordinator</option>
                        <option value="Academic Chapter Leader">Academic Chapter Leader</option>
                        <option value="Vanguard Council Board Member">Vanguard Council Board Member</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddLeaderSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Commit Assembly Appoint to Cabinet
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leadershipApps.map((l) => {
                const isItemEditing = editingItemId === l.id;
                return (
                  <div key={l.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{l.fullName}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">App ID: {l.id} • Ref ID: {l.memberId} ({l.country})</span>
                          </div>
                          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border leading-none ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : l.status === 'Declined' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {l.status}
                          </span>
                        </div>
                        <p className="text-stone-600 mt-2"><span className="text-stone-400 font-semibold">Cabinet Role:</span> <span className="font-bold text-slate-800">{l.position}</span> • <span className="text-stone-400 font-semibold">Dept:</span> {l.department}</p>
                        {l.motivation && <p className="text-stone-600 leading-relaxed text-[11px] bg-white p-2 border border-stone-150 rounded mt-2 italic">"Motivation: {l.motivation}"</p>}
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Full Name</label>
                          <input
                            type="text"
                            value={leadEditFullName}
                            onChange={(e) => setLeadEditFullName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Student Registry ID</label>
                            <input
                              type="text"
                              value={leadEditMemberId}
                              onChange={(e) => setLeadEditMemberId(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Country</label>
                            <input
                              type="text"
                              value={leadEditCountry}
                              onChange={(e) => setLeadEditCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Position</label>
                            <input
                              type="text"
                              value={leadEditPosition}
                              onChange={(e) => setLeadEditPosition(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Cabinet Division</label>
                            <input
                              type="text"
                              value={leadEditDepartment}
                              onChange={(e) => setLeadEditDepartment(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Cabinet Status</label>
                            <select
                              value={leadEditStatus}
                              onChange={(e: any) => setLeadEditStatus(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950' focus:outline-none font-bold"
                            >
                              <option value="Pending">Pending Audit</option>
                              <option value="Approved">Approved / Sanctioned</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Cabinet Aspiration Motivation</label>
                          <textarea
                            rows={3}
                            value={leadEditMotivation}
                            onChange={(e) => setLeadEditMotivation(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingLeadApp(l)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Record
                          </button>
                          {onDeleteLeadershipApp && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete leadership application for "${l.fullName}"? This action is irreversible.`)) {
                                  onDeleteLeadershipApp(l.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleLeadAppSave(l.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Stored
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {leadershipApps.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No submitted leadership applications recorded in the database.</p>
              )}
            </div>
          </div>
        )}

        {/* Clubs Management Tab */}
        {activeManagerTab === 'clubs' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Directly instantiate and authorize an approved new Campus Club Chapter?</p>
                <button
                  type="button"
                  onClick={() => setShowAddClubForm(!showAddClubForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddClubForm ? "Close Form" : "+ Create Campus Club"}
                </button>
              </div>

              {showAddClubForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Authorize Campus Club Chapter</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Chapter / Designate Name</label>
                      <input 
                        type="text" 
                        value={newClubName}
                        onChange={(e) => setNewClubName(e.target.value)}
                        placeholder="E.g. POAF Builders Club" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Affiliated College / School</label>
                      <input 
                        type="text" 
                        value={newClubSchool}
                        onChange={(e) => setNewClubSchool(e.target.value)}
                        placeholder="E.g. University of Nairobi" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Chapter Country Region</label>
                      <input 
                        type="text" 
                        value={newClubCountry}
                        onChange={(e) => setNewClubCountry(e.target.value)}
                        placeholder="E.g. Kenya" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Designated Contact Email</label>
                      <input 
                        type="email" 
                        value={newClubEmail}
                        onChange={(e) => setNewClubEmail(e.target.value)}
                        placeholder="E.g. poaf@uonbi.ac.ke" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Establishment Mandate & Written Proposal Summary</label>
                      <textarea 
                        rows={3}
                        value={newClubProposal}
                        onChange={(e) => setNewClubProposal(e.target.value)}
                        placeholder="Describe the physical meeting plans and regional coordinator designates..." 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddClubSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Deploy Academic Campus Chapter
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map((c) => {
                const isItemEditing = editingItemId === c.id;
                return (
                  <div key={c.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{c.clubName}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Club Ref ID: {c.id} • Campus: {c.school} ({c.country})</span>
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 border rounded leading-none ${c.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-500 border-amber-200'}`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-600 space-y-1 font-mono pt-1">
                          {c.contactEmail && <p>📧 Email: {c.contactEmail}</p>}
                          {c.contactPhone && <p>📞 Phone: {c.contactPhone}</p>}
                        </div>
                        {c.writtenProposal && <p className="text-stone-605 text-[10px] italic bg-white p-2 border border-stone-100 rounded mt-2">"Proposal: {c.writtenProposal}"</p>}
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Club Name</label>
                          <input
                            type="text"
                            value={clubEditName}
                            onChange={(e) => setClubEditName(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">University / School</label>
                            <input
                              type="text"
                              value={clubEditSchool}
                              onChange={(e) => setClubEditSchool(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Country</label>
                            <input
                              type="text"
                              value={clubEditCountry}
                              onChange={(e) => setClubEditCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Contact Email</label>
                            <input
                              type="email"
                              value={clubEditEmail}
                              onChange={(e) => setClubEditEmail(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Contact Phone</label>
                            <input
                              type="text"
                              value={clubEditPhone}
                              onChange={(e) => setClubEditPhone(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Written Chapter Proposal</label>
                          <textarea
                            rows={3}
                            value={clubEditProposal}
                            onChange={(e) => setClubEditProposal(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingClub(c)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Club
                          </button>
                          {onDeleteClub && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete approved campus club "${c.clubName}"? This action is irreversible.`)) {
                                  onDeleteClub(c.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handleClubSave(c.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Stored
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {clubs.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No registered campus club designs found.</p>
              )}
            </div>
          </div>
        )}

        {/* Partnerships Management Tab */}
        {activeManagerTab === 'partnerships' && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-slate-700 font-semibold">Directly compile a newly signed institutional Alliance Partnership into logs?</p>
                <button
                  type="button"
                  onClick={() => setShowAddPartnerForm(!showAddPartnerForm)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                >
                  {showAddPartnerForm ? "Close Form" : "+ Create Alliance Partner"}
                </button>
              </div>

              {showAddPartnerForm && (
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3">
                  <h4 className="font-extrabold text-slate-900 border-b border-stone-100 pb-1.5 uppercase text-[10px] tracking-wider">Publish Institutional Alliance Partnership</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Partner Organization Name</label>
                      <input 
                        type="text" 
                        value={newPartnerOrg}
                        onChange={(e) => setNewPartnerOrg(e.target.value)}
                        placeholder="E.g. AfriTech Foundations" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">HQ Cooperating Country</label>
                      <input 
                        type="text" 
                        value={newPartnerCountry}
                        onChange={(e) => setNewPartnerCountry(e.target.value)}
                        placeholder="E.g. South Africa" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Contact Corporate Email</label>
                      <input 
                        type="email" 
                        value={newPartnerEmail}
                        onChange={(e) => setNewPartnerEmail(e.target.value)}
                        placeholder="E.g. alliance@afritech.org" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">HQ Contact Phone</label>
                      <input 
                        type="text" 
                        value={newPartnerPhone}
                        onChange={(e) => setNewPartnerPhone(e.target.value)}
                        placeholder="E.g. +27 21 555 4321" 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] text-stone-500 font-bold uppercase tracking-wider">Alliance Mandate & cooperation statement</label>
                      <textarea 
                        rows={3}
                        value={newPartnerProposal}
                        onChange={(e) => setNewPartnerProposal(e.target.value)}
                        placeholder="Summarize key alignment targets, student job pipelines or technology exchange parameters..." 
                        className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDirectAddPartnerSubmit}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded uppercase tracking-wider text-[10px]"
                  >
                    Commit Alliance Partnership
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerships.map((p) => {
                const isItemEditing = editingItemId === p.id;
                return (
                  <div key={p.id} className="p-4 bg-stone-50 rounded-xl border border-stone-202 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 text-xs shadow-sm">
                    {!isItemEditing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-stone-900 font-bold block text-sm">{p.organization}</strong>
                            <span className="text-[10px] text-stone-500 block mt-0.5 font-mono">Partner Ref ID: {p.id} ({p.country})</span>
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 border rounded leading-none ${p.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-500 border-amber-200'}`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-600 space-y-1 font-mono pt-1">
                          {p.contactEmail && <p>📧 Email: {p.contactEmail}</p>}
                          {p.contactPhone && <p>📞 Phone: {p.contactPhone}</p>}
                        </div>
                        {p.writtenProposal && <p className="text-stone-605 text-[10px] italic bg-white p-2 border border-stone-100 rounded mt-2">"Alliance Proposal: {p.writtenProposal}"</p>}
                      </div>
                    ) : (
                      <div className="space-y-3 text-left">
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Organization / Alliance Entity</label>
                          <input
                            type="text"
                            value={partnerEditOrg}
                            onChange={(e) => setPartnerEditOrg(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Origin Country</label>
                            <input
                              type="text"
                              value={partnerEditCountry}
                              onChange={(e) => setPartnerEditCountry(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Contact Email</label>
                            <input
                              type="email"
                              value={partnerEditEmail}
                              onChange={(e) => setPartnerEditEmail(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Contact Phone</label>
                            <input
                              type="text"
                              value={partnerEditPhone}
                              onChange={(e) => setPartnerEditPhone(e.target.value)}
                              className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[9.5px] uppercase tracking-wider text-stone-500 font-bold block mb-1">Alliance Proposal Abstract</label>
                          <textarea
                            rows={3}
                            value={partnerEditProposal}
                            onChange={(e) => setPartnerEditProposal(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded px-2 py-1.5 text-stone-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 shrink-0">
                      {!isItemEditing ? (
                        <>
                          <button
                            onClick={() => startEditingPartner(p)}
                            className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 font-bold rounded border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Edit className="w-3.5 h-3.5 text-stone-500" /> Edit Alliance
                          </button>
                          {onDeletePartner && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you absolutely sure you want to delete approved alliance partner record with "${p.organization}"? This action is irreversible.`)) {
                                  onDeletePartner(p.id);
                                }
                              }}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="px-3 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-600 font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            onClick={() => handlePartnerSave(p.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors cursor-pointer focus:outline-none"
                          >
                            <Save className="w-3.5 h-3.5" /> Save Stored
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {partnerships.length === 0 && (
                <p className="text-xs text-stone-400 italic py-6 md:col-span-2 text-center">No alliance partnerships registered in the directory.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
