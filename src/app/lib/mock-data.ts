export interface Criterion {
  name: string;
  level: 'strong' | 'mid' | 'low';
  fill: number;
  note: string;
}

export interface Offer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  score: number;
  criteria: Criterion[];
  description: string;
  missions: string[];
  exclusive: boolean;
}

export type CandidatureStatus = 'a-preparer' | 'postulee' | 'entretien' | 'reponse';

export interface Candidature {
  offerId: number;
  status: CandidatureStatus;
  updatedAt: string;
}

export const OFFERS: Offer[] = [
  {
    id: 1, title: 'Alternance Chef de Projet Digital', company: 'Publicis Groupe', location: 'Paris 8e', type: 'Alternance · 12 mois', score: 92, exclusive: true,
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 90, note: '5 compétences clés sur 6 retrouvées dans ton CV.' },
      { name: 'Expérience', level: 'strong', fill: 82, note: 'Ton stage de gestion de projet correspond bien.' },
      { name: 'Mots-clés du secteur', level: 'mid', fill: 55, note: 'Ajoute "Trello" ou "Asana" — cités 3 fois dans la fiche.' },
    ],
    description: "Rejoins l'équipe digitale de Publicis pour piloter des projets de transformation online pour des clients du secteur luxe et retail.",
    missions: ['Coordonner les équipes créa, tech et media', 'Rédiger les briefs et suivre les livrables', 'Analyser les performances et produire les reportings'],
  },
  {
    id: 2, title: 'Alternance Traffic Manager', company: 'LVMH Digital', location: 'Paris 1er', type: 'Alternance · 12 mois', score: 78, exclusive: true,
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 88, note: 'SEO/SEA et Google Analytics bien couverts.' },
      { name: 'Expérience', level: 'mid', fill: 55, note: '1 an vs 2 ans attendus — à compenser par tes projets perso.' },
      { name: 'Mots-clés du secteur', level: 'low', fill: 25, note: 'Ajoute "GA4" et "acquisition payante" à ton CV.' },
    ],
    description: "Intègre la division digitale de LVMH pour piloter les campagnes d'acquisition sur les marchés européens.",
    missions: ['Gérer les campagnes Google Ads et Meta', 'Analyser les flux de trafic', 'Produire les reportings hebdomadaires'],
  },
  {
    id: 3, title: 'Alternance Content Manager', company: 'Ubisoft', location: 'Paris 17e', type: 'Alternance · 12 mois', score: 87, exclusive: true,
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 85, note: 'Copywriting et Notion bien présents.' },
      { name: 'Expérience', level: 'strong', fill: 78, note: 'Tes projets éditoriaux collent au poste.' },
      { name: 'Mots-clés du secteur', level: 'mid', fill: 48, note: 'Mentionne ta pratique gaming si tu en as une.' },
    ],
    description: "Rejoins l'équipe Brand Content d'Ubisoft pour produire les contenus éditoriaux des marques et franchises.",
    missions: ['Rédiger les contenus pour les réseaux sociaux et le blog', 'Coordonner les campagnes de lancement', 'Analyser les performances éditoriales'],
  },
  {
    id: 4, title: 'Alternance Social Media Manager', company: "L'Oréal", location: 'Clichy', type: 'Alternance · 12 mois', score: 65, exclusive: true,
    criteria: [
      { name: 'Compétences techniques', level: 'mid', fill: 58, note: 'Canva et Analytics présents, TikTok Ads absent.' },
      { name: 'Expérience', level: 'mid', fill: 50, note: 'Une expérience social media renforcerait ton profil.' },
      { name: 'Mots-clés du secteur', level: 'low', fill: 30, note: 'Le mot "beauté" n\'apparaît pas dans ton CV.' },
    ],
    description: "Intègre la direction digitale de L'Oréal pour gérer la présence social media des marques grand public.",
    missions: ['Créer et planifier les contenus Instagram, TikTok et LinkedIn', 'Analyser les performances', 'Veille concurrentielle mensuelle'],
  },
  {
    id: 5, title: 'Stage Assistant Comptable', company: 'Deloitte', location: 'Paris 17e', type: 'Stage · 6 mois', score: 14, exclusive: true,
    criteria: [
      { name: 'Compétences techniques', level: 'low', fill: 8, note: 'Aucune compétence comptable identifiée.' },
      { name: 'Expérience', level: 'low', fill: 5, note: 'Aucune expérience en audit ou finance.' },
      { name: 'Mots-clés du secteur', level: 'low', fill: 10, note: 'Ce poste est très éloigné de ta formation.' },
    ],
    description: "Intègre les équipes d'audit de Deloitte pour assister les managers sur des missions clients.",
    missions: ['Préparer les dossiers d\'audit', 'Analyser les états financiers', 'Rédiger les synthèses et rapports'],
  },
];

