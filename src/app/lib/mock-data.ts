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
  expectedSkills: string[];
  description: string;
  missions: string[];
  exclusive: boolean;
  rawText?: string;
}

export type CandidatureStatus = 'a-preparer' | 'postulee' | 'entretien' | 'reponse';

export interface Candidature {
  studentId: number;
  offerId: number;
  status: CandidatureStatus;
  updatedAt: string;
}

export const OFFERS: Offer[] = [
  {
    id: 1, title: 'Alternance Chef de Projet Digital', company: 'Publicis Groupe', location: 'Paris 8e', type: 'Alternance · 12 mois', score: 92, exclusive: true,
    expectedSkills: ['Gestion de projet', 'Trello', 'Asana', 'Communication', 'Marketing digital'],
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 90, note: '5 compétences clés sur 6 retrouvées dans ton CV.' },
      { name: 'Expérience', level: 'strong', fill: 82, note: 'Ton stage de gestion de projet correspond bien.' },
      { name: 'Mots-clés du secteur', level: 'mid', fill: 55, note: 'Ajoute "Trello" ou "Asana", cités 3 fois dans la fiche.' },
    ],
    description: "Rejoins l'équipe digitale de Publicis pour piloter des projets de transformation online pour des clients du secteur luxe et retail.",
    missions: ['Coordonner les équipes créa, tech et media', 'Rédiger les briefs et suivre les livrables', 'Analyser les performances et produire les reportings'],
  },
  {
    id: 2, title: 'Alternance Traffic Manager', company: 'LVMH Digital', location: 'Paris 1er', type: 'Alternance · 12 mois', score: 78, exclusive: true,
    expectedSkills: ['SEO/SEA', 'Google Analytics', 'GA4', 'Acquisition payante'],
    criteria: [
      { name: 'Compétences techniques', level: 'strong', fill: 88, note: 'SEO/SEA et Google Analytics bien couverts.' },
      { name: 'Expérience', level: 'mid', fill: 55, note: '1 an vs 2 ans attendus, à compenser par tes projets perso.' },
      { name: 'Mots-clés du secteur', level: 'low', fill: 25, note: 'Ajoute "GA4" et "acquisition payante" à ton CV.' },
    ],
    description: "Intègre la division digitale de LVMH pour piloter les campagnes d'acquisition sur les marchés européens.",
    missions: ['Gérer les campagnes Google Ads et Meta', 'Analyser les flux de trafic', 'Produire les reportings hebdomadaires'],
  },
  {
    id: 3, title: 'Alternance Content Manager', company: 'Ubisoft', location: 'Paris 17e', type: 'Alternance · 12 mois', score: 87, exclusive: true,
    expectedSkills: ['Copywriting', 'Notion', 'Réseaux sociaux', 'Gaming'],
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
    expectedSkills: ['Canva', 'Google Analytics', 'TikTok Ads', 'Réseaux sociaux'],
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
    expectedSkills: ['Comptabilité', 'Audit', 'Excel', 'Finance'],
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
    expectedSkills: ['Marketing digital', 'SEO/SEA', 'A/B testing', 'Funnel'],
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
    expectedSkills: ['Copywriting', 'Adobe Suite', 'Anglais', 'Culture musicale'],
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
  { studentId: 1, offerId: 1, status: 'entretien', updatedAt: '2 mars' },
  { studentId: 1, offerId: 3, status: 'postulee', updatedAt: '28 févr.' },
  { studentId: 1, offerId: 101, status: 'reponse', updatedAt: '20 févr.' },
  { studentId: 2, offerId: 2, status: 'entretien', updatedAt: '5 mars' },
  { studentId: 2, offerId: 4, status: 'postulee', updatedAt: '1 mars' },
  { studentId: 3, offerId: 3, status: 'postulee', updatedAt: '3 mars' },
  { studentId: 3, offerId: 2, status: 'a-preparer', updatedAt: '28 févr.' },
  { studentId: 4, offerId: 1, status: 'entretien', updatedAt: '6 mars' },
  { studentId: 4, offerId: 5, status: 'postulee', updatedAt: '2 mars' },
  { studentId: 5, offerId: 4, status: 'entretien', updatedAt: '4 mars' },
  { studentId: 5, offerId: 3, status: 'postulee', updatedAt: '27 févr.' },
  { studentId: 6, offerId: 2, status: 'postulee', updatedAt: '5 mars' },
  { studentId: 7, offerId: 1, status: 'entretien', updatedAt: '3 mars' },
  { studentId: 7, offerId: 4, status: 'reponse', updatedAt: '25 févr.' },
  { studentId: 8, offerId: 5, status: 'a-preparer', updatedAt: '1 mars' },
  { studentId: 9, offerId: 2, status: 'entretien', updatedAt: '7 mars' },
  { studentId: 9, offerId: 1, status: 'reponse', updatedAt: '2 mars' },
  { studentId: 10, offerId: 4, status: 'entretien', updatedAt: '6 mars' },
  { studentId: 11, offerId: 3, status: 'entretien', updatedAt: '4 mars' },
  { studentId: 11, offerId: 1, status: 'postulee', updatedAt: '26 févr.' },
  { studentId: 12, offerId: 5, status: 'a-preparer', updatedAt: '20 févr.' },
  { studentId: 13, offerId: 3, status: 'entretien', updatedAt: '4 mars' },
  { studentId: 14, offerId: 4, status: 'postulee', updatedAt: '8 mars' },
];

