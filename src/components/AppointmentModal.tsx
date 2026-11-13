import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  User,
  Mail,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { ClinicSiteData, Language } from '../data/initialClinicData';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: ClinicSiteData;
  lang: Language;
  preselectedSubject?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  siteData,
  lang,
  preselectedSubject = '',
}) => {
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(
    lang === 'fr' ? 'Matin (08h00 - 12h30)' : 'Morning (08:00 AM - 12:30 PM)'
  );
  const [explorationOrPathology, setExplorationOrPathology] = useState(
    preselectedSubject ||
      (lang === 'fr'
        ? 'Bilan Cardiologique Complet (Consultation + ECG + Écho)'
        : 'Full Cardiology Workup (Consultation + ECG + Echo)')
  );
  const [notes, setNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const subjectOptions = [
    lang === 'fr'
      ? 'Bilan Cardiologique Complet (Consultation + ECG + Écho sur place)'
      : 'Full Cardiology Workup (Consultation + On-Site ECG + Echo)',
    lang === 'fr'
      ? 'Dépistage Apnée du Sommeil (Polygraphie ventilatoire)'
      : 'Sleep Apnea Screening (Respiratory Polygraphy)',
    ...siteData.explorations.map((e) => `${lang === 'fr' ? 'Examen' : 'Exam'} : ${e.title[lang]}`),
    ...siteData.pathologies.map((p) => `${lang === 'fr' ? 'Suivi' : 'Care'} : ${p.title[lang]}`),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientName.trim() || !phone.trim() || !preferredDate) {
      setErrorMsg(
        lang === 'fr'
          ? 'Veuillez renseigner votre nom, votre téléphone et la date souhaitée.'
          : 'Please enter your name, phone number, and preferred date.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          preferredDate,
          preferredTime,
          reason: isUrgent ? 'Consultation Urgente' : 'Consultation Planifiée',
          explorationOrPathology,
          notes: notes.trim(),
          isUrgent,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setErrorMsg(data.error || 'Error');
      } else {
        setConfirmed(true);
      }
    } catch {
      setErrorMsg(
        lang === 'fr'
          ? 'Erreur de connexion. Vous pouvez également nous joindre au +237 693 44 78 10.'
          : 'Connection error. You can also reach us directly at +237 693 44 78 10.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${siteData.whatsappNumber}?text=${encodeURIComponent(
    lang === 'fr'
      ? `Bonjour Dr Annick TCHAM (Cabinet Médical de Cardiologie Paris 16), je souhaite prendre rendez-vous.\nNom : ${patientName || '...'}\nMotif : ${explorationOrPathology}\nDate souhaitée : ${preferredDate || '...'}`
      : `Hello Dr Annick TCHAM (Paris 16 Cardiology Medical Practice), I would like to book an appointment.\nName: ${patientName || '...'}\nReason: ${explorationOrPathology}\nPreferred Date: ${preferredDate || '...'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061B49]/65 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#0052CC]/30 relative my-auto">
        <button
          type="button"
          onClick={() => {
            setConfirmed(false);
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F4F8FD] hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmed ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF3FC] text-[#0052CC] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#DC141C]">
                {lang === 'fr' ? 'DEMANDE ENREGISTRÉE' : 'APPOINTMENT REQUEST SAVED'}
              </p>
              <h3 className="text-2xl font-extrabold text-[#061B49] mt-1">
                {lang === 'fr'
                  ? 'Votre demande de rendez-vous est confirmée !'
                  : 'Your appointment request has been registered!'}
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                {lang === 'fr'
                  ? `Merci ${patientName}. Le secrétariat du ${siteData.doctorName} vous recontactera très rapidement au ${phone}.`
                  : `Thank you ${patientName}. ${siteData.doctorName}'s office will contact you promptly at ${phone}.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F8FD] border border-slate-200 text-left text-xs space-y-1.5">
              <div>
                <span className="text-slate-500">
                  {lang === 'fr' ? 'Motif / Exploration :' : 'Reason / Exam:'}
                </span>{' '}
                <strong className="text-[#061B49]">{explorationOrPathology}</strong>
              </div>
              <div>
                <span className="text-slate-500">
                  {lang === 'fr' ? 'Créneau souhaité :' : 'Preferred Slot:'}
                </span>{' '}
                <strong className="text-[#0052CC] font-mono">
                  {preferredDate} · {preferredTime}
                </strong>
              </div>
              <div>
                <span className="text-slate-500">{lang === 'fr' ? 'Adresse :' : 'Address:'}</span>{' '}
                <span className="text-slate-700">{siteData.addressShort[lang]}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#DC141C] hover:bg-[#b81017] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {lang === 'fr' ? 'Confirmer aussi sur WhatsApp' : 'Also Confirm via WhatsApp'}
                </span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#061B49] text-white text-xs font-bold cursor-pointer"
              >
                {lang === 'fr' ? 'Retour au site' : 'Back to Website'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#061B49] via-[#0052CC] to-[#DC141C] text-white flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#DC141C]">
                  {siteData.clinicName[lang]}
                </p>
                <h3 className="text-xl font-extrabold text-[#061B49]">
                  {lang === 'fr'
                    ? `Prendre Rendez-vous avec ${siteData.doctorName}`
                    : `Book an Appointment with ${siteData.doctorName}`}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'fr'
                    ? 'Bilan complet sur place le même jour · Rendez-vous rapide'
                    : 'Complete same-day on-site checkup · Fast scheduling'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder={lang === 'fr' ? 'Votre nom complet' : 'Your full name'}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+237 6..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] font-mono focus:outline-none focus:border-[#0052CC]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    {lang === 'fr' ? 'Adresse e-mail' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@email.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    {lang === 'fr' ? 'Date souhaitée *' : 'Preferred Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] font-mono focus:outline-none focus:border-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#061B49] mb-1">
                    {lang === 'fr' ? 'Créneau horaire' : 'Time Slot'}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-xs font-semibold text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                    >
                      <option value="Matin (08h00 - 12h30)">
                        {lang === 'fr' ? 'Matin (08h00 - 12h30)' : 'Morning (08:00 - 12:30)'}
                      </option>
                      <option value="Après-midi (13h30 - 18h00)">
                        {lang === 'fr' ? 'Après-midi (13h30 - 18h00)' : 'Afternoon (13:30 - 18:00)'}
                      </option>
                      <option value="Urgence dès que possible">
                        {lang === 'fr' ? 'Urgence dès que possible' : 'Urgent / Earliest Slot'}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#061B49] mb-1">
                  {lang === 'fr'
                    ? 'Consultation, Exploration ou Pathologie concernée'
                    : 'Consultation, Exploration, or Condition'}
                </label>
                <select
                  value={explorationOrPathology}
                  onChange={(e) => setExplorationOrPathology(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                >
                  {subjectOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#061B49] mb-1">
                  {lang === 'fr'
                    ? 'Symptômes ou précisions pour le Dr Annick TCHAM (optionnel)'
                    : 'Symptoms or notes for Dr Annick TCHAM (optional)'}
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      lang === 'fr'
                        ? 'Ex: essoufflement, contrôle HTA, ronflements nocturnes, bilan pré-opératoire...'
                        : 'e.g. shortness of breath, BP check, nighttime snoring...'
                    }
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F4F8FD] border border-slate-200 text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50/80 border border-red-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 accent-[#DC141C] rounded"
                />
                <AlertCircle className="w-4 h-4 text-[#DC141C] shrink-0" />
                <span className="text-xs font-semibold text-red-900">
                  {lang === 'fr'
                    ? 'Demande urgente (douleur thoracique, palpitations aiguës, tension très élevée)'
                    : 'Urgent request (chest pain, acute palpitations, very high blood pressure)'}
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0052CC] to-[#DC141C] hover:opacity-95 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  {submitting
                    ? lang === 'fr'
                      ? 'Enregistrement...'
                      : 'Booking...'
                    : lang === 'fr'
                      ? 'Confirmer le Rendez-vous'
                      : 'Confirm Appointment'}
                </button>
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-[#F4F8FD] hover:bg-[#EBF3FC] text-[#061B49] border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#DC141C]" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
