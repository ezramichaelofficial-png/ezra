import React, { useState } from "react";
import { AFRICAN_COUNTRIES, DEPARTMENTS } from "../data";
import { Member } from "../types";
import { ShieldCheck, Image, AlertCircle, FileText, CheckCircle } from "lucide-react";

interface RegisterViewProps {
  onRegisterSubmit: (formData: Omit<Member, "status" | "joinDate" | "expiryDate" | "cardGenerated" | "certGenerated">) => void;
  departments: string[];
}

export default function RegisterView({ onRegisterSubmit, departments }: RegisterViewProps) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("Male");
  const [country, setCountry] = useState("Nigeria");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDept, setSelectedDept] = useState(departments[0] || "Community Outreach");
  const [skills, setSkills] = useState("");
  const [essay, setEssay] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [universityTrack, setUniversityTrack] = useState("");
  const [biography, setBiography] = useState("");
  const [poafRoleAspiration, setPoafRoleAspiration] = useState("Active Solution Builder");
  const [grade, setGrade] = useState("Year 3");
  const [major, setMajor] = useState("");
  const [age, setAge] = useState("");
  const [roleCategory, setRoleCategory] = useState<"Member" | "Leader">("Member");
  const [pin, setPin] = useState("");

  const [errorWordCount, setErrorWordCount] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  // Simple essay word counter
  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).filter(Boolean).length;

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB to keep syncing fast!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoBase64) {
      alert("PROFILES REQUIRE A PHOTO IDENTIFIER!\n\nPlease upload a profile photo before submitting the Pioneer Membership Request. This is strictly required to compile your system ID card and certificates.");
      return;
    }

    if (wordCount < 150 || wordCount > 300) {
      setErrorWordCount(true);
      return;
    }

    setErrorWordCount(false);

    // Call submit handler
    const mockIdNum = Math.floor(10000 + Math.random() * 90000); // 5 digit incremental/random label
    const formattedId = `POAF-${mockIdNum}`;
    setGeneratedId(formattedId);

    onRegisterSubmit({
      id: formattedId,
      fullName,
      gender,
      country,
      school,
      email,
      phone,
      department: selectedDept,
      skills,
      essay,
      photo: photoBase64,
      universityTrack,
      biography,
      poafRoleAspiration,
      grade,
      major,
      age,
      roleCategory,
      pin
    });

    setIsDone(true);
  };

  if (isDone) {
    return (
      <div className="card max-w-xl mx-auto bg-neutral-950 border border-[#C9A84C]/50 rounded-2xl p-6 sm:p-10 text-center text-white space-y-6 shadow-2xl relative" id="reg-success">
        <div className="absolute top-2 right-2 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider animate-pulse">
          ✓ Active Sync Secure
        </div>

        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
          <CheckCircle className="w-8 h-8 shrink-0" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-wide uppercase text-white">Pioneer Registration Logged!</h3>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">Welcome to the Pioneers of Africa's Future</span>
        </div>

        {/* SCREENSHOT ALERT BOX */}
        <div className="bg-amber-950/80 border border-amber-600/40 p-4 rounded-xl text-center space-y-2 max-w-md mx-auto" id="screenshot-warning-box">
          <h4 className="text-[#C9A84C] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
            📸 ATTENTION: TAKE A SCREENSHOT / SAVE NOW!
          </h4>
          <p className="text-[10.5px] text-amber-200 leading-normal font-medium">
            Please capture a screenshot of this page or note down your secure credentials below immediately before exiting. You will need these to access your official Dashboard!
          </p>
        </div>

        {/* CREDENTIALS CARD TO SCREENSHOT */}
        <div className="bg-neutral-900 border-2 border-dashed border-[#C9A84C]/40 p-5 rounded-2xl max-w-md mx-auto space-y-4 text-left shadow-lg" id="credentials-card-to-save">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <span className="text-[#C9A84C] font-black text-[10px] uppercase tracking-wider">Official POAF Passport Credentials</span>
            <span className="text-neutral-500 text-[8.5px] font-mono">EST. 2026</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
              <span className="text-[9.5px] text-neutral-400 font-bold uppercase">PIONEER MEMBER ID:</span>
              <span className="font-mono text-xs sm:text-sm font-black text-[#C9A84C] tracking-wide">
                {generatedId}
              </span>
            </div>

            <div className="flex justify-between items-center bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
              <span className="text-[9.5px] text-neutral-400 font-bold uppercase">SECURITY LOGIN PIN:</span>
              <span className="font-mono text-xs sm:text-sm font-black text-emerald-400 tracking-wider">
                {pin}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[9.5px] pt-1">
              <div>
                <span className="text-neutral-500 block uppercase">Full Name:</span>
                <span className="text-neutral-200 font-bold block truncate">{fullName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase">Country:</span>
                <span className="text-neutral-200 font-bold block truncate">{country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-4 max-w-md mx-auto space-y-2.5 text-xs text-left">
          <p className="font-bold text-[#C9A84C] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <span>⏳</span> CURRENT STATUS: Awaiting Admin Approval
          </p>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Pioneer Founder & President <strong>Ezra Michael Jofe</strong> evaluates incoming profiles. Once approved, your double-sided, QR-verified Member ID Card and Certificate of Membership will automatically activate inside your <strong>"My Dashboard"</strong> tab!
          </p>
        </div>

        {/* CALL TO ACTIONS */}
        <div className="pt-4 border-t border-neutral-900 max-w-md mx-auto flex flex-col gap-2.5">
          <a
            href="https://whatsapp.com/channel/0029VbDF6Q8InlqO22N7b70M"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider text-center transition-all block cursor-pointer border border-emerald-500 shadow-md transform hover:scale-[1.01]"
          >
            📢 Join Official WhatsApp Channel
          </a>

          <button
            onClick={() => {
              // Store user id in local storage and trigger redirect or update tab
              localStorage.setItem("poaf_user", generatedId);
              window.location.reload(); // Real reload to sync status and load dashboard
            }}
            className="w-full py-3 rounded-lg bg-[#C9A84C] text-neutral-950 font-black hover:bg-[#8B6914] hover:text-white transition-all text-xs uppercase tracking-wider cursor-pointer shadow-md"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-3xl mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-5 sm:p-8 text-white relative shadow-2xl" id="registration-panel">
      <div className="border-b border-neutral-900 pb-3 mb-6">
        <h2 className="text-base font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-[#C9A84C]" /> Pan-African Pioneer Registration Form
        </h2>
        <p className="text-[10px] text-neutral-400">
          Upholding student empowerment across all 54 African countries. Required fields are marked *
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="E.g. Ezra Michael"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
            />
            <span className="text-[8px] text-neutral-500 block mt-1">Please enter your legal complete name</span>
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Country of Origin *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]"
            >
              {AFRICAN_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">School / University / Hub *</label>
            <input
              type="text"
              required
              placeholder="University of Nairobi, etc."
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Mobile Contact *</label>
            <input
              type="tel"
              required
              placeholder="+234 803 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Division Department *</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold block mb-1">Verified Skills Keywords *</label>
            <input
              type="text"
              required
              placeholder="Coding, Research, Public Speaking, writing"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
            />
          </div>
        </div>

        {/* SECTION: ACADEMIC & ROLE VERIFICATION FIELDS */}
        <div className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-4">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded">
            Academic Track & POAF Role Profile
          </span>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] uppercase text-stone-300 font-extrabold block mb-1">Course of Study & Year Level *</label>
              <input
                type="text"
                required
                placeholder="E.g., B.Sc. Computer Science (Year 3)"
                value={universityTrack}
                onChange={(e) => setUniversityTrack(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="text-[10px] uppercase text-stone-300 font-extrabold block mb-1">Major Specialization *</label>
              <input
                type="text"
                required
                placeholder="E.g., Software Eng."
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-stone-300 font-extrabold block mb-1">Current Grade / GPA Level *</label>
              <input
                type="text"
                required
                placeholder="E.g., Second Class Upper or 3.8 GPA"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-stone-300 font-extrabold block mb-1">Pioneer Member Age *</label>
              <input
                type="text"
                required
                placeholder="E.g., 21"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-[#C9A84C] font-black block mb-1">Security Login PIN *</label>
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Enter PIN Code"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-neutral-950 border border-[#C9A84C]/30 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-mono placeholder-neutral-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-stone-300 font-extrabold block mb-1">Brief Biography / Background Profile *</label>
            <textarea
              required
              rows={3}
              placeholder="Tell our founder who you are, what background experiences define you, and any milestones you have reached..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600 leading-relaxed"
            />
          </div>
        </div>

        {/* Motivation Essay */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] uppercase text-neutral-400 font-extrabold flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Continental Motivation Essay * (150 to 300 Words)
            </label>
            <span className={`text-[10px] font-bold ${(wordCount >= 150 && wordCount <= 300) ? "text-emerald-400" : "text-rose-400"}`}>
              {wordCount} / 150 - 300 Words
            </span>
          </div>
          <textarea
            required
            rows={5}
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Why do you wish to join Pioneers of Africa's Future? In 150 to 300 words, describe your background, skills, and how you intend to contribute to local or regional development..."
            className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-600 leading-relaxed"
          />
          {errorWordCount && (
            <p className="text-red-500 font-bold text-[10px] flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Your motivation essay must be between 150 and 300 words! Currently at {wordCount} words.
            </p>
          )}
        </div>

        {/* Profile photo upload */}
        <div className={`p-4 bg-neutral-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${!photoBase64 ? 'border-amber-500/30 bg-amber-950/5' : 'border-neutral-850'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-full bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden ${!photoBase64 ? 'border-2 border-dashed border-amber-500' : 'border border-neutral-800'}`}>
              {photoBase64 ? (
                <img src={photoBase64} alt="Pioneer Avatar" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-6 h-6 text-amber-500" />
              )}
            </div>
            <div>
              <strong className="text-neutral-200 text-xs block font-bold">Profile Photo Identifier *</strong>
              <p className="text-[9px] text-[#C9A84C] block mt-0.5 max-w-sm font-semibold">
                This photograph is strictly required to compile and activate your official student credential ID card!
              </p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleImageUploaded}
            className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A84C] file:text-black hover:file:bg-[#8B6914] hover:file:text-white cursor-pointer"
          />
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full text-center py-3 rounded-lg bg-[#C9A84C] hover:bg-[#8B6914] text-neutral-950 hover:text-white text-xs font-black tracking-wider uppercase transition-all shadow-md cursor-pointer shrink-0"
          >
            Submit Pioneer Membership Card Request
          </button>
        </div>
      </form>
    </div>
  );
}