export const EXTERNAL_OFFERS: Offer[] = [
  {
    id: 101, title: 'Alternance Growth Marketing', company: 'Alan', location: 'Paris 9e', type: 'Alternance · 12 mois', score: 79, exclusive: false,
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 84, note: 'Marketing digital et SEO/SEA bien couverts.' },
      { name: 'Expérience', level: 'mid', fill: 52, note: 'A/B testing absent de ton CV.' },
      { name: 'Mots-clés du secteur', level: 'mid', fill: 60, note: 'Structure ton CV autour de la logique funnel.' },
    ],
    description: "Ajoutée depuis un lien LinkedIn — rejoins l'équipe Growth d'Alan pour accélérer l'acquisition digitale.",
    missions: ['Concevoir des campagnes d\'acquisition multicanales', 'Analyser les funnels de conversion'],
  },
  {
    id: 102, title: 'Alternance Brand Content', company: 'Spotify France', location: 'Paris 2e', type: 'Alternance · 12 mois', score: 61, exclusive: false,
    criteria: [
      { name: 'Compétences techniques', level: 'mid', fill: 55, note: 'Copywriting présent, Adobe Suite absent.' },
      { name: 'Expérience', level: 'low', fill: 32, note: 'Aucune expérience culture/musique identifiée.' },
      { name: 'Mots-clés du secteur', level: 'mid', fill: 48, note: 'Valorise ton anglais écrit dans ton CV.' },
    ],
    description: "Ajoutée depuis un PDF — intègre l'équipe Brand Content de Spotify France.",
    missions: ['Rédiger les contenus pour les campagnes saisonnières', 'Produire les assets visuels'],
  },
];

export const CANDIDATURES: Candidature[] = [
  { offerId: 1, status: 'entretien', updatedAt: '2 mars' },
  { offerId: 3, status: 'postulee', updatedAt: '28 févr.' },
  { offerId: 101, status: 'reponse', updatedAt: '20 févr.' },
];

export interface Student {
  id: number;
  name: string;
  promo: string;
  lastActivity: string;
  inactiveDays: number;
  candidatures: number;
  entretiens: number;
  cv: { formation: string; hardSkills: string[]; experience: string };
}

