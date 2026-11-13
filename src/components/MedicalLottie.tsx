import React from 'react';
import Lottie from 'lottie-react';

export type MedicalLottieVariant =
  | 'heartbeat-pulse'
  | 'ecg-monitor'
  | 'sleep-wave'
  | 'vascular-flow'
  | 'checkup-shield';

/**
 * Self-contained Lottie 5.7+ vector animations crafted in the official
 * Cabinet Médical de Cardiologie Paris 16 palette:
 * - Deep Navy: #061B49 [0.024, 0.106, 0.286, 1]
 * - Royal Blue: #0052CC [0, 0.322, 0.8, 1]
 * - Sky Blue: #38BDF8 [0.22, 0.741, 0.973, 1]
 * - Cardiac Crimson: #DC141C [0.863, 0.078, 0.11, 1]
 */
const HEARTBEAT_PULSE_LOTTIE = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: 'CardiacPulseParis16',
  ddd: 0,
  assets: [],
  layers: [
    // Layer 1: Expanding Crimson Sonar Ring
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'OuterSonarRing',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [85], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.2], y: [0] } },
            { t: 90, s: [0], e: [0] },
            { t: 120, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [45, 45, 100], e: [155, 155, 100], i: { x: [0.2], y: [1] }, o: { x: [0.2], y: [0] } },
            { t: 90, s: [155, 155, 100], e: [155, 155, 100] },
            { t: 120, s: [155, 155, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [110, 110] }, p: { a: 0, k: [0, 0] }, nm: 'RingPath' },
            {
              ty: 'st',
              c: { a: 0, k: [0.863, 0.078, 0.11, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
              nm: 'Stroke',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'RingGroup',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
    // Layer 2: Secondary Blue Sonar Ring
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'InnerBlueRing',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 20, s: [75], e: [0], i: { x: [0.4], y: [1] }, o: { x: [0.2], y: [0] } },
            { t: 115, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 20, s: [50, 50, 100], e: [140, 140, 100], i: { x: [0.2], y: [1] }, o: { x: [0.2], y: [0] } },
            { t: 115, s: [140, 140, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [100, 100] }, p: { a: 0, k: [0, 0] }, nm: 'RingPath2' },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0.533, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2,
              nm: 'Stroke2',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'RingGroup2',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
    // Layer 3: Pulsing Medical Cross & Core Disc
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'PulsingCore',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [92, 92, 100], e: [112, 112, 100] },
            { t: 18, s: [112, 112, 100], e: [96, 96, 100] },
            { t: 34, s: [96, 96, 100], e: [108, 108, 100] },
            { t: 52, s: [108, 108, 100], e: [92, 92, 100] },
            { t: 120, s: [92, 92, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'rc', d: 1, s: { a: 0, k: [22, 66] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 6 }, nm: 'VertBar' },
            { ty: 'rc', d: 1, s: { a: 0, k: [66, 22] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 6 }, nm: 'HorizBar' },
            {
              ty: 'fl',
              c: { a: 0, k: [0.863, 0.078, 0.11, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: 'CrimsonFill',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'CrossShape',
        },
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [94, 94] }, p: { a: 0, k: [0, 0] }, nm: 'CoreCircle' },
            {
              ty: 'fl',
              c: { a: 0, k: [0.024, 0.106, 0.286, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              nm: 'NavyFill',
            },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0.533, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
              nm: 'BlueRim',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'CircleBg',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

const ECG_MONITOR_LOTTIE = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 240,
  h: 80,
  nm: 'ECGMonitorWave',
  ddd: 0,
  assets: [],
  layers: [
    // Scanning glowing dot moving across ECG trace
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'ECGScannerDot',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [12, 40, 0], e: [80, 40, 0] },
            { t: 35, s: [80, 40, 0], e: [96, 14, 0] },
            { t: 45, s: [96, 14, 0], e: [112, 66, 0] },
            { t: 55, s: [112, 66, 0], e: [128, 8, 0] },
            { t: 68, s: [128, 8, 0], e: [144, 68, 0] },
            { t: 80, s: [144, 68, 0], e: [160, 40, 0] },
            { t: 120, s: [228, 40, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [145, 145, 100] },
            { t: 60, s: [145, 145, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            { ty: 'el', d: 1, s: { a: 0, k: [12, 12] }, p: { a: 0, k: [0, 0] }, nm: 'Dot' },
            { ty: 'fl', c: { a: 0, k: [0.863, 0.078, 0.11, 1] }, o: { a: 0, k: 100 }, r: 1, nm: 'RedDot' },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'DotGroup',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
    // ECG Path Line
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'ECGLine',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 40, 0] },
        a: { a: 0, k: [120, 40, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [12, 40],
                    [80, 40],
                    [96, 14],
                    [112, 66],
                    [128, 8],
                    [144, 68],
                    [160, 40],
                    [228, 40],
                  ],
                  c: false,
                },
              },
              nm: 'WavePath',
            },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0.322, 0.8, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
              nm: 'WaveStroke',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: 'WaveGroup',
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0,
    },
  ],
};

interface MedicalLottieProps {
  variant?: MedicalLottieVariant;
  className?: string;
}

export const MedicalLottie: React.FC<MedicalLottieProps> = ({
  variant = 'heartbeat-pulse',
  className = 'w-14 h-14',
}) => {
  const animationData =
    variant === 'ecg-monitor' ? ECG_MONITOR_LOTTIE : HEARTBEAT_PULSE_LOTTIE;

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`} aria-hidden="true">
      <Lottie animationData={animationData} loop={true} autoplay={true} className="w-full h-full" />
    </div>
  );
};
