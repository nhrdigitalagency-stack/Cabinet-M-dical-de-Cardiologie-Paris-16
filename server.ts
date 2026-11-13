import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CLINIC_DATA,
  INITIAL_TESTIMONIALS,
  ClinicSiteData,
  TestimonialItem,
  AppointmentItem,
} from './src/data/initialClinicData.ts';

const PORT = 3000;
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'l3036eyt';
const SANITY_ORG_ID = process.env.SANITY_ORG_ID || 'oh314dkvd';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || '';
const SANITY_API_VERSION = 'v2024-01-01';

const CACHE_DIR = path.resolve(process.cwd(), 'data');
const CACHE_FILE = path.join(CACHE_DIR, 'cms-store.json');

interface LocalStore {
  siteData: ClinicSiteData;
  testimonials: TestimonialItem[];
  appointments: AppointmentItem[];
  adminCredentials: {
    username: string;
    passwordHash: string;
  };
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(`paris16_salt_${password}`).digest('hex');
}

function sanitizeText(input: unknown, maxLen = 1000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .slice(0, maxLen);
}

function loadLocalStore(): LocalStore {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        siteData: parsed.siteData || INITIAL_CLINIC_DATA,
        testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : INITIAL_TESTIMONIALS,
        appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
        adminCredentials: parsed.adminCredentials || {
          username: process.env.ADMIN_USERNAME || 'admin',
          passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'Paris16Cardio2026'),
        },
      };
    }
  } catch (err) {
    console.error('Error loading local store:', err);
  }
  const initialStore: LocalStore = {
    siteData: INITIAL_CLINIC_DATA,
    testimonials: INITIAL_TESTIMONIALS,
    appointments: [
      {
        _id: 'appt-demo-1',
        patientName: 'Marie-Louise Tchoua',
        phone: '+237 699 12 34 56',
        email: 'ml.tchoua@example.com',
        preferredDate: '2026-11-14',
        preferredTime: '09:30',
        reason: 'Bilan HTA + Échocardiographie Doppler',
        explorationOrPathology: 'Hypertension Artérielle (HTA)',
        notes: 'Première consultation au cabinet avec bilan complet le même jour.',
        status: 'confirmed',
        isUrgent: false,
        createdAt: '2026-11-10T11:20:00.000Z',
      },
    ],
    adminCredentials: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'Paris16Cardio2026'),
    },
  };
  saveLocalStore(initialStore);
  return initialStore;
}

function saveLocalStore(store: LocalStore) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err);
  }
}

const store = loadLocalStore();
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

async function sanityQuery<T = unknown>(groq: string): Promise<T | null> {
  if (!SANITY_PROJECT_ID) return null;
  try {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (SANITY_API_TOKEN) {
      headers['Authorization'] = `Bearer ${SANITY_API_TOKEN}`;
    }
    const resp = await fetch(url, { headers });
    if (!resp.ok) return null;
    const data = (await resp.json()) as { result: T };
    return data.result;
  } catch (err) {
    console.error('Sanity query error:', err);
    return null;
  }
}

async function sanityMutate(mutations: Array<Record<string, unknown>>): Promise<boolean> {
  if (!SANITY_PROJECT_ID || !SANITY_API_TOKEN) return false;
  try {
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    });
    return resp.ok;
  } catch (err) {
    console.error('Sanity mutation error:', err);
    return false;
  }
}

