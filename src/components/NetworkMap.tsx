import React, { useState } from "react";
import { Member, getDirectDriveUrl } from "../types";
import { AFRICAN_COUNTRIES } from "../data";
import { Network, Search, Globe, MapPin, Users, User, Phone, Mail, Award } from "lucide-react";
// @ts-ignore
import founderDefaultPhoto from "../assets/images/founder_portrait_1780996644889.png";

interface NetworkMapProps {
  members: Member[];
}

export default function NetworkMap({ members }: NetworkMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("Nigeria");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = AFRICAN_COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Members in currently selected country
  const countryMembers = members.filter(
    (m) => m.country.toLowerCase() === selectedCountry.toLowerCase() && m.status === "Approved"
  );

  // Ambassadors / Leaders in selected country
  const leaders = countryMembers.filter((m) => m.leadership && m.status === "Approved");
  const normalMembers = countryMembers.filter((m) => !m.leadership && m.status === "Approved");

  // Summary statistics
  const totalPanAfricanActive = members.filter((m) => m.status === "Approved").length;
  const representedCountriesCount = Array.from(
    new Set(members.filter((m) => m.status === "Approved").map((m) => m.country.toLowerCase()))
  ).length;

  return (
    <div className="space-y-6" id="network-map-panel">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
            <Globe className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold block">Target Scope</span>
            <h4 className="text-xl font-bold tracking-tight text-white leading-tight">54 Nations</h4>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
            <Users className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold block">Active Pioneers</span>
            <h4 className="text-xl font-bold tracking-tight text-[#C9A84C] leading-tight">{totalPanAfricanActive}</h4>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
            <Network className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold block">Active Registrations</span>
            <h4 className="text-xl font-bold tracking-tight text-white leading-tight">{representedCountriesCount} Active Regions</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Country Picker Panel */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex flex-col h-[400px]">
          <h3 className="text-sm font-bold text-[#C9A84C] mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-[#C9A84C]" /> Select Union Region
          </h3>
          
          <div className="relative mb-3 shrink-0">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search 54 Countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C9A84C] font-sans placeholder-neutral-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 border border-neutral-900 p-2 rounded-lg bg-neutral-900/40">
            {filteredCountries.map((country) => {
              const countryCount = members.filter(
                (m) => m.country.toLowerCase() === country.toLowerCase() && m.status === "Approved"
              ).length;
              const isSelected = selectedCountry.toLowerCase() === country.toLowerCase();

              return (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`w-full py-2.5 px-3 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-[#C9A84C] text-neutral-950" 
                      : "bg-neutral-900/50 hover:bg-neutral-900 text-neutral-300"
                  }`}
                  id={`country-select-${country}`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {country}
                  </span>
                  {countryCount > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? "bg-neutral-950 text-[#C9A84C]" : "bg-neutral-800 text-neutral-400"
                    }`}>
                      {countryCount}
                    </span>
                  )}
                </button>
              );
            })}
            {filteredCountries.length === 0 && (
              <p className="text-center text-xs text-neutral-500 py-12">No African countries match query</p>
            )}
          </div>
        </div>

        {/* Localized Pioneer Roster Panel */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-xl p-5 min-h-[400px]">
          <div className="border-b border-neutral-900 pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A84C]" /> {selectedCountry}
              </h3>
              <span className="text-xs text-[#C9A84C] font-semibold tracking-wide">
                Region Pioneer Council
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#C9A84C]">{countryMembers.length}</span>
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider leading-none">Registered</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Leadership team for country */}
            <div>
              <h4 className="text-[10px] uppercase text-[#C9A84C] tracking-widest font-extrabold mb-2 underline">
                Ambassadors & Executive Leaders
              </h4>
              {leaders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {leaders.map((m) => (
                    <div key={m.id} className="bg-neutral-900 border border-[#C9A84C]/40 p-3 rounded-lg flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-full border border-[#C9A84C] bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden">
                        {m.photo ? (
                          <img src={getDirectDriveUrl(m.photo) || founderDefaultPhoto} alt={m.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-[#C9A84C]" />
                        )}
                      </div>
                      <div className="text-xs overflow-hidden">
                        <strong className="text-neutral-100 font-bold block truncate">{m.fullName}</strong>
                        <span className="text-[9px] text-[#C9A84C] font-semibold flex items-center gap-0.5 mt-0.5">
                          <Award className="w-3 h-3 shrink-0" />
                          {m.leadership}
                        </span>
                        <span className="text-[9px] text-neutral-400 block truncate mt-0.5">{m.school}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500 italic py-2">No regional executive leaders appointed yet. Submit a 'Leadership Application' to represent {selectedCountry}!</p>
              )}
            </div>

            {/* Normal registered members for country */}
            <div className="pt-2 border-t border-neutral-900">
              <h4 className="text-[10px] uppercase text-[#C9A84C] tracking-widest font-extrabold mb-2">
                Active Pioneers ({normalMembers.length})
              </h4>
              {normalMembers.length > 0 ? (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {normalMembers.map((m) => (
                    <div key={m.id} className="bg-neutral-900/50 hover:bg-neutral-900 p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 font-bold text-[#C9A84C] uppercase text-[10px]">
                          {m.fullName.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-neutral-100 font-bold block">{m.fullName}</strong>
                          <span className="text-[9.5px] text-neutral-400 block">{m.school} • {m.department}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-[9px] text-[#C9A84C] font-bold block">{m.id}</span>
                        <span className="text-[8px] bg-neutral-950 text-[#1a8a3f] px-1.5 py-0.5 rounded font-extrabold block mt-0.5 uppercase tracking-wide">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic py-2">No general student pioneers listed under {selectedCountry} yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
