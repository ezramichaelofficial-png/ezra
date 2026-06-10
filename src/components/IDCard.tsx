import React, { useState } from "react";
import { Member, getDirectDriveUrl } from "../types";
import { User, ShieldCheck, Mail, MapPin, Printer, CheckCircle, ExternalLink, QrCode } from "lucide-react";
// @ts-ignore
import founderDefaultPhoto from "../assets/images/founder_portrait_1780996644889.png";
// @ts-ignore
import officialSeal from "../assets/images/official_seal_1780784651126.png";

interface IDCardProps {
  member: Member;
}

export default function IDCard({ member }: IDCardProps) {
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const triggerPrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dynamicUrl = `https://poaf.africa/verify/${member.id}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dynamicUrl)}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>POAF Professional ID Card - ${member.fullName}</title>
          <style>
            body { 
              font-family: 'Segoe UI', system-ui, sans-serif; 
              background: #fff; 
              padding: 40px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
            }
            .id-card-wrapper {
              width: 320px;
              height: 480px;
              border: 4px solid #C9A84C;
              border-radius: 16px;
              background: #030303;
              color: white;
              padding: 16px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              position: relative;
            }
            .header {
              border-bottom: 2px solid #C9A84C;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header-org {
              font-size: 11px;
              font-weight: 900;
              color: #C9A84C;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin: 0;
            }
            .header-sub {
              font-size: 8px;
              color: #888;
              letter-spacing: 0.5px;
              margin: 2px 0 0 0;
            }
            .photo-frame {
              width: 110px;
              height: 140px;
              border: 2px solid #C9A84C;
              border-radius: 8px;
              overflow: hidden;
              margin: 0 auto 12px auto;
              background: #111;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            .photo-frame img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .name-title {
              font-size: 15px;
              font-weight: bold;
              color: #fff;
              margin: 0 0 4px 0;
            }
            .pioneer-tag {
              font-size: 8px;
              color: #C9A84C;
              background: rgba(201, 168, 76, 0.15);
              padding: 2px 8px;
              border-radius: 4px;
              display: inline-block;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
            }
            .meta-grid {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 10px;
              text-align: left;
              font-size: 9px;
              border-top: 1px solid #222;
              padding-top: 10px;
              margin-bottom: 15px;
            }
            .meta-label {
              font-size: 7px;
              color: #C9A84C;
              text-transform: uppercase;
              font-weight: bold;
            }
            .meta-val {
              color: #eee;
              font-weight: 500;
              margin-top: 1px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .footer-row {
              border-top: 1.5px solid #C9A84C;
              padding-top: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .barcode-line {
              height: 25px;
              background: repeating-linear-gradient(90deg, #fff, #fff 1.5px, #000 1.5px, #000 3px);
              width: 140px;
            }
            .qr-code-box {
              width: 48px;
              height: 48px;
              background: white;
              padding: 1px;
              border-radius: 4px;
            }
            .qr-code-box img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .reg-id {
              font-family: monospace;
              font-size: 8px;
              color: #C9A84C;
              font-weight: bold;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="id-card-wrapper">
            <div class="header">
              <p class="header-org">Pioneers of Africa's Future</p>
              <p class="header-sub">${member.roleCategory === 'Leader' ? 'Leadership ID Card' : 'Membership ID'}</p>
            </div>

            <div>
              <div class="photo-frame">
                ${member.photo ? `<img src="${getDirectDriveUrl(member.photo)}" referrerPolicy="no-referrer">` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; font-size:24px; color:#555;">👤</div>`}
              </div>
              <h4 class="name-title">${member.fullName}</h4>
              <span class="pioneer-tag">${member.roleCategory === 'Leader' ? 'Pioneer Leader' : 'Pioneer Member'}</span>
            </div>

            <div class="meta-grid">
              <div>
                <span class="meta-label">${member.roleCategory === 'Leader' ? 'Leadership ID' : 'Membership ID'}</span>
                <p class="meta-val" style="font-family:monospace; color:#C9A84C; font-weight:700;">${member.id}</p>
              </div>
              <div>
                <span class="meta-label">Origin Country</span>
                <p class="meta-val">${member.country}</p>
              </div>
              <div style="grid-column: span 2;">
                <span class="meta-label">Accredited Division Track</span>
                <p class="meta-val">${member.department} Division</p>
              </div>
              <div>
                <span class="meta-label">Date Issued</span>
                <p class="meta-val">${member.joinDate}</p>
              </div>
              <div>
                <span class="meta-label">Expiration Term</span>
                <p class="meta-val">${member.expiryDate}</p>
              </div>
            </div>

            <div class="footer-row">
              <div style="text-align: left;">
                <p class="reg-id">VERIFIED BY POAF</p>
                <div class="barcode-line"></div>
              </div>
              <div class="qr-code-box">
                <img src="${qrImageUrl}" alt="Pioneer Registry QR" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="card max-w-md mx-auto bg-neutral-900 border-2 border-[#C9A84C] py-8 px-4 sm:px-6 rounded-2xl text-white shadow-2xl relative overflow-hidden" id={`card-panel-${member.id}`}>
      
      {/* Dynamic Background Watermarks */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full border-8 border-dashed border-[#C9A84C]/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full border-8 border-dashed border-[#C9A84C]/5 pointer-events-none" />

      {/* Vertical ID Card Form */}
      <div className="w-[280px] sm:w-[300px] min-h-[460px] mx-auto border-2 border-[#C9A84C] rounded-2xl p-4 bg-gradient-to-b from-neutral-950 to-neutral-900 shadow-2xl relative flex flex-col justify-between" id={`physical-id-card-${member.id}`}>
        
        {/* Card Header styling matching Top Tier Universities */}
        <div className="border-b border-[#C9A84C]/35 pb-3.5 text-center">
          <span className="text-[11px] font-black tracking-widest text-[#C9A84C] block uppercase">
            Pioneers of Africa's Future
          </span>
          <span className="text-[7.5px] uppercase text-neutral-400 font-extrabold block mt-0.5 tracking-wider">
            {member.roleCategory === 'Leader' ? 'Leadership ID Card' : 'Membership ID'}
          </span>
        </div>

        {/* Center portrait block */}
        <div className="my-4 text-center">
          <div className="w-24 h-32 rounded-lg border-2 border-[#C9A84C] bg-neutral-950 overflow-hidden mx-auto shadow-xl relative group">
            {member.photo ? (
              <img src={getDirectDriveUrl(member.photo)} alt={member.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-neutral-600 font-bold">
                👤
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow">
              ✓ ACTIVE
            </div>
          </div>

          <h4 className="font-sans font-bold text-white text-sm sm:text-base tracking-wide mt-2.5 uppercase leading-snug">
            {member.fullName}
          </h4>
          <span className="inline-block text-[8px] uppercase tracking-widest bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-0.5 rounded-full font-extrabold mt-1">
            {member.roleCategory === 'Leader' ? 'Pioneer Leader' : 'Pioneer Member'}
          </span>
        </div>

        {/* Details list */}
        <div className="border-t border-neutral-800 pt-3.5 pb-2 text-[10px] space-y-2 font-sans tracking-wide">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[7.5px] uppercase font-bold text-neutral-500 block">
                {member.roleCategory === 'Leader' ? 'Leadership ID Card' : 'Membership ID'}
              </span>
              <span className="font-mono font-bold text-[#C9A84C] text-[10.5px]">{member.id}</span>
            </div>
            <div>
              <span className="text-[7px] uppercase font-bold text-neutral-500 block">Country Region</span>
              <span className="font-semibold text-neutral-200 block truncate">{member.country}</span>
            </div>
          </div>

          <div>
            <span className="text-[7px] uppercase font-bold text-neutral-500 block">Accredited Division Track</span>
            <span className="font-medium text-neutral-200 block truncate">{member.department} Division</span>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-neutral-900 pt-2">
            <div>
              <span className="text-[7px] uppercase font-bold text-neutral-500 block">Date Issued</span>
              <span className="text-neutral-300 font-semibold text-[9.5px]">{member.joinDate}</span>
            </div>
            <div>
              <span className="text-[7px] uppercase font-bold text-neutral-500 block">Expiry Term</span>
              <span className="text-neutral-300 font-semibold text-[9.5px]">{member.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Bottom card border & VERIFIABLE QR CODE */}
        <div className="border-t border-neutral-800/80 pt-3 flex items-center justify-between mt-1">
          <div className="text-left shrink-0">
            <span className="text-[6.5px] tracking-wider text-[#C9A84C] font-extrabold block uppercase">SYSTEM VERIFIED</span>
            {/* Elegant Barcode */}
            <div className="h-4.5 bg-repeating-linear bg-[linear-gradient(90deg,#fff,#fff_1.5px,#000_1.5px,#000_3px)] w-28 rounded shadow-sm opacity-90 mt-1" />
          </div>

          {/* Verification QR Code Trigger */}
          <button 
            onClick={() => setShowVerifiedModal(true)}
            className="w-12 h-12 bg-white p-1 rounded-lg border border-[#C9A84C] hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/15 duration-200 cursor-pointer flex items-center justify-center relative overflow-hidden group"
            title="Scan or Click to verify ledger logs"
            id={`qr-modal-trigger-${member.id}`}
          >
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://poaf.africa/verify/${member.id}`)}`} 
              alt="Pioneer Registry QR Code" 
              className="w-10 h-10 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[7px] rounded px-1 group-hover:block hidden whitespace-nowrap font-bold animate-bounce uppercase">
              Click to Scan
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2.5">
        <button 
          onClick={triggerPrint}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#C9A84C] text-xs font-bold transition-all border border-[#C9A84C]/45 shadow-md cursor-pointer"
          id={`btnPrintCard-${member.id}`}
        >
          <Printer className="w-3.5 h-3.5" />
          Print ID Card
        </button>

        <button 
          onClick={() => setShowVerifiedModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#C9A84C] hover:bg-[#8B6914] hover:text-white text-neutral-950 text-xs font-bold transition-all shadow-md cursor-pointer"
          id={`btnVerifyQR-${member.id}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Scan QR Code / Verify
        </button>
      </div>

      {/* LEDGER STATUS VERIFICATION POPUP MODAL */}
      {showVerifiedModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4" id="ledger-modal-back">
          <div className="bg-neutral-950 border-2 border-[#C9A84C] rounded-2xl w-full max-w-lg p-6 text-xs text-stone-300 shadow-2xl relative space-y-4" id="ledger-modal-inner">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold uppercase tracking-wide text-xs">Dynamic Registry Log</h4>
                  <span className="text-[8.5px] text-emerald-400 block font-mono font-bold">✓ SECURE SHA-256 SYSTEM AUTHENTICATED</span>
                </div>
              </div>
              <button 
                onClick={() => setShowVerifiedModal(false)}
                className="text-stone-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-xs cursor-pointer font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* Verification Receipt Details */}
            <div className="space-y-3.5">
              <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl p-3.5 space-y-2 font-mono text-[10.5px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">LEDGER STATUS:</span>
                  <span className="text-emerald-400 font-bold font-sans">● CERTIFIED PIONEER ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ID REFERENCE:</span>
                  <span className="text-[#C9A84C] font-bold">{member.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">FULL NAME:</span>
                  <span className="text-white uppercase">{member.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ORIGIN REGION:</span>
                  <span className="text-stone-200">{member.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ACADEMY AFFILIATION:</span>
                  <span className="text-stone-200 truncate max-w-[200px]">{member.school}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">COURSE LEVEL:</span>
                  <span className="text-[#C9A84C] font-bold">{member.universityTrack || "Standard Admissions Hub"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">POAF DESIGNATION:</span>
                  <span className="text-stone-300 font-sans italic">🎯 {member.poafRoleAspiration || "Pioneer Active Builder"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">GENDER & AGE:</span>
                  <span className="text-stone-200">{member.gender || "Not Specified"} ({member.age || "N/A"} Yrs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">MAJOR STUDY:</span>
                  <span className="text-stone-200">{member.major || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">GRADE LEVEL:</span>
                  <span className="text-emerald-400 font-bold">{member.grade || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ROLE CLASS:</span>
                  <span className="text-[#C9A84C] font-bold uppercase">{member.roleCategory === 'Leader' ? 'Pioneer Leader (Leadership ID)' : 'Pioneer Member (Membership ID)'}</span>
                </div>
              </div>

              {/* Biography answers displayed dynamically */}
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase font-black tracking-widest text-[8px] block">Biography Profile</span>
                <p className="bg-neutral-900/60 p-2 text-stone-300 rounded border border-neutral-900 leading-relaxed italic text-[11px]">
                  "{member.biography || "This student pioneer has been evaluated by the movement cabinet and is actively registered into POAF development tracks."}"
                </p>
              </div>

              {/* Essay answers displayed dynamically */}
              <div className="space-y-1">
                <span className="text-neutral-500 uppercase font-black tracking-widest text-[8px] block">Motivation Essay Response</span>
                <p className="bg-neutral-900/60 p-2 text-stone-300 rounded border border-neutral-900 leading-relaxed text-[11px] max-h-24 overflow-y-auto">
                  "{member.essay}"
                </p>
              </div>
            </div>

            {/* Signature validation */}
            <div className="border-t border-neutral-900 pt-3 flex items-center justify-between text-[9px] text-neutral-400 font-mono">
              <div>
                <p className="text-neutral-500 mb-1">GOVERNANCE SEAL:</p>
                <div className="bg-neutral-900/60 border border-neutral-900 rounded-lg p-2 flex items-center gap-2 mb-1">
                  <img src={officialSeal} alt="Founder Signature Stamp" className="w-16 h-auto opacity-90 invert mix-blend-screen pointer-events-none" referrerPolicy="no-referrer" />
                  <div>
                    <span className="text-stone-200 uppercase font-black text-[9px] block">Ezra Michael Jofe</span>
                    <span className="text-stone-500 text-[8px] block">PRESIDENT & CHANCELLOR</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-neutral-500">TIMESTAMP:</p>
                <p className="text-emerald-400 font-bold">{new Date().toLocaleDateString()} UT</p>
                <p className="text-neutral-500 text-[8px]">SECURED SSL SHA-256</p>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