export const STUDENTS: Student[] = [
  { id: 1, name: 'Léa Bernard', promo: 'Marketing Digital — Promo 2026', lastActivity: '9 jours', inactiveDays: 9, candidatures: 3, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'SEO/SEA', 'Google Analytics', 'Canva'], experience: 'Stage 6 mois — Chargée de communication digitale, agence Nova.' } },
  { id: 2, name: 'Hugo Martin', promo: 'Marketing Digital — Promo 2026', lastActivity: 'Aujourd\'hui', inactiveDays: 0, candidatures: 11, entretiens: 2, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Gestion de projet', 'Notion', 'Trello', 'Copywriting'], experience: 'Stage 6 mois — Assistant chef de projet, Havas.' } },
  { id: 3, name: 'Ahn Nguyen', promo: 'Marketing Digital — Promo 2026', lastActivity: '2 jours', inactiveDays: 2, candidatures: 6, entretiens: 0, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Copywriting', 'Réseaux sociaux', 'Canva'], experience: 'Alternance 1 an — Community manager, studio indépendant.' } },
  { id: 4, name: 'Jefté Moïse', promo: 'Marketing Digital — Promo 2026', lastActivity: '14 jours', inactiveDays: 14, candidatures: 4, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['SEO/SEA', 'Google Analytics', 'Excel'], experience: 'Stage 4 mois — Chargé de trafic, régie média.' } },
  { id: 5, name: 'Camille Roussel', promo: 'Marketing Digital — Promo 2026', lastActivity: '1 jour', inactiveDays: 1, candidatures: 8, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Copywriting', 'Notion'], experience: 'Stage 6 mois — Assistante marketing, start-up e-commerce.' } },
  { id: 6, name: 'Younes Belkacem', promo: 'Marketing Digital — Promo 2026', lastActivity: '5 jours', inactiveDays: 5, candidatures: 5, entretiens: 0, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['SEO/SEA', 'Canva', 'Google Analytics'], experience: 'Stage 3 mois — Assistant SEO, agence indépendante.' } },
  { id: 7, name: 'Manon Girard', promo: 'Marketing Digital — Promo 2025', lastActivity: '3 jours', inactiveDays: 3, candidatures: 9, entretiens: 2, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Google Analytics', 'Copywriting', 'Notion'], experience: 'Alternance 1 an — Chargée de projet digital, Decathlon.' } },
  { id: 8, name: 'Ibrahim Kane', promo: 'Marketing Digital — Promo 2025', lastActivity: '11 jours', inactiveDays: 11, candidatures: 2, entretiens: 0, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Notion', 'Trello', 'Excel'], experience: 'Stage 2 mois — Assistant administratif marketing.' } },
  { id: 9, name: 'Zoé Lambert', promo: 'Marketing Digital — Promo 2025', lastActivity: 'Aujourd\'hui', inactiveDays: 0, candidatures: 14, entretiens: 3, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'SEO/SEA', 'Google Analytics', 'Copywriting'], experience: 'Alternance 1 an — Traffic manager, LVMH Digital.' } },
  { id: 10, name: 'Thibault Perrin', promo: 'Marketing Digital — Promo 2025', lastActivity: '6 jours', inactiveDays: 6, candidatures: 4, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Canva', 'Copywriting', 'Réseaux sociaux'], experience: 'Stage 6 mois — Community manager, marque DNVB.' } },
  { id: 11, name: 'Nour Aït Ali', promo: 'Marketing Digital — Promo 2025', lastActivity: '2 jours', inactiveDays: 2, candidatures: 7, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Notion', 'Canva'], experience: 'Stage 6 mois — Assistante chef de projet, agence de com.' } },
  { id: 12, name: 'Paul Fontaine', promo: 'Marketing Digital — Promo 2025', lastActivity: '20 jours', inactiveDays: 20, candidatures: 1, entretiens: 0, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Excel', 'Notion'], experience: 'Aucune expérience professionnelle renseignée.' } },
  { id: 13, name: 'Salomé Weber', promo: 'Marketing Digital — Promo 2026', lastActivity: '4 jours', inactiveDays: 4, candidatures: 6, entretiens: 1, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Copywriting', 'Google Analytics', 'SEO/SEA'], experience: 'Stage 6 mois — Chargée de contenu, media digital.' } },
  { id: 14, name: 'Adam Chevalier', promo: 'Marketing Digital — Promo 2026', lastActivity: '8 jours', inactiveDays: 8, candidatures: 3, entretiens: 0, cv: { formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Notion', 'Canva', 'Marketing digital'], experience: 'Stage 4 mois — Assistant marketing, PME locale.' } },
];

export interface Coach {
  id: number;
  name: string;
  email: string;
  studentsCount: number;
  avgInactive: number;
}

export const COACHES: Coach[] = [
  { id: 1, name: 'Camille Dubois', email: 'c.dubois@hetic.fr', studentsCount: 42, avgInactive: 4.2 },
  { id: 2, name: 'Karim Haddad', email: 'k.haddad@hetic.fr', studentsCount: 38, avgInactive: 6.8 },
];

const SOFT_SKILLS_POOL = ['Autonomie', 'Rigueur', 'Curiosité', "Esprit d'équipe", 'Créativité', "Sens de l'organisation", 'Adaptabilité', "Prise d'initiative"];

export function softSkillsFor(student: Student): string[] {
  const start = student.id % SOFT_SKILLS_POOL.length;
  return [0, 1, 2].map((i) => SOFT_SKILLS_POOL[(start + i) % SOFT_SKILLS_POOL.length]);
}

export function studentEmail(student: Student): string {
  return student.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.') + '@hetic.fr';
}

export function studentPhone(student: Student): string {
  const n = String(1000 + student.id * 37).padStart(4, '0');
  return `06 ${n.slice(0, 2)} ${n.slice(2, 4)} 00 00`;
}

export function promoYear(student: Student): string {
  const match = student.promo.match(/\d{4}/);
  return match ? match[0] : '2026';
}

export const STATUS_LABEL: Record<CandidatureStatus, string> = {
  'a-preparer': 'À préparer',
  'postulee': 'Postulée',
  'entretien': 'Entretien obtenu',
  'reponse': 'Réponse reçue',
};
