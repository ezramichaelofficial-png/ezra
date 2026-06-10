import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Store path configuration
const STORE_PATH = path.join(process.cwd(), "data-store.json");

const mapOldDepartmentToNew = (dept: string): string => {
  if (!dept) return dept;
  const normalized = dept.trim();
  const mapping: Record<string, string> = {
    "Community Outreach": "Community Outreach and Problem-Solving Department",
    "Community Outreach Department": "Community Outreach and Problem-Solving Department",
    "Data & Communication": "Debate and communication Department",
    "Data & Communication Department": "Debate and communication Department",
    "Debate and communication": "Debate and communication Department",
    "Debate and Communication": "Debate and communication Department",
    "Student Development": "Student Development and Capacity Building Department",
    "Student Development Department": "Student Development and Capacity Building Department",
    "Student Development and Capacity Building": "Student Development and Capacity Building Department",
    "Youth Empowerment": "Youth Empowerment and Community Development Department",
    "Youth Empowerment Department": "Youth Empowerment and Community Development Department",
    "Youth Empowerment and Community Development": "Youth Empowerment and Community Development Department",
    "Engineering & Research": "Research and engineering Department",
    "Engineering & Research Department": "Research and engineering Department",
    "Research and engineering": "Research and engineering Department",
    "Technology & Innovation": "Technology and Innovation Department",
    "Technology & Innovation Department": "Technology and Innovation Department",
    "Technology and Innovation": "Technology and Innovation Department"
  };
  return mapping[normalized] || normalized;
};

const sanitizeStoreDepartments = (store: any) => {
  if (!store) return store;
  if (Array.isArray(store.members)) {
    store.members = store.members.map((m: any) => {
      if (m.department) {
        m.department = mapOldDepartmentToNew(m.department);
      }
      return m;
    });
  }
  if (Array.isArray(store.projects)) {
    store.projects = store.projects.map((p: any) => {
      if (p.department) {
        p.department = mapOldDepartmentToNew(p.department);
      }
      return p;
    });
  }
  if (Array.isArray(store.events)) {
    store.events = store.events.map((e: any) => {
      if (e.department) {
        e.department = mapOldDepartmentToNew(e.department);
      }
      return e;
    });
  }
  return store;
};

