import React, { useEffect, useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Stethoscope,
  Activity,
  HeartPulse,
  Moon,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  Globe,
  Menu,
  X,
  Lock,
  Sparkles,
  UserCheck,
  Award,
  PhoneCall,
  Cpu,
  Zap,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Info,
  Send,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INITIAL_CLINIC_DATA,
  INITIAL_TESTIMONIALS,
  ClinicSiteData,
  Language,
  TestimonialItem,
} from './data/initialClinicData';
import { ExplorationIllustration, EQUIPMENT_IMAGES } from './components/MedicalIllustrations';
import { BonaprisoMap } from './components/BonaprisoMap';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AppointmentModal } from './components/AppointmentModal';
import {
  ClinicalDetailModal,
  SelectedClinicalItem,
} from './components/ClinicalDetailModal';
import { LogoSplashLoader } from './components/LogoSplashLoader';
import { CardiologyInsightsSection } from './components/CardiologyInsightsSection';

type PageView =
  | 'home'
  | 'about'
  | 'explorations'
  | 'pathologies'
  | 'insights'
  | 'testimonials'
  | 'contact';

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [activePage, setActivePage] = useState<PageView>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  const [siteData, setSiteData] = useState<ClinicSiteData>(INITIAL_CLINIC_DATA);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);

  // Interactive states for new sections
  const [expandedPathologyId, setExpandedPathologyId] = useState<string | null>('hta');
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>('ecg');
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  // Inline Strategic Appointment Section state (Section 9)
  const [inlineName, setInlineName] = useState('');
  const [inlinePhone, setInlinePhone] = useState('');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineDate, setInlineDate] = useState('');
  const [inlineTime, setInlineTime] = useState('Matin (08h00 - 12h30)');
  const [inlineService, setInlineService] = useState(
    'Bilan Cardiologique Complet (Consultation + ECG + Écho sur place)'
  );
  const [inlineNotes, setInlineNotes] = useState('');
  const [inlineUrgent, setInlineUrgent] = useState(false);
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Modals state
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [preselectedSubject, setPreselectedSubject] = useState<string>('');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedClinicalItem, setSelectedClinicalItem] = useState<SelectedClinicalItem>(null);
  const [copiedFooterField, setCopiedFooterField] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sec = params.get('section') as PageView | null;
    if (
      sec &&
      [
        'home',
        'about',
        'explorations',
        'pathologies',
        'insights',
        'testimonials',
        'contact',
      ].includes(sec)
    ) {
      setActivePage(sec);
    }

    let mounted = true;
    fetch('/api/site-data')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data) return;
        if (data.siteData) setSiteData(data.siteData);
        if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch((err) => {
        console.error('Error fetching initial site data:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Dynamic Local & National SEO (Douala, Bonapriso & Cameroun) per Page & Language
  useEffect(() => {
    const seoTitles: Record<PageView, { fr: string; en: string }> = {
      home: {
        fr: 'Cardiologue à Douala (Bonapriso) & Cameroun | Cabinet Médical de Cardiologie Paris 16 — Dr Annick TCHAM',
        en: 'Cardiologist in Douala (Bonapriso) & Cameroon | Paris 16 Cardiology Clinic — Dr Annick TCHAM',
      },
      about: {
        fr: 'Dr Annick TCHAM · Cardiologue à Douala Bonapriso, Cameroun | Cabinet Cardiologie Paris 16',
        en: 'Dr Annick TCHAM · Cardiologist in Douala Bonapriso, Cameroon | Paris 16 Cardiology',
      },
      pathologies: {
        fr: 'Spécialités Cardiologiques à Douala & Cameroun : HTA, Arythmie, AVC, Apnée | Dr Annick TCHAM',
        en: 'Cardiology Specialties in Douala & Cameroon: Hypertension, Arrhythmia, Stroke, Sleep Apnea',
      },
      explorations: {
        fr: 'ECG, Échocardiographie Doppler, Holter, MAPA & Apnée du Sommeil à Douala (Bonapriso) | Cameroun',
        en: 'ECG, Doppler Echocardiography, Holter, ABPM & Sleep Apnea in Douala (Bonapriso) | Cameroon',
      },
      insights: {
        fr: 'Cardiology Insights · Blog Santé du Cœur, HTA, Apnée du Sommeil & Prévention à Douala & Cameroun | Dr Annick TCHAM',
        en: 'Cardiology Insights · Heart Health Tips, Hypertension, Sleep Apnea & Prevention Blog in Douala & Cameroon | Dr Annick TCHAM',
      },
      testimonials: {
        fr: 'Avis Patients Cardiologue Douala & Cameroun | Cabinet Médical de Cardiologie Paris 16',
        en: 'Patient Reviews Cardiologist Douala & Cameroon | Paris 16 Cardiology Clinic',
      },
      contact: {
        fr: 'Plan d’Accès Bonapriso Douala & Rendez-vous Cardiologue Cameroun (+237 693 44 78 10)',
        en: 'Bonapriso Douala Map & Cardiologist Appointment Cameroon (+237 693 44 78 10)',
      },
    };

    document.title = seoTitles[activePage][lang];
    document.documentElement.lang = lang === 'fr' ? 'fr-CM' : 'en';
  }, [activePage, lang]);

  const openBookingWithSubject = (subject = '') => {
    setPreselectedSubject(subject);
    setAppointmentModalOpen(true);
  };

  const navigateToPage = (page: PageView) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFooterField(key);
    setTimeout(() => setCopiedFooterField(null), 2200);
  };

  const handleInlineAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setInlineSuccess(null);

    if (!inlineName.trim() || !inlinePhone.trim() || !inlineDate) {
      setInlineError(
        lang === 'fr'
          ? 'Veuillez renseigner votre nom, votre téléphone et la date souhaitée.'
          : 'Please enter your name, phone number, and preferred date.'
      );
      return;
    }

    setInlineSubmitting(true);
    try {
      const resp = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: inlineName.trim(),
          phone: inlinePhone.trim(),
          email: inlineEmail.trim(),
          preferredDate: inlineDate,
          preferredTime: inlineTime,
          reason: inlineUrgent ? 'Consultation Urgente' : 'Consultation Planifiée',
          explorationOrPathology: inlineService,
          notes: inlineNotes.trim(),
          isUrgent: inlineUrgent,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setInlineError(data.error || 'Erreur');
      } else {
        setInlineSuccess(
          lang === 'fr'
            ? `Rendez-vous enregistré pour ${inlineName} le ${inlineDate} ! Le secrétariat du ${siteData.doctorName} vous contactera rapidement.`
            : `Appointment registered for ${inlineName} on ${inlineDate}! ${siteData.doctorName}'s office will contact you shortly.`
        );
        setInlineName('');
        setInlinePhone('');
        setInlineEmail('');
        setInlineNotes('');
      }
    } catch {
      setInlineError(
        lang === 'fr'
          ? 'Erreur réseau. Appelez directement le +237 693 44 78 10.'
          : 'Network error. Call +237 693 44 78 10 directly.'
      );
    } finally {
      setInlineSubmitting(false);
    }
  };

  const whatsappUrgenceHref = `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
    lang === 'fr'
      ? `URGENCE CARDIOLOGIQUE — Bonjour ${siteData.doctorName} (${siteData.clinicName.fr}), j'ai besoin d'une prise en charge ou d'un rendez-vous rapide.`
      : `CARDIAC EMERGENCY — Hello ${siteData.doctorName} (${siteData.clinicName.en}), I need urgent cardiological care or a fast appointment.`
  )}`;

  const navItems: Array<{ id: PageView; label: { fr: string; en: string } }> = [
    { id: 'home', label: { fr: 'Accueil', en: 'Home' } },
    { id: 'about', label: { fr: 'Dr TCHAM', en: 'Dr TCHAM' } },
    { id: 'pathologies', label: { fr: 'Spécialités', en: 'Specialties' } },
    { id: 'explorations', label: { fr: 'Explorations', en: 'Explorations' } },
    { id: 'insights', label: { fr: 'Cardiology Insights', en: 'Cardiology Insights' } },
    { id: 'testimonials', label: { fr: 'Témoignages', en: 'Testimonials' } },
    { id: 'contact', label: { fr: 'Plan & Contact', en: 'Map & Contact' } },
  ];

  const getParticularityIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart-handshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'cpu':
        return <Cpu className="w-5 h-5" />;
      case 'phone-call':
        return <PhoneCall className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  // Word-by-word Text Mask Reveal helper for Doctor Biography (Section 2)
  const bioWords = siteData.synthesisParagraph1[lang].split(' ');

  const handleSplashComplete = () => {
    setIsSplashLoading(false);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 5-SECOND LOGO SPLASH SCREEN WITH IMMERSIVE EXIT PORTAL */}
      <LogoSplashLoader
        isVisible={isSplashLoading}
        siteData={siteData}
        lang={lang}
        onComplete={handleSplashComplete}
      />

      {/* IMMERSIVE ENTRY CONTAINER — Zooms & sharpens into focus as the 5s logo splash completes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
        animate={{
          opacity: isSplashLoading ? 0 : 1,
          scale: isSplashLoading ? 0.95 : 1,
          filter: isSplashLoading ? 'blur(10px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen flex flex-col bg-[#F4F8FD] text-[#061B49]"
      >
        {/* FLOATING TRANSPARENT ROUNDED HEADER — Fully Responsive across Mobile, Tablet & Desktop */}
        <div className="sticky top-2 sm:top-3 z-40 px-2.5 sm:px-6 lg:px-8">
          <header className="max-w-7xl mx-auto bg-white/82 backdrop-blur-xl rounded-2xl lg:rounded-full border border-white/80 shadow-[0_12px_36px_-10px_rgba(6,27,73,0.16)] px-3 sm:px-5 lg:px-7 py-2 sm:py-0 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 transition-all">
            {/* Zone 1: Brand Wordmark — Never truncates or hides clinic name */}
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="flex items-center gap-2 sm:gap-3 text-left min-w-0 shrink-0 cursor-pointer group"
            >
              <img
                src={siteData.logoUrl}
                alt={siteData.clinicName[lang]}
                referrerPolicy="no-referrer"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl bg-white p-1 border border-[#0052CC]/20 group-hover:border-[#DC141C] transition-colors shrink-0"
              />
              <div className="leading-tight">
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0052CC]">
                  Cabinet Médical
                </span>
                <span className="block text-xs sm:text-base font-extrabold tracking-tight text-[#061B49]">
                  Cardiologie <span className="text-[#DC141C]">Paris 16</span>
                </span>
              </div>
            </button>

          {/* Zone 2: Clean Single-Line Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-semibold text-[#061B49]/85">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateToPage(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer nav-link-underline ${
                    isActive
                      ? 'text-[#0052CC] font-bold nav-link-active'
                      : 'hover:text-[#0052CC]'
                  }`}
                >
                  {item.label[lang]}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Switch + Primary CTA + Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center bg-[#F4F8FD]/95 p-0.5 sm:p-1 rounded-full border border-slate-200/80">
              <Globe className="w-3.5 h-3.5 text-[#0052CC] ml-1.5 mr-1 hidden md:block" />
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-colors cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-[#061B49] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#061B49]'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#061B49] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#061B49]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => openBookingWithSubject()}
              className="hidden sm:inline-flex items-center justify-center px-4 md:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0052CC] to-[#DC141C] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {lang === 'fr' ? 'Prendre RDV' : 'Book Visit'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#F4F8FD] hover:bg-[#EBF3FC] text-[#061B49] border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#DC141C]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Responsive Animated Mobile & Tablet Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="lg:hidden mt-2 max-w-7xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-4 space-y-2.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateToPage(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      activePage === item.id
                        ? 'bg-[#EBF3FC] text-[#0052CC]'
                        : 'text-[#061B49] hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label[lang]}</span>
                    <ArrowRight className="w-4 h-4 text-[#DC141C]" />
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingWithSubject();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#DC141C] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {lang === 'fr' ? 'Prendre Rendez-vous Maintenant' : 'Book Appointment Now'}
                  </span>
                </button>

                <div className="flex items-center justify-between sm:justify-end gap-3 px-2 py-1 text-xs text-slate-600">
                  <a
                    href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                    className="font-mono font-bold text-[#0052CC] flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#DC141C]" />
                    <span>{siteData.phone}</span>
                  </a>
                  <span className="font-semibold text-[#061B49]">· Bonapriso</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN PAGE CONTENT */}
      <main className="flex-1">
        {/* SUBPAGE HEADER BANNER (When viewing dedicated subpages) */}
        {activePage !== 'home' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            <div className="rounded-3xl bg-gradient-to-r from-[#061B49] via-[#0052CC] to-[#DC141C] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-200">
                    <span>{siteData.clinicName[lang]}</span>
                    <span>·</span>
                    <span>{siteData.doctorName}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
                    {activePage === 'about' &&
                      (lang === 'fr'
                        ? 'Présentation du Dr Annick TCHAM & du Cabinet'
                        : 'Meet Dr Annick TCHAM & Our Practice')}
                    {activePage === 'explorations' &&
                      (lang === 'fr'
                        ? 'Technologies & 8 Explorations Cardiologiques'
                        : 'Medical Technologies & 8 Cardiac Explorations')}
                    {activePage === 'pathologies' &&
                      (lang === 'fr'
                        ? 'Spécialités Médicales & 8 Pathologies Prises en Charge'
                        : 'Medical Specialties & 8 Conditions Treated')}
                    {activePage === 'insights' &&
                      (lang === 'fr'
                        ? 'Cardiology Insights · Blog & Conseils Santé du Cœur'
                        : 'Cardiology Insights · Heart Health Tips & Clinical Guides')}
                    {activePage === 'testimonials' &&
                      (lang === 'fr'
                        ? 'Témoignages Patients en Direct'
                        : 'Live Patient Testimonials')}
                    {activePage === 'contact' &&
                      (lang === 'fr'
                        ? 'Localisation, Plan d’Accès Bonapriso & Rendez-vous'
                        : 'Location, Bonapriso Map & Appointments')}
                  </h1>
                  <p className="text-sm sm:text-base text-white/85 mt-2 max-w-2xl">
                    {siteData.sloganPrimary[lang]} {siteData.sloganSecondary[lang]}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigateToPage('home')}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {lang === 'fr' ? '← Accueil' : '← Home'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openBookingWithSubject()}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[#061B49] text-xs font-extrabold shadow-md transition-colors cursor-pointer"
                  >
                    {lang === 'fr' ? 'Prendre RDV' : 'Book Visit'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 1: HERO SECTION WITH ZOOMING PORTRAIT BACKGROUND & DARK SCRIM
           ===================================================================== */}
        {activePage === 'home' && (
          <section className="relative mx-3 sm:mx-6 lg:mx-8 mt-4 rounded-3xl overflow-hidden min-h-[620px] lg:min-h-[680px] flex items-center shadow-2xl border border-[#0052CC]/25">
            {/* Background Image with Continuous Zoom Animation (Ken Burns) */}
            <div className="absolute inset-0 overflow-hidden z-0">
              <img
                src={siteData.doctorPortraitUrl}
                alt={`${siteData.doctorName} - ${siteData.clinicName[lang]}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center sm:object-[center_20%] animate-hero-zoom"
              />
              {/* Semi-transparent black overlay calibrated so background portrait remains clearly visible */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061B49]/85 via-[#061B49]/55 to-black/35" />
            </div>

            {/* Foreground Hero Content — Extra bottom padding so bottom wave never overlaps text */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-12 pb-24 sm:py-20 lg:py-24 relative z-10 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column (7 cols): Slogans, Headline, Synthesis & Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="lg:col-span-7 space-y-5 sm:space-y-6 text-white"
                >
                  <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-sky-300">
                    <span>{siteData.sloganPrimary[lang]}</span>
                    <span className="text-[#DC141C]">·</span>
                    <span className="text-white">{siteData.doctorName}</span>
                  </div>

                  <h1
                    className="text-2xl sm:text-4xl lg:text-[52px] font-extrabold text-white leading-[1.14] tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    {lang === 'fr' ? (
                      <>
                        Cabinet Médical de Cardiologie{' '}
                        <span className="text-[#FF4D58]">Paris 16</span>
                      </>
                    ) : (
                      <>
                        Cardiology Medical Practice{' '}
                        <span className="text-[#FF4D58]">Paris 16</span>
                      </>
                    )}
                  </h1>

                  {/* ECG Red Pulse Line Inspired by the Official Logo */}
                  <div className="w-48 sm:w-72">
                    <svg viewBox="0 0 280 28" className="w-full h-7" fill="none">
                      <path
                        d="M0 14 H95 L108 4 L120 24 L134 2 L148 26 L160 10 L170 14 H280"
                        stroke="#DC141C"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p className="text-base sm:text-xl font-semibold text-sky-100 italic">
                    “{siteData.sloganSecondary[lang]}”
                  </p>

                  <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl">
                    {siteData.synthesisParagraph1[lang]} {siteData.synthesisParagraph2[lang]}
                  </p>

                  {/* Primary & Secondary Action Buttons — Full-width on mobile, inline on sm+ */}
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => openBookingWithSubject()}
                      className="w-full sm:w-auto px-6 py-4 rounded-full bg-gradient-to-r from-[#DC141C] to-[#0052CC] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer animate-urgent-pulse"
                    >
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>
                        {lang === 'fr' ? 'Prendre Rendez-vous' : 'Book an Appointment'}
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToPage('explorations')}
                      className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/35 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4 text-sky-300 shrink-0" />
                      <span>
                        {lang === 'fr'
                          ? '8 Explorations Sur Place'
                          : '8 On-Site Explorations'}
                      </span>
                    </button>
                  </div>

                  {/* Direct Phone & Address Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/95">
                    <a
                      href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-2 font-mono font-bold text-white hover:text-sky-300"
                    >
                      <PhoneCall className="w-4 h-4 text-[#FF4D58] shrink-0" />
                      <span>{siteData.phone}</span>
                    </a>
                    <span className="hidden sm:inline text-white/40">|</span>
                    <div className="flex items-start sm:items-center gap-2">
                      <MapPin className="w-4 h-4 text-sky-300 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="break-words">{siteData.addressShort[lang]}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column (5 cols): Glassmorphic Logo & Quick Highlights Over the Zooming Background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="lg:col-span-5 flex flex-col gap-4"
                >
                  <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/30 text-white shadow-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={siteData.logoUrl}
                        alt="Logo Officiel Cabinet Paris 16"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl bg-white p-2 shadow-md shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                          {siteData.specialty[lang]}
                        </div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-white">
                          {siteData.doctorName}
                        </h2>
                        <p className="text-xs text-white/85 mt-0.5 leading-snug">
                          {lang === 'fr'
                            ? 'Bilan complet sur place le même jour à Bonapriso'
                            : 'Complete same-day on-site cardiac workup in Bonapriso'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                      {[
                        {
                          title: { fr: 'Accueil & Écoute', en: 'Active Listening' },
                          sub: { fr: 'Sans précipitation', en: 'Unhurried care' },
                        },
                        {
                          title: { fr: 'Bilan Même Jour', en: 'Same-Day Workup' },
                          sub: { fr: 'ECG, Écho, Holter, MAPA', en: 'ECG, Echo, Holter, ABPM' },
                        },
                        {
                          title: { fr: 'Apnée du Sommeil', en: 'Sleep Apnea' },
                          sub: { fr: 'Polygraphie nocturne', en: 'Nocturnal polygraphy' },
                        },
                        {
                          title: { fr: 'Suivi Continu', en: 'Phone Follow-Up' },
                          sub: { fr: 'Rappels & contrôle', en: 'Checkup reminders' },
                        },
                      ].map((pill, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-black/35 border border-white/15 backdrop-blur-xs"
                        >
                          <div className="text-xs font-bold text-white">{pill.title[lang]}</div>
                          <div className="text-[11px] text-sky-200 mt-0.5">{pill.sub[lang]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Animated Undulating Wave Divider at Bottom of Hero */}
            <div className="absolute bottom-0 inset-x-0 overflow-hidden leading-none pointer-events-none z-10">
              <svg
                viewBox="0 0 1440 70"
                preserveAspectRatio="none"
                className="w-[105%] h-10 sm:h-14 animate-wave-svg"
              >
                <path
                  d="M0,32 C320,72 640,0 960,36 C1200,64 1360,16 1440,32 L1440,70 L0,70 Z"
                  fill="#F4F8FD"
                />
              </svg>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 2: PRÉSENTATION DU MÉDECIN (DR ANNICK TCHAM)
            - Image Clip Reveal, Scroll Parallax, Word-by-Word Text Mask Reveal, Signature Reveal
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'about') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="bg-white rounded-3xl p-5 sm:p-10 lg:p-12 section-hover-border">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Doctor Portrait with Clip Reveal & Dedicated Caption Footer (Never obscures portrait) */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-5"
                >
                  <div className="rounded-3xl overflow-hidden border-2 border-[#0052CC]/20 shadow-xl bg-[#061B49] group">
                    <div className="overflow-hidden h-[340px] sm:h-[410px]">
                      <img
                        src={siteData.doctorPortraitUrl}
                        alt={siteData.doctorName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="bg-gradient-to-r from-[#061B49] via-[#092563] to-[#0052CC] p-5 text-white border-t border-white/15">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block">
                        {siteData.specialty[lang]} · Bonapriso, Douala
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5">
                        {siteData.doctorName}
                      </h3>
                      <p className="text-xs text-white/85 mt-1">{siteData.clinicName[lang]}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Word-by-Word Presentation, 4 Pillars & Progressive Signature Draw (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                      {lang === 'fr'
                        ? 'SECTION 02 · PRÉSENTATION DU MÉDECIN & ENGAGEMENT'
                        : 'SECTION 02 · PHYSICIAN PROFILE & COMMITMENT'}
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061B49] mt-1 tracking-tight">
                      {siteData.doctorName},{' '}
                      <span className="text-[#0052CC]">{siteData.specialty[lang]}</span>
                    </h2>
                  </div>

                  {/* Word-by-Word Text Mask Reveal — Always 100% visible */}
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {bioWords.map((word, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.015, 0.6) }}
                        className="inline-block mr-1.5"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </p>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {siteData.synthesisParagraph2[lang]}
                  </p>

                  {/* The 4 Differentiators ("Notre Particularité") */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {siteData.particularities.map((part, i) => (
                      <motion.div
                        key={part.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.08 }}
                        className="p-4 rounded-2xl bg-[#F4F8FD] wave-hover-card"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0052CC] to-[#061B49] text-white flex items-center justify-center shrink-0">
                            {getParticularityIcon(part.iconName)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#061B49]">
                              {part.title[lang]}
                            </h4>
                            <p className="text-[11px] font-semibold text-[#DC141C]">
                              {part.subtitle[lang]}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {part.description[lang]}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progressive SVG Signature Reveal + CTA */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {lang === 'fr' ? 'Signature Médicale Officielle' : 'Official Medical Signature'}
                      </div>
                      <svg viewBox="0 0 260 56" className="w-52 h-12 mt-1" fill="none">
                        <path
                          d="M12 40 C28 14, 44 12, 52 38 C58 22, 74 18, 86 34 C98 46, 118 14, 134 26 C148 36, 162 20, 184 28 C204 34, 225 18, 248 24"
                          stroke="#0052CC"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          className="animate-signature-draw"
                        />
                        <path
                          d="M42 46 L210 42"
                          stroke="#DC141C"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <text
                          x="14"
                          y="52"
                          fill="#061B49"
                          fontSize="10"
                          fontWeight="700"
                          fontStyle="italic"
                        >
                          Dr Annick TCHAM · Cardiologue Paris 16
                        </text>
                      </svg>
                    </div>

                    <button
                      type="button"
                      onClick={() => openBookingWithSubject()}
                      className="px-6 py-3.5 rounded-full bg-[#061B49] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                    >
                      <span>
                        {lang === 'fr'
                          ? 'Prendre RDV avec le Dr TCHAM'
                          : 'Book with Dr TCHAM'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#FF4D58]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 3: SPÉCIALITÉS MÉDICALES & 8 PATHOLOGIES PRISES EN CHARGE
            - Stagger Cards Reveal, 3D Card Hover, Icon Draw, Inline Card Expansion
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'pathologies') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                  {lang === 'fr'
                    ? 'SECTION 03 · SPÉCIALITÉS MÉDICALES & PATHOLOGIES'
                    : 'SECTION 03 · MEDICAL SPECIALTIES & CONDITIONS'}
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061B49] mt-1 tracking-tight">
                  {lang === 'fr' ? (
                    <>
                      Les 8 <span className="text-[#0052CC]">Pathologies Cardiovasculaires</span>{' '}
                      Prises en Charge
                    </>
                  ) : (
                    <>
                      The 8 <span className="text-[#0052CC]">Cardiovascular Conditions</span> We
                      Treat
                    </>
                  )}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl">
                  {lang === 'fr'
                    ? 'Cliquez sur une pathologie pour agrandir la carte et consulter les symptômes, la prévention et le protocole de suivi.'
                    : 'Click any condition card to expand it and inspect symptoms, prevention, and clinical follow-up.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteData.pathologies.map((pat, idx) => {
                const isExpanded = expandedPathologyId === pat.id;
                return (
                  <motion.div
                    key={pat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className={`bg-white rounded-3xl p-6 card-hover-border flex flex-col justify-between transition-all ${
                      isExpanded
                        ? 'md:col-span-2 ring-2 ring-[#0052CC] bg-gradient-to-br from-white to-[#F0F7FF]'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#061B49] to-[#0052CC] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                          {pat.number}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPathologyId(isExpanded ? null : pat.id)
                          }
                          className="px-3 py-1 rounded-full bg-[#F4F8FD] hover:bg-[#EBF3FC] text-[#0052CC] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? (lang === 'fr' ? 'Réduire' : 'Collapse') : (lang === 'fr' ? 'Développer' : 'Expand')}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-[#061B49]">
                        {pat.title[lang]}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {pat.shortDesc[lang]}
                      </p>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-slate-200/80 space-y-3"
                        >
                          <p className="text-xs sm:text-sm text-[#061B49] leading-relaxed">
                            {pat.details[lang]}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200">
                              <div className="text-[11px] font-bold uppercase text-[#DC141C]">
                                {lang === 'fr' ? 'Symptômes fréquents' : 'Common Symptoms'}
                              </div>
                              <p className="text-xs text-slate-700 mt-1">{pat.symptoms[lang]}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white border border-slate-200">
                              <div className="text-[11px] font-bold uppercase text-[#0052CC]">
                                {lang === 'fr' ? 'Prévention & Suivi' : 'Prevention & Care'}
                              </div>
                              <p className="text-xs text-slate-700 mt-1">{pat.prevention[lang]}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedClinicalItem({ kind: 'pathology', item: pat })
                        }
                        className="text-xs font-bold text-[#0052CC] hover:text-[#DC141C] transition-colors cursor-pointer"
                      >
                        {lang === 'fr' ? 'Fiche clinique complète' : 'Full clinical sheet'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openBookingWithSubject(pat.title[lang])}
                        className="px-3.5 py-2 rounded-full bg-[#DC141C] hover:bg-[#b81017] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>{lang === 'fr' ? 'Prendre RDV' : 'Book'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 4: PARCOURS DE SOINS RASSURANT (ANIMATED TIMELINE)
            - Animated Timeline, Step Reveal, Progress Line, Number Counter
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'about') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-gradient-to-br from-[#061B49] via-[#092563] to-[#0052CC] rounded-3xl p-7 sm:p-12 text-white shadow-xl relative overflow-hidden">
              <div className="max-w-2xl mb-10">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  {lang === 'fr'
                    ? 'SECTION 04 · PARCOURS DE SOINS DU PATIENT'
                    : 'SECTION 04 · PATIENT CARE JOURNEY'}
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold mt-1 tracking-tight">
                  {lang === 'fr'
                    ? 'Votre Parcours Cardiologique en 4 Étapes Simples'
                    : 'Your Cardiology Care Journey in 4 Clear Steps'}
                </h2>
                <p className="text-xs sm:text-sm text-sky-100 mt-2">
                  {lang === 'fr'
                    ? 'Tout est organisé au Cabinet Médical de Cardiologie Paris 16 pour vous éviter les déplacements multiples et vous offrir un diagnostic complet le jour même.'
                    : 'Everything at Paris 16 Cardiology Medical Practice is designed to spare you multiple trips and provide a complete same-day diagnosis.'}
                </p>
              </div>

              {/* Animated Progress Line & 4 Steps */}
              <div className="relative">
                <div className="hidden lg:block absolute top-8 left-10 right-10 h-1 bg-white/15 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#DC141C] via-sky-400 to-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {[
                    {
                      step: '01',
                      title: {
                        fr: 'Accueil & Écoute',
                        en: 'Welcome & Listening',
                      },
                      desc: {
                        fr: 'On écoute votre histoire et vos symptômes sans précipitation dans un cadre apaisant.',
                        en: 'We listen to your medical history and symptoms without rushing in a reassuring setting.',
                      },
                    },
                    {
                      step: '02',
                      title: {
                        fr: 'Explorations Sur Place',
                        en: 'On-Site Explorations',
                      },
                      desc: {
                        fr: 'ECG, Échocardiographie Doppler, Holter, MAPA ou Polygraphie réalisés le même jour sur place.',
                        en: 'ECG, Doppler Echocardiography, Holter, ABPM, or Polygraphy performed on-site the same day.',
                      },
                    },
                    {
                      step: '03',
                      title: {
                        fr: 'Explications Simples',
                        en: 'Plain-Language Diagnosis',
                      },
                      desc: {
                        fr: 'Compte-rendu immédiat expliqué en langage clair par le Dr Annick TCHAM.',
                        en: 'Immediate diagnostic report explained in plain, understandable language by Dr Annick TCHAM.',
                      },
                    },
                    {
                      step: '04',
                      title: {
                        fr: 'Suivi Téléphonique',
                        en: 'Continuous Follow-Up',
                      },
                      desc: {
                        fr: 'Après la consultation, suivi téléphonique, rappel de vos contrôles et accompagnement.',
                        en: 'After your visit, dedicated phone follow-up, checkup reminders, and ongoing care.',
                      },
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.12 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#DC141C] text-white font-mono font-extrabold text-base flex items-center justify-center shadow-lg mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-base font-extrabold text-white">
                        {item.title[lang]}
                      </h3>
                      <p className="text-xs text-sky-100 mt-2 leading-relaxed">
                        {item.desc[lang]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 5: TECHNOLOGIES & ÉQUIPEMENTS MÉDICAUX (8 EXPLORATIONS)
            - Image Zoom Reveal, Interactive Hotspots & Floating Labels, Sleep Apnea Banner
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'explorations') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                  {lang === 'fr'
                    ? 'SECTION 05 · TECHNOLOGIES & EXPLORATIONS CARDIOLOGIQUES'
                    : 'SECTION 05 · TECHNOLOGIES & CARDIAC EXPLORATIONS'}
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#061B49] mt-1 tracking-tight">
                  {lang === 'fr' ? (
                    <>
                      Plateau Technique &{' '}
                      <span className="text-[#0052CC]">8 Explorations Sur Place</span>
                    </>
                  ) : (
                    <>
                      Diagnostic Platform &{' '}
                      <span className="text-[#0052CC]">8 On-Site Explorations</span>
                    </>
                  )}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl">
                  {lang === 'fr'
                    ? 'Survolez ou cliquez sur les points interactifs (+) de chaque équipement pour afficher la durée, la préparation et la disponibilité le jour même.'
                    : 'Hover or click the interactive hotspots (+) on each unit to reveal duration, preparation, and same-day availability.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {siteData.explorations.map((exp, idx) => {
                const isHotspotOpen = activeHotspotId === exp.id;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden wave-hover-card flex flex-col justify-between group"
                  >
                    <div>
                      {/* Visual Equipment Slot with Interactive Hotspot & Floating Label */}
                      <div className="relative">
                        <ExplorationIllustration
                          type={exp.illustrationType}
                          className="w-full h-48"
                        />

                        {/* Floating Tech Label */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#061B49]/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold shadow-xs">
                          #{exp.number} · {exp.sameDay ? (lang === 'fr' ? 'Même Jour' : 'Same Day') : 'Sur RDV'}
                        </div>

                        {/* Interactive Hotspot Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspotId(isHotspotOpen ? null : exp.id);
                          }}
                          aria-expanded={isHotspotOpen}
                          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer ${
                            isHotspotOpen ? 'bg-[#0052CC] ring-2 ring-white' : 'bg-[#DC141C]'
                          }`}
                          title={lang === 'fr' ? 'Caractéristiques techniques' : 'Technical specs'}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <div
                          onClick={() =>
                            setSelectedClinicalItem({ kind: 'exploration', item: exp })
                          }
                          className="cursor-pointer"
                        >
                          <h3 className="text-base font-extrabold text-[#061B49] group-hover:text-[#0052CC] transition-colors">
                            {exp.title[lang]}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                            {exp.shortDesc[lang]}
                          </p>
                        </div>

                        {/* Expandable Technical Specs Box — Never overlaps image or clips text */}
                        {isHotspotOpen && (
                          <div className="bg-[#061B49] text-white p-3.5 rounded-2xl text-xs border border-[#0052CC]/40 space-y-1.5 shadow-sm">
                            <div className="font-bold text-sky-300 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#FF4D58] shrink-0" />
                              <span>{exp.duration[lang]}</span>
                            </div>
                            <p className="text-[11px] text-white/95 leading-relaxed">
                              {exp.preparation[lang]}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedClinicalItem({ kind: 'exploration', item: exp })
                        }
                        className="text-xs font-bold text-[#0052CC] hover:text-[#DC141C] transition-colors cursor-pointer"
                      >
                        {lang === 'fr' ? 'Détails & Préparation' : 'Details & Prep'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openBookingWithSubject(exp.title[lang])}
                        className="w-9 h-9 rounded-full bg-[#061B49] group-hover:bg-[#DC141C] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        aria-label="Réserver"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Featured Flyer Alert Banner: Dépistage de l'Apnée du Sommeil */}
            <div className="rounded-3xl bg-gradient-to-r from-[#061B49] via-[#0052CC] to-[#DC141C] p-6 sm:p-9 text-white shadow-xl section-hover-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
                  <Moon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-200">
                    {lang === 'fr'
                      ? 'DÉPISTAGE DE L’APNÉE DU SOMMEIL · POLYGRAPHIE VENTILATOIRE'
                      : 'SLEEP APNEA SCREENING · RESPIRATORY POLYGRAPHY'}
                  </p>
                  <h3 className="text-lg sm:text-2xl font-extrabold mt-1">
                    {siteData.sleepApneaBanner[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-3xl">
                    {siteData.sleepApneaSubtext[lang]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  openBookingWithSubject(
                    lang === 'fr'
                      ? 'Dépistage de l’apnée du sommeil (Polygraphie ventilatoire)'
                      : 'Sleep Apnea Screening (Respiratory Polygraphy)'
                  )
                }
                className="px-6 py-3.5 rounded-full bg-white hover:bg-sky-50 text-[#061B49] text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap shrink-0 shadow-md transition-colors cursor-pointer"
              >
                <span>
                  {lang === 'fr' ? 'Réserver mon dépistage' : 'Book Sleep Screening'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#DC141C]" />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 6: CHIFFRES CLÉS & STATISTIQUES VÉRIFIÉS DU CABINET
            - Utilise uniquement les données réelles et vérifiées du cabinet
           ===================================================================== */}
        {activePage === 'home' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white rounded-3xl p-6 sm:p-10 section-hover-border space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                    {lang === 'fr'
                      ? 'SECTION 06 · INDICATEURS CLINIQUES VÉRIFIÉS DU CABINET'
                      : 'SECTION 06 · VERIFIED CLINICAL INDICATORS'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061B49] mt-1">
                    {lang === 'fr'
                      ? 'Le Cabinet Médical de Cardiologie Paris 16 en Chiffres Réels'
                      : 'Paris 16 Cardiology Medical Practice in Verified Figures'}
                  </h2>
                </div>
                <span className="text-xs font-semibold text-[#0052CC]">
                  {siteData.doctorName} · Bonapriso, Douala
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    number: '08',
                    unit: lang === 'fr' ? 'Pathologies' : 'Conditions',
                    title: {
                      fr: 'Pathologies Cardiovasculaires Prises en Charge',
                      en: 'Cardiovascular Conditions Treated',
                    },
                    desc: {
                      fr: 'HTA, Insuffisance cardiaque, Arythmie, Angor, Infarctus, AVC, Embolie, Apnée.',
                      en: 'Hypertension, Heart Failure, Arrhythmia, Angina, MI, Stroke, PE, Sleep Apnea.',
                    },
                    progress: 100,
                    color: 'from-[#0052CC] to-[#0088FF]',
                  },
                  {
                    number: '08',
                    unit: lang === 'fr' ? 'Explorations' : 'Explorations',
                    title: {
                      fr: 'Examens Cardiologiques Réalisés Sur Place',
                      en: 'Cardiological Exams Performed On-Site',
                    },
                    desc: {
                      fr: 'ECG, Holter ECG, MAPA, Écho Doppler, ETO, Doppler vasculaire, Effort, Polygraphie.',
                      en: 'ECG, Holter, ABPM, Echo Doppler, TEE, Vascular Doppler, Stress Test, Polygraphy.',
                    },
                    progress: 100,
                    color: 'from-[#DC141C] to-[#FF4D58]',
                  },
                  {
                    number: '01',
                    unit: lang === 'fr' ? 'Seul Lieu' : 'Single Hub',
                    title: {
                      fr: 'Bilan Complet Réalisé le Même Jour',
                      en: 'Complete Workup on the Same Day',
                    },
                    desc: {
                      fr: "Pas besoin d'aller dans 3 endroits différents : plateau technique réuni à Bonapriso.",
                      en: 'No need to visit 3 different locations: full diagnostic suite in Bonapriso.',
                    },
                    progress: 100,
                    color: 'from-[#061B49] to-[#0052CC]',
                  },
                  {
                    number: '04',
                    unit: lang === 'fr' ? 'Engagements' : 'Pillars',
                    title: {
                      fr: 'Piliers de Notre Particularité Médicale',
                      en: 'Core Pillars of Our Medical Care',
                    },
                    desc: {
                      fr: 'Accueil & écoute sans précipitation, Technologie, Suivi téléphonique et Rapidité.',
                      en: 'Unhurried listening, On-site technology, Phone follow-up, and Fast scheduling.',
                    },
                    progress: 100,
                    color: 'from-[#0052CC] to-[#DC141C]',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-6 rounded-2xl bg-[#F4F8FD] border border-slate-200/80 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#061B49] tabular-nums">
                          {stat.number}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                          {stat.unit}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-[#061B49] mt-2">
                        {stat.title[lang]}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {stat.desc[lang]}
                      </p>
                    </div>

                    {/* Animated Progress Bar Reveal */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${stat.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 7: TÉMOIGNAGES DES PATIENTS (SMOOTH SLIDER + DIRECT PUBLISH)
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'testimonials') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <TestimonialsSection
              testimonials={testimonials}
              siteData={siteData}
              lang={lang}
              onTestimonialAdded={(updatedList) => setTestimonials(updatedList)}
            />
          </section>
        )}

        {/* =====================================================================
            SECTION 8: GALERIE VISUELLE DU CABINET MÉDICAL, APPAREILS & CONSEILS SANTÉ
            - Masonry / Clip Path Transition / Scroll Zoom
           ===================================================================== */}
        {activePage === 'home' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                  {lang === 'fr'
                    ? 'SECTION 08 · GALERIE DES APPAREILS MÉDICAUX & PRÉVENTION'
                    : 'SECTION 08 · MEDICAL EQUIPMENT GALLERY & PREVENTION'}
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#061B49] mt-1">
                  {lang === 'fr' ? (
                    <>
                      Nos <span className="text-[#0052CC]">Équipements de Pointe</span> & Dossiers
                      de Prévention
                    </>
                  ) : (
                    <>
                      Our <span className="text-[#0052CC]">Advanced Medical Devices</span> &
                      Prevention Insights
                    </>
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigateToPage('explorations')}
                className="px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-[#0052CC] text-xs font-bold text-[#061B49] flex items-center gap-2 self-start cursor-pointer"
              >
                <span>
                  {lang === 'fr' ? 'Voir les 8 explorations' : 'View All 8 Explorations'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#DC141C]" />
              </button>
            </div>

            {/* Equipment Showcase Grid — Dedicated Image + Full Untruncated Text Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {[
                {
                  span: 'lg:col-span-4',
                  src: EQUIPMENT_IMAGES.echoDoppler,
                  tag: { fr: 'IMAGERIE CARDIAQUE HD', en: 'HD CARDIAC IMAGING' },
                  title: {
                    fr: 'Échocardiographie Doppler Couleur & ETO',
                    en: 'Color Doppler Echocardiography & TEE',
                  },
                  desc: {
                    fr: 'Analyse en temps réel du muscle cardiaque, des valves et des flux vasculaires sur place.',
                    en: 'Real-time assessment of heart muscle, valves, and vascular blood flow on-site.',
                  },
                },
                {
                  span: 'lg:col-span-4',
                  src: EQUIPMENT_IMAGES.ecgHolter,
                  tag: { fr: 'RYTHMOLOGIE & ÉLECTROPHYSIOLOGIE', en: 'RHYTHMOLOGY & ECG' },
                  title: {
                    fr: 'ECG 12 Dérivations & Holter ECG 24h–72h',
                    en: '12-Lead ECG & 24h–72h Holter Monitor',
                  },
                  desc: {
                    fr: 'Détection immédiate des arythmies, palpitations et troubles de la conduction.',
                    en: 'Immediate detection of arrhythmias, palpitations, and conduction disorders.',
                  },
                },
                {
                  span: 'lg:col-span-4',
                  src: EQUIPMENT_IMAGES.mapa,
                  tag: { fr: 'SUIVI TENSIONNEL', en: 'BLOOD PRESSURE' },
                  title: {
                    fr: 'Holter Tensionnel (MAPA 24h)',
                    en: '24h ABPM Blood Pressure Monitor',
                  },
                  desc: {
                    fr: 'Mesure automatique jour et nuit pour un équilibrage précis de l’hypertension artérielle (HTA).',
                    en: 'Automated day and night monitoring for accurate hypertension care.',
                  },
                },
                {
                  span: 'lg:col-span-6',
                  src: EQUIPMENT_IMAGES.stressTest,
                  tag: { fr: 'EXPLORATION FONCTIONNELLE', en: 'EXERCISE CARDIOLOGY' },
                  title: {
                    fr: 'Plateau d’Épreuve d’Effort Cardiologique',
                    en: 'Cardiac Exercise Stress Test Suite',
                  },
                  desc: {
                    fr: 'Cyclo-ergomètre médical connecté à une surveillance ECG 12 dérivations continue à l’effort.',
                    en: 'Medical ergometer connected to continuous 12-lead exercise ECG telemetry.',
                  },
                },
                {
                  span: 'lg:col-span-6',
                  src: EQUIPMENT_IMAGES.polygraphy,
                  tag: { fr: 'SOMMEIL & CARDIOLOGIE', en: 'SLEEP & HEART CARE' },
                  title: {
                    fr: 'Polygraphie Ventilatoire Nocturne (Apnée du Sommeil)',
                    en: 'Nocturnal Respiratory Polygraphy (Sleep Apnea)',
                  },
                  desc: {
                    fr: 'Vous ronflez ? Vous êtes fatigué au réveil ? Enregistrement nocturne complet à domicile.',
                    en: 'Snoring or waking up exhausted? Complete overnight home respiratory recording.',
                  },
                },
              ].map((eq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  onClick={() => openBookingWithSubject(eq.title[lang])}
                  className={`${eq.span} bg-[#061B49] rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer section-hover-border shadow-md`}
                >
                  <div className="relative h-52 sm:h-60 overflow-hidden">
                    <img
                      src={eq.src}
                      alt={eq.title[lang]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061B49] via-transparent to-transparent" />
                    <span className="absolute top-3.5 left-3.5 text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#DC141C] text-white shadow-md">
                      {eq.tag[lang]}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 text-white flex-1 flex flex-col justify-between bg-gradient-to-b from-[#061B49] to-[#0A2558]">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold group-hover:text-sky-300 transition-colors">
                        {eq.title[lang]}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
                        {eq.desc[lang]}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-300">
                      <span>{lang === 'fr' ? 'Planifier cet examen' : 'Schedule this exam'}</span>
                      <ArrowRight className="w-4 h-4 text-[#FF4D58] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 wave-hover-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <img
                  src={siteData.logoUrl}
                  alt={siteData.clinicName[lang]}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 object-contain shrink-0 transition-transform duration-500 hover:scale-105"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                    {siteData.sloganPrimary[lang]}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#061B49] mt-0.5">
                    {siteData.clinicName[lang]} · {siteData.doctorName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    {siteData.addressFull[lang]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigateToPage('insights')}
                className="px-5 py-3 rounded-full bg-[#061B49] hover:bg-[#0052CC] text-white text-xs font-extrabold flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
              >
                <span>
                  {lang === 'fr'
                    ? 'Lire le Blog Cardiology Insights'
                    : 'Read Cardiology Insights Blog'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#FF4D58]" />
              </button>
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION 8B: CARDIOLOGY INSIGHTS — BLOG SANTÉ DU CŒUR & MAILLAGE INTERNE SEO
            - Heart Health Tips with direct backlinks to clinic Explorations & Pathologies
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'insights') && (
          <CardiologyInsightsSection
            siteData={siteData}
            lang={lang}
            onSelectClinicalItem={(item) => setSelectedClinicalItem(item)}
            onBookWithSubject={(subj) => openBookingWithSubject(subj)}
            onNavigateToSection={(sec) => navigateToPage(sec)}
          />
        )}

        {/* =====================================================================
            SECTION 9: SECTION STRATÉGIQUE DE PRISE DE RENDEZ-VOUS + PLAN D'ACCÈS
            - Form Reveal, Input Focus Animation, Magnetic Hover, CTA Pulse
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'contact') && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
            {/* Strategic Direct Booking Block */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-gradient-to-br from-[#061B49] via-[#0A2766] to-[#0052CC] p-6 sm:p-10 lg:p-12 text-white shadow-2xl section-hover-border"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column (5 cols): Direct Conversion Pitch & Emergency Contacts */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-300">
                    {lang === 'fr'
                      ? 'SECTION 09 · PRISE DE RENDEZ-VOUS STRATÉGIQUE'
                      : 'SECTION 09 · DIRECT APPOINTMENT BOOKING'}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                    {lang === 'fr' ? (
                      <>
                        Planifiez Votre Consultation avec le{' '}
                        <span className="text-[#FF4D58]">{siteData.doctorName}</span>
                      </>
                    ) : (
                      <>
                        Schedule Your Consultation with{' '}
                        <span className="text-[#FF4D58]">{siteData.doctorName}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-sky-100 leading-relaxed">
                    {lang === 'fr'
                      ? 'Rendez-vous rapide, même en urgence. Bilan cardiologique complet (ECG, Échocardiographie Doppler, Holter, MAPA, Polygraphie) réalisé sur place le même jour.'
                      : 'Fast appointment scheduling, including emergencies. Complete cardiology workup performed on-site the very same day.'}
                  </p>

                  <div className="space-y-3 pt-2">
                    <a
                      href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-3.5 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[#DC141C] text-white flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-sky-200">
                          {lang === 'fr' ? 'Ligne directe & Urgences' : 'Direct Line & Emergencies'}
                        </div>
                        <div className="text-base sm:text-lg font-extrabold font-mono tabular-nums">
                          {siteData.phone}
                        </div>
                      </div>
                    </a>

                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#0052CC] text-white flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-sky-200">
                          {lang === 'fr' ? 'Adresse à Bonapriso, Douala' : 'Bonapriso Address'}
                        </div>
                        <div className="text-xs sm:text-sm font-bold">
                          {siteData.addressShort[lang]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 cols): Interactive Conversion Form */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 text-[#061B49] shadow-xl">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#061B49] mb-4">
                    {lang === 'fr'
                      ? 'Formulaire de Réservation Rapide'
                      : 'Fast Appointment Booking Form'}
                  </h3>

                  <form onSubmit={handleInlineAppointmentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#061B49] mb-1">
                          {lang === 'fr' ? 'Nom et Prénom *' : 'Full Name *'}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={inlineName}
                            onChange={(e) => setInlineName(e.target.value)}
                            placeholder={lang === 'fr' ? 'Votre nom complet' : 'Your full name'}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#061B49] mb-1">
                          {lang === 'fr' ? 'Téléphone / WhatsApp *' : 'Phone / WhatsApp *'}
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={inlinePhone}
                            onChange={(e) => setInlinePhone(e.target.value)}
                            placeholder="+237 6..."
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] font-mono focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#061B49] mb-1">
                          {lang === 'fr' ? 'E-mail (optionnel)' : 'Email (optional)'}
                        </label>
                        <input
                          type="email"
                          value={inlineEmail}
                          onChange={(e) => setInlineEmail(e.target.value)}
                          placeholder="patient@email.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#061B49] mb-1">
                          {lang === 'fr' ? 'Date souhaitée *' : 'Preferred Date *'}
                        </label>
                        <input
                          type="date"
                          required
                          value={inlineDate}
                          onChange={(e) => setInlineDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] font-mono focus:outline-none focus:border-[#0052CC]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#061B49] mb-1">
                          {lang === 'fr' ? 'Créneau' : 'Time Slot'}
                        </label>
                        <select
                          value={inlineTime}
                          onChange={(e) => setInlineTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-xs font-semibold text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                        >
                          <option value="Matin (08h00 - 12h30)">
                            {lang === 'fr' ? 'Matin (08h00 - 12h30)' : 'Morning (08:00 - 12:30)'}
                          </option>
                          <option value="Après-midi (13h30 - 18h00)">
                            {lang === 'fr'
                              ? 'Après-midi (13h30 - 18h00)'
                              : 'Afternoon (13:30 - 18:00)'}
                          </option>
                          <option value="Urgence dès que possible">
                            {lang === 'fr' ? 'Urgence dès que possible' : 'Urgent / Earliest Slot'}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#061B49] mb-1">
                        {lang === 'fr'
                          ? 'Motif de consultation ou examen souhaité'
                          : 'Reason for Consultation or Exam'}
                      </label>
                      <select
                        value={inlineService}
                        onChange={(e) => setInlineService(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                      >
                        <option value="Bilan Cardiologique Complet (Consultation + ECG + Écho sur place)">
                          {lang === 'fr'
                            ? 'Bilan Cardiologique Complet (Consultation + ECG + Écho sur place)'
                            : 'Complete Cardiology Workup (Consultation + On-site ECG + Echo)'}
                        </option>
                        <option value="Dépistage Apnée du Sommeil (Polygraphie ventilatoire)">
                          {lang === 'fr'
                            ? 'Dépistage Apnée du Sommeil (Polygraphie ventilatoire)'
                            : 'Sleep Apnea Screening (Respiratory Polygraphy)'}
                        </option>
                        {siteData.explorations.map((e) => (
                          <option key={e.id} value={e.title[lang]}>
                            {e.title[lang]}
                          </option>
                        ))}
                        {siteData.pathologies.map((p) => (
                          <option key={p.id} value={p.title[lang]}>
                            {p.title[lang]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#061B49] mb-1">
                        {lang === 'fr' ? 'Précisions ou symptômes' : 'Symptoms or notes'}
                      </label>
                      <div className="relative">
                        <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={inlineNotes}
                          onChange={(e) => setInlineNotes(e.target.value)}
                          placeholder={
                            lang === 'fr'
                              ? 'Ex: contrôle tension, palpitations, fatigue au réveil...'
                              : 'e.g. BP check, palpitations, morning fatigue...'
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inlineUrgent}
                        onChange={(e) => setInlineUrgent(e.target.checked)}
                        className="w-4 h-4 accent-[#DC141C] rounded"
                      />
                      <AlertCircle className="w-4 h-4 text-[#DC141C] shrink-0" />
                      <span className="text-xs font-semibold text-red-900">
                        {lang === 'fr'
                          ? 'Rendez-vous prioritaire / Urgence cardiologique'
                          : 'Priority appointment / Cardiac emergency'}
                      </span>
                    </label>

                    {inlineError && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                        {inlineError}
                      </div>
                    )}

                    {inlineSuccess && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{inlineSuccess}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={inlineSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#DC141C] hover:opacity-95 text-white text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {inlineSubmitting
                          ? lang === 'fr'
                            ? 'Enregistrement en cours...'
                            : 'Booking...'
                          : lang === 'fr'
                            ? 'Valider mon Rendez-vous au Cabinet'
                            : 'Confirm My Clinic Appointment'}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Interactive Bonapriso Map & 13 Landmarks */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                  {lang === 'fr'
                    ? 'PLAN D’ACCÈS BONAPRISO · 13 REPÈRES GÉOGRAPHIQUES'
                    : 'BONAPRISO ACCESS MAP · 13 GEOGRAPHICAL LANDMARKS'}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#061B49] mt-1">
                  {siteData.addressFull[lang]}
                </h3>
              </div>

              <BonaprisoMap
                siteData={siteData}
                lang={lang}
                onBookClick={() => openBookingWithSubject()}
              />
            </div>
          </section>
        )}

        {/* =====================================================================
            SECTION SEO & FAQ CARDIOLOGIQUE — DOUALA (BONAPRISO) & TOUT LE CAMEROUN
           ===================================================================== */}
        {(activePage === 'home' || activePage === 'contact' || activePage === 'about') && (
          <section
            aria-label={
              lang === 'fr'
                ? 'Questions fréquentes et couverture cardiologique à Douala et au Cameroun'
                : 'Frequently Asked Questions and Cardiology Coverage in Douala & Cameroon'
            }
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 section-hover-border space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                    {lang === 'fr'
                      ? 'CENTRE DE RÉFÉRENCE CARDIOLOGIQUE · DOUALA (BONAPRISO) & CAMEROUN'
                      : 'CARDIOLOGY REFERENCE CENTER · DOUALA (BONAPRISO) & CAMEROON'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#061B49] mt-1">
                    {lang === 'fr'
                      ? 'Questions Fréquentes & Accueil des Patients de Douala et du Cameroun'
                      : 'FAQ & Care for Patients Across Douala and All of Cameroon'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl">
                    {lang === 'fr'
                      ? 'Situé à Bonapriso (Douala), le Cabinet Médical de Cardiologie Paris 16 du Dr Annick TCHAM reçoit les patients de tous les quartiers de Douala ainsi que des 10 régions du Cameroun pour un bilan complet réalisé le jour même.'
                      : 'Located in Bonapriso (Douala), Dr Annick TCHAM’s Paris 16 Cardiology Medical Practice welcomes patients from all Douala neighborhoods and across all 10 regions of Cameroon for same-day cardiac evaluations.'}
                  </p>
                </div>

                <a
                  href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                  className="px-5 py-3 rounded-full bg-[#EBF3FC] hover:bg-[#dbeafe] text-[#0052CC] text-xs font-extrabold font-mono flex items-center gap-2 self-start lg:self-end shrink-0"
                >
                  <PhoneCall className="w-4 h-4 text-[#DC141C]" />
                  <span>{siteData.phone} · Douala, Cameroun</span>
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Interactive FAQ Accordion matching JSON-LD FAQPage (7 cols) */}
                <div className="lg:col-span-7 space-y-3">
                  {[
                    {
                      q: {
                        fr: 'Où se trouve le Cabinet Médical de Cardiologie Paris 16 à Douala ?',
                        en: 'Where is the Paris 16 Cardiology Medical Practice located in Douala?',
                      },
                      a: {
                        fr: 'Le cabinet du Dr Annick TCHAM est situé à Bonapriso, Douala (Fin rue pavée de l’École publique de Bonapriso, groupe 1), à proximité immédiate de l’École publique de Bonapriso, de la Rue Njo-Njo, du Casino Marbella, de l’Hôtel de l’Air et du Carrefour Bonadouma Home.',
                        en: 'Dr Annick TCHAM’s clinic is located in Bonapriso, Douala (End of the paved street of Bonapriso Public School, Group 1), right next to Bonapriso Public School, Rue Njo-Njo, Casino Marbella, and Hôtel de l’Air.',
                      },
                    },
                    {
                      q: {
                        fr: 'Quels examens cardiologiques réalisez-vous sur place le même jour à Douala ?',
                        en: 'Which cardiological exams are performed on-site the same day in Douala?',
                      },
                      a: {
                        fr: 'Nous réalisons les 8 explorations cardiologiques sur place : ECG 12 dérivations, Holter ECG (24h–72h), Holter tensionnel (MAPA), Échocardiographie Doppler couleur, Échographie trans-œsophagienne (ETO), Écho-Doppler vasculaire, Épreuve d’effort et Polygraphie ventilatoire nocturne.',
                        en: 'We perform all 8 cardiac explorations on-site: 12-lead ECG, Holter ECG, 24h ABPM Blood Pressure Monitor, Color Doppler Echocardiography, Transesophageal Echocardiography (TEE), Vascular Doppler, Exercise Stress Test, and Nocturnal Respiratory Polygraphy.',
                      },
                    },
                    {
                      q: {
                        fr: 'Faites-vous le dépistage de l’apnée du sommeil au Cameroun ?',
                        en: 'Do you provide sleep apnea screening in Cameroon?',
                      },
                      a: {
                        fr: 'Oui. « Vous ronflez ? Vous êtes fatigué au réveil ? Pensez au dépistage de l’apnée du sommeil. » Le cabinet réalise la polygraphie ventilatoire nocturne pour dépister et traiter les apnées du sommeil souvent responsables d’hypertension artérielle résistante et d’arythmies.',
                        en: 'Yes. “Do you snore? Do you wake up tired? Consider sleep apnea screening.” Our clinic performs nocturnal respiratory polygraphy to diagnose and treat sleep apnea.',
                      },
                    },
                    {
                      q: {
                        fr: 'Comment s’organise le bilan pour les patients venant de Yaoundé, Bafoussam, Kribi, Limbe ou d’autres villes du Cameroun ?',
                        en: 'How are appointments organized for patients traveling from Yaounde, Bafoussam, Kribi, Limbe, or other cities in Cameroon?',
                      },
                      a: {
                        fr: 'Grâce à notre plateau technique complet réuni en un seul lieu à Bonapriso (Douala), les patients en provenance de Yaoundé, Bafoussam, Limbe, Buea, Kribi, Edéa, Nkongsamba ou Garoua réalisent leur consultation spécialisée et tous leurs examens (ECG, Écho Doppler, Holter, MAPA) le même jour, puis bénéficient de notre suivi téléphonique continu.',
                        en: 'Thanks to our all-in-one diagnostic platform in Bonapriso (Douala), patients traveling from Yaounde, Bafoussam, Limbe, Buea, Kribi, Edea, or Garoua complete their consultation and exams on the very same day, followed by remote telephone follow-up.',
                      },
                    },
                  ].map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200/90 bg-[#F4F8FD] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#EBF3FC]/60 transition-colors"
                          aria-expanded={isOpen}
                        >
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#061B49]">
                            {faq.q[lang]}
                          </h3>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#DC141C] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#0052CC] shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                            {faq.a[lang]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Regional & City Coverage Directory for Douala & Cameroon (5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#061B49] to-[#0052CC] rounded-3xl p-6 text-white space-y-5">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-300">
                      {lang === 'fr'
                        ? 'RAYONNEMENT MÉDICAL · DOUALA & CAMEROUN'
                        : 'REGIONAL COVERAGE · DOUALA & CAMEROON'}
                    </span>
                    <h3 className="text-lg font-extrabold mt-1">
                      {lang === 'fr'
                        ? 'Votre Cardiologue de Proximité à Douala & au Cameroun'
                        : 'Your Trusted Cardiologist in Douala & Across Cameroon'}
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                      <div className="font-bold text-sky-300 mb-1">
                        {lang === 'fr'
                          ? 'Quartiers de Douala desservis (Accès rapide Bonapriso) :'
                          : 'Douala Neighborhoods Served (Fast Access to Bonapriso):'}
                      </div>
                      <p className="text-white/90 leading-relaxed">
                        Bonapriso · Akwa · Bonanjo · Bali · Koumassi · New-Bell · Deïdo · Bonamoussadi · Makepe · Logpom · Kotto · Ndokoti · Bonabéri · Yassa · Japoma.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                      <div className="font-bold text-sky-300 mb-1">
                        {lang === 'fr'
                          ? 'Villes & Régions du Cameroun accompagnées :'
                          : 'Cameroon Cities & Regions Served:'}
                      </div>
                      <p className="text-white/90 leading-relaxed">
                        Douala (Littoral) · Yaoundé (Centre) · Bafoussam & Dschang (Ouest) · Kribi & Edéa · Limbe & Buea (Sud-Ouest) · Nkongsamba · Bamenda · Bertoua · Ebolowa · Ngaoundéré · Garoua · Maroua.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openBookingWithSubject()}
                    className="w-full py-3 px-4 rounded-xl bg-[#DC141C] hover:bg-[#b81017] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {lang === 'fr'
                        ? 'Réserver mon Bilan Cardiologique à Douala'
                        : 'Book My Cardiology Workup in Douala'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================================
          SECTION 10: FOOTER MÉDICAL PREMIUM (DISPOSITION SANS CHEVAUCHEMENT AVEC URGENCE)
         ===================================================================== */}
      <footer className="bg-[#061B49] text-white pt-16 pb-24 sm:pb-20 border-t-4 border-[#DC141C] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            {/* Brand Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={siteData.logoUrl}
                  alt={siteData.clinicName[lang]}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-contain rounded-2xl bg-white p-1.5 shadow-md"
                />
                <div>
                  <div className="text-base font-extrabold text-white">
                    {siteData.clinicName[lang]}
                  </div>
                  <div className="text-xs font-bold text-[#FF4D58]">
                    {siteData.doctorName} · {siteData.specialty[lang]}
                  </div>
                </div>
              </div>
              <p className="text-xs text-sky-100/80 leading-relaxed">
                {siteData.synthesisParagraph1[lang]}
              </p>
              <div className="text-xs font-bold text-sky-300">
                {siteData.sloganPrimary[lang]} {siteData.sloganSecondary[lang]}
              </div>
            </div>

            {/* Quick Links (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                {lang === 'fr' ? 'Navigation' : 'Quick Links'}
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => navigateToPage(item.id)}
                      className="hover:text-white nav-link-underline transition-colors cursor-pointer"
                    >
                      {item.label[lang]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explorations Links (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                {lang === 'fr' ? 'Explorations Sur Place' : 'On-Site Explorations'}
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                {siteData.explorations.slice(0, 6).map((exp) => (
                  <li key={exp.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedClinicalItem({ kind: 'exploration', item: exp })}
                      className="hover:text-white nav-link-underline transition-colors text-left cursor-pointer"
                    >
                      {exp.title[lang]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us & Copy Buttons (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-300">
                {lang === 'fr' ? 'Contact & Rendez-vous' : 'Contact Us'}
              </h4>
              <div className="space-y-3 text-xs text-white/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF4D58] shrink-0 mt-0.5" />
                  <span>{siteData.addressShort[lang]}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <a
                      href={`tel:${siteData.phone.replace(/\s+/g, '')}`}
                      className="font-mono font-bold text-white hover:text-sky-300 break-words"
                    >
                      {siteData.phone}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(siteData.phone, 'footer-phone')}
                    className="px-2 py-1 rounded-lg bg-white text-[11px] font-bold text-[#061B49] shrink-0 cursor-pointer"
                  >
                    {copiedFooterField === 'footer-phone'
                      ? lang === 'fr'
                        ? 'Copié'
                        : 'Copied'
                      : lang === 'fr'
                        ? 'Copier'
                        : 'Copy'}
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 border border-white/15">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="w-3.5 h-3.5 text-[#FF4D58] shrink-0" />
                    <a
                      href={`mailto:${siteData.email}`}
                      className="font-medium text-white hover:text-sky-300 break-all"
                    >
                      {siteData.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(siteData.email, 'footer-email')}
                    className="px-2 py-1 rounded-lg bg-white text-[11px] font-bold text-[#061B49] shrink-0 cursor-pointer"
                  >
                    {copiedFooterField === 'footer-email'
                      ? lang === 'fr'
                        ? 'Copié'
                        : 'Copied'
                      : lang === 'fr'
                        ? 'Copier'
                        : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Admin Button — Positioned on the left/center away from the bottom-right floating Urgence button */}
          <div className="pt-6 sm:pr-48 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 sm:gap-6 text-xs text-white/75">
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#DC141C] text-white border border-white/25 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-sky-300" />
              <span>{lang === 'fr' ? 'Accès Admin' : 'Admin Portal'}</span>
            </button>

            <div className="leading-relaxed">
              © {new Date().getFullYear()} {siteData.clinicName[lang]} — {siteData.doctorName}.{' '}
              {lang === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING BUTTON (BOTTOM RIGHT) — Written strictly "Urgence" as requested */}
      <a
        href={whatsappUrgenceHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Urgence"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#DC141C] hover:bg-[#b81017] text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-200 hover:-translate-y-1 animate-urgent-pulse"
      >
        <PhoneCall className="w-5 h-5 text-white shrink-0" />
        <span className="text-sm font-extrabold tracking-wide">Urgence</span>
      </a>

      {/* MODALS */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        siteData={siteData}
        lang={lang}
        preselectedSubject={preselectedSubject}
      />

      <ClinicalDetailModal
        selected={selectedClinicalItem}
        onClose={() => setSelectedClinicalItem(null)}
        lang={lang}
        onBookWithSubject={(subj) => openBookingWithSubject(subj)}
        siteData={siteData}
        onSelectClinicalItem={(item) => setSelectedClinicalItem(item)}
      />

      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        siteData={siteData}
        testimonials={testimonials}
        lang={lang}
        onSiteDataUpdated={(updated) => setSiteData(updated)}
        onTestimonialsUpdated={(updatedList) => setTestimonials(updatedList)}
      />
      </motion.div>
    </>
  );
}
