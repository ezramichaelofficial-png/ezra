export interface Member {
  id: string;
  fullName: string;
  gender: string;
  country: string;
  school: string;
  email: string;
  phone: string;
  department: string;
  skills: string;
  essay: string;
  photo: string | null; // base64 or file URL
  status: 'Pending' | 'Approved';
  joinDate: string;
  expiryDate: string;
  cardGenerated: boolean;
  certGenerated: boolean;
  certNumber?: string;
  leadership?: string; // e.g. "Founder & President", "Country Ambassador", "Department Leader", "Director"
  leadershipId?: string;
  awards?: string[];
  isFounder?: boolean;
  biography?: string;
  poafRoleAspiration?: string;
  universityTrack?: string;
  grade?: string;
  major?: string;
  age?: string;
  roleCategory?: 'Member' | 'Leader';
  pin?: string;
}

export interface Project {
  id: string;
  name: string;
  department: string;
  country: string;
  description: string;
  submittedBy: string; // Member Name or ID
  status: 'Pending' | 'Approved';
  photo?: string | null;
  docUrl?: string | null;   // PDF / Word Document Base64 or URL
  docName?: string | null;  // Original uploaded filename
}

export interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  description: string;
  photo?: string | null;
  status: 'Pending' | 'Approved';
}

export interface LeadershipApp {
  id: string;
  memberId: string;
  fullName: string;
  department: string;
  position: string;
  country: string;
  motivation: string;
  status: 'Pending' | 'Approved' | 'Declined';
  dateSubmitted: string;
}

export interface Club {
  id: string;
  school: string;
  country: string;
  clubName: string;
  contactEmail: string;
  contactPhone: string;
  writtenProposal?: string;
  status: 'Pending' | 'Approved';
}

export interface Partner {
  id: string;
  organization: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  writtenProposal?: string;
  status: 'Pending' | 'Approved';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string; // e.g. "Founder", "Leader", "Member"
  message: string;
  timestamp: string;
  channel: 'members' | 'leaders';
  isBroadcast?: boolean;
}

export interface Award {
  id: string;
  category: 'Student of the Month' | 'Innovator of the Month' | 'Researcher of the Month';
  memberId: string;
  memberName: string;
  memberCountry: string;
  date: string;
  title?: string;
  description?: string;
  photo?: string;
}

export function getDirectDriveUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const parts = url.split("/d/");
    if (parts.length > 1) {
      const id = parts[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
    }
  }
  return url;
}