// Helper structure for initial data
const getInitialStore = () => sanitizeStoreDepartments({
  members: [
    // === 8 PRIMARY EXECUTIVE LEADERS ===
    {
      id: "POAF-00001",
      fullName: "Ezra Michael Jofe",
      gender: "Male",
      country: "Africa",
      school: "POAF HQ",
      email: "Ezra.Michael.official@gmail.com",
      phone: "+251911000000",
      department: "Executive Board",
      skills: "Visionary Leadership, Strategy, Public Relations",
      essay: "Founder and President of Pioneers of Africa's Future (POAF). Initiated this movement in 2024 to build sustainable solutions, empower active students, and transform our continental future across all 54 African nations.",
      photo: "https://drive.google.com/file/d/11VYNonUNvAQ_sk2cHeGPZBdumyU_tnrm/view?usp=drivesdk",
      status: "Approved",
      joinDate: "2024-01-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00001",
      leadership: "Founder & President",
      leadershipId: "POAF-L-00001",
      awards: ["Founder and Organizer Medal"],
      isFounder: true,
      pin: "8255",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10002",
      fullName: "Aisha Mahmoud",
      gender: "Female",
      country: "Egypt",
      school: "Cairo University",
      email: "aisha.mahmoud@poaf.org",
      phone: "+201011110002",
      department: "Executive Board",
      skills: "Venture Auditing, Legal Policy, Operational Design",
      essay: "Appointed as Executive Vice-President of POAF. Dedicated to building cross-regional communication channels, ensuring high administrative standards, and overseeing active campus launches across North African universities.",
      photo: null,
      status: "Approved",
      joinDate: "2024-06-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10002",
      leadership: "Executive Vice-President",
      leadershipId: "POAF-L-10002",
      awards: ["Presidential Meritorious Service Medal"],
      pin: "1002",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10003",
      fullName: "Samuel Adebayo",
      gender: "Male",
      country: "Nigeria",
      school: "Covenant University",
      email: "samuel.adebayo@poaf.org",
      phone: "+2348021110003",
      department: "Executive Board",
      skills: "Minutes Documentation, Operational Archiving, Press Management",
      essay: "Executive Secretary of POAF. Coordinating agenda settings, managing general board minutes, and designing standard structural procedures for registering student chapters across sub-Saharan campuses.",
      photo: null,
      status: "Approved",
      joinDate: "2024-06-20",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10003",
      leadership: "Executive Secretary",
      leadershipId: "POAF-L-10003",
      awards: ["Superior Achievement Star"],
      pin: "1003",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10004",
      fullName: "Fatma Al-Suri",
      gender: "Female",
      country: "Tunisia",
      school: "Université de Tunis",
      email: "fatma.alsuri@poaf.org",
      phone: "+21671110004",
      department: "Executive Board",
      skills: "Treasury Logistics, Grant Allocation, Budget Verification",
      essay: "Serving as Cabinet Executive Treasurer. Dedicated to auditing all resource allocations, confirming clear deployment sheets, and verifying funding programs for high-impact campus projects.",
      photo: null,
      status: "Approved",
      joinDate: "2024-07-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10004",
      leadership: "Cabinet Executive Treasurer",
      leadershipId: "POAF-L-10004",
      awards: ["Strategic Integrity Cross"],
      pin: "1004",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10005",
      fullName: "Jean-Pierre Ndlovu",
      gender: "Male",
      country: "Zimbabwe",
      school: "University of Zimbabwe",
      email: "jp.ndlovu@poaf.org",
      phone: "+263771110005",
      department: "Executive Board",
      skills: "Supply Chain, Field Operations, Logistics Coordination",
      essay: "Appointed as Director of Operations. Focused on optimizing the physical delivery of hardware diagrams and coordinating offline field assemblies across agricultural chapters.",
      photo: null,
      status: "Approved",
      joinDate: "2024-07-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10005",
      leadership: "Director of Operations",
      leadershipId: "POAF-L-10005",
      awards: ["Operational Leadership Crest"],
      pin: "1005",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10006",
      fullName: "Marie-Claire Gisele",
      gender: "Female",
      country: "Rwanda",
      school: "University of Rwanda",
      email: "marie.gisele@poaf.org",
      phone: "+250781110006",
      department: "Executive Board",
      skills: "Diplomatic Outreach, Stakeholder Management, Language Translation",
      essay: "Serving as POAF's Relations Ambassador. Bridging the gap between French, English, and local-language speaking chapters to build true continental cohesion and university alliances.",
      photo: null,
      status: "Approved",
      joinDate: "2024-08-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10006",
      leadership: "Relations Ambassador",
      leadershipId: "POAF-L-10006",
      awards: ["Continental Harmony Medal"],
      pin: "1006",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10007",
      fullName: "Ebenezer Kojo",
      gender: "Male",
      country: "Ghana",
      school: "Kwame Nkrumah University of Science and Technology",
      email: "ebenezer.kojo@poaf.org",
      phone: "+233241110007",
      department: "Technology & Innovation",
      skills: "Product Prototyping, Systems Engineering, Clean Energy",
      essay: "Serving as Director of STEM Strategy. Harmonizing technical workshops, designing open-source solar and distillation blueprints, and managing academic research repositories.",
      photo: null,
      status: "Approved",
      joinDate: "2024-08-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10007",
      leadership: "Director of STEM Strategy",
      leadershipId: "POAF-L-10007",
      awards: ["STEM Academic Catalyst"],
      pin: "1007",
      roleCategory: "Leader"
    },
    {
      id: "POAF-10008",
      fullName: "Sarah Jenkins-Okafor",
      gender: "Female",
      country: "Nigeria",
      school: "University of Lagos",
      email: "sarah.jenkins@poaf.org",
      phone: "+2348031110008",
      department: "Data & Communication",
      skills: "Database Architecture, Cryptographic Verification, Data Privacy",
      essay: "Appointed as Chief Ledger Registrar of POAF. Designing tamper-proof verification registries, protecting member datasets, and auditing student record synchronization channels.",
      photo: null,
      status: "Approved",
      joinDate: "2024-09-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-E-10008",
      leadership: "Chief Ledger Registrar",
      leadershipId: "POAF-L-10008",
      awards: ["Outstanding Systems Sentinel medal"],
      pin: "1008",
      roleCategory: "Leader"
    },

    // === 15 DEPARTMENT / REGIONAL LEADERS ===
    {
      id: "POAF-33333",
      fullName: "Kwame Mensah",
      gender: "Male",
      country: "Ghana",
      school: "Ashesi University",
      email: "kwame.mensah@poaf.org",
      phone: "+233241113333",
      department: "Technology & Innovation",
      skills: "React Native, Cloud Infrastructure, Tech Policy",
      essay: "Dedicated to building community communication networks and technical training hubs for African students.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      status: "Approved",
      joinDate: "2025-06-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-33333",
      pin: "3333",
      roleCategory: "Leader",
      leadership: "Country Ambassador",
      leadershipId: "POAF-L-33333"
    },
    {
      id: "POAF-44444",
      fullName: "Wambui Kamau",
      gender: "Female",
      country: "Kenya",
      school: "University of Nairobi",
      email: "wambui.kamau@poaf.org",
      phone: "+254711224444",
      department: "Engineering & Research",
      skills: "Solar Harvesting, CAD Design, Prototyping",
      essay: "Committed to expanding clean power technologies and agricultural storage innovations in East Africa.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
      status: "Approved",
      joinDate: "2025-07-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-44444",
      pin: "4444",
      roleCategory: "Leader",
      leadership: "Regional Director",
      leadershipId: "POAF-L-44444"
    },
    {
      id: "POAF-55555",
      fullName: "Tendai Moyo",
      gender: "Male",
      country: "Zimbabwe",
      school: "University of Zimbabwe",
      email: "tendai.moyo@gmail.com",
      phone: "+263771125555",
      department: "Community Outreach",
      skills: "Conflict Resolution, Interpersonal Advocacy, Event Coordination",
      essay: "Passionate about organizing student assemblies, training programs, and expanding regional networking clubs.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
      status: "Approved",
      joinDate: "2025-08-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-55555",
      pin: "5555",
      roleCategory: "Leader",
      leadership: "Department Coordinator",
      leadershipId: "POAF-L-55555"
    },
    {
      id: "POAF-99999",
      fullName: "Tunde Adeleke",
      gender: "Male",
      country: "Nigeria",
      school: "University of Lagos",
      email: "tunde.adeleke@poaf.org",
      phone: "+2348029999999",
      department: "Technology & Innovation",
      skills: "React, Python, GIS, Cloud Architecture",
      essay: "Focused on deploying student coding networks and community-centric AI tools to bridge the digital gap.",
      photo: null,
      status: "Approved",
      joinDate: "2025-11-20",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-99999",
      pin: "9999",
      roleCategory: "Leader",
      leadership: "Chapter President",
      leadershipId: "POAF-L-99999"
    },
    {
      id: "POAF-00003",
      fullName: "Nia Sanni",
      gender: "Female",
      country: "Ghana",
      school: "University of Ghana",
      email: "nia.sanni@poaf.org",
      phone: "+233241120303",
      department: "Student Development",
      skills: "Public Speaking, Workshop Facilitation, Career Mentoring",
      essay: "I will establish secondary-school mentoring channels and peer coaching structures under the POAF framework.",
      photo: null,
      status: "Approved",
      joinDate: "2025-12-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00003",
      pin: "1203",
      roleCategory: "Leader",
      leadership: "Regional Ambassador",
      leadershipId: "POAF-L-00003"
    },
    {
      id: "POAF-00005",
      fullName: "Amara Keita",
      gender: "Female",
      country: "Guinea",
      school: "Université de Conakry",
      email: "amara.keita@poaf.org",
      phone: "+224621205055",
      department: "Community Outreach",
      skills: "Public Relations, Media Strategy, Grassroots Mobilization",
      essay: "Advocating for student solutions and publishing regular monthly newsletters to highlight youth innovations.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-20",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00005",
      pin: "1205",
      roleCategory: "Leader",
      leadership: "Communications Lead",
      leadershipId: "POAF-L-00005"
    },
    {
      id: "POAF-30001",
      fullName: "Daniel Mulugeta",
      gender: "Male",
      country: "Ethiopia",
      school: "Addis Ababa University",
      email: "daniel.mulugeta@poaf.org",
      phone: "+251911440001",
      department: "Engineering & Research",
      skills: "Irrigation Systems, Hydraulics, Fluid Dynamics",
      essay: "Committed to deploying student-designed mechanical harvesting kits and community bio-filtration tubes.",
      photo: null,
      status: "Approved",
      joinDate: "2025-05-18",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30001",
      pin: "3001",
      roleCategory: "Leader",
      leadership: "Head of Agri-tech Innovation",
      leadershipId: "POAF-L-30001"
    },
    {
      id: "POAF-30002",
      fullName: "Nura Idris",
      gender: "Female",
      country: "Morocco",
      school: "Mohammed V University",
      email: "nura.idris@poaf.org",
      phone: "+212622440002",
      department: "Data & Communication",
      skills: "Statistical Analysis, Technical Writing, Press Liaison",
      essay: "Supervising the research index publications and ensuring our structural audits remain fully transparent.",
      photo: null,
      status: "Approved",
      joinDate: "2025-06-22",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30002",
      pin: "3002",
      roleCategory: "Leader",
      leadership: "Regional Communications Officer",
      leadershipId: "POAF-L-30002"
    },
    {
      id: "POAF-30003",
      fullName: "Chiseche Moyo",
      gender: "Female",
      country: "Zambia",
      school: "University of Zambia",
      email: "chiseche.moyo@poaf.org",
      phone: "+260971240003",
      department: "Youth Empowerment",
      skills: "Business Incubation, Mentorship Strategy, Grant-writing",
      essay: "Expanding campus entrepreneurship networks and launching solution labs focused on youth job creation.",
      photo: null,
      status: "Approved",
      joinDate: "2025-07-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30003",
      pin: "3003",
      roleCategory: "Leader",
      leadership: "National Chapter Coordinator",
      leadershipId: "POAF-L-30003"
    },
    {
      id: "POAF-30004",
      fullName: "Boubacar Traore",
      gender: "Male",
      country: "Senegal",
      school: "Université Cheikh Anta Diop",
      email: "boubacar.traore@poaf.org",
      phone: "+221771240004",
      department: "Student Development",
      skills: "Ethics Education, Policy Formulation, Academic Integrity Counseling",
      essay: "Ensuring proper adherence to our POAF honor code and conducting integrity workshops in western universities.",
      photo: null,
      status: "Approved",
      joinDate: "2025-08-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30004",
      pin: "3004",
      roleCategory: "Leader",
      leadership: "Ethics Board Representative",
      leadershipId: "POAF-L-30004"
    },
    {
      id: "POAF-30005",
      fullName: "Thabo Molefe",
      gender: "Male",
      country: "South Africa",
      school: "University of Witwatersrand",
      email: "thabo.molefe@poaf.org",
      phone: "+27117240005",
      department: "Engineering & Research",
      skills: "Solar Photovoltaics, Micro-grids, CAD Design",
      essay: "Overseeing student micro-projects in renewable battery storage and green energy design across regions.",
      photo: null,
      status: "Approved",
      joinDate: "2025-08-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30005",
      pin: "3005",
      roleCategory: "Leader",
      leadership: "Green Energy Project Officer",
      leadershipId: "POAF-L-30005"
    },
    {
      id: "POAF-30006",
      fullName: "Saffron De-Coninck",
      gender: "Female",
      country: "Namibia",
      school: "University of Namibia",
      email: "saffron.de@poaf.org",
      phone: "+264817240006",
      department: "Community Outreach",
      skills: "Grassroots Campaigning, Resource Relief, Event Planning",
      essay: "Directing localized physical relief campaigns, educational book distribution hubs, and native land recovery.",
      photo: null,
      status: "Approved",
      joinDate: "2025-09-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30006",
      pin: "3006",
      roleCategory: "Leader",
      leadership: "Grassroots Field Organizer",
      leadershipId: "POAF-L-30006"
    },
    {
      id: "POAF-30007",
      fullName: "Blessing Chimwemwe",
      gender: "Female",
      country: "Malawi",
      school: "University of Malawi",
      email: "blessing.c@poaf.org",
      phone: "+26517240007",
      department: "Data & Communication",
      skills: "Data Logging, Ledger Analysis, Transparency Reporting",
      essay: "Managing records across East African branches and confirming full data parity inside key cloud nodes.",
      photo: null,
      status: "Approved",
      joinDate: "2025-09-12",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30007",
      pin: "3007",
      roleCategory: "Leader",
      leadership: "Public Ledger Audit Officer",
      leadershipId: "POAF-L-30007"
    },
    {
      id: "POAF-30008",
      fullName: "Mamadou Sidibe",
      gender: "Male",
      country: "Guinea",
      school: "Université de Conakry",
      email: "mamadou.sidibe@poaf.org",
      phone: "+224621240008",
      department: "Youth Empowerment",
      skills: "Inter-school Coordination, Debate Moderation, Youth Advocacy",
      essay: "Empowering university alliances through regular continental inter-campus debates and training models.",
      photo: null,
      status: "Approved",
      joinDate: "2025-09-25",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30008",
      pin: "3008",
      roleCategory: "Leader",
      leadership: "Continental Interschool Coordinator",
      leadershipId: "POAF-L-30008"
    },
    {
      id: "POAF-30009",
      fullName: "Chima Nwosu",
      gender: "Male",
      country: "Nigeria",
      school: "University of Ibadan",
      email: "chima.nwosu@poaf.org",
      phone: "+2348031240009",
      department: "Technology & Innovation",
      skills: "Open Source Management, Python, Peer Tutoring",
      essay: "Coordinating peer-to-peer coding academies and student hardware developer camps across Nigeria.",
      photo: null,
      status: "Approved",
      joinDate: "2025-10-05",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-L-30009",
      pin: "3009",
      roleCategory: "Leader",
      leadership: "Peer Coding Hub President",
      leadershipId: "POAF-L-30009"
    },

    // === 30 REGISTERED GENERAL MEMBERS ===
    {
      id: "POAF-11111",
      fullName: "Chidera Okafor",
      gender: "Female",
      country: "Nigeria",
      school: "University of Ibadan",
      email: "chidera.okafor@gmail.com",
      phone: "+2348031111111",
      department: "Technology & Innovation",
      skills: "React, Python, Data Science, AI Systems",
      essay: "I am extremely passionate about introducing custom mobile systems and lightweight models to under-resourced schools. By aligning high-impact technology goals with general civic challenges, we can build a stronger foundation for technical skills and regional development projects across West Africa.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      status: "Approved",
      joinDate: "2025-05-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-11111",
      pin: "1111",
      roleCategory: "Member"
    },
    {
      id: "POAF-22222",
      fullName: "Fatoumata Diallo",
      gender: "Female",
      country: "Senegal",
      school: "Université Cheikh Anta Diop",
      email: "fatoumata.diallo@gmail.com",
      phone: "+221772222222",
      department: "Engineering & Research",
      skills: "Water Purification, Agro-ecology, Solar Energy",
      essay: "Developing dry-irrigation technology has been my life's research pursuit. By integrating affordable solar power cells and localized, low-cost clay-filter technology, our local university team aims to supply reliable irrigation plans that will prevent agricultural distress across sub-Saharan Africa.",
      photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300",
      status: "Approved",
      joinDate: "2025-11-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-22222",
      pin: "2222",
      roleCategory: "Member"
    },
    {
      id: "POAF-66666",
      fullName: "Moussa Diop",
      gender: "Male",
      country: "Mali",
      school: "Université de Bamako",
      email: "moussa.diop@gmail.com",
      phone: "+223701255555",
      department: "Youth Empowerment",
      skills: "Agrarian Ecology, Solar Irrigation, Logistics",
      essay: "I want to deploy small-scale solar irrigation units to boost local food security and empower campus clubs.",
      photo: null,
      status: "Approved",
      joinDate: "2025-09-05",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-66666",
      pin: "6666",
      roleCategory: "Member"
    },
    {
      id: "POAF-77777",
      fullName: "Amina Bekele",
      gender: "Female",
      country: "Ethiopia",
      school: "Addis Ababa University",
      email: "amina.bekele@gmail.com",
      phone: "+251911557777",
      department: "Data & Communication",
      skills: "Statistical Research, Tech Writing, Policy Design",
      essay: "My mission is to coordinate continental database structures and student-driven policy research briefs.",
      photo: null,
      status: "Approved",
      joinDate: "2025-09-20",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-77777",
      pin: "7777",
      roleCategory: "Member"
    },
    {
      id: "POAF-88888",
      fullName: "Elikia Bamba",
      gender: "Male",
      country: "DR Congo",
      school: "Université de Kinshasa",
      email: "elikia.bamba@gmail.com",
      phone: "+243811238888",
      department: "Student Development",
      skills: "Grassroots Organizing, Public Relations, Translation",
      essay: "Dedicated to academic excellence, organizing campus solution labs, and championing POAF empowerment.",
      photo: null,
      status: "Approved",
      joinDate: "2025-10-18",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-88888",
      pin: "8888",
      roleCategory: "Member"
    },
    {
      id: "POAF-00002",
      fullName: "Yusuf Toure",
      gender: "Male",
      country: "Ivory Coast",
      school: "Université Félix Houphouët-Boigny",
      email: "yusuf.toure@gmail.com",
      phone: "+2250702120202",
      department: "Youth Empowerment",
      skills: "Seminar Planning, Entrepreneurial Training",
      essay: "My goal is to design student incubation spaces that turn research projects into scalable micro-enterprises.",
      photo: null,
      status: "Approved",
      joinDate: "2025-12-05",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00002",
      pin: "1202",
      roleCategory: "Member"
    },
    {
      id: "POAF-00004",
      fullName: "Sipho Dube",
      gender: "Male",
      country: "South Africa",
      school: "University of Cape Town",
      email: "sipho.dube@gmail.com",
      phone: "+27211204444",
      department: "Engineering & Research",
      skills: "Mechanical Prototyping, CAD, Solar Systems",
      essay: "Focused on hardware designs for rain harvesting and affordable clean power generators for off-grid communities.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-08",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00004",
      pin: "1204",
      roleCategory: "Member"
    },
    {
      id: "POAF-00006",
      fullName: "Kofi Osei",
      gender: "Male",
      country: "Ghana",
      school: "Kwame Nkrumah University of Science and Technology",
      email: "kofi.osei@gmail.com",
      phone: "+233241120606",
      department: "Technology & Innovation",
      skills: "Next.js, Tailwind CSS, API Integration",
      essay: "Passionate about creating accessible digital ledger systems for tracking student club milestones.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-00006",
      pin: "1206",
      roleCategory: "Member"
    },
    {
      id: "POAF-50001",
      fullName: "David Kojo",
      gender: "Male",
      country: "Ghana",
      school: "University of Ghana",
      email: "david.kojo@gmail.com",
      phone: "+233241150001",
      department: "Technology & Innovation",
      skills: "Javascript, HTML5, Web Design",
      essay: "Committed to creating decentralized regional directory projects and assisting youth computer integration.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50001",
      pin: "5001",
      roleCategory: "Member"
    },
    {
      id: "POAF-50002",
      fullName: "Zahra Ahmed",
      gender: "Female",
      country: "Sudan",
      school: "University of Khartoum",
      email: "zahra.ahmed@gmail.com",
      phone: "+249121150002",
      department: "Student Development",
      skills: "Ethics Education, Academic Support, Peer Tutoring",
      essay: "Promoting ethical governance frameworks and coordinating resources among East African schools.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50002",
      pin: "5002",
      roleCategory: "Member"
    },
    {
      id: "POAF-50003",
      fullName: "Kelvin Mwangi",
      gender: "Male",
      country: "Kenya",
      school: "Kenyatta University",
      email: "kelvin.mwangi@gmail.com",
      phone: "+25471150003",
      department: "Engineering & Research",
      skills: "Solar Installation, Electrical Circuits, CAD",
      essay: "Supporting clean power generator developments and water collection initiatives on suburban campuses.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-22",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50003",
      pin: "5003",
      roleCategory: "Member"
    },
    {
      id: "POAF-50004",
      fullName: "Mercy Osei",
      gender: "Female",
      country: "Ghana",
      school: "Ashesi University",
      email: "mercy.osei@gmail.com",
      phone: "+233241150004",
      department: "Community Outreach",
      skills: "Interpersonal Relations, Campaign Logistics, Event Management",
      essay: "Coordinating physical aid delivery and regional student directories across Western African schools.",
      photo: null,
      status: "Approved",
      joinDate: "2026-01-28",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50004",
      pin: "5004",
      roleCategory: "Member"
    },
    {
      id: "POAF-50005",
      fullName: "Tarik Kamal",
      gender: "Male",
      country: "Egypt",
      school: "Cairo University",
      email: "tarik.kamal@gmail.com",
      phone: "+20101150005",
      department: "Technology & Innovation",
      skills: "Machine Learning, Python, Database Management",
      essay: "Integrating lightweight database query models for student-managed cloud records and web development.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-02",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50005",
      pin: "5005",
      roleCategory: "Member"
    },
    {
      id: "POAF-50006",
      fullName: "Oluwaseun Davies",
      gender: "Male",
      country: "Nigeria",
      school: "University of Lagos",
      email: "seun.davies@gmail.com",
      phone: "+2348031150006",
      department: "Data & Communication",
      skills: "Network Administration, Ledger Cryptography, Public Auditing",
      essay: "Supporting secure database configurations and managing peer communications inside local chapters.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-08",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50006",
      pin: "5006",
      roleCategory: "Member"
    },
    {
      id: "POAF-50007",
      fullName: "Agnes Sillah",
      gender: "Female",
      country: "Sierra Leone",
      school: "University of Sierra Leone",
      email: "agnes.sillah@gmail.com",
      phone: "+232761150007",
      department: "Youth Empowerment",
      skills: "Business Incubation, Local Organizing, Career Design",
      essay: "Motivated to scale campus development workshops and coordinate student innovation briefs across the nation.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-12",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50007",
      pin: "5007",
      roleCategory: "Member"
    },
    {
      id: "POAF-50008",
      fullName: "Paul Kagabo",
      gender: "Male",
      country: "Rwanda",
      school: "University of Rwanda",
      email: "paul.kagabo@gmail.com",
      phone: "+250781150008",
      department: "Engineering & Research",
      skills: "Agri-technology, Irrigation Schemes, Soil Testing",
      essay: "Passionate about testing sub-surface drip irrigation systems and teaching local farming methods.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-18",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50008",
      pin: "5008",
      roleCategory: "Member"
    },
    {
      id: "POAF-50009",
      fullName: "Faith Nafula",
      gender: "Female",
      country: "Uganda",
      school: "Makerere University",
      email: "faith.nafula@gmail.com",
      phone: "+256771150009",
      department: "Student Development",
      skills: "Academic Tutoring, Ethical Leadership, Peer Support",
      essay: "Passionate about introducing core ethical guides and professional skills to incoming collegiate peers.",
      photo: null,
      status: "Approved",
      joinDate: "2026-02-22",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50009",
      pin: "5009",
      roleCategory: "Member"
    },
    {
      id: "POAF-50010",
      fullName: "Joseph Ndiaye",
      gender: "Male",
      country: "Senegal",
      school: "Université Cheikh Anta Diop",
      email: "joseph.ndiaye@gmail.com",
      phone: "+221771150010",
      department: "Community Outreach",
      skills: "Resource Mobilization, Local Assembly, Environment Action",
      essay: "Supporting clean-ups and managing community forestry projects under the university outreach wings.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-01",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50010",
      pin: "5010",
      roleCategory: "Member"
    },
    {
      id: "POAF-50011",
      fullName: "Chinyere Obi",
      gender: "Female",
      country: "Nigeria",
      school: "Covenant University",
      email: "chinyere.obi@gmail.com",
      phone: "+2348031150011",
      department: "Technology & Innovation",
      skills: "Frontend Development, React, Tailwind CSS",
      essay: "Re-developing modular student registries and auditing visual layouts for maximum accessibility.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-05",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50011",
      pin: "5011",
      roleCategory: "Member"
    },
    {
      id: "POAF-50012",
      fullName: "Sisa Zuma",
      gender: "Male",
      country: "South Africa",
      school: "University of Cape Town",
      email: "sisa.zuma@gmail.com",
      phone: "+27211150012",
      department: "Youth Empowerment",
      skills: "Business Inception, Presentation Skills, Legal Frameworks",
      essay: "Assisting local student cohorts in defining solid business briefs and micro-alliance strategies.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50012",
      pin: "5012",
      roleCategory: "Member"
    },
    {
      id: "POAF-50013",
      fullName: "Abdi Ibrahim",
      gender: "Male",
      country: "Somalia",
      school: "Mogadishu University",
      email: "abdi.ibrahim@gmail.com",
      phone: "+25261150013",
      department: "Engineering & Research",
      skills: "Civil Prototyping, Resource Sourcing, Dry Crops",
      essay: "Supporting rain harvesting designs and regional agritech programs inside drought-inclined territories.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-15",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50013",
      pin: "5013",
      roleCategory: "Member"
    },
    {
      id: "POAF-50014",
      fullName: "Chido Kamanda",
      gender: "Female",
      country: "Zimbabwe",
      school: "University of Zimbabwe",
      email: "chido.kamanda@gmail.com",
      phone: "+263771150014",
      department: "Data & Communication",
      skills: "Data Logging, Research Coordination, Surveys",
      essay: "Analyzing student community impact statistics and publishing monthly educational reports.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-18",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50014",
      pin: "5014",
      roleCategory: "Member"
    },
    {
      id: "POAF-50015",
      fullName: "Miriam Bekele",
      gender: "Female",
      country: "Ethiopia",
      school: "Addis Ababa University",
      email: "miriam.bekele@gmail.com",
      phone: "+251911550015",
      department: "Student Development",
      skills: "Leadership Mentoring, Content Writing, Presentation",
      essay: "Drafting student course contents and facilitating academic focus circles on modern civic leadership.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-22",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50015",
      pin: "5015",
      roleCategory: "Member"
    },
    {
      id: "POAF-50016",
      fullName: "Ismael Toure",
      gender: "Male",
      country: "Ivory Coast",
      school: "Université Félix Houphouët-Boigny",
      email: "ismael.toure@gmail.com",
      phone: "+2250702150016",
      department: "Youth Empowerment",
      skills: "Venture Ideation, Logistics planning, Resource deployment",
      essay: "Supporting practical business seminars and empowering student startup models under academic boards.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-26",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50016",
      pin: "5016",
      roleCategory: "Member"
    },
    {
      id: "POAF-50017",
      fullName: "Sharon Phiri",
      gender: "Female",
      country: "Zambia",
      school: "University of Zambia",
      email: "sharon.phiri@gmail.com",
      phone: "+260971150017",
      department: "Community Outreach",
      skills: "Local Relief logistics, Health Seminars, Community Sourcing",
      essay: "Designing clean sanitary water guidelines and spearheading localized medical awareness programs on campus.",
      photo: null,
      status: "Approved",
      joinDate: "2026-03-30",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50017",
      pin: "5017",
      roleCategory: "Member"
    },
    {
      id: "POAF-50018",
      fullName: "Ousmane Diallo",
      gender: "Male",
      country: "Guinea",
      school: "Université de Conakry",
      email: "ousmane.diallo@gmail.com",
      phone: "+224621150018",
      department: "Technology & Innovation",
      skills: "Node.js, Backend Proxies, Data Architecture",
      essay: "Integrating open source web dashboards to let regional chapters publish and map student innovations.",
      photo: null,
      status: "Approved",
      joinDate: "2026-04-02",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50018",
      pin: "5018",
      roleCategory: "Member"
    },
    {
      id: "POAF-50019",
      fullName: "Pamela Baloyi",
      gender: "Female",
      country: "South Africa",
      school: "Stellenbosch University",
      email: "pamela.baloyi@gmail.com",
      phone: "+27211150019",
      department: "Data & Communication",
      skills: "Academic Auditing, Technical Drafting, Publications",
      essay: "Assisting internal publication editors in compiling quarterly reports on academic solutions.",
      photo: null,
      status: "Approved",
      joinDate: "2026-04-06",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50019",
      pin: "5019",
      roleCategory: "Member"
    },
    {
      id: "POAF-50020",
      fullName: "Joshua Quansah",
      gender: "Male",
      country: "Ghana",
      school: "University of Ghana",
      email: "joshua.quansah@gmail.com",
      phone: "+233241150020",
      department: "Engineering & Research",
      skills: "Agro-forestry, Drip Irrigation, Solid Design",
      essay: "Integrating campus-wide agricultural nurseries and distributing tree seedlings to schools.",
      photo: null,
      status: "Approved",
      joinDate: "2026-04-10",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50020",
      pin: "5020",
      roleCategory: "Member"
    },
    {
      id: "POAF-50021",
      fullName: "Aminata Sow",
      gender: "Female",
      country: "Senegal",
      school: "Université Cheikh Anta Diop",
      email: "aminata.sow@gmail.com",
      phone: "+221771150021",
      department: "Youth Empowerment",
      skills: "Advocacy planning, Job Seminars, Career Networks",
      essay: "Organizing professional developmental circles and setting up young founder clinics in Dakar.",
      photo: null,
      status: "Approved",
      joinDate: "2026-04-14",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50021",
      pin: "5021",
      roleCategory: "Member"
    },
    {
      id: "POAF-50022",
      fullName: "Robert Phiri",
      gender: "Male",
      country: "Malawi",
      school: "University of Malawi",
      email: "robert.phiri@gmail.com",
      phone: "+26511150022",
      department: "Community Outreach",
      skills: "Field Relief coordinator, Campaign logistics, Advocacy",
      essay: "Coordinating sustainable field campaigns and book dissemination programs within regional hubs.",
      photo: null,
      status: "Approved",
      joinDate: "2026-04-18",
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: "CERT-50022",
      pin: "5022",
      roleCategory: "Member"
    }
  ],
  projects: [
    {
      id: "PROJ-10001",
      name: "Agri-Tech Irrigation Hub",
      department: "Engineering & Research",
      country: "Kenya",
      description: "Low-cost solar powered drip irrigation kit designed by students for smallholder farmers to combat local droughts.",
      submittedBy: "Ezra Michael Jofe",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10002",
      name: "Pan-African Digital Literacy Initiative",
      department: "Technology & Innovation",
      country: "Nigeria",
      description: "Free coding bootcamps and digital materials curated for under-funded secondary classrooms.",
      submittedBy: "Ezra Michael Jofe",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10003",
      name: "Solar Water Distillation Kits",
      department: "Engineering & Research",
      country: "Ghana",
      description: "Low-cost water purification arrays powered by solar condensation to supply remote schools.",
      submittedBy: "Kwame Mensah",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10004",
      name: "E-Waste Eco-Collection Network",
      department: "Community Outreach",
      country: "Kenya",
      description: "A student-designed recycling drive that recovers precious components and solar battery shells from defunct hardware.",
      submittedBy: "Wambui Kamau",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10005",
      name: "Rural Health Literacy Caravan",
      department: "Community Outreach",
      country: "Ethiopia",
      description: "Disseminating medical manuals and essential health awareness brochures written in Amharic to local communities.",
      submittedBy: "Daniel Mulugeta",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10006",
      name: "Sorghum High-Yield Storage Bin",
      department: "Engineering & Research",
      country: "Zimbabwe",
      description: "Atmospherically-stabilized silos designed using clay tiles and basic solar ventilators to prevent harvest degradation.",
      submittedBy: "Tendai Moyo",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10007",
      name: "Mobile Soil Chemistry Node",
      department: "Technology & Innovation",
      country: "Ivory Coast",
      description: "Lightweight sensor sticks designed by engineering students to map nitrogen levels in school agricultural gardens.",
      submittedBy: "Yusuf Toure",
      status: "Approved",
      photo: null
    },
    {
      id: "PROJ-10008",
      name: "Academic Ethics Code Directory",
      department: "Student Development",
      country: "Nigeria",
      description: "An open repository cataloguing ethical resources and research integrity guides for West African universities.",
      submittedBy: "Sarah Jenkins-Okafor",
      status: "Approved",
      photo: null
    }
  ],
  events: [
    {
      id: "EVT-10001",
      name: "POAF 2026 Continental Youth Leadership Summit",
      date: "2026-08-15",
      department: "Youth Empowerment",
      description: "Virtual and in-person assembly uniting 500+ student delegates to present sustainable solutions for local challenges.",
      status: "Approved"
    },
    {
      id: "EVT-10002",
      name: "Artificial Intelligence in Africa Workshop",
      date: "2026-06-25",
      department: "Technology & Innovation",
      description: "Practical training class for beginners starting code work with Gemini models.",
      status: "Approved"
    },
    {
      id: "EVT-10003",
      name: "Agrarian Sovereignty Field Exhibition",
      date: "2026-07-10",
      department: "Engineering & Research",
      description: "Exhibiting localized student engineering achievements in bio-irrigation and grain silo storage.",
      status: "Approved"
    },
    {
      id: "EVT-10004",
      name: "Ethics in Academic Action Seminar",
      date: "2026-07-28",
      department: "Student Development",
      description: "Interactive session addressing university code standards and fostering transparency paths.",
      status: "Approved"
    },
    {
      id: "EVT-10005",
      name: "Youth Micro-enterprise Solutions Summit",
      date: "2026-08-04",
      department: "Youth Empowerment",
      description: "Showcasing student-designed incubation networks and business startup pitches to local regional boards.",
      status: "Approved"
    },
    {
      id: "EVT-10006",
      name: "Solar Prototyping Student Expo",
      date: "2026-08-20",
      department: "Engineering & Research",
      description: "Demonstrating physical solar drip structures and DIY battery models crafted in student workshops.",
      status: "Approved"
    }
  ],
  leadershipApps: [],
  clubs: [
    {
      id: "CLUB-10001",
      school: "University of Ibadan",
      country: "Nigeria",
      clubName: "University of Ibadan Solutions Club",
      contactEmail: "ui.club@poaf.org",
      contactPhone: "+2348031110001",
      writtenProposal: "Approved chapter focusing on peer computer academies and neighborhood water sanitation guides.",
      status: "Approved"
    },
    {
      id: "CLUB-10002",
      school: "Ashesi University",
      country: "Ghana",
      clubName: "Ashesi POAF Innovation Circle",
      contactEmail: "ashesi.club@poaf.org",
      contactPhone: "+233241110002",
      writtenProposal: "Core chapter focusing on regional mobile software directories and high-school mentorship pipelines.",
      status: "Approved"
    },
    {
      id: "CLUB-10003",
      school: "University of Nairobi",
      country: "Kenya",
      clubName: "University of Nairobi Engineering Core",
      contactEmail: "uon.club@poaf.org",
      contactPhone: "+25471110003",
      writtenProposal: "Student chapter focusing on localized solar battery cells and grain preservation research silos.",
      status: "Approved"
    },
    {
      id: "CLUB-10004",
      school: "Cairo University",
      country: "Egypt",
      clubName: "Cairo Academic Integrity Society",
      contactEmail: "cairo.club@poaf.org",
      contactPhone: "+20101110004",
      writtenProposal: "A registered society delivering student honor counseling and leadership seminars across Cairo.",
      status: "Approved"
    },
    {
      id: "CLUB-10005",
      school: "University of Cape Town",
      country: "South Africa",
      clubName: "UCT Environmental Solution League",
      contactEmail: "uct.club@poaf.org",
      contactPhone: "+27211110005",
      writtenProposal: "Pioneering green energy projects, tree-planting caravans, and rain harvesting installations.",
      status: "Approved"
    },
    {
      id: "CLUB-10006",
      school: "Université Cheikh Anta Diop",
      country: "Senegal",
      clubName: "UCAD Youth Empowerment Hub",
      contactEmail: "ucad.club@poaf.org",
      contactPhone: "+221771110006",
      writtenProposal: "Chapter running agricultural incubation spaces and micro-enterprise tutoring clinics for students.",
      status: "Approved"
    }
  ],
  partnerships: [
    {
      id: "PRT-10001",
      organization: "African Development Bank Group",
      country: "Africa",
      contactEmail: "youth.initiatives@afdb-group.org",
      contactPhone: "+22501010101",
      writtenProposal: "Strategic alliance providing direct resource grants and logistics support for POAF agricultural silos.",
      status: "Approved"
    },
    {
      id: "PRT-10002",
      organization: "UNICEF Youth Outreach Africa",
      country: "Africa",
      contactEmail: "outreach@unicef-youth.org",
      contactPhone: "+2542012345",
      writtenProposal: "Partnership supplying academic manuals and promoting child health directory solutions across branches.",
      status: "Approved"
    },
    {
      id: "PRT-10003",
      organization: "Meltwater Entrepreneurial School of Technology",
      country: "Ghana",
      contactEmail: "incubate@mest-africa.org",
      contactPhone: "+233302123456",
      writtenProposal: "Incubator alliance providing specialized technology training and startup mentoring for chapter members.",
      status: "Approved"
    },
    {
      id: "PRT-10004",
      organization: "Tony Elumelu Foundation Support",
      country: "Nigeria",
      contactEmail: "grants@tef-support.org",
      contactPhone: "+23412774600",
      writtenProposal: "Empowering university entrepreneurs with structured pitch events and financial literacy tools.",
      status: "Approved"
    },
    {
      id: "PRT-10005",
      organization: "African Union Student Coalition",
      country: "Africa",
      contactEmail: "coalition@au-students.org",
      contactPhone: "+251115517700",
      writtenProposal: "Policy integration program allowing student leaders to advocate solutions in official AU forums.",
      status: "Approved"
    },
    {
      id: "PRT-10006",
      organization: "Green Africa Foundation",
      country: "Kenya",
      contactEmail: "alliance@green-africa.org",
      contactPhone: "+25420555666",
      writtenProposal: "Environmental initiative backing tree planting drives and water distillation networks in East Africa.",
      status: "Approved"
    }
  ],
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
      message: "Welcome to Pioneers of Africa's Future portal! Feel free to register, construct your ID card, verify your details, and contribute to continental projects.",
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
      message: "Leadership channel activated. Regional Ambassadors and Department Directors, please collaborate here to host events and approve memberships.",
      timestamp: new Date().toLocaleString(),
      channel: "leaders"
    }
  ],
  nextId: 2,
  clearancePins: {
    projectPin: "1000",
    eventPin: "1000",
    leadershipPin: "1000",
    awardPin: "1000",
    whatsappLink: "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M"
  }
});

