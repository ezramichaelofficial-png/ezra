import { Member, Project, Event, Club, Partner, Award } from "../types";
import { DEPARTMENTS, AFRICAN_COUNTRIES } from "../data";

// Pools for generating authentic and beautiful African student profiles
const FIRST_NAMES = [
  "Olumide", "Chinedu", "Abebe", "Moussa", "Kofi", "Tendai", "Sipho", "Fatoumata", "Amara", "Zola",
  "Kwame", "Tunde", "Amina", "Chioma", "Lindiwe", "Nia", "Eniola", "Samiya", "Desta", "Tewodros",
  "Alaba", "Babatunde", "Chidi", "Efe", "Femi", "Gideon", "Halima", "Ibrahim", "Jelani", "Kelechi",
  "Latif", "Mustafa", "Nkosazana", "Ousmane", "Penda", "Qasim", "Rami", "Sekou", "Thabo", "Uzoma",
  "Wambui", "Xola", "Yusuf", "Zuri", "Ayanda", "Bongani", "Chipo", "Dada", "Eshe", "Fola"
];

const LAST_NAMES = [
  "Adeleke", "Okonkwo", "Bekele", "Diop", "Mensah", "Moyo", "Dube", "Sow", "Keita", "Turay",
  "Ndiaye", "Osei", "Baloyi", "Kamau", "Obi", "Ojo", "Sanni", "Toure", "Gaye", "Zuma",
  "Abe", "Bello", "Chidama", "Diallo", "Eze", "Fofana", "Gueye", "Hassan", "Idris", "Jalloh",
  "Kone", "Lawal", "Mamba", "Nwachukwu", "Olatunji", "Phiri", "Quansah", "Rafiki", "Sowande", "Traore",
  "Uche", "Venter", "Wane", "Yeboah", "Zere", "Abara", "Biobaku", "Chuku", "Dogo", "Eremie"
];

const UNIVERSITIES = [
  "University of Ibadan", "University of Lagos", "Makerere University", "University of Nairobi",
  "University of Cape Town", "University of the Witwatersrand", "Ashesi University", "University of Ghana",
  "Addis Ababa University", "Cairo University", "University of Dar es Salaam", "Kenyatta University",
  "Obafemi Awolowo University", "Covenant University", "Stellenbosch University", "Strathmore University",
  "University of Zimbabwe", "National University of Rwanda", "University of Abidjan", "Cheikh Anta Diop University"
];

const PROJECTS_POOL = [
  { name: "Solar Water Distillation Kit", dept: "Engineering & Research" },
  { name: "Sorghum High-Yield Storage Bin", dept: "Engineering & Research" },
  { name: "E-Waste Eco-Collection Network", dept: "Community Outreach" },
  { name: "Rural Health Literacy Caravan", dept: "Community Outreach" },
  { name: "Student Coding & AI Network", dept: "Technology & Innovation" },
  { name: "Mobile Soil Chemistry Node", dept: "Technology & Innovation" },
  { name: "Pan-African Legal Aid Portal", dept: "Data & Communication" },
  { name: "Open-Science Student Directory", dept: "Data & Communication" },
  { name: "Micro-Enterprise Incubation Hub", dept: "Youth Empowerment" },
  { name: "Student Legal Advisory Desk", dept: "Student Development" }
];

const EVENTS_POOL = [
  { name: "POAF Annual Academic Integrity Summit", dept: "Student Development" },
  { name: "Digital Solutions Code-Screencast Expo", dept: "Technology & Innovation" },
  { name: "Agrarian Sovereignty Field Exhibition", dept: "Engineering & Research" },
  { name: "Pan-African Climate Policy Coalition", dept: "Youth Empowerment" },
  { name: "Local Student Roster Assembly & Meetup", dept: "Community Outreach" },
  { name: "Cabinet Strategic Governance Session", dept: "Data & Communication" }
];

