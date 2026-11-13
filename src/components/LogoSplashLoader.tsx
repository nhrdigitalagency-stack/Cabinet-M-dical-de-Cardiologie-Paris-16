import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { ClinicSiteData, Language } from '../data/initialClinicData';
import { MedicalLottie } from './MedicalLottie';

interface LogoSplashLoaderProps {
  isVisible: boolean;
  siteData: ClinicSiteData;
  lang: Language;
  onComplete: () => void;
}

export const LogoSplashLoader: React.FC<LogoSplashLoaderProps> = ({
  isVisible,
  siteData,
  lang,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isVisible) {
      completedRef.current = false;
      setProgress(0);
      return;
    }

    const maxDurationMs = 5000; // Strict 5 seconds maximum splashscreen duration
    const intervalMs = 40;
    const startTime = Date.now();

    const finishSplash = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setProgress(100);
      onComplete();
    };

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / maxDurationMs);
      setProgress(Math.round(ratio * 100));

      if (ratio >= 1) {
        clearInterval(timer);
        finishSplash();
      }
    }, intervalMs);

    // Hard 5-second maximum ceiling guarantee even if browser tab throttles intervals
    const hardTimeout = setTimeout(() => {
      clearInterval(timer);
      finishSplash();
    }, maxDurationMs);

    return () => {
      clearInterval(timer);
      clearTimeout(hardTimeout);
    };
  }, [isVisible, onComplete]);

  const remainingSeconds = Math.max(0, ((100 - progress) * 5) / 100).toFixed(1);

  const getStageLabel = () => {
    if (progress < 35) {
      return lang === 'fr'
        ? 'Initialisation du Plateau Technique Cardiologique...'
        : 'Initializing Cardiology Diagnostic Suite...';
    }
    if (progress < 75) {
      return lang === 'fr'
        ? 'Chargement des 8 Explorations & Spécialités (Bonapriso, Douala)...'
        : 'Loading 8 On-Site Cardiac Explorations & Specialties...';
    }
    return lang === 'fr'
      ? 'Immersion vers la Page d’Accueil — Cabinet Paris 16...'
      : 'Immersive Entry into Home Page — Paris 16 Clinic...';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="paris16-splash-loader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.32,
            filter: 'blur(14px)',
            transition: {
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-br from-[#030F2E] via-[#061B49] to-[#003380] text-white overflow-y-auto select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Splashscreen Cabinet Médical de Cardiologie Paris 16"
        >
          {/* Ambient Immersive Radial Glows & Cardiac Sonar Rings */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.18, 0.35, 0.18],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[540px] h-[300px] sm:h-[540px] rounded-full bg-[#0052CC]/30 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.1, 1.5, 1.1],
                opacity: [0.12, 0.28, 0.12],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] rounded-full bg-[#DC141C]/25 blur-3xl"
            />
          </div>

          {/* Top Bar: Location & Verification Badge */}
          <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-sky-200/90 relative z-10">
            <div className="flex items-center gap-1.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#FF4D58] shrink-0" />
              <span>Bonapriso, Douala · Cameroun</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sky-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0088FF] shrink-0" />
              <span>{siteData.doctorName} · Cardiologue</span>
            </div>
          </div>

          {/* Centerpiece: Official Logo with Lottie Cardiac Pulse & Slogans */}
          <div className="my-auto py-3 flex flex-col items-center text-center max-w-2xl w-full relative z-10 space-y-4 sm:space-y-5">
            {/* Logo Medallion with Expanding Sonar Rings + Lottie Badge */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border-2 border-[#DC141C]/60"
              />
              <motion.div
                animate={{ scale: [1, 1.75], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, delay: 0.45, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-[#0088FF]/50"
              />

              <motion.div
                initial={{ scale: 0.78, opacity: 0 }}
                animate={{ scale: [0.98, 1.04, 0.98], opacity: 1 }}
                transition={{
                  opacity: { duration: 0.45 },
                  scale: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl bg-white p-3 sm:p-4 shadow-[0_0_60px_rgba(0,136,255,0.45)] border-2 border-white flex items-center justify-center"
              >
                <img
                  src={siteData.logoUrl}
                  alt={siteData.clinicName[lang]}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                {/* Live Lottie Heartbeat Pulse Badge on Corner of Logo */}
                <div className="absolute -bottom-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center">
                  <MedicalLottie variant="heartbeat-pulse" className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </motion.div>
            </div>

            {/* Animated Lottie ECG Monitor Wave */}
            <div className="w-56 sm:w-72 mx-auto flex items-center justify-center">
              <MedicalLottie variant="ecg-monitor" className="w-56 sm:w-72 h-12" />
            </div>

            {/* Official Title, Doctor & Slogans */}
            <div className="space-y-2 px-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-300"
              >
                <HeartPulse className="w-3.5 h-3.5 text-[#FF4D58]" />
                <span>
                  {siteData.doctorName} · {siteData.specialty[lang]}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight"
              >
                Cabinet Médical de Cardiologie{' '}
                <span className="text-[#FF4D58]">Paris 16</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="text-xs sm:text-base font-semibold text-sky-100 italic"
              >
                “{siteData.sloganPrimary[lang]} {siteData.sloganSecondary[lang]}”
              </motion.p>
            </div>

            {/* 5-Second Max Progress Bar & Telemetry Counter */}
            <div className="w-full max-w-md mx-auto space-y-2.5 pt-1 px-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-sky-200 truncate pr-2">{getStageLabel()}</span>
                <span className="font-extrabold text-white shrink-0 tabular-nums">
                  {progress}% · {remainingSeconds}s
                </span>
              </div>

              <div
                className="w-full h-3 rounded-full bg-white/15 p-0.5 overflow-hidden border border-white/20 shadow-inner"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#0088FF] via-[#0052CC] to-[#DC141C] shadow-[0_0_16px_rgba(220,20,28,0.8)] transition-all duration-75"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-sky-200/80 pt-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {lang === 'fr'
                    ? 'Splashscreen immersif (5 secondes max)'
                    : 'Immersive splashscreen (5 seconds max)'}
                </span>
                <button
                  type="button"
                  onClick={onComplete}
                  className="text-sky-300 hover:text-white underline font-semibold cursor-pointer"
                >
                  {lang === 'fr' ? 'Entrer maintenant →' : 'Enter now →'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Emergency & Address */}
          <div className="w-full max-w-4xl text-center text-[11px] sm:text-xs text-sky-200/75 relative z-10">
            {siteData.addressShort[lang]} · Tél : {siteData.phone}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