// Load state of datastore cache
let currentStore = getInitialStore();

try {
  if (fs.existsSync(STORE_PATH)) {
    const rawData = fs.readFileSync(STORE_PATH, "utf-8");
    currentStore = sanitizeStoreDepartments(JSON.parse(rawData));
    console.log("Loaded cached store cleanly! Active members count:", currentStore.members?.length || 0);
  } else {
    fs.writeFileSync(STORE_PATH, JSON.stringify(currentStore, null, 2), "utf-8");
    console.log("Initial fallback storage written!");
  }

  // Ensure default elements, especially the founder and sample members, are present
  currentStore.members = currentStore.members || [];
  const initial = getInitialStore();
  let needToSave = false;

  if (!currentStore.members.some((m: any) => m.id === "POAF-00001")) {
    console.log("Seeding founder profile to local data store...");
    currentStore.members.unshift(initial.members[0]);
    needToSave = true;
  }

  if (!currentStore.members.some((m: any) => m.id === "POAF-11111")) {
    console.log("Seeding sample member 1 to local data store...");
    currentStore.members.push(initial.members[1]);
    needToSave = true;
  }

  if (!currentStore.members.some((m: any) => m.id === "POAF-22222")) {
    console.log("Seeding sample member 2 to local data store...");
    currentStore.members.push(initial.members[2]);
    needToSave = true;
  }

  if (!currentStore.projects || currentStore.projects.length === 0) {
    currentStore.projects = initial.projects;
    needToSave = true;
  }

  if (!currentStore.events || currentStore.events.length === 0) {
    currentStore.events = initial.events;
    needToSave = true;
  }

  if (!currentStore.awards || currentStore.awards.length === 0) {
    currentStore.awards = initial.awards;
    needToSave = true;
  }

  if (!currentStore.membersChat || currentStore.membersChat.length === 0) {
    currentStore.membersChat = initial.membersChat;
    needToSave = true;
  }

  if (!currentStore.leadersChat || currentStore.leadersChat.length === 0) {
    currentStore.leadersChat = initial.leadersChat;
    needToSave = true;
  }

  if (needToSave) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(currentStore, null, 2), "utf-8");
    console.log("Seeded database entries written cleanly!");
  }
} catch (e) {
  console.error("Local load store error:", e);
}

