import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Stethoscope,
  Activity,
  CheckCircle2,
  Search,
  Calendar,
  Sparkles,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClinicSiteData,
  ExplorationItem,
  HealthArticleItem,
  Language,
  PathologyItem,
} from '../data/initialClinicData';
import { ExplorationIllustration } from './MedicalIllustrations';
import { SelectedClinicalItem } from './ClinicalDetailModal';

interface CardiologyInsightsSectionProps {
  siteData: ClinicSiteData;
  lang: Language;
  onSelectClinicalItem: (item: SelectedClinicalItem) => void;
  onBookWithSubject: (subject: string) => void;
  onNavigateToSection: (section: 'explorations' | 'pathologies' | 'insights') => void;
}

export const CardiologyInsightsSection: React.FC<CardiologyInsightsSectionProps> = ({
  siteData,
  lang,
  onSelectClinicalItem,
  onBookWithSubject,
  onNavigateToSection,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    siteData.articles[0]?.id || null
  );

  const mapArticleIllustration = (
    illustrationType: HealthArticleItem['illustrationType']
  ): ExplorationItem['illustrationType'] => {
    switch (illustrationType) {
      case 'sleep-apnea':
        return 'polygraphy';
      case 'hypertension':
        return 'mapa';
      case 'rhythm':
        return 'holter-ecg';
      case 'stress-test':
        return 'stress-test';
      case 'vascular':
        return 'vascular';
      default:
        return 'echo-doppler';
    }
  };

  const filterCategories = [
    { id: 'all', label: { fr: 'Tous les Articles', en: 'All Insights' } },
    { id: 'sleep-apnea', label: { fr: 'Apnée du Sommeil', en: 'Sleep Apnea' } },
    { id: 'hypertension', label: { fr: 'Hypertension & MAPA', en: 'Hypertension & ABPM' } },
    { id: 'rhythm', label: { fr: 'Rythmologie & Holter', en: 'Arrhythmia & Holter' } },
    { id: 'stress-test', label: { fr: 'Effort & Coronaires', en: 'Exercise & Coronary' } },
    { id: 'vascular', label: { fr: 'AVC & Doppler Vasculaire', en: 'Stroke & Vascular' } },
    { id: 'checkup', label: { fr: 'Bilan Même Jour', en: 'Same-Day Workup' } },
  ];

  const filteredArticles = useMemo(() => {
    return siteData.articles.filter((article) => {
      const matchesFilter =
        selectedFilter === 'all' || article.illustrationType === selectedFilter;
      if (!matchesFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        article.title[lang].toLowerCase().includes(q) ||
        article.summary[lang].toLowerCase().includes(q) ||
        article.content[lang].toLowerCase().includes(q) ||
        article.category[lang].toLowerCase().includes(q) ||
        (article.seoKeywords || []).some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [siteData.articles, selectedFilter, searchQuery, lang]);

  const getLinkedExplorations = (article: HealthArticleItem): ExplorationItem[] => {
    const ids = article.relatedExplorationIds || [];
    if (ids.length > 0) {
      return siteData.explorations.filter((e) => ids.includes(e.id));
    }
    // Fallback mapping based on illustrationType if custom article
    if (article.illustrationType === 'sleep-apnea') {
      return siteData.explorations.filter((e) =>
        ['polygraphie-ventilatoire', 'holter-tensionnel-mapa'].includes(e.id)
      );
    }
    if (article.illustrationType === 'hypertension') {
      return siteData.explorations.filter((e) =>
        ['holter-tensionnel-mapa', 'echocardiographie-doppler'].includes(e.id)
      );
    }
    return siteData.explorations.slice(0, 3);
  };

  const getLinkedPathologies = (article: HealthArticleItem): PathologyItem[] => {
    const ids = article.relatedPathologyIds || [];
    if (ids.length > 0) {
      return siteData.pathologies.filter((p) => ids.includes(p.id));
    }
    return siteData.pathologies.slice(0, 2);
  };

  // Structured Data JSON-LD for Cardiology Insights Blog (Boosts Douala & Cameroon SEO)
  const blogJsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name:
        lang === 'fr'
          ? 'Cardiology Insights · Conseils & Prévention Cardiologique — Cabinet Médical de Cardiologie Paris 16 (Douala, Cameroun)'
          : 'Cardiology Insights · Heart Health Tips & Prevention — Paris 16 Cardiology Clinic (Douala, Cameroon)',
      description:
        lang === 'fr'
          ? 'Articles médicaux et conseils de prévention cardiovasculaire rédigés par le Dr Annick TCHAM, Cardiologue à Bonapriso, Douala (Cameroun).'
          : 'Medical articles and cardiovascular prevention tips by Dr Annick TCHAM, Cardiologist in Bonapriso, Douala (Cameroon).',
      publisher: {
        '@type': 'MedicalClinic',
        name: siteData.clinicName[lang],
        telephone: siteData.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteData.addressShort[lang],
          addressLocality: 'Bonapriso, Douala',
          addressRegion: 'Littoral',
          addressCountry: 'CM',
        },
      },
      blogPost: siteData.articles.map((art) => ({
        '@type': 'BlogPosting',
        headline: art.title[lang],
        description: art.summary[lang],
        articleBody: art.content[lang],
        author: {
          '@type': 'Physician',
          name: siteData.doctorName,
          medicalSpecialty: 'Cardiovascular',
        },
        keywords: (art.seoKeywords || []).join(', '),
      })),
    };
  }, [siteData, lang]);

  return (
    <div className="space-y-10">
      {/* Embedded JSON-LD for Search Engine Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#DC141C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'fr'
                ? 'CARDIOLOGY INSIGHTS · BLOG & CONSEILS SANTÉ DU CŒUR (DOUALA & CAMEROUN)'
                : 'CARDIOLOGY INSIGHTS · HEART HEALTH BLOG & PREVENTION TIPS'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#061B49] mt-1 tracking-tight">
            {lang === 'fr' ? (
              <>
                Cardiology <span className="text-[#0052CC]">Insights</span> : Conseils &{' '}
                <span className="text-[#DC141C]">Prévention Cardiovasculaire</span>
              </>
            ) : (
              <>
                Cardiology <span className="text-[#0052CC]">Insights</span>: Heart Health{' '}
                <span className="text-[#DC141C]">Tips & Clinical Guides</span>
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
            {lang === 'fr'
              ? 'Découvrez les dossiers médicaux du Dr Annick TCHAM pour comprendre vos symptômes, adopter les bons réflexes de prévention et accéder directement aux examens cardiologiques correspondants réalisés sur place à Bonapriso (Douala).'
              : 'Explore Dr Annick TCHAM’s medical guides to understand your symptoms, adopt heart-healthy habits, and connect directly with the corresponding on-site cardiac explorations in Bonapriso (Douala).'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="w-4 h-4 text-[#0052CC] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'fr'
                ? 'Rechercher un conseil (HTA, MAPA, apnée, ECG...)'
                : 'Search insights (BP, ABPM, sleep apnea, ECG...)'
            }
            aria-label={lang === 'fr' ? 'Rechercher un article' : 'Search articles'}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-[#061B49] focus:outline-none focus:border-[#0052CC] shadow-xs"
          />
        </div>
      </div>

      {/* Interactive Category Filter Bar */}
      <div
        role="tablist"
        aria-label={lang === 'fr' ? 'Catégories Cardiology Insights' : 'Cardiology Insights categories'}
        className="flex flex-wrap items-center gap-2"
      >
        {filterCategories.map((cat) => {
          const isActive = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#061B49] to-[#0052CC] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-[#061B49] border border-slate-200/90 hover:border-[#0052CC]/40'
              }`}
            >
              {cat.label[lang]}
            </button>
          );
        })}
      </div>

      {/* Articles Grid with Direct Clinic Service Backlinks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedFilter}-${searchQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-7"
        >
          {filteredArticles.map((article, idx) => {
            const isExpanded = expandedArticleId === article.id;
            const linkedExplorations = getLinkedExplorations(article);
            const linkedPathologies = getLinkedPathologies(article);
            const takeaways = article.keyTakeaways?.[lang] || [];

            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: idx * 0.05 }}
                className={`bg-white rounded-3xl overflow-hidden wave-hover-card flex flex-col justify-between ${
                  isExpanded ? 'ring-2 ring-[#0052CC]/50' : ''
                }`}
              >
                <div>
                  {/* Article Visual Header */}
                  <div className="relative">
                    <ExplorationIllustration
                      type={mapArticleIllustration(article.illustrationType)}
                      className="w-full h-52 sm:h-56"
                    />
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-[#DC141C] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                        {article.category[lang]}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#061B49]/90 backdrop-blur-xs text-sky-200 text-[11px] font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-300" />
                        {article.readTime[lang]}
                      </span>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="text-xs font-semibold text-[#0052CC] flex flex-wrap items-center gap-2">
                      <span>{article.date[lang]}</span>
                      <span>·</span>
                      <span>
                        {lang === 'fr'
                          ? `Par ${siteData.doctorName}, Cardiologue à Douala`
                          : `By ${siteData.doctorName}, Cardiologist in Douala`}
                      </span>
                    </div>

                    <h3
                      onClick={() =>
                        setExpandedArticleId(isExpanded ? null : article.id)
                      }
                      className="text-lg sm:text-xl font-extrabold text-[#061B49] hover:text-[#0052CC] transition-colors cursor-pointer leading-snug"
                    >
                      {article.title[lang]}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {article.summary[lang]}
                    </p>

                    {/* Expandable Full Medical Guide + Key Takeaways */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="pt-3 border-t border-slate-100 space-y-4"
                      >
                        <p className="text-xs sm:text-sm text-[#061B49] leading-relaxed bg-[#F4F8FD] p-4 rounded-2xl border border-slate-200/80">
                          {article.content[lang]}
                        </p>

                        {takeaways.length > 0 && (
                          <div className="p-4 rounded-2xl bg-[#EBF3FC]/70 border border-[#0052CC]/20 space-y-2">
                            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0052CC] flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[#DC141C] shrink-0" />
                              <span>
                                {lang === 'fr'
                                  ? 'Conseils Clés pour Votre Cœur'
                                  : 'Key Heart Health Takeaways'}
                              </span>
                            </div>
                            <ul className="space-y-1.5">
                              {takeaways.map((tip, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-[#061B49] flex items-start gap-2 leading-relaxed"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC141C] mt-1.5 shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {article.seoKeywords && article.seoKeywords.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                            {article.seoKeywords.map((kw, kIdx) => (
                              <span
                                key={kIdx}
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* DIRECT INTERNAL BACKLINKS TO CLINIC SERVICES (Explorations & Pathologies) */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#061B49] flex items-center justify-between gap-2">
                        <span>
                          {lang === 'fr'
                            ? 'Services & Examens du Cabinet Associés :'
                            : 'Related Clinic Services & Explorations:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigateToSection('explorations')}
                          className="text-[#0052CC] hover:text-[#DC141C] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{lang === 'fr' ? 'Tout le plateau' : 'All services'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Linked Explorations Backlinks */}
                      <div className="flex flex-wrap gap-2">
                        {linkedExplorations.map((exp) => (
                          <button
                            key={exp.id}
                            type="button"
                            onClick={() =>
                              onSelectClinicalItem({ kind: 'exploration', item: exp })
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#F4F8FD] hover:bg-[#0052CC] text-[#061B49] hover:text-white border border-[#0052CC]/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group/link"
                            title={
                              lang === 'fr'
                                ? `Voir l'examen : ${exp.title.fr}`
                                : `View exploration: ${exp.title.en}`
                            }
                          >
                            <Stethoscope className="w-3.5 h-3.5 text-[#0052CC] group-hover/link:text-white shrink-0" />
                            <span>{exp.title[lang]}</span>
                          </button>
                        ))}

                        {/* Linked Pathologies Backlinks */}
                        {linkedPathologies.map((pat) => (
                          <button
                            key={pat.id}
                            type="button"
                            onClick={() =>
                              onSelectClinicalItem({ kind: 'pathology', item: pat })
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#FCE8EA]/60 hover:bg-[#DC141C] text-[#061B49] hover:text-white border border-[#DC141C]/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer group/pat"
                            title={
                              lang === 'fr'
                                ? `Voir la spécialité : ${pat.title.fr}`
                                : `View condition: ${pat.title.en}`
                            }
                          >
                            <Activity className="w-3.5 h-3.5 text-[#DC141C] group-hover/pat:text-white shrink-0" />
                            <span>{pat.title[lang]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 sm:px-7 py-4 bg-[#F4F8FD] border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedArticleId(isExpanded ? null : article.id)
                      }
                      className="text-xs font-extrabold text-[#0052CC] hover:text-[#DC141C] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>
                        {isExpanded
                          ? lang === 'fr'
                            ? 'Réduire l’article'
                            : 'Collapse article'
                          : lang === 'fr'
                            ? 'Lire le guide complet'
                            : 'Read full guide'}
                      </span>
                    </button>

                    <span className="text-slate-300">|</span>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectClinicalItem({ kind: 'article', item: article })
                      }
                      className="text-xs font-semibold text-slate-600 hover:text-[#061B49] cursor-pointer"
                    >
                      {lang === 'fr' ? 'Mode lecture fiche' : 'Reader modal'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onBookWithSubject(
                        linkedExplorations[0]?.title[lang] || article.title[lang]
                      )
                    }
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#061B49] to-[#0052CC] hover:from-[#DC141C] hover:to-[#0052CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'fr' ? 'Prendre RDV pour ce bilan' : 'Book Related Checkup'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty Search State */}
      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-[#061B49]">
            {lang === 'fr'
              ? 'Aucun article ne correspond à votre recherche.'
              : 'No heart health articles match your search.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold cursor-pointer"
          >
            {lang === 'fr' ? 'Afficher tous les articles' : 'Show all articles'}
          </button>
        </div>
      )}
    </div>
  );
};
