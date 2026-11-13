import React, { useState } from 'react';
import { Activity, HeartPulse, Moon, Stethoscope, Gauge } from 'lucide-react';

export const EQUIPMENT_IMAGES = {
  ecgHolter: '/src/assets/images/ecg_holter_device_1794470525624.jpg',
  echoDoppler: '/src/assets/images/echo_doppler_scanner_1794470527211.jpg',
  mapa: '/src/assets/images/mapa_blood_pressure_1794470528253.jpg',
  stressTest: '/src/assets/images/stress_test_ergometer_1794470530593.jpg',
  polygraphy: '/src/assets/images/sleep_apnea_polygraphy_1794470532108.jpg',
};

interface IllustrationProps {
  type: string;
  className?: string;
}

export const ExplorationIllustration: React.FC<IllustrationProps> = ({
  type,
  className = 'w-full h-48',
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const getEquipmentConfig = () => {
    switch (type) {
      case 'ecg':
        return {
          src: EQUIPMENT_IMAGES.ecgHolter,
          alt: 'Appareil ECG 12 dérivations — Cabinet Médical de Cardiologie Paris 16',
          badge: 'ECG 12 DÉRIVATIONS',
          sub: 'Tracé immédiat au repos',
          objectPos: 'object-left',
          icon: Activity,
        };
      case 'holter-ecg':
        return {
          src: EQUIPMENT_IMAGES.ecgHolter,
          alt: 'Boîtier Holter ECG numérique 24h à 72h',
          badge: 'HOLTER ECG 24H–72H',
          sub: 'Enregistreur continu discret',
          objectPos: 'object-right',
          icon: HeartPulse,
        };
      case 'mapa':
        return {
          src: EQUIPMENT_IMAGES.mapa,
          alt: 'Holter tensionnel MAPA 24 heures et brassard médical',
          badge: 'MAPA 24 HEURES',
          sub: 'Mesure tensionnelle jour & nuit',
          objectPos: 'object-center',
          icon: Gauge,
        };
      case 'echo-doppler':
        return {
          src: EQUIPMENT_IMAGES.echoDoppler,
          alt: 'Échographe Doppler couleur cardiaque haute définition',
          badge: 'ÉCHO DOPPLER COULEUR',
          sub: 'Imagerie myocardique & valvulaire',
          objectPos: 'object-center',
          icon: Stethoscope,
        };
      case 'eto':
        return {
          src: EQUIPMENT_IMAGES.echoDoppler,
          alt: 'Système d’échographie trans-œsophagienne haute résolution',
          badge: 'IMAGERIE ETO HD',
          sub: 'Sonde multiplan haute précision',
          objectPos: 'object-right-top',
          icon: Stethoscope,
        };
      case 'vascular':
        return {
          src: EQUIPMENT_IMAGES.echoDoppler,
          alt: 'Écho-Doppler vasculaire artériel et veineux',
          badge: 'DOPPLER VASCULAIRE',
          sub: 'Artères carotides, aorte & membres',
          objectPos: 'object-left-bottom',
          icon: Activity,
        };
      case 'stress-test':
        return {
          src: EQUIPMENT_IMAGES.stressTest,
          alt: 'Plateau d’épreuve d’effort cardiologique avec cyclo-ergomètre médical',
          badge: 'ÉPREUVE D’EFFORT',
          sub: 'Ergométrie & télémétrie ECG',
          objectPos: 'object-center',
          icon: HeartPulse,
        };
      default:
        return {
          src: EQUIPMENT_IMAGES.polygraphy,
          alt: 'Polygraphe ventilatoire nocturne pour dépistage de l’apnée du sommeil',
          badge: 'POLYGRAPHIE NOCTURNE',
          sub: 'Dépistage Apnée du Sommeil · SpO2',
          objectPos: 'object-center',
          icon: Moon,
        };
    }
  };

  const config = getEquipmentConfig();
  const Icon = config.icon;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#061B49] via-[#0052CC] to-[#0A2558] flex items-center justify-center group ${className}`}
    >
      {!imgFailed ? (
        <img
          src={config.src}
          alt={config.alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${config.objectPos} transition-transform duration-700 ease-out group-hover:scale-110`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-white p-4 text-center">
          <Icon className="w-10 h-10 text-[#DC141C] mb-2" />
          <span className="text-xs font-bold">{config.badge}</span>
        </div>
      )}

      {/* Measured Contrast Scrim for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#061B49]/92 via-[#061B49]/30 to-transparent pointer-events-none" />

      {/* Bottom Equipment Telemetry Strip — Full Wrapping Text (Zero Truncation) */}
      <div className="absolute bottom-2.5 left-3 right-12 flex items-start gap-2 pointer-events-none">
        <div className="w-7 h-7 rounded-lg bg-[#DC141C] text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-[10px] font-mono font-extrabold tracking-wider text-sky-300 uppercase break-words">
            {config.badge}
          </div>
          <div className="text-[11px] font-semibold text-white break-words mt-0.5">
            {config.sub}
          </div>
        </div>
      </div>
    </div>
  );
};