const saveStoreToFile = () => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(currentStore, null, 2), "utf-8");
  } catch (error) {
    console.error("Save local cache error:", error);
  }
};

// --- SUPABASE CLIENT LAZY FACTORY ---
let supabaseInstance: any = null;

const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "" || anonKey === "" || url.startsWith("YOUR_") || url.startsWith("MY_")) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey);
    return supabaseInstance;
  } catch (e) {
    console.error("❌ Failed to initiate Supabase client:", e);
    return null;
  }
};

// --- MULTI-CASE COMPLIANT TRANSLATION MAPS ---
// The following mapping functions output both camelCase and snake_case properties.
// The self-healing loop below will automatically strip variables that Postgres throws column errors on,
// making database tables created with either casing structure immediately and seamlessly working.

function toSupabaseMember(m: any) {
  return {
    id: m.id,
    fullName: m.fullName,
    full_name: m.fullName,
    gender: m.gender,
    country: m.country,
    school: m.school,
    email: m.email,
    phone: m.phone,
    department: m.department,
    skills: m.skills,
    essay: m.essay,
    photo: m.photo,
    status: m.status,
    joinDate: m.joinDate,
    join_date: m.joinDate,
    expiryDate: m.expiryDate,
    expiry_date: m.expiryDate,
    cardGenerated: m.cardGenerated,
    card_generated: m.cardGenerated,
    certGenerated: m.certGenerated,
    cert_generated: m.certGenerated,
    certNumber: m.certNumber,
    cert_number: m.certNumber,
    leadership: m.leadership,
    leadershipId: m.leadershipId,
    leadership_id: m.leadershipId,
    awards: Array.isArray(m.awards) ? JSON.stringify(m.awards) : (m.awards || ""),
    isFounder: m.isFounder,
    is_founder: m.isFounder,
    biography: m.biography,
    poafRoleAspiration: m.poafRoleAspiration,
    poaf_role_aspiration: m.poafRoleAspiration,
    universityTrack: m.universityTrack,
    university_track: m.universityTrack,
    grade: m.grade,
    major: m.major,
    age: m.age,
    roleCategory: m.roleCategory,
    role_category: m.roleCategory,
    pin: m.pin
  };
}