type StudentCv = Omit<CvData, 'softSkills' | 'phone' | 'contactEmail' | 'languages'>;

function baseCv(data: Pick<StudentCv, 'formation' | 'experience' | 'hardSkills'> & Partial<StudentCv>): StudentCv {
  return {
    title: '', photoUrl: '', bio: '', certifications: [], portfolioLinks: '',
    personalProjects: '', interests: '', drivingLicense: false, availability: '', attentionNote: '',
    ...data,
  };
}

export interface Student {
  id: number;
  name: string;
  promo: string;
  lastActivity: string;
  inactiveDays: number;
  candidatures: number;
  entretiens: number;
  coachId: number;
  cv: StudentCv;
}

export const STUDENTS: Student[] = [
  { id: 1, coachId: 1, name: 'Léa Bernard', promo: 'Marketing Digital — Promo 2026', lastActivity: '9 jours', inactiveDays: 9, candidatures: 3, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'SEO/SEA', 'Google Analytics', 'Canva'], experience: 'Stage 6 mois, Chargée de communication digitale, agence Nova.', title: 'Chargée de communication digitale en recherche d\'alternance', certifications: ['Google Analytics'], interests: 'Photographie, voyages', drivingLicense: true, availability: 'Disponible dès septembre, mobile Île-de-France' }) },
  { id: 2, coachId: 2, name: 'Hugo Martin', promo: 'Marketing Digital — Promo 2026', lastActivity: 'Aujourd\'hui', inactiveDays: 0, candidatures: 11, entretiens: 2, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Gestion de projet', 'Notion', 'Trello', 'Copywriting'], experience: 'Stage 6 mois, Assistant chef de projet, Havas.', certifications: ['Scrum Fundamentals'], personalProjects: 'Organisation bénévole du festival étudiant HETIC 2025.' }) },
  { id: 3, coachId: 1, name: 'Ahn Nguyen', promo: 'Marketing Digital — Promo 2026', lastActivity: '2 jours', inactiveDays: 2, candidatures: 6, entretiens: 0, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Copywriting', 'Réseaux sociaux', 'Canva'], experience: 'Alternance 1 an, Community manager, studio indépendant.', title: 'Community manager passionnée par le contenu de marque', portfolioLinks: 'instagram.com/ahn.creates', interests: "Illustration, cinéma d'animation" }) },
  { id: 4, coachId: 2, name: 'Jefté Moïse', promo: 'Marketing Digital — Promo 2026', lastActivity: '14 jours', inactiveDays: 14, candidatures: 4, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['SEO/SEA', 'Google Analytics', 'Excel'], experience: 'Stage 4 mois, Chargé de trafic, régie média.', availability: "Mobile toute l'Île-de-France" }) },
  { id: 5, coachId: 1, name: 'Camille Roussel', promo: 'Marketing Digital — Promo 2026', lastActivity: '1 jour', inactiveDays: 1, candidatures: 8, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Copywriting', 'Notion'], experience: 'Stage 6 mois, Assistante marketing, start-up e-commerce.', certifications: ['Google Ads'], personalProjects: "Gestion des réseaux sociaux d'une association étudiante.", drivingLicense: true }) },
  { id: 6, coachId: 2, name: 'Younes Belkacem', promo: 'Marketing Digital — Promo 2026', lastActivity: '5 jours', inactiveDays: 5, candidatures: 5, entretiens: 0, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['SEO/SEA', 'Canva', 'Google Analytics'], experience: 'Stage 3 mois, Assistant SEO, agence indépendante.', interests: 'Jeux vidéo, e-sport', attentionNote: 'Recherche une alternance orientée SEO technique.' }) },
  { id: 7, coachId: 1, name: 'Manon Girard', promo: 'Marketing Digital — Promo 2025', lastActivity: '3 jours', inactiveDays: 3, candidatures: 9, entretiens: 2, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Google Analytics', 'Copywriting', 'Notion'], experience: 'Alternance 1 an, Chargée de projet digital, Decathlon.', title: 'Chargée de projet digital', certifications: ['Google Analytics', 'HubSpot Academy'], portfolioLinks: 'linkedin.com/in/manon-girard', drivingLicense: true, availability: 'Disponible immédiatement, mobile France entière' }) },
  { id: 8, coachId: 2, name: 'Ibrahim Kane', promo: 'Marketing Digital — Promo 2025', lastActivity: '11 jours', inactiveDays: 11, candidatures: 2, entretiens: 0, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Notion', 'Trello', 'Excel'], experience: 'Stage 2 mois, Assistant administratif marketing.', attentionNote: 'En reconversion vers le marketing après un parcours administratif.' }) },
  { id: 9, coachId: 1, name: 'Zoé Lambert', promo: 'Marketing Digital — Promo 2025', lastActivity: 'Aujourd\'hui', inactiveDays: 0, candidatures: 14, entretiens: 3, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'SEO/SEA', 'Google Analytics', 'Copywriting'], experience: 'Alternance 1 an, Traffic manager, LVMH Digital.', title: 'Traffic manager en alternance', certifications: ['Google Ads', 'Google Analytics'], portfolioLinks: 'linkedin.com/in/zoe-lambert' }) },
  { id: 10, coachId: 2, name: 'Thibault Perrin', promo: 'Marketing Digital — Promo 2025', lastActivity: '6 jours', inactiveDays: 6, candidatures: 4, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Canva', 'Copywriting', 'Réseaux sociaux'], experience: 'Stage 6 mois, Community manager, marque DNVB.', interests: 'Mode, création de contenu', portfolioLinks: 'instagram.com/thibault.creates' }) },
  { id: 11, coachId: 1, name: 'Nour Aït Ali', promo: 'Marketing Digital — Promo 2025', lastActivity: '2 jours', inactiveDays: 2, candidatures: 7, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Marketing digital', 'Notion', 'Canva'], experience: 'Stage 6 mois, Assistante chef de projet, agence de com.', personalProjects: 'Bénévole communication pour une association étudiante.' }) },
  { id: 12, coachId: 2, name: 'Paul Fontaine', promo: 'Marketing Digital — Promo 2025', lastActivity: '20 jours', inactiveDays: 20, candidatures: 1, entretiens: 0, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Excel', 'Notion'], experience: 'Aucune expérience professionnelle renseignée.' }) },
  { id: 13, coachId: 1, name: 'Salomé Weber', promo: 'Marketing Digital — Promo 2026', lastActivity: '4 jours', inactiveDays: 4, candidatures: 6, entretiens: 1, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Copywriting', 'Google Analytics', 'SEO/SEA'], experience: 'Stage 6 mois, Chargée de contenu, media digital.', certifications: ['Copywriting SEO — certification en ligne'] }) },
  { id: 14, coachId: 2, name: 'Adam Chevalier', promo: 'Marketing Digital — Promo 2026', lastActivity: '8 jours', inactiveDays: 8, candidatures: 3, entretiens: 0, cv: baseCv({ formation: 'Bachelor Marketing Digital, HETIC', hardSkills: ['Notion', 'Canva', 'Marketing digital'], experience: 'Stage 4 mois, Assistant marketing, PME locale.' }) },
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

export const CURRENT_STUDENT_ID = 1;

export interface CvData {
  title: string;
  photoUrl: string;
  bio: string;
  phone: string;
  contactEmail: string;
  formation: string;
  experience: string;
  hardSkills: string[];
  certifications: string[];
  softSkills: string[];
  languages: string;
  portfolioLinks: string;
  personalProjects: string;
  interests: string;
  drivingLicense: boolean;
  availability: string;
  attentionNote: string;
}

export function defaultCvFor(student: Student): CvData {
  return {
    ...student.cv,
    hardSkills: [...student.cv.hardSkills],
    certifications: [...student.cv.certifications],
    phone: studentPhone(student),
    contactEmail: studentEmail(student),
    softSkills: softSkillsFor(student),
    languages: 'Français (natif), Anglais (professionnel)',
  };
}

export const STATUS_LABEL: Record<CandidatureStatus, string> = {
  'a-preparer': 'À préparer',
  'postulee': 'Postulée',
  'entretien': 'Entretien obtenu',
  'reponse': 'Réponse reçue',
};

export const CURRENT_COACH_ID = 2;

export interface EventType {
  id: number;
  label: string;
  duration: number;
  description: string;
  active: boolean;
}

export const EVENT_TYPES: EventType[] = [
  { id: 1, label: 'Point de suivi', duration: 30, description: 'Rapide tour de la recherche en cours.', active: true },
  { id: 2, label: "Préparation d'entretien", duration: 45, description: "Simulation d'entretien et retours.", active: true },
  { id: 3, label: 'Relecture de CV', duration: 20, description: 'Retour rapide sur une version du CV.', active: true },
  { id: 4, label: 'Bilan de mi-parcours', duration: 60, description: 'Point complet sur les objectifs.', active: false },
];

export interface Rdv {
  id: number;
  coachId: number;
  studentId: number;
  eventTypeId: number;
  day: string;
  time: string;
}

export const RDVS: Rdv[] = [
  { id: 1, coachId: 2, studentId: 4, eventTypeId: 2, day: 'Jeudi 13 mars', time: '14:00' },
  { id: 2, coachId: 2, studentId: 8, eventTypeId: 1, day: 'Vendredi 14 mars', time: '10:00' },
  { id: 3, coachId: 2, studentId: 12, eventTypeId: 3, day: 'Lundi 10 mars', time: '09:00' },
  { id: 4, coachId: 1, studentId: 1, eventTypeId: 1, day: 'Mardi 11 mars', time: '11:00' },
  { id: 5, coachId: 1, studentId: 3, eventTypeId: 3, day: 'Jeudi 13 mars', time: '10:00' },
];

export const WEEK_DAYS = [
  { key: 'lun', label: 'Lundi 10 mars' },
  { key: 'mar', label: 'Mardi 11 mars' },
  { key: 'mer', label: 'Mercredi 12 mars' },
  { key: 'jeu', label: 'Jeudi 13 mars' },
  { key: 'ven', label: 'Vendredi 14 mars' },
];
export const WEEK_TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export interface Message {
  from: 'coach' | 'student';
  text: string;
  time: string;
}

export interface Conversation {
  studentId: number;
  messages: Message[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    studentId: 2,
    messages: [
      { from: 'student', text: "Salut Karim, je viens d'envoyer 3 nouvelles candidatures ce matin.", time: '09:12' },
      { from: 'coach', text: 'Nickel, tu peux me dire lesquelles ? Je regarde les fiches avec toi.', time: '09:20' },
      { from: 'student', text: 'LVMH, Ubisoft et une offre externe chez Alan.', time: '09:24' },
    ],
  },
  {
    studentId: 4,
    messages: [
      { from: 'coach', text: 'Jefté, ça fait deux semaines sans candidature. Un souci de ton côté ?', time: 'Hier 16:40' },
      { from: 'student', text: "Oui, je bloque sur la lettre de motivation, tu peux m'aider jeudi ?", time: 'Hier 17:02' },
      { from: 'coach', text: 'Ok, je te cale un créneau jeudi 14h.', time: 'Hier 17:05' },
    ],
  },
  {
    studentId: 8,
    messages: [
      { from: 'student', text: 'Je peux avoir un créneau cette semaine pour revoir mon CV ?', time: 'Lun 11:03' },
    ],
  },
  {
    studentId: 12,
    messages: [
      { from: 'coach', text: 'Paul, je vois que ton profil est toujours à 1 candidature ce mois-ci, on en parle lundi ?', time: '3 mars' },
      { from: 'student', text: 'Oui pas de souci, désolé pour le retard.', time: '3 mars' },
    ],
  },
  {
    studentId: 1,
    messages: [
      { from: 'coach', text: 'Salut Léa, comment se passent tes candidatures cette semaine ?', time: 'Hier 15:00' },
      { from: 'student', text: "Ça avance, j'ai postulé chez Publicis et Ubisoft, en attente de retour.", time: 'Hier 15:20' },
      { from: 'coach', text: 'Top, tiens-moi au courant si tu as un entretien, on préparera ça ensemble.', time: 'Hier 15:22' },
    ],
  },
];

export interface CvHistoryEntry {
  id: number;
  date: string;
  label: string;
  cv: CvData;
}
