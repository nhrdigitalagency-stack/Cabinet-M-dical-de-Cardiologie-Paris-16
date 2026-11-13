import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Phone,
  Mail,
  Compass,
  Search,
  Building2,
} from 'lucide-react';
import { ClinicSiteData, Language, LandmarkItem } from '../data/initialClinicData';

interface BonaprisoMapProps {
  siteData: ClinicSiteData;
  lang: Language;
  onBookClick: () => void;
}

export const BonaprisoMap: React.FC<BonaprisoMapProps> = ({ siteData, lang, onBookClick }) => {
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('ecole-publique-bonapriso');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const filteredLandmarks = siteData.landmarks.filter(
    (l) =>
      l.name[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLandmark: LandmarkItem =
    siteData.landmarks.find((l) => l.id === selectedLandmarkId) || siteData.landmarks[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Column: Interactive Schematic Vector Plan of Bonapriso (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-7 lg:p-8 section-hover-border flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#DC141C] uppercase">
                {lang === 'fr' ? 'PLAN D’ACCÈS OFFICIEL · BONAPRISO' : 'OFFICIAL ACCESS MAP · BONAPRISO'}
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-[#061B49] mt-1">
                {lang === 'fr'
                  ? 'Repères Géographiques vers le Cabinet'
                  : 'Geographical Landmarks to the Clinic'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLandmarkId('ecole-publique-bonapriso')}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#EBF3FC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{lang === 'fr' ? 'Centrer sur le Cabinet' : 'Center on Clinic'}</span>
            </button>
          </div>

          {/* Interactive Vector Road & Landmark Map — Responsive & Non-Overlapping */}
          <div className="relative w-full h-[340px] sm:h-[430px] rounded-2xl bg-gradient-to-br from-[#F0F7FF] via-[#E6F0FF] to-[#FDECEE] border border-[#0052CC]/15 overflow-hidden select-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0 20 H100 M0 40 H100 M0 60 H100 M0 80 H100 M20 0 V100 M40 0 V100 M60 0 V100 M80 0 V100"
                stroke="#0052CC"
                strokeOpacity="0.06"
                strokeWidth="0.4"
              />
              <path
                d="M12 24 L45 28 L78 20"
                stroke="#CBD5E1"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M30 10 L30 78"
                stroke="#CBD5E1"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M20 66 L48 74 L84 82"
                stroke="#CBD5E1"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M45 28 L52 46 L48 74"
                stroke="#0052CC"
                strokeOpacity="0.35"
                strokeWidth="2.6"
                strokeDasharray="2 1.5"
                fill="none"
              />
              <path d="M82 44 L52 46" stroke="#CBD5E1" strokeWidth="2.4" fill="none" />

              {selectedLandmark && (
                <line
                  x1={selectedLandmark.coordinates.x}
                  y1={selectedLandmark.coordinates.y}
                  x2={52}
                  y2={46}
                  stroke="#DC141C"
                  strokeWidth="1.4"
                  strokeDasharray="2 1"
                />
              )}
            </svg>

            {/* Landmark Pins — Compact numbered pins on mobile unless selected so text is never overlapped */}
            {siteData.landmarks.map((lm, index) => {
              const isSelected = lm.id === selectedLandmarkId;
              const isClinicArea = lm.isHighlight;
              return (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => setSelectedLandmarkId(lm.id)}
                  style={{ left: `${lm.coordinates.x}%`, top: `${lm.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform duration-150 cursor-pointer ${
                    isSelected ? 'z-30 scale-105' : 'z-20 hover:scale-105'
                  }`}
                  title={lm.name[lang]}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold shadow-sm transition-colors ${
                      isClinicArea
                        ? 'bg-[#DC141C] text-white ring-4 ring-[#DC141C]/35'
                        : isSelected
                          ? 'bg-[#0052CC] text-white ring-2 ring-[#DC141C]/30'
                          : 'bg-white/95 text-[#061B49] border border-[#0052CC]/25 hover:border-[#DC141C]'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    {/* On mobile, show full name for selected/clinic pin and number badge for others to prevent overlap */}
                    <span className={isSelected || isClinicArea ? 'inline font-bold' : 'hidden md:inline'}>
                      {lm.name[lang]}
                    </span>
                    {!isSelected && !isClinicArea && (
                      <span className="md:hidden font-mono font-bold">{index + 1}</span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Central Cabinet Marker Badge */}
            <div
              style={{ left: '52%', top: '37%' }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#061B49] text-white text-[10px] sm:text-xs font-bold shadow-lg border border-[#DC141C] flex items-center gap-1.5 whitespace-nowrap">
                <Building2 className="w-3.5 h-3.5 text-[#DC141C] shrink-0" />
                <span>CABINET PARIS 16 · DR TCHAM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Landmark Route Guidance Bar — Full Visible Text */}
        <div className="mt-5 p-4 rounded-2xl bg-[#F4F8FD] border border-[#0052CC]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0052CC]/10 text-[#0052CC] flex items-center justify-center shrink-0 mt-0.5">
              <Navigation className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500">
                {lang === 'fr' ? 'Repère sélectionné sur le plan' : 'Selected landmark on the map'} ·{' '}
                <span className="text-[#DC141C] font-semibold">{selectedLandmark.zone}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-[#061B49] mt-0.5 break-words">
                {selectedLandmark.name[lang]}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === 'fr'
                  ? 'Destination : Fin rue pavée de l’École publique de Bonapriso, groupe 1 (à proximité de l’École publique de Bonapriso).'
                  : 'Destination: End of paved street of Bonapriso Public School, Group 1 (near Bonapriso Public School).'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBookClick}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#DC141C] hover:bg-[#b81017] text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer text-center"
          >
            {lang === 'fr' ? 'Prendre RDV' : 'Book Visit'}
          </button>
        </div>
      </div>

      {/* Right Column: All 13 Landmarks Directory & Direct Copy Contacts (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-7 section-hover-border">
          <p className="text-xs font-bold tracking-wider text-[#0052CC] uppercase">
            {lang === 'fr' ? 'COORDONNÉES DIRECTES & ADRESSE' : 'DIRECT CONTACTS & ADDRESS'}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-[#061B49] mt-1">
            {siteData.clinicName[lang]}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {siteData.addressFull[lang]}
          </p>

          <div className="mt-5 space-y-3">
            {/* Phone Copy Row — Responsive & Never Truncated */}
            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#0052CC] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">
                    {lang === 'fr' ? 'Téléphone / Rendez-vous' : 'Phone / Appointments'}
                  </div>
                  <a
                    href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                    className="text-sm sm:text-base font-bold text-[#061B49] hover:text-[#0052CC] font-mono tabular-nums break-words block"
                  >
                    {siteData.phone}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(siteData.phone, 'phone')}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#DC141C] text-xs font-semibold text-[#061B49] flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                {copiedField === 'phone' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#DC141C]" />
                    <span className="text-[#DC141C]">{lang === 'fr' ? 'Copié !' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'fr' ? 'Copier le numéro' : 'Copy number'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Email Copy Row — Responsive & Never Truncated */}
            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#DC141C] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500">
                    {lang === 'fr' ? 'Adresse e-mail officielle' : 'Official Email Address'}
                  </div>
                  <a
                    href={`mailto:${siteData.email}`}
                    className="text-xs sm:text-sm font-bold text-[#061B49] hover:text-[#DC141C] break-all block"
                  >
                    {siteData.email}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(siteData.email, 'email')}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#DC141C] text-xs font-semibold text-[#061B49] flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#DC141C]" />
                    <span className="text-[#DC141C]">{lang === 'fr' ? 'Copié !' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'fr' ? "Copier l'e-mail" : 'Copy email'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* All 13 Landmarks Checklist — Fully Visible Without Clipping or Hidden Scrollbars */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 section-hover-border flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-sm sm:text-base font-bold text-[#061B49]">
              {lang === 'fr'
                ? 'Les 13 Repères Géographiques du Plan'
                : 'All 13 Geographical Landmarks on Map'}
            </h4>
            <span className="text-xs text-slate-500 font-mono tabular-nums shrink-0">
              {filteredLandmarks.length}/{siteData.landmarks.length}
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === 'fr'
                  ? 'Rechercher un carrefour ou repère (ex: Marbella, Njo-njo...)'
                  : 'Search landmark (e.g. Marbella, Njo-njo...)'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4F8FD] border border-slate-200 text-xs text-[#061B49] focus:outline-none focus:border-[#0052CC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLandmarks.map((lm, idx) => {
              const active = lm.id === selectedLandmarkId;
              return (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => setSelectedLandmarkId(lm.id)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#0052CC] text-white shadow-sm'
                      : 'bg-[#F4F8FD] text-[#061B49] hover:bg-[#E6F0FF]'
                  }`}
                >
                  <MapPin
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      active ? 'text-white' : 'text-[#DC141C]'
                    }`}
                  />
                  <span className="break-words leading-snug">
                    <strong className="font-mono text-[10px] opacity-75 mr-1">
                      {idx + 1}.
                    </strong>
                    {lm.name[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