function fromSupabaseMember(row: any): any {
  let parsedAwards: string[] = [];
  try {
    if (typeof row.awards === 'string' && row.awards.startsWith('[')) {
      parsedAwards = JSON.parse(row.awards);
    } else if (Array.isArray(row.awards)) {
      parsedAwards = row.awards;
    } else if (row.awards) {
      parsedAwards = [row.awards];
    }
  } catch (e) {
    parsedAwards = row.awards ? [row.awards] : [];
  }

  return {
    id: row.id,
    fullName: row.full_name || row.fullName || "",
    gender: row.gender || "",
    country: row.country || "",
    school: row.school || "",
    email: row.email || "",
    phone: row.phone || "",
    department: row.department || "",
    skills: row.skills || "",
    essay: row.essay || "",
    photo: row.photo || null,
    status: row.status || "Pending",
    joinDate: row.join_date || row.joinDate || "",
    expiryDate: row.expiry_date || row.expiryDate || "",
    cardGenerated: !!(row.card_generated ?? row.cardGenerated),
    certGenerated: !!(row.cert_generated ?? row.certGenerated),
    certNumber: row.cert_number || row.certNumber || "",
    leadership: row.leadership || "",
    leadershipId: row.leadership_id || row.leadershipId || "",
    awards: parsedAwards,
    isFounder: !!(row.is_founder ?? row.isFounder),
    biography: row.biography || "",
    poafRoleAspiration: row.poaf_role_aspiration || row.poafRoleAspiration || "",
    universityTrack: row.university_track || row.universityTrack || "",
    grade: row.grade || "",
    major: row.major || "",
    age: row.age || "",
    roleCategory: row.role_category || row.roleCategory || "Member",
    pin: row.pin || ""
  };
}