const ORGANIZATIONS_POOL = [
  "African Development Bank Group", "UNICEF Youth Outreach Africa", "Meltwater Entrepreneurial School of Technology",
  "African Union Student Coalition", "Tony Elumelu Foundation Support", "AfriLabs Innovation Network",
  "Pan-African Tech Alliance", "African STEM Society", "Green Africa Foundation", "Equity Group Foundation"
];

const SKILLS_POOL = [
  "Mobile App Development, React Native, UI/UX", "Data Science, Python, Statistical Research",
  "Mechanical Prototyping, CAD, Solar Energy Designs", "Public Relations, Technical Writing, Press Campaigns",
  "Grassroots Organizing, Conflict Resolution, Event Orchestration", "Policy Memo Drafting, Legal Analysis, Public Speaking"
];

const ROLES_ASPIRATIONS = [
  "Country Representative", "Chapter Solutions Director", "Global Student Coordinator",
  "Division Project Advisor", "Pioneer Ambassador", "Student Roster Manager"
];

const MAJORS_POOL = [
  "Computer Science", "Electrical Engineering", "Civil Engineering", "Agricultural Sciences",
  "Medicine & Surgery", "Economics", "International Relations", "Public Health", "Law", "Microbiology"
];

const essayParagraphs = [
  "I am deeply motivated to join Pioneers of Africa's Future because I believe that continental collaboration among academic students is the most effective pathway to designing concrete solutions for our local communities. Across our higher education institutions, there is an immense reserve of intellectual energy and research talent that goes unused due to a lack of coordinated platforms.",
  "By matching technology, outreach projects, and research databases across different country chapters, we can create structured models to solve real-world problems in agri-tech, digital literacy, and sustainable power. Joining this movement allows me to contribute my skills and collaborate with fellow builders on solutions that directly boost welfare.",
  "Furthermore, I want to establish key regional alliances and scale educational seminars that equip young African leaders with critical administrative competencies. We must act as active agents of transformation, designing grassroots projects, publishing academic blueprints, and organizing summits that highlight innovative youth projects and empower student chapters across the continent.",
  "Ultimately, POAF represents a practical vision of continental integrity and academic excellence that I want to be a part of. I am fully committed to the mission of building solutions, empowering students, and transforming Africa, and I pledge to actively support our monthly assemblies, digital newsletters, and research innovations.",
  "Under scientific supervision and coordination with student divisions, we can execute rigorous studies to support public-policy shifts and develop educational modules. This structure not only resolves immediate problems but builds long-term institutional knowledge that strengthens local governance and creates sustainable, lasting continental impact."
];

const descParagraphs = [
  "This critical initiative is designed to address pressing structural and educational challenges within our community by mobilizing student skillsets and academic research. By setting up physical solution booths, local solar irrigation rigs, or collaborative code spaces on campus, we can establish highly functional hubs that serve the local population and provide practical training in relevant fields.",
  "Furthermore, our primary objective is to scale this operational framework across adjacent student chapters and secure active backing from regional partners and universities. We will conduct technical workshops, perform thorough user research, and compile comprehensive blueprint layouts to ensure that all development is sustainable and easily reproducible in diverse geographies.",
  "Ultimately, this effort endeavors to foster a culture of active problem-solving, continental cooperation, and academic integration among young African builders. By sharing resources, tracking milestones in our general directory, and publishing regular research reports, we ensure full strategic alignment with the broader developmental visions of POAF across Africa.",
  "Our planning committee has scheduled multi-stakeholder feedback loops and structured research assessments to measure community impact quarterly. By working hand-in-hand with regional coordinators, we aim to register this layout with international education boards and secure long-term funding streams for active participants."
];

// Generates an essay strictly bounded inside the 150 - 300 words window
function generateEssay(): string {
  // Combine 4 paragraphs to get around 215-220 words
  const chosen = [essayParagraphs[0], essayParagraphs[1], essayParagraphs[2], essayParagraphs[3]];
  return chosen.join("\n\n");
}

// Generates a description strictly bounded inside the 100 - 700 words window
function generateDescription(): string {
  // Combine 3 paragraphs to get around 160-210 words (perfectly inside [100, 700])
  const chosen = [descParagraphs[0], descParagraphs[1], descParagraphs[2]];
  return chosen.join("\n\n");
}

