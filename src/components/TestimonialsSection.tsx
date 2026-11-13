import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  Quote,
  Send,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Award,
  ArrowUpDown,
  Pause,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClinicSiteData, Language, TestimonialItem } from '../data/initialClinicData';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  siteData: ClinicSiteData;
  lang: Language;
  onTestimonialAdded: (updatedList: TestimonialItem[]) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  siteData,
  lang,
  onTestimonialAdded,
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'rating'>('rating');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [patientRole, setPatientRole] = useState('');
  const [serviceUsed, setServiceUsed] = useState(
    lang === 'fr' ? 'Consultation Cardiologique & Écoute' : 'Cardiology Consultation & Care'
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const sortedTestimonials = useMemo(() => {
    const copy = [...testimonials];
    if (sortBy === 'rating') {
      return copy.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return copy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [testimonials, sortBy]);

  // Auto-play slides to the next testimonial every 6 seconds (6000ms),
  // and pauses when the user interacts with the rating/newest toggle buttons.
  useEffect(() => {
    if (sortedTestimonials.length <= 1 || isAutoPlayPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sortedTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sortedTestimonials.length, isAutoPlayPaused]);

  const handleSortInteraction = (mode: 'newest' | 'rating') => {
    // Pause the 6-second auto-play when the user interacts with the rating/newest toggle buttons
    setIsAutoPlayPaused(true);
    if (mode !== sortBy) {
      setSortBy(mode);
      setActiveSlide(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (patientName.trim().length < 2) {
      setErrorMsg(
        lang === 'fr'
          ? 'Veuillez renseigner votre nom ou vos initiales.'
          : 'Please enter your name or initials.'
      );
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg(
        lang === 'fr'
          ? 'Merci de rédiger un témoignage d’au moins 10 caractères.'
          : 'Please write a testimonial of at least 10 characters.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientRole:
            patientRole.trim() ||
            (lang === 'fr' ? 'Patient du Cabinet · Douala' : 'Clinic Patient · Douala'),
          serviceUsed,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorMsg(data.error || 'Error submitting testimonial');
      } else {
        onTestimonialAdded(data.testimonials);
        setSortBy('newest');
        setActiveSlide(0);
        setPatientName('');
        setPatientRole('');
        setComment('');
        setRating(5);
        setSuccessMsg(
          lang === 'fr'
            ? 'Merci ! Votre témoignage a été publié en direct et synchronisé sur le site.'
            : 'Thank you! Your testimonial has been published live on the website.'
        );
      }
    } catch {
      setErrorMsg(
        lang === 'fr'
          ? 'Erreur réseau lors de la publication.'
          : 'Network error while publishing.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const serviceOptions = [
    lang === 'fr' ? 'Consultation Cardiologique Complète' : 'Comprehensive Cardiology Consultation',
    ...siteData.explorations.map((e) => e.title[lang]),
    ...siteData.pathologies.map((p) => p.title[lang]),
  ];

  const currentFeatured = sortedTestimonials[activeSlide] || sortedTestimonials[0];
  const featuredRatingPercent = currentFeatured
    ? Math.min(100, Math.max(20, Math.round((currentFeatured.rating / 5) * 100)))
    : 100;

  return (
    <div className="space-y-10">
      {/* Section Header + Responsive Button Group & Dropdown for Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase text-[#DC141C]">
            {lang === 'fr'
              ? 'SECTION 07 · TÉMOIGNAGES DES PATIENTS EN DIRECT (DOUALA & CAMEROUN)'
              : 'SECTION 07 · LIVE PATIENT TESTIMONIALS (DOUALA & CAMEROON)'}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#061B49] mt-1 tracking-tight">
            {lang === 'fr' ? (
              <>
                La Confiance de nos <span className="text-[#0052CC]">Patients</span>{' '}
                <span className="text-[#DC141C]">Paris 16</span>
              </>
            ) : (
              <>
                Trusted by Our <span className="text-[#0052CC]">Patients</span>
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            {lang === 'fr'
              ? 'Défilement automatique toutes les 6 secondes. Filtrez par note (5 étoiles en premier) ou par ordre chronologique — le défilement se met automatiquement en pause lors de votre sélection.'
              : 'Auto-plays every 6 seconds. Toggle between View by Rating (5-star reviews first) and View by Newest — auto-play pauses when you interact with the sort controls.'}
          </p>
        </div>

        {/* Responsive Sort Control: Button Group + Select Dropdown (Pauses Auto-Play on Interaction) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-start lg:self-end w-full lg:w-auto">
          {/* Segmented Button Group */}
          <div
            role="group"
            aria-label={lang === 'fr' ? 'Trier les témoignages' : 'Sort testimonials'}
            onMouseDown={() => setIsAutoPlayPaused(true)}
            onTouchStart={() => setIsAutoPlayPaused(true)}
            className="grid grid-cols-1 sm:grid-cols-2 items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs w-full sm:w-auto"
          >
            <button
              type="button"
              onClick={() => handleSortInteraction('rating')}
              onFocus={() => setIsAutoPlayPaused(true)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'rating'
                  ? 'bg-[#DC141C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061B49] hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'fr' ? 'Par Note (5★) · View by Rating' : 'View by Rating (5★ First)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSortInteraction('newest')}
              onFocus={() => setIsAutoPlayPaused(true)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                sortBy === 'newest'
                  ? 'bg-[#061B49] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#061B49] hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'fr' ? 'Plus Récents · View by Newest' : 'View by Newest'}
              </span>
            </button>
          </div>

          {/* Synchronized Quick Select Dropdown */}
          <div className="relative w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#0052CC] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              aria-label={lang === 'fr' ? 'Ordre de tri des avis' : 'Review sort order'}
              value={sortBy}
              onFocus={() => setIsAutoPlayPaused(true)}
              onChange={(e) => handleSortInteraction(e.target.value as 'newest' | 'rating')}
              className="w-full sm:w-auto pl-8 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-[#061B49] focus:outline-none focus:border-[#0052CC] shadow-xs cursor-pointer"
            >
              <option value="rating">
                {lang === 'fr'
                  ? 'Trier : Note (5★ en premier)'
                  : 'Sort: View by Rating (5★ first)'}
              </option>
              <option value="newest">
                {lang === 'fr'
                  ? 'Trier : Plus récents d’abord'
                  : 'Sort: View by Newest (Chronological)'}
              </option>
            </select>
          </div>

          {/* Auto-Play Status & Toggle Pill (6s cycle) */}
          <button
            type="button"
            onClick={() => setIsAutoPlayPaused((prev) => !prev)}
            className={`px-3 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoPlayPaused
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-[#EBF3FC] border-[#0052CC]/25 text-[#0052CC] hover:bg-[#dbeafe]'
            }`}
            title={
              isAutoPlayPaused
                ? lang === 'fr'
                  ? 'Défilement automatique en pause — Cliquer pour reprendre (6s)'
                  : 'Auto-play paused — Click to resume (6s)'
                : lang === 'fr'
                  ? 'Défilement automatique actif (6s) — Cliquer pour mettre en pause'
                  : 'Auto-play active (6s) — Click to pause'
            }
          >
            {isAutoPlayPaused ? (
              <>
                <Play className="w-3.5 h-3.5 text-[#DC141C] fill-[#DC141C]" />
                <span>{lang === 'fr' ? 'Auto-play en pause' : 'Auto-play Paused'}</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>{lang === 'fr' ? 'Auto-play 6s actif' : 'Auto-play 6s On'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Smooth Testimonial Slider Spotlight (Auto-plays every 6 seconds unless paused) */}
      {currentFeatured && (
        <div className="bg-gradient-to-r from-[#061B49] via-[#0A2B6E] to-[#0052CC] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden section-hover-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 min-h-[180px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sortBy}-${currentFeatured._id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < currentFeatured.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-white/25'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                      {currentFeatured.rating}.0 / 5
                    </span>
                    <span className="text-xs text-sky-200 font-medium">
                      · {currentFeatured.serviceUsed}
                    </span>
                    <span className="text-[11px] font-mono text-sky-300/80">
                      · {isAutoPlayPaused ? (lang === 'fr' ? 'Pause manuelle' : 'Paused') : 'Auto 6s'}
                    </span>
                  </div>

                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <Quote className="w-8 h-8 text-[#DC141C] mb-2" />
                    </motion.div>
                    <p className="text-base sm:text-xl font-medium text-white leading-relaxed">
                      “{currentFeatured.comment}”
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#DC141C] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
                        {currentFeatured.patientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          {currentFeatured.patientName}
                        </div>
                        <div className="text-xs text-sky-200">{currentFeatured.patientRole}</div>
                      </div>
                    </div>

                    {/* Visual Star-Rating Progress Bar in Spotlight */}
                    <div className="w-full sm:w-64 bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/15">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                        <span className="text-sky-200">
                          {lang === 'fr' ? 'Indice de satisfaction' : 'Satisfaction Rating'}
                        </span>
                        <span className="font-mono text-amber-300 tabular-nums">
                          {currentFeatured.rating} / 5 ★ ({featuredRatingPercent}%)
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full bg-white/20 overflow-hidden"
                        role="progressbar"
                        aria-valuenow={currentFeatured.rating}
                        aria-valuemin={1}
                        aria-valuemax={5}
                      >
                        <motion.div
                          key={`feat-bar-${currentFeatured._id}`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${featuredRatingPercent}%` }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-[#FF4D58] to-[#DC141C]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls */}
            <div className="flex lg:flex-col items-center gap-3 self-end lg:self-center">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (prev) => (prev - 1 + sortedTestimonials.length) % sortedTestimonials.length
                  )
                }
                className="w-11 h-11 rounded-2xl bg-white/15 hover:bg-[#DC141C] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono font-bold text-sky-200 tabular-nums">
                {activeSlide + 1}/{sortedTestimonials.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % sortedTestimonials.length)
                }
                className="w-11 h-11 rounded-2xl bg-white/15 hover:bg-[#DC141C] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split: Published Testimonials Grid with Subtle Fade-In Transition on Sort Change (7 cols) + Direct Submission Form (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={sortBy}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="grid grid-cols-1 gap-5"
            >
              {sortedTestimonials.map((item, idx) => {
                const ratingPercentage = Math.min(
                  100,
                  Math.max(20, Math.round((item.rating / 5) * 100))
                );
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05, ease: 'easeOut' }}
                    className="space-y-2"
                  >
                    {/* Testimonial Card */}
                    <article className="bg-white rounded-3xl p-6 sm:p-7 wave-hover-card flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-amber-400">
                              {Array.from({ length: 5 }).map((_, starIdx) => (
                                <Star
                                  key={starIdx}
                                  className={`w-4 h-4 ${
                                    starIdx < item.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-mono font-bold text-[#061B49] tabular-nums">
                              {item.rating}.0 / 5
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span>{item.serviceUsed}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {new Date(item.createdAt).toLocaleDateString(
                                lang === 'fr' ? 'fr-FR' : 'en-US',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="relative">
                          <Quote className="w-6 h-6 text-[#DC141C]/25 mb-2" />
                          <p className="text-sm sm:text-base text-[#061B49] leading-relaxed">
                            “{item.comment}”
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#061B49] via-[#0052CC] to-[#DC141C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                            {item.patientName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#061B49]">{item.patientName}</h4>
                            <p className="text-xs text-slate-500">{item.patientRole}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0052CC]">
                          <UserCheck className="w-4 h-4 text-[#DC141C]" />
                          <span>{lang === 'fr' ? 'Patient Vérifié' : 'Verified Patient'}</span>
                        </div>
                      </div>
                    </article>

                    {/* Visual Star-Rating Progress Bar Below Each Testimonial Card */}
                    <div
                      className="bg-white/90 rounded-2xl px-4 py-3 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      aria-label={
                        lang === 'fr'
                          ? `Barre de progression de l'évaluation : ${item.rating} sur 5 étoiles`
                          : `Star rating progress bar: ${item.rating} out of 5 stars`
                      }
                    >
                      <div className="flex items-center justify-between sm:justify-start gap-2 shrink-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#061B49]">
                          {lang === 'fr' ? 'Évaluation Étoiles' : 'Star Rating Score'}
                        </span>
                        <span className="text-xs font-mono font-extrabold text-[#0052CC] tabular-nums">
                          {item.rating}.0 / 5 ★ ({ratingPercentage}%)
                        </span>
                      </div>

                      <div className="flex-1 sm:max-w-xs w-full flex items-center gap-2">
                        <div
                          className="w-full h-2.5 rounded-full bg-slate-200/90 overflow-hidden p-0.5"
                          role="progressbar"
                          aria-valuenow={item.rating}
                          aria-valuemin={1}
                          aria-valuemax={5}
                        >
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${ratingPercentage}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.06, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              item.rating >= 5
                                ? 'bg-gradient-to-r from-[#0052CC] via-[#DC141C] to-amber-400'
                                : item.rating === 4
                                  ? 'bg-gradient-to-r from-[#0052CC] to-sky-400'
                                  : 'bg-amber-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Direct Public Testimonial Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 section-hover-border sticky top-28">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FCE8EA] text-[#DC141C] flex items-center justify-center shrink-0">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#061B49]">
                {lang === 'fr' ? 'Témoigner sur le site' : 'Share Your Experience'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'fr'
                  ? 'Publication immédiate visible par tous les visiteurs'
                  : 'Published immediately for all visitors to see'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr'
                  ? 'Votre nom complet (ou initiales) *'
                  : 'Your full name (or initials) *'}
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={lang === 'fr' ? 'Ex: Paulin N. ou Clarisse T.' : 'e.g. Paulin N.'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr' ? 'Quartier / Ville au Cameroun' : 'Neighborhood / City in Cameroon'}
              </label>
              <input
                type="text"
                value={patientRole}
                onChange={(e) => setPatientRole(e.target.value)}
                placeholder={
                  lang === 'fr'
                    ? 'Ex: Patient · Bonapriso, Douala ou Yaoundé'
                    : 'e.g. Patient · Bonapriso, Douala or Yaounde'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr'
                  ? 'Consultation ou examen réalisé'
                  : 'Consultation or Exam Received'}
              </label>
              <select
                value={serviceUsed}
                onChange={(e) => setServiceUsed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
              >
                {serviceOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr' ? 'Votre note d’appréciation (1 à 5 ★)' : 'Your Rating (1 to 5 ★)'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="p-2 rounded-xl bg-[#F4F8FD] hover:bg-[#E6F0FF] border border-slate-200 transition-colors cursor-pointer"
                    aria-label={`${starValue} stars`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        starValue <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-[#0052CC] ml-2 tabular-nums">
                  {rating}/5 ({Math.round((rating / 5) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr' ? 'Votre témoignage *' : 'Your Testimonial *'}
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  lang === 'fr'
                    ? "Partagez votre expérience concernant l'accueil, l'écoute du Dr Annick TCHAM, les examens sur place ou le suivi..."
                    : 'Share your experience regarding the welcome, Dr Annick TCHAM’s listening, on-site exams, or follow-up...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 transition-all"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#DC141C] hover:opacity-95 disabled:opacity-60 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {submitting
                  ? lang === 'fr'
                    ? 'Publication en cours...'
                    : 'Publishing...'
                  : lang === 'fr'
                    ? 'Publier mon témoignage en direct'
                    : 'Publish My Testimonial Live'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