function toSupabaseProject(p: any) {
  return {
    id: p.id,
    name: p.name,
    department: p.department,
    country: p.country,
    description: p.description,
    submittedBy: p.submittedBy,
    submitted_by: p.submittedBy,
    status: p.status,
    photo: p.photo
  };
}

function fromSupabaseProject(row: any): any {
  return {
    id: row.id,
    name: row.name || "",
    department: row.department || "",
    country: row.country || "",
    description: row.description || "",
    submittedBy: row.submitted_by || row.submittedBy || "",
    status: row.status || "Pending",
    photo: row.photo || null
  };
}

function toSupabaseEvent(e: any) {
  return {
    id: e.id,
    name: e.name,
    date: e.date,
    startTime: e.startTime,
    start_time: e.startTime,
    endTime: e.endTime,
    end_time: e.endTime,
    department: e.department,
    description: e.description,
    photo: e.photo,
    status: e.status
  };
}

function fromSupabaseEvent(row: any): any {
  return {
    id: row.id,
    name: row.name || "",
    date: row.date || "",
    startTime: row.start_time || row.startTime || "",
    endTime: row.end_time || row.endTime || "",
    department: row.department || "",
    description: row.description || "",
    photo: row.photo || null,
    status: row.status || "Pending"
  };
}

function toSupabaseClub(c: any) {
  return {
    id: c.id,
    school: c.school,
    country: c.country,
    clubName: c.clubName,
    club_name: c.clubName,
    contactEmail: c.contactEmail,
    contact_email: c.contactEmail,
    contactPhone: c.contactPhone,
    contact_phone: c.contactPhone,
    writtenProposal: c.writtenProposal,
    written_proposal: c.writtenProposal,
    status: c.status
  };
}

function fromSupabaseClub(row: any): any {
  return {
    id: row.id,
    school: row.school || "",
    country: row.country || "",
    clubName: row.club_name || row.clubName || "",
    contactEmail: row.contact_email || row.contactEmail || "",
    contactPhone: row.contact_phone || row.contactPhone || "",
    writtenProposal: row.written_proposal || row.writtenProposal || "",
    status: row.status || "Pending"
  };
}

function toSupabasePartner(p: any) {
  return {
    id: p.id,
    organization: p.organization,
    country: p.country,
    contactEmail: p.contactEmail,
    contact_email: p.contactEmail,
    contactPhone: p.contactPhone,
    contact_phone: p.contactPhone,
    writtenProposal: p.writtenProposal,
    written_proposal: p.writtenProposal,
    status: p.status
  };
}

function fromSupabasePartner(row: any): any {
  return {
    id: row.id,
    organization: row.organization || "",
    country: row.country || "",
    contactEmail: row.contact_with_email || row.contact_email || row.contactEmail || "",
    contactPhone: row.contact_phone || row.contactPhone || "",
    writtenProposal: row.written_proposal || row.writtenProposal || "",
    status: row.status || "Pending"
  };
}

function toSupabaseAward(a: any) {
  return {
    id: a.id,
    category: a.category,
    memberId: a.memberId,
    member_id: a.memberId,
    memberName: a.memberName,
    member_name: a.memberName,
    memberCountry: a.memberCountry,
    member_country: a.memberCountry,
    date: a.date,
    title: a.title,
    description: a.description,
    photo: a.photo
  };
}

function fromSupabaseAward(row: any): any {
  return {
    id: row.id,
    category: row.category || "Student of the Month",
    memberId: row.member_id || row.memberId || "",
    memberName: row.member_name || row.memberName || "",
    memberCountry: row.member_country || row.memberCountry || "",
    date: row.date || "",
    title: row.title || "",
    description: row.description || "",
    photo: row.photo || ""
  };
}

function toSupabaseLeadershipApp(l: any) {
  return {
    id: l.id,
    memberId: l.memberId,
    member_id: l.memberId,
    fullName: l.fullName,
    full_name: l.fullName,
    department: l.department,
    position: l.position,
    country: l.country,
    motivation: l.motivation,
    status: l.status,
    dateSubmitted: l.dateSubmitted,
    date_submitted: l.dateSubmitted
  };
}

function fromSupabaseLeadershipApp(row: any): any {
  return {
    id: row.id,
    memberId: row.member_id || row.memberId || "",
    fullName: row.full_name || row.fullName || "",
    department: row.department || "",
    position: row.position || "",
    country: row.country || "",
    motivation: row.motivation || "",
    status: row.status || "Pending",
    dateSubmitted: row.date_submitted || row.dateSubmitted || ""
  };
}

function toSupabaseChat(c: any) {
  return {
    id: c.id,
    senderId: c.senderId,
    sender_id: c.senderId,
    senderName: c.senderName,
    sender_name: c.senderName,
    senderRole: c.senderRole,
    sender_role: c.senderRole,
    message: c.message,
    timestamp: c.timestamp,
    channel: c.channel,
    isBroadcast: c.isBroadcast,
    is_broadcast: c.isBroadcast
  };
}

function fromSupabaseChat(row: any): any {
  return {
    id: row.id,
    senderId: row.sender_id || row.senderId || "",
    senderName: row.sender_name || row.senderName || "",
    senderRole: row.sender_role || row.senderRole || "",
    message: row.message || "",
    timestamp: row.timestamp || "",
    channel: row.channel || "members",
    isBroadcast: !!(row.is_broadcast ?? row.isBroadcast)
  };
}

// --- SELF-HEALING DYNAMIC UPSERT ENGINE ---
// Postgres throws errors if columns requested do not exist.
// This function catches defined-column mismatch errors and automatically prunes columns,
// successfully performing upserts regardless of structural field configuration!
async function selfHealingUpsert(tableName: string, rows: any[]) {
  if (!rows || rows.length === 0) return;

  const supabase = getSupabase();
  if (!supabase) return;

  // Deep clone row array
  let currentRows = JSON.parse(JSON.stringify(rows));
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    attempts++;
    const { error } = await supabase.from(tableName).upsert(currentRows);
    if (!error) {
      break; // Completed successfully!
    }

    // Checking if error is 'undefined_column' (42703 code)
    if (error.code === '42703') {
      const match = error.message.match(/column "([^"]+)" of relation /);
      if (match && match[1]) {
        const missingCol = match[1];
        console.log(`[Self-Healing Mode] Col "${missingCol}" not in "${tableName}". Removing and retrying upsert...`);
        for (const r of currentRows) {
          delete r[missingCol];
        }
        continue;
      }
    }

    // If another error occurred, log it and bubble up
    console.error(`[Supabase Engine Warning] Cannot upsert row to table "${tableName}":`, error.message, error);
    break;
  }
}

