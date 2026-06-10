import React from "react";
import { Member } from "../types";
import { Printer } from "lucide-react";
// @ts-ignore
import officialSeal from "../assets/images/official_seal_1780784651126.png";

interface CertificateProps {
  member: Member;
}

export default function Certificate({ member }: CertificateProps) {
  const triggerPrintCert = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>POAF Official Certificate - ${member.fullName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Space+Grotesk:wght@400;600&display=swap');
            body { 
              font-family: 'Space Grotesk', sans-serif; 
              background: #f7f6f0; 
              padding: 20px; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh;
              margin: 0;
            }
            .cert-border-outer {
              width: 820px;
              height: 560px;
              padding: 16px;
              border: 14px double #8B6914;
              background: #fffdf6;
              box-sizing: border-box;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              position: relative;
            }
            .cert-border-inner {
              border: 2px solid #C9A84C;
              height: 100%;
              width: 100%;
              padding: 30px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              text-align: center;
            }
            .cert-header {
              font-family: 'Cinzel Decorative', serif;
              font-size: 22px;
              color: #8B6914;
              letter-spacing: 2.5px;
              margin-top: 10px;
            }
            .certificate-award {
              font-family: 'Playfair Display', serif;
              font-size: 30px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #0c0c0c;
              margin: 10px 0;
            }
            .cert-text-desc {
              font-family: 'Playfair Display', serif;
              font-size: 15px;
              font-style: italic;
              color: #444;
              margin: 6px 0;
            }
            .cert-name {
              font-family: 'Playfair Display', serif;
              font-size: 38px;
              font-weight: 800;
              color: #8B6914;
              border-bottom: 2px solid #C9A84C;
              padding-bottom: 8px;
              margin: 15px auto;
              width: 85%;
              text-transform: capitalize;
            }
            .cert-scope {
              font-size: 11.5px;
              line-height: 1.7;
              color: #333;
              max-width: 620px;
              margin: 10px auto;
            }
            .cert-footer-row {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding: 0 45px;
              margin-bottom: 5px;
            }
            .footer-col {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 200px;
            }
            .signature-svg {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              font-size: 19px;
              font-weight: bold;
              color: #1a1a5a;
              margin-bottom: -5px;
              letter-spacing: 0.5px;
            }
            .footer-line {
              border-top: 1.5px solid #444;
              width: 100%;
              margin-top: 4px;
              padding-top: 4px;
              font-size: 9px;
              color: #555;
              text-transform: uppercase;
              font-weight: bold;
            }
            .cert-number-stamp {
              position: absolute;
              bottom: 30px;
              left: 40px;
              font-family: monospace;
              font-size: 10px;
              color: #777;
            }
            .cert-badge-box {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 3px double #C9A84C;
              background: #fffdf6;
              padding: 8px;
              border-radius: 50%;
              width: 108px;
              height: 108px;
              box-sizing: border-box;
              box-shadow: 0 2px 8px rgba(139, 105, 20, 0.15);
            }
            .cert-badge-text-inner {
              font-size: 8px;
              font-weight: 800;
              color: #8B6914;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              line-height: 1.2;
              text-align: center;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="cert-border-outer">
            <div class="cert-border-inner">
              <div class="cert-header">Pioneers of Africa's Future</div>
              <div class="certificate-award">CERTIFICATE OF MEMBERSHIP</div>
              <div class="cert-text-desc">This document serves to officially declare that</div>
              
              <div class="cert-name">${member.fullName}</div>
              
              <div class="cert-text-desc">is a qualified and recognized active student pioneer within the division of</div>
              <div style="font-weight:bold; font-size:15px; color:#0c0c0c; margin:4px 0; text-transform:uppercase; letter-spacing:1px;">${member.department}</div>
              
              <div class="cert-scope">
                Having demonstrated a steadfast commitment to collegiate empowerment, Pan-African collaboration, and practical leadership, this pioneer is hereby registered with all associated honors, and networks of the Pioneers of Africa's Future union.
              </div>

              <div class="cert-footer-row">
                <div class="footer-col">
                  <div style="font-size:12px; font-weight:700; color:#111;">${member.country}</div>
                  <div class="footer-line">PIONEER REGION</div>
                </div>

                <div class="footer-col" style="justify-content: center;">
                  <div class="cert-badge-box">
                    <div style="font-size: 18px; color: #8B6914; margin-bottom: 2px;">🛡️</div>
                    <div class="cert-badge-text-inner">VERIFIED<br>REGISTRY<br>STATUS</div>
                  </div>
                </div>

                <div class="footer-col" style="position: relative; display: flex; flex-direction: column; align-items: center;">
                  <img src="${officialSeal}" style="width: 135px; height: auto; position: absolute; bottom: 8px; mix-blend-mode: multiply; pointer-events: none; z-index: 10;" referrerPolicy="no-referrer" />
                  <div style="height: 38px;"></div>
                  <div class="footer-line">PRESIDENT & FOUNDER</div>
                </div>
              </div>

              <div class="cert-number-stamp">REF ID: ${member.id} • NO: CERT-0${member.id.substring(5)}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formattedCertNumber = `CERT-0${member.id.substring(5)}`;

  return (
    <div className="card max-w-2xl mx-auto bg-white border-4 border-double border-[#8B6914] p-4 sm:p-8 rounded-lg shadow-xl text-neutral-900 relative" id={`certificate-panel-${member.id}`}>

      <div className="border border-[#C9A84C] p-4 sm:p-8 text-center bg-stone-50/20 relative">
        <h2 className="font-serif text-[#8B6914] font-extrabold text-base sm:text-2xl tracking-widest uppercase mb-1">
          Pioneers of Africa's Future
        </h2>
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#8B6914]/80 block mb-8">
          Certificate of Membership
        </span>

        <p className="font-serif italic text-sm text-neutral-500 mb-2">
          This is to verify and officially record that
        </p>

        <h3 className="font-serif text-[#8B6914] text-xl sm:text-3xl sm:text-4xl font-extrabold italic border-b-2 border-[#C9A84C]/50 py-2 inline-block px-4 sm:px-16 mb-6 capitalize">
          {member.fullName}
        </h3>

        <p className="font-serif italic text-sm text-neutral-500 mb-1">
          is an officially registered and authenticated pioneer in the division of
        </p>
        <span className="font-extrabold text-neutral-800 tracking-wide text-sm block mb-8 uppercase font-sans">
          {member.department}
        </span>

        <p className="text-neutral-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-8 font-light">
          Upholding the directives and mission: <strong className="text-[#8B6914] font-semibold">"Building Solutions. Empowering Students. Transforming Africa."</strong> This pioneer coordinates active development solutions across the continent.
        </p>

        {/* Footer row */}
        <div className="grid grid-cols-3 items-end gap-3 border-t border-stone-200/80 pt-6">
          <div className="text-center bg-transparent">
            <span className="font-bold text-neutral-800 text-xs sm:text-sm block">{member.country}</span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block border-t border-neutral-300 w-2/3 mx-auto mt-1 pt-1 font-bold">Region</span>
          </div>

          <div className="flex justify-center">
            {/* Elegant Ring-based Verification Badge */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#8B6914] bg-stone-50 p-2 rounded-full w-20 h-20 sm:w-24 sm:h-24 shadow-inner relative">
              <div className="absolute inset-0.5 rounded-full border border-[#C9A84C] pointer-events-none" />
              <div className="text-lg sm:text-xl text-[#8B6914]">🛡️</div>
              <span className="text-[6.5px] sm:text-[7.5px] uppercase font-bold text-[#8B6914] tracking-wider text-center block leading-none mt-1">
                Verified<br />Status
              </span>
            </div>
          </div>

          <div className="text-center bg-transparent relative flex flex-col items-center">
            {/* Stamp Overlap */}
            <img src={officialSeal} alt="Ezra Michael Jofe Stamp" className="w-32 h-auto absolute -top-8 pointer-events-none mix-blend-multiply opacity-90" referrerPolicy="no-referrer" />
            <div className="h-6" />
            <span className="font-serif italic font-extrabold text-stone-800 text-xs sm:text-base block leading-none relative z-10">Ezra Michael Jofe</span>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block border-t border-neutral-300 w-2/3 mx-auto mt-2 pt-1 font-bold relative z-10">President</span>
          </div>
        </div>

        {/* Certificate metadata */}
        <div className="mt-8 flex justify-between text-[10px] font-mono text-neutral-400 border-t border-stone-100 pt-4">
          <span>ID: {member.id}</span>
          <span>NO: {formattedCertNumber}</span>
          <span>TERM: 2024-2030</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={triggerPrintCert}
          className="flex items-center gap-1.5 px-4 py-2 rounded bg-neutral-900 border border-[#8B6914] hover:bg-[#8B6914] hover:text-white text-[#C9A84C] text-xs font-bold font-sans transition-all"
          id={`btnPrintCert-${member.id}`}
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Download Certificate
        </button>
      </div>
    </div>
  );
}