async function syncWithSanityOnBoot() {
  if (!SANITY_API_TOKEN) return;
  try {
    const remoteConfig = await sanityQuery<{ payload?: ClinicSiteData }>(
      `*[_type == "clinicConfig" && _id == "clinic-config-paris16"][0]`
    );
    if (remoteConfig && remoteConfig.payload) {
      store.siteData = remoteConfig.payload;
    } else {
      await sanityMutate([
        {
          createOrReplace: {
            _id: 'clinic-config-paris16',
            _type: 'clinicConfig',
            organizationId: SANITY_ORG_ID,
            updatedAt: new Date().toISOString(),
            payload: store.siteData,
          },
        },
      ]);
    }

    const remoteTestimonials = await sanityQuery<TestimonialItem[]>(
      `*[_type == "testimonial"] | order(createdAt desc)`
    );
    if (remoteTestimonials && remoteTestimonials.length > 0) {
      store.testimonials = remoteTestimonials;
    } else {
      const testimonialMutations = store.testimonials.map((t) => ({
        createOrReplace: {
          _id: t._id,
          _type: 'testimonial',
          patientName: t.patientName,
          patientRole: t.patientRole,
          serviceUsed: t.serviceUsed,
          rating: t.rating,
          comment: t.comment,
          createdAt: t.createdAt,
          verified: t.verified,
        },
      }));
      await sanityMutate(testimonialMutations);
    }

    const remoteAppointments = await sanityQuery<AppointmentItem[]>(
      `*[_type == "appointment"] | order(createdAt desc)`
    );
    if (remoteAppointments && remoteAppointments.length > 0) {
      store.appointments = remoteAppointments;
    } else if (store.appointments.length > 0) {
      const apptMutations = store.appointments.map((a) => ({
        createOrReplace: {
          ...a,
          _type: 'appointment',
        },
      }));
      await sanityMutate(apptMutations);
    }

    saveLocalStore(store);
    console.log(`Connected and synced with Sanity CMS (Project: ${SANITY_PROJECT_ID}, Org: ${SANITY_ORG_ID})`);
  } catch (err) {
    console.error('Initial Sanity sync warning:', err);
  }
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès non autorisé. Veuillez vous connecter.' });
    return;
  }
  const token = authHeader.slice(7);
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Trigger background Sanity sync
  syncWithSanityOnBoot();

  // Technical SEO: /robots.txt for Google, Bing, and WhatsApp crawlers
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const appUrl =
      process.env.APP_URL ||
      'https://ais-pre-er2k2ejusg6bnnkfz2j6yh-323022168140.europe-west2.run.app';
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/admin/',
        `Sitemap: ${appUrl.replace(/\/$/, '')}/sitemap.xml`,
      ].join('\n')
    );
  });

  // Technical SEO: /sitemap.xml covering Douala (Bonapriso) & Cameroon Cardiology Sections
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const baseUrl = (
      process.env.APP_URL ||
      'https://ais-pre-er2k2ejusg6bnnkfz2j6yh-323022168140.europe-west2.run.app'
    ).replace(/\/$/, '');
    const now = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/?section=about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?section=pathologies</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?section=explorations</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/?section=testimonials</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/?section=contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    res.header('Content-Type', 'application/xml').send(xml);
  });

  // Public Endpoint: Get all site content & live testimonials
  app.get('/api/site-data', async (_req: Request, res: Response) => {
    res.json({
      siteData: store.siteData,
      testimonials: store.testimonials,
      sanityInfo: {
        projectId: SANITY_PROJECT_ID,
        organizationId: SANITY_ORG_ID,
        dataset: SANITY_DATASET,
        connected: Boolean(SANITY_API_TOKEN),
      },
    });
  });

  // Public Endpoint: Patient publishes a live testimonial
  app.post('/api/testimonials', async (req: Request, res: Response) => {
    try {
      const patientName = sanitizeText(req.body?.patientName, 80);
      const patientRole = sanitizeText(req.body?.patientRole || 'Patient du Cabinet · Douala', 100);
      const serviceUsed = sanitizeText(req.body?.serviceUsed || 'Consultation Cardiologique', 120);
      const comment = sanitizeText(req.body?.comment, 800);
      const rawRating = Number(req.body?.rating);
      const rating = Number.isFinite(rawRating) ? Math.min(5, Math.max(1, Math.round(rawRating))) : 5;

      if (!patientName || patientName.length < 2) {
        res.status(400).json({ error: 'Veuillez indiquer votre nom ou vos initiales.' });
        return;
      }
      if (!comment || comment.length < 10) {
        res.status(400).json({ error: 'Votre témoignage doit contenir au moins 10 caractères.' });
        return;
      }

      const newTestimonial: TestimonialItem = {
        _id: `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        patientName,
        patientRole,
        serviceUsed,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        verified: true,
      };

      store.testimonials = [newTestimonial, ...store.testimonials];
      saveLocalStore(store);

      // Persist immediately in Sanity CMS
      await sanityMutate([
        {
          createOrReplace: {
            ...newTestimonial,
            _type: 'testimonial',
          },
        },
      ]);

      res.status(201).json({
        testimonial: newTestimonial,
        testimonials: store.testimonials,
      });
    } catch (err) {
      console.error('Error creating testimonial:', err);
      res.status(500).json({ error: 'Erreur lors de la publication du témoignage.' });
    }
  });

  // Public Endpoint: Patient books an appointment
  app.post('/api/appointments', async (req: Request, res: Response) => {
    try {
      const patientName = sanitizeText(req.body?.patientName, 100);
      const phone = sanitizeText(req.body?.phone, 40);
      const email = sanitizeText(req.body?.email, 100);
      const preferredDate = sanitizeText(req.body?.preferredDate, 30);
      const preferredTime = sanitizeText(req.body?.preferredTime, 30);
      const reason = sanitizeText(req.body?.reason, 150);
      const explorationOrPathology = sanitizeText(req.body?.explorationOrPathology, 150);
      const notes = sanitizeText(req.body?.notes, 600);
      const isUrgent = Boolean(req.body?.isUrgent);

      if (!patientName || !phone || !preferredDate) {
        res.status(400).json({
          error: 'Veuillez renseigner votre nom complet, votre numéro de téléphone et la date souhaitée.',
        });
        return;
      }

      const newAppointment: AppointmentItem = {
        _id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        patientName,
        phone,
        email,
        preferredDate,
        preferredTime: preferredTime || 'Matin (08h30 - 12h00)',
        reason: reason || 'Consultation Cardiologique',
        explorationOrPathology: explorationOrPathology || 'Bilan Cardiologique Complet',
        notes,
        status: 'pending',
        isUrgent,
        createdAt: new Date().toISOString(),
      };

      store.appointments = [newAppointment, ...store.appointments];
      saveLocalStore(store);

      await sanityMutate([
        {
          createOrReplace: {
            ...newAppointment,
            _type: 'appointment',
          },
        },
      ]);

      res.status(201).json({
        appointment: newAppointment,
        message: 'Votre demande de rendez-vous a été enregistrée avec succès.',
      });
    } catch (err) {
      console.error('Error booking appointment:', err);
      res.status(500).json({ error: 'Erreur lors de la prise de rendez-vous.' });
    }
  });

  // Admin Endpoint: Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');

    const inputHash = hashPassword(password);
    if (
      username.toLowerCase() === store.adminCredentials.username.toLowerCase() &&
      inputHash === store.adminCredentials.passwordHash
    ) {
      const token = crypto.randomBytes(32).toString('hex');
      activeSessions.set(token, {
        username: store.adminCredentials.username,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12, // 12 hours
      });
      res.json({
        token,
        username: store.adminCredentials.username,
        siteData: store.siteData,
        testimonials: store.testimonials,
        appointments: store.appointments,
        sanityInfo: {
          projectId: SANITY_PROJECT_ID,
          organizationId: SANITY_ORG_ID,
          dataset: SANITY_DATASET,
          connected: Boolean(SANITY_API_TOKEN),
        },
      });
      return;
    }

    res.status(401).json({
      error: 'Identifiants incorrects. Veuillez vérifier votre nom d’utilisateur et mot de passe.',
    });
  });

  // Admin Endpoint: Get Dashboard Data
  app.get('/api/admin/dashboard', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      siteData: store.siteData,
      testimonials: store.testimonials,
      appointments: store.appointments,
      username: store.adminCredentials.username,
      sanityInfo: {
        projectId: SANITY_PROJECT_ID,
        organizationId: SANITY_ORG_ID,
        dataset: SANITY_DATASET,
        connected: Boolean(SANITY_API_TOKEN),
      },
    });
  });

  // Admin Endpoint: Update Clinic Site Data & Sync with Sanity
  app.put('/api/admin/config', requireAdminAuth, async (req: Request, res: Response) => {
    try {
      const updatedData = req.body?.siteData as ClinicSiteData;
      if (!updatedData || !updatedData.clinicName || !updatedData.phone) {
        res.status(400).json({ error: 'Données de configuration invalides.' });
        return;
      }

      store.siteData = updatedData;
      saveLocalStore(store);

      const sanitySynced = await sanityMutate([
        {
          createOrReplace: {
            _id: 'clinic-config-paris16',
            _type: 'clinicConfig',
            organizationId: SANITY_ORG_ID,
            updatedAt: new Date().toISOString(),
            payload: store.siteData,
          },
        },
      ]);

      res.json({
        siteData: store.siteData,
        sanitySynced,
        message: 'Informations du site mises à jour et synchronisées avec Sanity CMS.',
      });
    } catch (err) {
      console.error('Error updating clinic config:', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde de la configuration.' });
    }
  });

  // Admin Endpoint: Delete Testimonial
  app.delete('/api/admin/testimonials/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    store.testimonials = store.testimonials.filter((t) => t._id !== id);
    saveLocalStore(store);

    await sanityMutate([{ delete: { id } }]);
    res.json({ testimonials: store.testimonials });
  });

  // Admin Endpoint: Update Appointment Status
  app.patch('/api/admin/appointments/:id', requireAdminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body?.status as AppointmentItem['status'];
    const validStatuses: AppointmentItem['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Statut invalide.' });
      return;
    }

    store.appointments = store.appointments.map((a) => (a._id === id ? { ...a, status } : a));
    saveLocalStore(store);

    const updated = store.appointments.find((a) => a._id === id);
    if (updated) {
      await sanityMutate([
        {
          createOrReplace: {
            ...updated,
            _type: 'appointment',
          },
        },
      ]);
    }

    res.json({ appointments: store.appointments });
  });

  // Admin Endpoint: Update Admin Username & Password
  app.put('/api/admin/credentials', requireAdminAuth, async (req: Request, res: Response) => {
    const newUsername = String(req.body?.username || '').trim();
    const newPassword = String(req.body?.password || '');

    if (!newUsername || newUsername.length < 3 || !newPassword || newPassword.length < 6) {
      res.status(400).json({
        error: 'Le nom d’utilisateur (min 3 caractères) et le mot de passe (min 6 caractères) sont requis.',
      });
      return;
    }

    store.adminCredentials = {
      username: newUsername,
      passwordHash: hashPassword(newPassword),
    };
    saveLocalStore(store);

    await sanityMutate([
      {
        createOrReplace: {
          _id: 'clinic-admin-credentials',
          _type: 'adminCredentials',
          username: newUsername,
          updatedAt: new Date().toISOString(),
        },
      },
    ]);

    res.json({
      username: newUsername,
      message: 'Vos identifiants administrateur ont été mis à jour avec succès.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