// --- SECURE ONE-SHOT AUTO DATA MIGRATION ENGINE ---
// Copies data from fallback JSON store to Supabase tables on application boot!
async function migrateFallbackStoreToSupabase() {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    console.log("⚡ [Migration System] Inspecting Supabase membership ledger state...");
    const { data: currentMembers, error } = await supabase.from('members').select('id').limit(1);

    if (error) {
      console.warn("⚠️ [Migration System] Could not load members list. Tables might be missing or unconfigured.", error.message);
      return;
    }

    if (currentMembers && currentMembers.length > 0) {
      console.log("🟢 [Migration System] Supabase is already populated. Ready, skipping fallback migration.");
      return;
    }

    console.log("🚀 [Migration System] Supabase tables are currently empty! Commencing automatic cloud migration stream...");

    // Read full active database contents from fallback JSON files
    let storeData = getInitialStore();
    if (fs.existsSync(STORE_PATH)) {
      try {
        const content = fs.readFileSync(STORE_PATH, "utf-8");
        storeData = sanitizeStoreDepartments(JSON.parse(content));
      } catch (ex) {
        console.error("Could not parse data-store.json, building initial memory structure for migration.");
      }
    }

    // Push Members
    if (Array.isArray(storeData.members) && storeData.members.length > 0) {
      console.log(`📦 Member Records: Syncing ${storeData.members.length} items...`);
      const mapped = storeData.members.map(toSupabaseMember);
      await selfHealingUpsert('members', mapped);
    }

    // Push Projects
    if (Array.isArray(storeData.projects) && storeData.projects.length > 0) {
      console.log(`📦 Venture Projects: Syncing ${storeData.projects.length} items...`);
      const mapped = storeData.projects.map(toSupabaseProject);
      await selfHealingUpsert('projects', mapped);
    }

    // Push Events
    if (Array.isArray(storeData.events) && storeData.events.length > 0) {
      console.log(`📦 Summit Events: Syncing ${storeData.events.length} items...`);
      const mapped = storeData.events.map(toSupabaseEvent);
      await selfHealingUpsert('events', mapped);
    }

    // Push Clubs
    if (Array.isArray(storeData.clubs) && storeData.clubs.length > 0) {
      console.log(`📦 Campus Chapters: Syncing ${storeData.clubs.length} items...`);
      const mapped = storeData.clubs.map(toSupabaseClub);
      await selfHealingUpsert('clubs', mapped);
    }

    // Push Partnerships
    if (Array.isArray(storeData.partnerships) && storeData.partnerships.length > 0) {
      console.log(`📦 Alliance Partners: Syncing ${storeData.partnerships.length} items...`);
      const mapped = storeData.partnerships.map(toSupabasePartner);
      await selfHealingUpsert('partnerships', mapped);
    }

    // Push Awards
    if (Array.isArray(storeData.awards) && storeData.awards.length > 0) {
      console.log(`📦 Honours Board: Syncing ${storeData.awards.length} items...`);
      const mapped = storeData.awards.map(toSupabaseAward);
      await selfHealingUpsert('awards', mapped);
    }

    // Push Leadership Applications
    if (Array.isArray(storeData.leadershipApps) && storeData.leadershipApps.length > 0) {
      console.log(`📦 Cabinet Applications: Syncing ${storeData.leadershipApps.length} items...`);
      const mapped = storeData.leadershipApps.map(toSupabaseLeadershipApp);
      await selfHealingUpsert('leadership_applications', mapped);
    }

    // Push Members Chat
    if (Array.isArray(storeData.membersChat) && storeData.membersChat.length > 0) {
      console.log(`📦 Member Chat Logs: Syncing ${storeData.membersChat.length} items...`);
      const mapped = storeData.membersChat.map(toSupabaseChat);
      await selfHealingUpsert('members_chat', mapped);
    }

    // Push Leaders Chat
    if (Array.isArray(storeData.leadersChat) && storeData.leadersChat.length > 0) {
      console.log(`📦 Leadership Chat Logs: Syncing ${storeData.leadersChat.length} items...`);
      const mapped = storeData.leadersChat.map(toSupabaseChat);
      await selfHealingUpsert('leaders_chat', mapped);
    }

    // Store custom configs (Pins & NextId) inside special Members rows safely!
    const sysPins = {
      id: "SYSTEM_CONFIG_PINS",
      fullName: "System Clearance Config Pins",
      full_name: "System Clearance Config Pins",
      skills: JSON.stringify(storeData.clearancePins),
      status: "Approved"
    };
    const sysNextId = {
      id: "SYSTEM_CONFIG_NEXTID",
      fullName: "System Config NextId State",
      full_name: "System Config NextId State",
      skills: storeData.nextId ? storeData.nextId.toString() : "2",
      status: "Approved"
    };
    await selfHealingUpsert('members', [sysPins, sysNextId]);

    console.log("🎉 [Migration System] Fallback local stores synchronized up to Supabase Cloud Tables successfully!");
  } catch (err: any) {
    console.error("🔴 Fatal error during migration process stream:", err.message, err);
  }
}

// --- API ENDPOINTS ---

// GET DB STORE
app.get("/api/data", async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    console.log("⚠️ [POAF Service - LOCAL FALLBACK] Supabase client is unconfigured or offline. Serving request using local data-store.json fallback");
    
    // Maintain seeded profiles on local fallbacks too
    const initialStore = getInitialStore();
    currentStore.members = currentStore.members || [];
    for (const initMember of initialStore.members) {
      const existingIdx = currentStore.members.findIndex((m: any) => m.id === initMember.id);
      if (existingIdx === -1) {
        currentStore.members.push(initMember);
      } else {
        currentStore.members[existingIdx].pin = initMember.pin;
        if (initMember.isFounder) {
          currentStore.members[existingIdx].isFounder = true;
        }
      }
    }
    saveStoreToFile();
    return res.json({
      ...currentStore,
      dataSource: "fallback"
    });
  }

  try {
    console.log("🟢 [POAF Service - SUPABASE CLOUD] Fetching all continental data stores from Supabase cloud database...");
    const [
      { data: dbMembers },
      { data: dbProjects },
      { data: dbEvents },
      { data: dbClubs },
      { data: dbPartnerships },
      { data: dbAwards },
      { data: dbLeadershipApps },
      { data: dbMembersChat },
      { data: dbLeadersChat }
    ] = await Promise.all([
      supabase.from('members').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('events').select('*'),
      supabase.from('clubs').select('*'),
      supabase.from('partnerships').select('*'),
      supabase.from('awards').select('*'),
      supabase.from('leadership_applications').select('*'),
      supabase.from('members_chat').select('*'),
      supabase.from('leaders_chat').select('*'),
    ]);

    const rawMembers = dbMembers || [];

    // Filter out our custom system metadata tags
    const pinsRow = rawMembers.find((m: any) => m.id === 'SYSTEM_CONFIG_PINS');
    const nextIdRow = rawMembers.find((m: any) => m.id === 'SYSTEM_CONFIG_NEXTID');

    const activeMembers = rawMembers.filter((m: any) => !m.id.startsWith('SYSTEM_CONFIG_'));

    const mappedMembers = activeMembers.map(fromSupabaseMember);

    // Enforce vital members (Founder + 2 Sample Members)
    const initialStore = getInitialStore();
    for (const initMember of initialStore.members) {
      const existingIdx = mappedMembers.findIndex((m: any) => m.id === initMember.id);
      if (existingIdx === -1) {
        mappedMembers.push(initMember);
        // Asynchronously self-heal/seed missing members in the cloud table so they are persisted
        selfHealingUpsert('members', [toSupabaseMember(initMember)]).catch(e => {
          console.error(`Failed to self-heal/seed member ${initMember.id} on runtime fetching:`, e);
        });
      } else {
        // Enforce exact requested security PIN codes for the seeded users
        mappedMembers[existingIdx].pin = initMember.pin;
        if (initMember.isFounder) {
          mappedMembers[existingIdx].isFounder = true;
        }
      }
    }

    const mappedProjects = (dbProjects || []).map(fromSupabaseProject);
    const mappedEvents = (dbEvents || []).map(fromSupabaseEvent);
    const mappedClubs = (dbClubs || []).map(fromSupabaseClub);
    const mappedPartnerships = (dbPartnerships || []).map(fromSupabasePartner);
    const mappedAwards = (dbAwards || []).map(fromSupabaseAward);
    const mappedLeadershipApps = (dbLeadershipApps || []).map(fromSupabaseLeadershipApp);
    const mappedMembersChat = (dbMembersChat || []).map(fromSupabaseChat);
    const mappedLeadersChat = (dbLeadersChat || []).map(fromSupabaseChat);

    // Fetch clearancePins state
    let clearancePins = { ...currentStore.clearancePins };
    if (pinsRow) {
      try {
        const parsedPins = JSON.parse(pinsRow.skills || pinsRow.essay || '{}');
        clearancePins = {
          ...clearancePins,
          ...parsedPins,
          whatsappLink: parsedPins.whatsappLink || "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M"
        };
      } catch (err) {}
    } else {
      clearancePins.whatsappLink = clearancePins.whatsappLink || "https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M";
    }

    // Fetch nextId counter
    let nextId = currentStore.nextId;
    if (nextIdRow) {
      const parsed = parseInt(nextIdRow.skills || nextIdRow.essay || "2", 10);
      if (!isNaN(parsed)) nextId = parsed;
    }

    const payload = {
      members: mappedMembers,
      projects: mappedProjects,
      events: mappedEvents,
      clubs: mappedClubs,
      partnerships: mappedPartnerships,
      awards: mappedAwards,
      leadershipApps: mappedLeadershipApps,
      membersChat: mappedMembersChat,
      leadersChat: mappedLeadersChat,
      nextId,
      clearancePins,
      dataSource: "supabase"
    };

    // Keep cached memory fully matched
    currentStore = payload;
    saveStoreToFile();

    console.log("🟢 [POAF Service - SUCCESS] Successfully loaded and mapped all ledger tables from Supabase cloud database.");
    res.json(payload);
  } catch (err: any) {
    console.error("🔴 [POAF Service - ERROR] Failing to retrieve or map live data from active Supabase Tables:", err.message);
    res.status(500).json({
      error: `FAILED_TO_LOAD_SUPABASE: ${err.message}`, 
      dataSource: "supabase_error", 
      message: "An error occurred retrieving data from the live Supabase Cloud Database. Fallback JSON storage reversion is disabled because Supabase is active."
    });
  }
});