export function generateBulkSeededData(): {
  members: Member[];
  projects: Project[];
  events: Event[];
  clubs: Club[];
  partnerships: Partner[];
  awards: Award[];
} {
  const generatedMembers: Member[] = [];
  const generatedProjects: Project[] = [];
  const generatedEvents: Event[] = [];
  const generatedClubs: Club[] = [];
  const generatedPartnerships: Partner[] = [];
  const generatedAwards: Award[] = [];

  // Helper arrays for random selection
  const genders = ["Male", "Female"];

  // 1. GENERATE 120 LEADERS (roster entries)
  for (let i = 1; i <= 120; i++) {
    const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = `${fName} ${lName}`;
    const randCountry = AFRICAN_COUNTRIES[i % AFRICAN_COUNTRIES.length];
    const randUni = UNIVERSITIES[i % UNIVERSITIES.length];
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${10 + i}@poaf.org`;
    const phone = `+${Math.floor(211 + Math.random() * 50)}7${Math.floor(10000000 + Math.random() * 90000000)}`;
    const randDept = DEPARTMENTS[i % DEPARTMENTS.length];
    
    const leadershipId = `POAF-L-${10100 + i}`;
    const roles = ["Country Ambassador", "Regional Director", "Department Coordinator", "Pioneer Elder"];
    const leadershipRole = roles[i % roles.length];

    generatedMembers.push({
      id: `POAF-${20000 + i}`,
      fullName,
      gender: genders[i % genders.length],
      country: randCountry,
      school: randUni,
      email,
      phone,
      department: randDept,
      skills: SKILLS_POOL[i % SKILLS_POOL.length],
      essay: generateEssay(),
      photo: null,
      status: "Approved",
      joinDate: `2025-0${(i % 9) + 1}-10`,
      expiryDate: "2030-01-01",
      cardGenerated: true,
      certGenerated: true,
      certNumber: `CERT-L-${10000 + i}`,
      leadership: leadershipRole,
      leadershipId,
      awards: [i % 5 === 0 ? "Outstanding Governance Medal" : "Active Leader Medal"],
      biography: generateEssay().split("\n\n")[0],
      poafRoleAspiration: ROLES_ASPIRATIONS[i % ROLES_ASPIRATIONS.length],
      universityTrack: MAJORS_POOL[i % MAJORS_POOL.length],
      grade: `${(3.5 + Math.random() * 0.5).toFixed(2)} GPA`,
      roleCategory: "Leader",
      pin: String(1000 + i)
    });
  }

  // 2. GENERATE 300 GENERAL STUDENTS
  for (let i = 1; i <= 300; i++) {
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = `${fName} ${lName}`;
    const randCountry = AFRICAN_COUNTRIES[i % AFRICAN_COUNTRIES.length];
    const randUni = UNIVERSITIES[i % UNIVERSITIES.length];
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${100 + i}@gmail.com`;
    const phone = `+${Math.floor(211 + Math.random() * 50)}8${Math.floor(1000000 + Math.random() * 9000000)}`;
    const randDept = DEPARTMENTS[i % DEPARTMENTS.length];

    generatedMembers.push({
      id: `POAF-${30000 + i}`,
      fullName,
      gender: genders[i % genders.length],
      country: randCountry,
      school: randUni,
      email,
      phone,
      department: randDept,
      skills: SKILLS_POOL[i % SKILLS_POOL.length],
      essay: generateEssay(),
      photo: null,
      status: "Approved",
      joinDate: `2025-11-2${i % 10}`,
      expiryDate: "2030-01-01",
      cardGenerated: false,
      certGenerated: false,
      biography: generateEssay().split("\n\n")[0],
      poafRoleAspiration: "Active Student Pioneer",
      universityTrack: MAJORS_POOL[i % MAJORS_POOL.length],
      grade: `${(3.0 + Math.random() * 1.0).toFixed(2)} GPA`,
      roleCategory: "Member",
      pin: String(2000 + i)
    });
  }

  // 3. GENERATE 50 PROJECTS
  for (let i = 1; i <= 50; i++) {
    const poolItem = PROJECTS_POOL[i % PROJECTS_POOL.length];
    const randCountry = AFRICAN_COUNTRIES[i % AFRICAN_COUNTRIES.length];
    // Assign to a random member name from the ones we just generated
    const randMember = generatedMembers[i % generatedMembers.length];

    generatedProjects.push({
      id: `PROJ-${20000 + i}`,
      name: `${poolItem.name} ${randCountry} Phase ${Math.floor(i / 10) + 1}`,
      department: poolItem.dept,
      country: randCountry,
      description: generateDescription(),
      submittedBy: randMember.fullName,
      status: "Approved",
      photo: null
    });
  }

  // 4. GENERATE 30 EVENTS
  for (let i = 1; i <= 30; i++) {
    const poolItem = EVENTS_POOL[i % EVENTS_POOL.length];
    const eventTimes = [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "16:30" },
      { start: "10:30", end: "13:00" },
      { start: "16:00", end: "18:00" }
    ];
    const randTime = eventTimes[i % eventTimes.length];

    generatedEvents.push({
      id: `EVT-${20000 + i}`,
      name: `${poolItem.name} (Region Code: E-${100 + i})`,
      date: `2026-07-${10 + (i % 20)}`,
      startTime: randTime.start,
      endTime: randTime.end,
      department: poolItem.dept,
      description: generateDescription(),
      photo: null,
      status: "Approved"
    });
  }

  // 5. GENERATE 60 AWARDS / HONORS (relational alignment)
  const categories = ["Student of the Month", "Innovator of the Month", "Researcher of the Month"] as const;
  for (let i = 1; i <= 60; i++) {
    const targetMember = generatedMembers[i % generatedMembers.length];
    generatedAwards.push({
      id: `AWD-${20000 + i}`,
      category: categories[i % categories.length],
      memberId: targetMember.id,
      memberName: targetMember.fullName,
      memberCountry: targetMember.country,
      date: `2026-0${(i % 5) + i % 2 + 1}`,
      title: `${categories[i % categories.length]} Excellence Ribbon`,
      description: generateDescription().split("\n\n")[0]
    });
  }

  // 6. GENERATE 10 CAMPUS CLUBS
  for (let i = 1; i <= 10; i++) {
    const randUni = UNIVERSITIES[i % UNIVERSITIES.length];
    const randCountry = AFRICAN_COUNTRIES[i % AFRICAN_COUNTRIES.length];
    generatedClubs.push({
      id: `CLUB-${10000 + i}`,
      school: randUni,
      country: randCountry,
      clubName: `${randUni} Solutions & Empowerment Club`,
      contactEmail: `club.president@${randUni.toLowerCase().replace(/\s+/g, "")}.edu`,
      contactPhone: `+${Math.floor(211 + Math.random() * 50)}9${Math.floor(1000000 + Math.random() * 9000000)}`,
      writtenProposal: generateDescription(),
      status: "Approved"
    });
  }

  // 7. GENERATE 50 PARTNERSHIPS
  for (let i = 1; i <= 50; i++) {
    const orgName = ORGANIZATIONS_POOL[i % ORGANIZATIONS_POOL.length];
    const randCountry = AFRICAN_COUNTRIES[i % AFRICAN_COUNTRIES.length];
    generatedPartnerships.push({
      id: `PRT-${10000 + i}`,
      organization: `${orgName} (Chapter Support Council)`,
      country: randCountry,
      contactEmail: `alliance@${orgName.toLowerCase().replace(/\s+/g, "")}.org`,
      contactPhone: `+${Math.floor(211 + Math.random() * 50)}5${Math.floor(100000 + Math.random() * 900000)}`,
      writtenProposal: generateDescription(),
      status: "Approved"
    });
  }

  return {
    members: generatedMembers,
    projects: generatedProjects,
    events: generatedEvents,
    clubs: generatedClubs,
    partnerships: generatedPartnerships,
    awards: generatedAwards
  };
}
