import React, { useState } from 'react';
import {
  Lock,
  User,
  X,
  Save,
  CheckCircle2,
  Trash2,
  Calendar,
  MessageSquare,
  Stethoscope,
  Building2,
  ShieldCheck,
  LogOut,
  Database,
  Phone,
  Plus,
  KeyRound,
} from 'lucide-react';
import {
  AppointmentItem,
  ClinicSiteData,
  Language,
  TestimonialItem,
} from '../data/initialClinicData';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: ClinicSiteData;
  testimonials: TestimonialItem[];
  lang: Language;
  onSiteDataUpdated: (newData: ClinicSiteData) => void;
  onTestimonialsUpdated: (newList: TestimonialItem[]) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  siteData,
  testimonials,
  lang,
  onSiteDataUpdated,
  onTestimonialsUpdated,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'general' | 'clinical' | 'particularities' | 'appointments' | 'testimonials' | 'security'
  >('general');

  const [draftData, setDraftData] = useState<ClinicSiteData>(siteData);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [sanityStatus, setSanityStatus] = useState<{
    projectId: string;
    organizationId: string;
    dataset: string;
    connected: boolean;
  } | null>(null);

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [newAdminUser, setNewAdminUser] = useState('admin');
  const [newAdminPass, setNewAdminPass] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setLoginError(data.error || 'Identifiants invalides');
      } else {
        setToken(data.token);
        setDraftData(data.siteData);
        setAppointments(data.appointments || []);
        setSanityStatus(data.sanityInfo || null);
        setNewAdminUser(data.username || 'admin');
        onTestimonialsUpdated(data.testimonials || testimonials);
      }
    } catch {
      setLoginError('Erreur réseau lors de la connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!token) return;
    setLoading(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const resp = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteData: draftData }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setSaveError(data.error || 'Erreur lors de la sauvegarde');
      } else {
        onSiteDataUpdated(data.siteData);
        setSaveMessage(
          data.sanitySynced
            ? 'Modifications enregistrées et synchronisées sur Sanity CMS (l3036eyt) !'
            : 'Modifications enregistrées avec succès !'
        );
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } catch {
      setSaveError('Erreur réseau lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!token) return;
    try {
      const resp = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        onTestimonialsUpdated(data.testimonials);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointmentStatus = async (
    id: string,
    status: AppointmentItem['status']
  ) => {
    if (!token) return;
    try {
      const resp = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaveMessage(null);
    setSaveError(null);
    try {
      const resp = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newAdminUser,
          password: newAdminPass,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setSaveError(data.error || 'Erreur');
      } else {
        setNewAdminPass('');
        setSaveMessage(data.message);
      }
    } catch {
      setSaveError('Erreur lors de la mise à jour des identifiants.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061B49]/65 backdrop-blur-md overflow-y-auto">
      {!token ? (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#0052CC]/30 relative my-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F4F8FD] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <img
              src={siteData.logoUrl}
              alt="Logo Cabinet Paris 16"
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-contain rounded-2xl bg-[#F4F8FD] p-1.5 border border-slate-200"
            />
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase text-[#DC141C]">
                PORTAIL D’ADMINISTRATION SÉCURISÉ
              </p>
              <h3 className="text-lg font-extrabold text-[#061B49]">
                {siteData.clinicName[lang]}
              </h3>
              <p className="text-xs text-slate-500">{siteData.doctorName} · Sanity CMS</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr' ? "Nom d'utilisateur (Username)" : 'Username'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#0052CC] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#061B49] mb-1.5">
                {lang === 'fr' ? 'Mot de passe (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#0052CC] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#061B49] via-[#0052CC] to-[#DC141C] hover:opacity-95 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              {loading
                ? lang === 'fr'
                  ? 'Connexion en cours...'
                  : 'Signing in...'
                : lang === 'fr'
                  ? 'Se connecter au Portail Admin'
                  : 'Sign In to Admin Portal'}
            </button>
          </form>

          <div className="mt-5 p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#0052CC]/15 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <div className="font-bold text-[#061B49]">Accès propriétaire par défaut :</div>
              <div className="font-mono text-[11px] mt-0.5">
                User: <strong className="text-[#0052CC]">admin</strong> · Pass:{' '}
                <strong className="text-[#DC141C]">Paris16Cardio2026</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('Paris16Cardio2026');
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#DC141C] text-[11px] font-semibold text-[#0052CC] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Remplir
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-[#0052CC]/30 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 bg-gradient-to-r from-[#061B49] via-[#0052CC] to-[#DC141C] text-white flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-sky-300" />
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  Administration · {draftData.clinicName.fr}
                </h3>
                <p className="text-xs text-white/85 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>
                    Sanity CMS connecté · Projet:{' '}
                    <strong className="font-mono">{sanityStatus?.projectId || 'l3036eyt'}</strong> · Org:{' '}
                    <strong className="font-mono">{sanityStatus?.organizationId || 'oh314dkvd'}</strong>
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 text-[#061B49] text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4 text-[#DC141C]" />
                <span>{loading ? 'Sauvegarde...' : 'Enregistrer sur Sanity'}</span>
              </button>
              <button
                type="button"
                onClick={() => setToken(null)}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(saveMessage || saveError) && (
            <div
              className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
                saveMessage ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveMessage || saveError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSaveMessage(null);
                  setSaveError(null);
                }}
                className="underline cursor-pointer"
              >
                Fermer
              </button>
            </div>
          )}

          <div className="px-6 py-3 bg-[#F4F8FD] border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'general', label: '1. Cabinet & Contacts', icon: Building2 },
              { id: 'clinical', label: '2. Pathologies & Explorations', icon: Stethoscope },
              { id: 'particularities', label: '3. Notre Particularité (4 Piliers)', icon: ShieldCheck },
              {
                id: 'appointments',
                label: `4. Rendez-vous (${appointments.length})`,
                icon: Calendar,
              },
              {
                id: 'testimonials',
                label: `5. Témoignages (${testimonials.length})`,
                icon: MessageSquare,
              },
              { id: 'security', label: '6. Identifiants Admin', icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    active
                      ? 'bg-[#061B49] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:text-[#061B49] border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Nom de l’établissement (Français)
                  </label>
                  <input
                    type="text"
                    value={draftData.clinicName.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        clinicName: { ...draftData.clinicName, fr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Nom de l’établissement (Anglais)
                  </label>
                  <input
                    type="text"
                    value={draftData.clinicName.en}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        clinicName: { ...draftData.clinicName, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Médecin Responsable
                  </label>
                  <input
                    type="text"
                    value={draftData.doctorName}
                    onChange={(e) => setDraftData({ ...draftData, doctorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Téléphone / Rendez-vous
                  </label>
                  <input
                    type="text"
                    value={draftData.phone}
                    onChange={(e) => setDraftData({ ...draftData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Numéro WhatsApp (format international sans +)
                  </label>
                  <input
                    type="text"
                    value={draftData.whatsappNumber}
                    onChange={(e) =>
                      setDraftData({ ...draftData, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Adresse E-mail Officielle
                  </label>
                  <input
                    type="email"
                    value={draftData.email}
                    onChange={(e) => setDraftData({ ...draftData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Slogan 1 (Français)
                  </label>
                  <input
                    type="text"
                    value={draftData.sloganPrimary.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        sloganPrimary: { ...draftData.sloganPrimary, fr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Slogan 2 (Français)
                  </label>
                  <input
                    type="text"
                    value={draftData.sloganSecondary.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        sloganSecondary: { ...draftData.sloganSecondary, fr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Adresse Physique Complète (Français)
                  </label>
                  <input
                    type="text"
                    value={draftData.addressFull.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        addressFull: { ...draftData.addressFull, fr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Message Dépistage Apnée du Sommeil (Flyer)
                  </label>
                  <input
                    type="text"
                    value={draftData.sleepApneaBanner.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        sleepApneaBanner: { ...draftData.sleepApneaBanner, fr: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Synthèse Générale du Cabinet (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={draftData.synthesisParagraph1.fr}
                    onChange={(e) =>
                      setDraftData({
                        ...draftData,
                        synthesisParagraph1: {
                          ...draftData.synthesisParagraph1,
                          fr: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'clinical' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-extrabold text-[#061B49]">
                      Explorations Cardiologiques ({draftData.explorations.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const nextNum = String(draftData.explorations.length + 1).padStart(2, '0');
                        setDraftData({
                          ...draftData,
                          explorations: [
                            ...draftData.explorations,
                            {
                              id: `exp-${Date.now()}`,
                              number: nextNum,
                              title: { fr: 'Nouvelle Exploration', en: 'New Exploration' },
                              shortDesc: {
                                fr: 'Description courte de l’examen.',
                                en: 'Short exam description.',
                              },
                              details: {
                                fr: 'Détails complets de l’examen au cabinet.',
                                en: 'Full details of the clinical exam.',
                              },
                              duration: { fr: '20 minutes', en: '20 minutes' },
                              preparation: { fr: 'Aucune préparation.', en: 'No preparation.' },
                              sameDay: true,
                              illustrationType: 'ecg',
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0052CC] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un examen</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {draftData.explorations.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-2xl bg-[#F4F8FD] border border-slate-200 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#0052CC]">
                            Examen #{exp.number}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDraftData({
                                ...draftData,
                                explorations: draftData.explorations.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={exp.title.fr}
                          onChange={(e) => {
                            const updated = [...draftData.explorations];
                            updated[idx] = {
                              ...exp,
                              title: { ...exp.title, fr: e.target.value },
                            };
                            setDraftData({ ...draftData, explorations: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#061B49]"
                        />
                        <textarea
                          rows={2}
                          value={exp.shortDesc.fr}
                          onChange={(e) => {
                            const updated = [...draftData.explorations];
                            updated[idx] = {
                              ...exp,
                              shortDesc: { ...exp.shortDesc, fr: e.target.value },
                            };
                            setDraftData({ ...draftData, explorations: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-extrabold text-[#061B49]">
                      Pathologies Prises en Charge ({draftData.pathologies.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const nextNum = String(draftData.pathologies.length + 1).padStart(2, '0');
                        setDraftData({
                          ...draftData,
                          pathologies: [
                            ...draftData.pathologies,
                            {
                              id: `patho-${Date.now()}`,
                              number: nextNum,
                              title: { fr: 'Nouvelle Pathologie', en: 'New Pathology' },
                              shortDesc: {
                                fr: 'Prise en charge spécialisée au cabinet.',
                                en: 'Specialized care at our practice.',
                              },
                              details: {
                                fr: 'Description clinique détaillée.',
                                en: 'Detailed clinical description.',
                              },
                              symptoms: { fr: 'Symptômes principaux.', en: 'Main symptoms.' },
                              prevention: { fr: 'Suivi cardiologique.', en: 'Cardiology follow-up.' },
                              category: 'vascular',
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#DC141C] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une pathologie</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {draftData.pathologies.map((pat, idx) => (
                      <div
                        key={pat.id}
                        className="p-4 rounded-2xl bg-[#F4F8FD] border border-slate-200 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#DC141C]">
                            Pathologie #{pat.number}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDraftData({
                                ...draftData,
                                pathologies: draftData.pathologies.filter((_, i) => i !== idx),
                              })
                            }
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={pat.title.fr}
                          onChange={(e) => {
                            const updated = [...draftData.pathologies];
                            updated[idx] = {
                              ...pat,
                              title: { ...pat.title, fr: e.target.value },
                            };
                            setDraftData({ ...draftData, pathologies: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#061B49]"
                        />
                        <textarea
                          rows={2}
                          value={pat.shortDesc.fr}
                          onChange={(e) => {
                            const updated = [...draftData.pathologies];
                            updated[idx] = {
                              ...pat,
                              shortDesc: { ...pat.shortDesc, fr: e.target.value },
                            };
                            setDraftData({ ...draftData, pathologies: updated });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'particularities' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {draftData.particularities.map((part, idx) => (
                  <div
                    key={part.id}
                    className="p-5 rounded-2xl bg-[#F4F8FD] border border-slate-200 space-y-3"
                  >
                    <div className="text-xs font-bold text-[#0052CC] uppercase">
                      Pilier #{idx + 1} · Notre Particularité
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Titre (FR)
                      </label>
                      <input
                        type="text"
                        value={part.title.fr}
                        onChange={(e) => {
                          const updated = [...draftData.particularities];
                          updated[idx] = {
                            ...part,
                            title: { ...part.title, fr: e.target.value },
                          };
                          setDraftData({ ...draftData, particularities: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Notre différence (FR)
                      </label>
                      <textarea
                        rows={3}
                        value={part.description.fr}
                        onChange={(e) => {
                          const updated = [...draftData.particularities];
                          updated[idx] = {
                            ...part,
                            description: { ...part.description, fr: e.target.value },
                          };
                          setDraftData({ ...draftData, particularities: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-[#061B49]">
                  Demandes de Rendez-vous Patients ({appointments.length})
                </h4>
                {appointments.length === 0 ? (
                  <p className="text-sm text-slate-500">Aucun rendez-vous enregistré.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appt) => (
                      <div
                        key={appt._id}
                        className="p-4 rounded-2xl bg-[#F4F8FD] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold text-[#061B49]">
                              {appt.patientName}
                            </span>
                            {appt.isUrgent && (
                              <span className="text-xs font-bold text-[#DC141C]">· URGENCE</span>
                            )}
                            <span className="text-xs text-slate-500 font-mono">
                              · {appt.preferredDate} ({appt.preferredTime})
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-[#0052CC]">
                            {appt.explorationOrPathology} — {appt.reason}
                          </div>
                          {appt.notes && (
                            <p className="text-xs text-slate-600 italic">“{appt.notes}”</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                            <a
                              href={`tel:${appt.phone}`}
                              className="flex items-center gap-1 text-[#0052CC] font-mono font-bold hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {appt.phone}
                            </a>
                            {appt.email && <span>{appt.email}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={appt.status}
                            onChange={(e) =>
                              handleUpdateAppointmentStatus(
                                appt._id,
                                e.target.value as AppointmentItem['status']
                              )
                            }
                            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#061B49]"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmé</option>
                            <option value="completed">Effectué</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <h4 className="text-base font-extrabold text-[#061B49]">
                  Modération des Témoignages Patients ({testimonials.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((t) => (
                    <div
                      key={t._id}
                      className="p-4 rounded-2xl bg-[#F4F8FD] border border-slate-200 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#061B49]">{t.patientName}</span>
                          <span className="text-xs font-mono font-bold text-amber-600">
                            {t.rating}/5 ★
                          </span>
                        </div>
                        <p className="text-xs text-[#0052CC] font-medium">{t.serviceUsed}</p>
                        <p className="text-xs text-slate-700 mt-2">“{t.comment}”</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {t._id.slice(0, 16)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t._id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleUpdateCredentials} className="max-w-md space-y-4">
                <h4 className="text-base font-extrabold text-[#061B49]">
                  Modifier les Identifiants Administrateur
                </h4>
                <p className="text-xs text-slate-600">
                  Personnalisez le nom d’utilisateur et le mot de passe utilisés pour accéder à ce portail d’administration.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Nouveau nom d’utilisateur
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    Nouveau mot de passe (min. 6 caractères)
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="Nouveau mot de passe sécurisé"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#061B49] text-white text-xs font-bold cursor-pointer"
                >
                  Mettre à jour les identifiants
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