// UPDATE/SYNC DATABASE ACTIONS INDEPENDENTLY
app.post("/api/sync", async (req, res) => {
  try {
    const updated = req.body;
    if (!updated) {
      return res.status(400).json({ error: "Payload cannot be empty" });
    }

    const supabase = getSupabase();
    if (supabase) {
      console.log("Syncing database updates down to Supabase tables...");

      // Members Sync
      if (Array.isArray(updated.members)) {
        const actualMembers = updated.members.filter((m: any) => !m.id?.startsWith('SYSTEM_CONFIG_'));
        const mapped = actualMembers.map(toSupabaseMember);
        await selfHealingUpsert('members', mapped);

        // Delete deleted records
        const ids = actualMembers.map((m: any) => m.id);
        const idsToKeep = [...ids, 'SYSTEM_CONFIG_PINS', 'SYSTEM_CONFIG_NEXTID'];
        await supabase.from('members').delete().not('id', 'in', idsToKeep);
      }

      // Projects Sync
      if (Array.isArray(updated.projects)) {
        const mapped = updated.projects.map(toSupabaseProject);
        await selfHealingUpsert('projects', mapped);
        const ids = updated.projects.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('projects').delete().not('id', 'in', ids);
        } else {
          await supabase.from('projects').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Events Sync
      if (Array.isArray(updated.events)) {
        const mapped = updated.events.map(toSupabaseEvent);
        await selfHealingUpsert('events', mapped);
        const ids = updated.events.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('events').delete().not('id', 'in', ids);
        } else {
          await supabase.from('events').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Clubs Sync
      if (Array.isArray(updated.clubs)) {
        const mapped = updated.clubs.map(toSupabaseClub);
        await selfHealingUpsert('clubs', mapped);
        const ids = updated.clubs.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('clubs').delete().not('id', 'in', ids);
        } else {
          await supabase.from('clubs').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Partnerships Sync
      if (Array.isArray(updated.partnerships)) {
        const mapped = updated.partnerships.map(toSupabasePartner);
        await selfHealingUpsert('partnerships', mapped);
        const ids = updated.partnerships.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('partnerships').delete().not('id', 'in', ids);
        } else {
          await supabase.from('partnerships').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Awards Sync
      if (Array.isArray(updated.awards)) {
        const mapped = updated.awards.map(toSupabaseAward);
        await selfHealingUpsert('awards', mapped);
        const ids = updated.awards.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('awards').delete().not('id', 'in', ids);
        } else {
          await supabase.from('awards').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Leadership Apps Sync
      if (Array.isArray(updated.leadershipApps)) {
        const mapped = updated.leadershipApps.map(toSupabaseLeadershipApp);
        await selfHealingUpsert('leadership_applications', mapped);
        const ids = updated.leadershipApps.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('leadership_applications').delete().not('id', 'in', ids);
        } else {
          await supabase.from('leadership_applications').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Members Chat Sync
      if (Array.isArray(updated.membersChat)) {
        const mapped = updated.membersChat.map(toSupabaseChat);
        await selfHealingUpsert('members_chat', mapped);
        const ids = updated.membersChat.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('members_chat').delete().not('id', 'in', ids);
        } else {
          await supabase.from('members_chat').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Leaders Chat Sync
      if (Array.isArray(updated.leadersChat)) {
        const mapped = updated.leadersChat.map(toSupabaseChat);
        await selfHealingUpsert('leaders_chat', mapped);
        const ids = updated.leadersChat.map((x: any) => x.id);
        if (ids.length > 0) {
          await supabase.from('leaders_chat').delete().not('id', 'in', ids);
        } else {
          await supabase.from('leaders_chat').delete().neq('id', 'SYSTEM_DUMMY_NONE');
        }
      }

      // Sync custom system configs in database
      const configRows = [];
      if (updated.clearancePins) {
        configRows.push({
          id: 'SYSTEM_CONFIG_PINS',
          fullName: 'System Clearance Config Pins',
          full_name: 'System Clearance Config Pins',
          skills: JSON.stringify(updated.clearancePins),
          status: 'Approved'
        });
      }
      if (typeof updated.nextId === "number") {
        configRows.push({
          id: 'SYSTEM_CONFIG_NEXTID',
          fullName: 'System Config NextId State',
          full_name: 'System Config NextId State',
          skills: updated.nextId.toString(),
          status: 'Approved'
        });
      }
      if (configRows.length > 0) {
        await selfHealingUpsert('members', configRows);
      }
    }

    // Keep data-store.json in-sync for robust fallbacks
    if (Array.isArray(updated.members)) currentStore.members = updated.members;
    if (Array.isArray(updated.projects)) currentStore.projects = updated.projects;
    if (Array.isArray(updated.events)) currentStore.events = updated.events;
    if (Array.isArray(updated.leadershipApps)) currentStore.leadershipApps = updated.leadershipApps;
    if (Array.isArray(updated.clubs)) currentStore.clubs = updated.clubs;
    if (Array.isArray(updated.partnerships)) currentStore.partnerships = updated.partnerships;
    if (Array.isArray(updated.awards)) currentStore.awards = updated.awards;
    if (Array.isArray(updated.membersChat)) currentStore.membersChat = updated.membersChat;
    if (Array.isArray(updated.leadersChat)) currentStore.leadersChat = updated.leadersChat;
    if (typeof updated.nextId === "number") currentStore.nextId = updated.nextId;
    if (updated.clearancePins) currentStore.clearancePins = updated.clearancePins;

    saveStoreToFile();
    res.json({ success: true, count: currentStore.members.length });
  } catch (err: any) {
    console.error("🔴 Error syncing store updates:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// AI Assistant Auto Ezra Endpoint leveraging Gemini Model
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API")) {
      // Return a mock assistant response if Gemini Key is not configured
      return res.json({
        text: `Hello! This is Auto Ezra, your official automated POAF guidance counselor and academic solution advisor. Currently, the server is running in offline preview mode (GEMINI_API_KEY placeholder detected). To enable full AI intelligence, please update your GEMINI_API_KEY in the 'Settings > Secrets' panel.

Here is how you can access academic solutions and chapter guidance:
1. Ask about Academic Project Blueprints and design/submission criteria.
2. Inquire on how to calendarize local student gatherings or coordinate regional assemblies.
3. Learn how to launch verified POAF clubs on your campus or establish alliances.
4. Obtain guidance on syncing ID cards and registering in the general ledger.

POAF was founded by Ezra Michael Jofe with the vision: "Building Solutions. Empowering Students. Transforming Africa." and coordinates student pioneers across all 54 African nations!`
      });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': "aistudio-build",
        }
      }
    });

    // Provide context instruction for Auto Ezra helper
    const systemPrompt = `You are Auto Ezra, the official automated POAF guidance counselor and academic solution advisor for Pioneers of Africa's Future (POAF).
POAF was founded in 2024 by Ezra Michael Jofe (Ezra.Michael.official@gmail.com) with the vision: "Building Solutions. Empowering Students. Transforming Africa."
POAF coordinates student builders across all 54 African nations.

You provide step-by-step guidance on how users can access solutions and resources:
1. Academic Project Blueprints - how to design, write, submit, and secure cabinet approval.
2. Meetups and Assemblies - how to calendarize student gatherings or coordinate regional summits.
3. Chapters and Alliances - how to set up campus POAF clubs and form partnerships.
4. Clearance and Credentials - how to register in the general ledger and sync membership cards.

Current User Context:
${userProfile ? JSON.stringify(userProfile, null, 2) : "Anonymous Visitor / Not Registered yet"}

Your persona is modeled after founder and president Ezra Michael Jofe: intellectual, visionary, inspiring, direct, authentic, encouraging, and deeply passionate about Pan-African empowerment. State things clearly. Inspire youth development. Avoid generic robotic introductory lines, dive right into helping! If asked how to join, guide them to the Register tab to obtain a custom POAF Membership Card and Certificate! Keep responses formatted in clean markdown.`;

    // Map conversation formatting to GoogleGenAI expectations
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    const replyText = response.text || "I was unable to process that. Please try once more.";
    res.json({ text: replyText });

  } catch (error: any) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: `Auto Ezra experienced an error: ${error.message || error}` });
  }
});

// Integrate Vite dev server or serve production dist
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Trigger Supabase cloud table seed/migration asynchronously so it doesn't delay starting up
  migrateFallbackStoreToSupabase().catch(e => {
    console.error("Async auto-migration failure:", e);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
