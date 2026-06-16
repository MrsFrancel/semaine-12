import { useState, useRef, useEffect } from 'react';

// ─── Responsive hook ───────────────────────────────────────────────────────────
const useWindowSize = () => {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

type Step =
  | 'auth'
  | 'upload'
  | 'questionnaire'
  | 'intermediate'
  | 'match-free'
  | 'payment'
  | 'match-premium'
  | 'offer-detail'
  | 'offer-detail-free'
  | 'profile';

interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
  hardSkills: string[];
  softSkills: string[];
  personalityAnswers: Record<string, string>;
  preferences: string;
}

interface Offer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  score: number;
  matchPoints: string[];
  gapPoints: string[];
  description: string;
  missions: string[];
  advice: string[];
  source: string;
}

const OFFERS: Offer[] = [
  { id: 1, title: 'Alternance Chef de Projet Digital', company: 'Publicis Groupe', location: 'Paris 8e', type: 'Alternance 12 mois', score: 92, matchPoints: ['Marketing digital', 'Gestion de projet', 'Canva', 'Notion'], gapPoints: ['SQL'], description: "Rejoins l'équipe digitale de Publicis pour piloter des projets de transformation online pour des clients du secteur luxe et retail.", missions: ['Coordonner les équipes créa, tech et media', 'Rédiger les briefs et suivre les livrables', 'Analyser les performances et produire les reportings', 'Participer aux réunions clients'], advice: ["Mets en avant ton projet SEO en Master 1", "Reformule 'stage de 2 mois' en 'mission de gestion de campagnes digitales'", "Ajoute Trello ou Asana - mentionnés 3 fois dans la fiche"], source: 'LinkedIn' },
  { id: 2, title: 'Alternance Traffic Manager', company: 'LVMH Digital', location: 'Paris 1er', type: 'Alternance 12 mois', score: 89, matchPoints: ['SEO/SEA', 'Google Analytics', 'Marketing digital'], gapPoints: ['Google Tag Manager', 'Expérience luxe'], description: "Intègre la division digitale de LVMH pour piloter les campagnes d'acquisition sur les marchés européens.", missions: ['Gérer les campagnes Google Ads et Meta', 'Analyser les flux de trafic', 'Produire les reportings hebdomadaires', 'Collaborer avec les équipes e-commerce'], advice: ["Mentionne Google Analytics 4 explicitement", "Ajoute une expérience chiffrée en acquisition payante", "Contextualise tes projets autour de marques premium"], source: 'Welcome to the Jungle' },
  { id: 3, title: 'Alternance Content Manager', company: 'Ubisoft', location: 'Paris 17e', type: 'Alternance 12 mois', score: 87, matchPoints: ['Copywriting', 'Marketing digital', 'Canva', 'Notion'], gapPoints: ['Adobe Premiere', 'Communauté gaming'], description: "Rejoins l'équipe Brand Content d'Ubisoft pour produire les contenus éditoriaux des marques et franchises.", missions: ["Rédiger les contenus pour les réseaux sociaux et le blog", "Coordonner les campagnes de lancement", "Analyser les performances éditoriales", "Collaborer avec les équipes créa et com"], advice: ["Mentionne ta capacité à t'approprier une culture de marque forte", "Si tu joues à des jeux Ubisoft, c'est un atout à mentionner", "Ajoute Figma ou Canva dans tes outils"], source: 'Indeed' },
  { id: 4, title: "Alternance Social Media Manager", company: "L'Oreal", location: 'Clichy', type: 'Alternance 12 mois', score: 85, matchPoints: ['Copywriting', 'Canva', 'Marketing digital', 'Google Analytics'], gapPoints: ['TikTok Ads', 'Expérience beauté'], description: "Intègre la direction digitale de L'Oreal pour gérer la présence social media des marques grand public.", missions: ["Créer et planifier les contenus pour Instagram, TikTok et LinkedIn", "Analyser les performances et optimiser l'engagement", "Collaborer avec les influenceurs", "Veille concurrentielle mensuelle"], advice: ["Mentionne des formats spécifiques créés avec Canva", "TikTok est central - si tu as une pratique personnelle, indique-la", "Ajoute des métriques d'engagement à tes expériences"], source: 'LinkedIn' },
  { id: 5, title: 'Alternance Chargé de Marketing Digital', company: 'Decathlon', location: "Villeneuve d'Ascq", type: 'Alternance 12 mois', score: 83, matchPoints: ['SEO/SEA', 'Google Analytics', 'Marketing digital', 'Copywriting'], gapPoints: ['E-commerce', 'Sport pratiqué'], description: "Rejoins l'équipe marketing digital de Decathlon pour piloter les campagnes d'acquisition et de fidélisation.", missions: ["Piloter les campagnes SEA sur Google et Meta", "Optimiser le SEO des fiches produits", "Analyser les performances", "Tester de nouveaux formats publicitaires"], advice: ["Mentionne ta pratique sportive personnelle si tu en as une", "Le mot 'e-commerce' revient 5 fois - contextualise tes projets autour de ça", "Mentionne ta maîtrise de GA4 spécifiquement"], source: 'Indeed' },
  { id: 6, title: 'Alternance Product Marketing Manager', company: 'Doctolib', location: 'Paris 10e', type: 'Alternance 12 mois', score: 81, matchPoints: ['Marketing digital', 'Copywriting', 'Notion', 'Google Analytics'], gapPoints: ['Salesforce', 'Secteur santé'], description: "Intègre l'équipe Product Marketing de Doctolib pour accélérer l'adoption des nouvelles fonctionnalités.", missions: ["Créer les contenus de lancement de fonctionnalités", "Analyser les comportements utilisateurs", "Collaborer avec les équipes produit et growth", "Rédiger les newsletters et communications"], advice: ["Intègre des métriques dans tes descriptions de poste", "La maîtrise de Notion est un vrai plus ici", "Mentionne une expérience d'analyse de comportement utilisateur"], source: 'Welcome to the Jungle' },
  { id: 7, title: 'Alternance Growth Marketing', company: 'Alan', location: 'Paris 9e', type: 'Alternance 12 mois', score: 79, matchPoints: ['Marketing digital', 'SEO/SEA', 'Google Analytics', 'Copywriting'], gapPoints: ['Python basics', 'A/B testing', 'Secteur assurance'], description: "Rejoins l'équipe Growth d'Alan pour accélérer l'acquisition de nouveaux assurés via des canaux digitaux.", missions: ["Concevoir et lancer des campagnes d'acquisition multicanales", "Analyser les funnels de conversion", "Tester de nouveaux messages et formats", "Collaborer avec les équipes produit et data"], advice: ["Structure ton CV autour de la logique funnel", "Mentionne toute expérience d'A/B testing, même sur des projets perso", "Montre ton intérêt pour la disruption sectorielle"], source: 'LinkedIn' },
  { id: 8, title: 'Alternance Brand Content', company: 'Spotify France', location: 'Paris 2e', type: 'Alternance 12 mois', score: 76, matchPoints: ['Copywriting', 'Marketing digital', 'Canva'], gapPoints: ['Adobe Suite', 'Culture musicale', 'Anglais courant'], description: "Intègre l'équipe Brand Content de Spotify France pour produire les campagnes éditoriales et culturelles.", missions: ["Rédiger les contenus pour les campagnes saisonnières", "Collaborer avec les artistes et labels partenaires", "Produire les assets visuels", "Analyser les performances des campagnes"], advice: ["Valorise ta maîtrise de l'anglais à l'écrit dans ton CV", "Mentionne ta relation à la musique et à la culture", "Si tu as des bases Adobe, même légères, indique-les"], source: 'Indeed' },
  { id: 9, title: 'Alternance Marketing Manager', company: 'Decathlon Digital', location: 'Lille', type: 'Alternance 12 mois', score: 74, matchPoints: ['SEO/SEA', 'Google Analytics', 'Copywriting'], gapPoints: ['Adobe Suite', 'Expérience e-commerce'], description: "Intègre l'équipe marketing de Decathlon Digital pour piloter la stratégie de contenu et les campagnes d'acquisition.", missions: ["Piloter les campagnes SEA sur Google et Meta", "Produire les contenus du blog et des réseaux sociaux", "Analyser les KPIs", "Collaborer avec les équipes produit et design"], advice: ["Mentionne ton expérience avec Google Analytics dans l'accroche", "Ajoute des métriques concrètes à tes expériences passées", "Contextualise tes projets autour de l'e-commerce"], source: 'Indeed' },
  { id: 10, title: 'Alternance Chef de Projet Communication', company: 'SNCF', location: 'Saint-Denis', type: 'Alternance 12 mois', score: 71, matchPoints: ['Copywriting', 'Canva', 'Marketing digital'], gapPoints: ['Relations presse', 'Secteur transport', 'InDesign'], description: "Rejoins la direction de la communication de SNCF pour piloter les campagnes institutionnelles.", missions: ["Rédiger les communiqués et les contenus éditoriaux", "Piloter les campagnes de communication interne", "Produire les supports visuels", "Coordonner les agences créa et médias"], advice: ["Mentionne toute expérience de communication institutionnelle ou associative", "Valorise ta capacité à apprendre InDesign", "Structure ton CV de façon très claire"], source: 'LinkedIn' },
  { id: 11, title: 'Alternance Digital Project Manager', company: 'Capgemini', location: 'Paris 15e', type: 'Alternance 12 mois', score: 69, matchPoints: ['Notion', 'Marketing digital', 'Google Analytics'], gapPoints: ['Jira', 'Agile Scrum', 'Expérience conseil'], description: "Intègre la practice Digital de Capgemini pour accompagner des clients grands comptes dans leur transformation digitale.", missions: ["Cadrer et piloter des projets de transformation digitale", "Animer les rituels agiles", "Produire les livrables et présentations clients", "Assurer le suivi des risques et plannings"], advice: ["Mentionne toute expérience de gestion de projet, même associative", "La maîtrise de Notion peut compenser l'absence de Jira", "Mets en avant tes capacités rédactionnelles"], source: 'Welcome to the Jungle' },
  { id: 12, title: 'Alternance Community Manager', company: 'Red Bull France', location: 'Paris 9e', type: 'Alternance 12 mois', score: 67, matchPoints: ['Copywriting', 'Canva', 'Marketing digital'], gapPoints: ['Vidéo editing', 'Culture sport extrême', 'TikTok'], description: "Rejoins l'équipe Social Media de Red Bull France pour animer les communautés et produire les contenus éditoriaux.", missions: ["Créer les contenus pour Instagram, TikTok et YouTube", "Animer les communautés et répondre aux fans", "Couvrir les événements Red Bull sur le terrain", "Analyser les performances et produire les reportings"], advice: ["Valorise ta passion pour la culture que Red Bull représente", "Si tu pratiques le montage vidéo en amateur, mentionne-le", "Montre que tu comprends les codes TikTok"], source: 'Indeed' },
  { id: 13, title: 'Alternance Chargé de Communication Digitale', company: 'Axa', location: 'Paris 8e', type: 'Alternance 12 mois', score: 64, matchPoints: ['Copywriting', 'Canva', 'Google Analytics'], gapPoints: ['Secteur assurance', 'Relations médias', 'InDesign'], description: "Intègre la direction de la communication digitale d'Axa pour piloter les campagnes online et la présence éditoriale.", missions: ["Rédiger les contenus pour les canaux digitaux", "Gérer les réseaux sociaux professionnels", "Analyser les performances", "Collaborer avec les agences et les équipes internes"], advice: ["Mentionne ta compréhension des enjeux de confiance dans le secteur financier", "Mets en avant ta maîtrise de l'écrit", "Cite des cas concrets d'analyse de trafic"], source: 'LinkedIn' },
  { id: 14, title: 'Alternance Marketing Produit', company: 'Deezer', location: 'Paris 11e', type: 'Alternance 12 mois', score: 62, matchPoints: ['Marketing digital', 'Copywriting', 'Google Analytics'], gapPoints: ['Product management', 'Culture musicale', 'SQL'], description: "Rejoins l'équipe Product Marketing de Deezer pour accélérer l'adoption des fonctionnalités premium.", missions: ["Créer les contenus de lancement de nouvelles fonctionnalités", "Analyser les comportements utilisateurs", "Collaborer avec les équipes produit et data", "Piloter les campagnes d'activation"], advice: ["Mentionne ta relation à la musique et aux plateformes de streaming", "Valorise toute expérience liée au produit", "Mentionne ta maîtrise de GA4 spécifiquement"], source: 'Indeed' },
  { id: 15, title: 'Alternance Chargé de Projet Digital', company: 'Bouygues Telecom', location: 'Issy-les-Moulineaux', type: 'Alternance 12 mois', score: 60, matchPoints: ['Marketing digital', 'Notion', 'Google Analytics'], gapPoints: ['UX Design', 'Secteur télécom', 'CRM Salesforce'], description: "Intègre la direction digitale de Bouygues Telecom pour piloter des projets d'expérience client en ligne.", missions: ["Coordonner les projets de refonte des parcours digitaux", "Analyser les comportements utilisateurs sur le site", "Collaborer avec les équipes UX, tech et marketing", "Suivre les KPIs et produire les reportings"], advice: ["Mentionne toute expérience liée à l'expérience utilisateur", "La maîtrise de Notion est un atout pour la coordination projet", "Une connaissance même basique des CRM est valorisée"], source: 'Welcome to the Jungle' },
  { id: 16, title: 'Stage Assistant Marketing', company: 'Pierre Fabre', location: 'Toulouse', type: 'Stage 6 mois', score: 58, matchPoints: ['Marketing digital', 'Canva', 'Copywriting'], gapPoints: ['Secteur pharmaceutique', 'Marketing santé', 'PowerPoint avancé'], description: "Rejoins l'équipe marketing de Pierre Fabre pour soutenir les campagnes des marques dermo-cosmétiques.", missions: ["Contribuer aux plans marketing des marques", "Produire les supports de présentation", "Analyser les ventes et les parts de marché", "Coordonner avec les agences et les équipes terrain"], advice: ["Mentionne ta capacité d'adaptation aux contraintes réglementaires", "Canva est un atout ici pour produire des supports rapidement", "Mentionne toute connaissance des codes marketing beauté ou santé"], source: 'Indeed' },
  { id: 17, title: 'Alternance Chargé de Marketing B2B', company: 'Salesforce France', location: 'Paris 9e', type: 'Alternance 12 mois', score: 57, matchPoints: ['Marketing digital', 'Copywriting', 'Google Analytics'], gapPoints: ['Marketing B2B', 'Salesforce CRM', 'Account-based marketing'], description: "Intègre l'équipe marketing de Salesforce France pour générer des leads et soutenir l'équipe commerciale.", missions: ["Créer les contenus pour les campagnes B2B", "Gérer les campagnes d'emailing et de nurturing", "Analyser les performances des campagnes", "Collaborer avec les équipes sales"], advice: ["Valorise toute expérience de relation professionnelle", "Des bases sur les CRM sont un plus à mentionner", "Mentionne tout outil d'emailing utilisé"], source: 'LinkedIn' },
  { id: 18, title: 'Stage Chargé de Communication', company: 'WWF France', location: 'Paris 16e', type: 'Stage 6 mois', score: 55, matchPoints: ['Copywriting', 'Canva', 'Marketing digital'], gapPoints: ['Communication associative', 'Plaidoyer', 'Mobilisation citoyenne'], description: "Rejoins l'équipe communication du WWF France pour sensibiliser le grand public aux enjeux environnementaux.", missions: ["Rédiger les contenus pour les campagnes de sensibilisation", "Gérer les réseaux sociaux et la newsletter", "Produire les supports visuels pour les actions terrain", "Soutenir les campagnes de mobilisation citoyenne"], advice: ["Valorise clairement ton engagement sur les enjeux environnementaux", "Ton ton doit être empathique et mobilisateur", "Mentionne tout bénévolat ou engagement associatif"], source: 'Indeed' },
  { id: 19, title: 'Stage Chargé de Communication', company: 'BNP Paribas', location: 'Paris La Défense', type: 'Stage 6 mois', score: 51, matchPoints: ['Copywriting', 'Canva'], gapPoints: ['Relations presse', 'InDesign', 'Secteur bancaire', 'Communication institutionnelle'], description: "Rejoins la direction de la communication de BNP Paribas pour participer aux campagnes institutionnelles.", missions: ["Rédiger les communiqués de presse", "Gérer les relations avec les journalistes", "Produire les supports visuels pour les événements", "Veille médiatique quotidienne"], advice: ["Ton profil est orienté digital - ce poste est très print et institutionnel", "InDesign est central ici - même des bases sont indispensables", "Mentionne une expérience en secteur réglementé si tu en as"], source: 'Welcome to the Jungle' },
  { id: 20, title: 'Alternance Développeur Front-End', company: 'Thales', location: 'Massy', type: 'Alternance 24 mois', score: 18, matchPoints: ['Notion'], gapPoints: ['React', 'TypeScript', 'HTML/CSS avancé', 'Git', 'Expérience dev'], description: "Intègre les équipes techniques de Thales pour développer des interfaces utilisateurs pour des systèmes critiques.", missions: ["Développer des composants React", "Participer aux revues de code", "Collaborer avec les équipes back-end", "Rédiger la documentation technique"], advice: ["Ce poste est très technique et éloigné de ton profil marketing", "Une formation en développement web serait nécessaire", "Ton profil correspond mieux aux postes en marketing digital"], source: 'LinkedIn' },
  { id: 21, title: 'Stage Assistant Comptable', company: 'Deloitte', location: 'Paris 17e', type: 'Stage 6 mois', score: 12, matchPoints: [], gapPoints: ['Comptabilité', 'Excel avancé', 'Audit', 'Fiscalité', 'Formation finance'], description: "Intègre les équipes d'audit de Deloitte pour assister les managers sur des missions clients.", missions: ["Préparer les dossiers d'audit", "Analyser les états financiers", "Participer aux missions chez les clients", "Rédiger les synthèses et rapports"], advice: ["Ce poste est très éloigné de ton profil et de ta formation", "Une formation en comptabilité ou finance est indispensable", "Concentre tes recherches sur des postes en marketing digital"], source: 'Indeed' },
  { id: 22, title: 'Alternance Ingénieur Data', company: 'Airbus', location: 'Toulouse', type: 'Alternance 12 mois', score: 15, matchPoints: ['Google Analytics'], gapPoints: ['Python', 'SQL', 'Machine Learning', 'Big Data', 'Formation ingénierie'], description: "Rejoins les équipes Data d'Airbus pour développer des modèles prédictifs sur des données de production.", missions: ["Développer des pipelines de données", "Construire des modèles de machine learning", "Analyser des datasets complexes", "Produire des visualisations de données"], advice: ["Ce poste nécessite une formation en data science ou ingénierie", "Ton profil marketing est éloigné des exigences techniques", "Des postes en marketing analytics correspondraient mieux à ton profil"], source: 'Welcome to the Jungle' },
  { id: 23, title: 'Stage Assistant Juridique', company: 'Cabinet Gide', location: 'Paris 8e', type: 'Stage 6 mois', score: 8, matchPoints: [], gapPoints: ['Droit des affaires', 'Formation juridique', 'Rédaction juridique', 'Anglais juridique'], description: "Intègre le cabinet Gide pour assister les avocats sur des dossiers de droit des affaires.", missions: ["Effectuer des recherches juridiques", "Rédiger des notes et mémos", "Préparer les dossiers clients", "Participer aux réunions avec les clients"], advice: ["Ce poste nécessite impérativement une formation en droit", "Ton profil marketing n'est pas en adéquation avec ce poste", "Concentre tes recherches sur des postes en marketing ou communication"], source: 'LinkedIn' },
  { id: 24, title: 'Alternance Technicien Réseau', company: 'Orange', location: 'Lyon', type: 'Alternance 24 mois', score: 10, matchPoints: [], gapPoints: ['Cisco', 'Administration réseau', 'Linux', 'Formation informatique', 'Protocoles TCP/IP'], description: "Rejoins les équipes techniques d'Orange pour assurer la maintenance et l'évolution des infrastructures réseau.", missions: ["Configurer et maintenir les équipements réseau", "Diagnostiquer et résoudre les incidents", "Rédiger la documentation technique", "Participer aux projets d'évolution des infrastructures"], advice: ["Ce poste nécessite une formation en informatique réseaux", "Ton profil marketing est incompatible avec les exigences techniques", "Des postes en digital marketing chez Orange correspondraient mieux"], source: 'Indeed' },
  { id: 25, title: 'Stage Assistant Ressources Humaines', company: 'Renault', location: 'Boulogne-Billancourt', type: 'Stage 6 mois', score: 22, matchPoints: ['Copywriting', 'Notion'], gapPoints: ['Droit du travail', 'Recrutement', 'SIRH', 'Formation RH', 'Paie'], description: "Intègre la direction des ressources humaines de Renault pour soutenir les équipes sur les projets RH.", missions: ["Assister sur les processus de recrutement", "Gérer les dossiers administratifs RH", "Participer aux projets de marque employeur", "Soutenir l'organisation des événements internes"], advice: ["La marque employeur est la partie de ce poste la plus proche de ton profil", "Une formation RH ou des bases en droit du travail sont attendues", "Si tu t'intéresses aux RH, oriente-toi vers des postes en employer branding"], source: 'Welcome to the Jungle' },
];

// ─── Design system tokens & global CSS ────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { width: 100%; max-width: 100vw; overflow-x: hidden; }

  :root {
    --color-primary:       #00B8D9;
    --color-primary-dark:  #005490;
    --color-primary-deep:  #034D82;
    --color-primary-light: #27C0EF;
    --color-primary-pale:  #EFFBFF;
    --color-text-dark:     #183B56;
    --color-text-body:     #90A3B4;
    --color-text-muted:    #8EA9C1;
    --color-text-white:    #FFFFFF;
    --color-bg-white:      #FFFFFF;
    --color-bg-soft:       #F5F9FF;
    --color-bg-pale:       #EFFBFF;
    --color-bg-footer:     #081315;
    --color-border:        #EEF0F2;
    --color-neutral:       #B3BAC5;
    --color-neutral-dark:  #5A7184;
    --color-warning:       #FAAD13;
    --color-success:       #36B37E;
    --color-chart-light:   #9BE1F8;
    --grad-hero:     linear-gradient(216.04deg, #27C0EF 13.84%, #00A8DB 83.53%);
    --grad-cta:      linear-gradient(278.21deg, #005490 1.66%, #328BCB 96.78%);
    --grad-section:  linear-gradient(270deg, #01B8D9 0%, #24CEED 100%);
  }

  .mu-root * {
    font-family: 'DM Sans', sans-serif !important;
    box-sizing: border-box;
    letter-spacing: 0.3px;
  }

  .mu-root h1, .mu-root h2, .mu-root h3, .mu-root h4,
  .mu-root p, .mu-root span, .mu-root div,
  .mu-root button, .mu-root input, .mu-root textarea { margin: 0; padding: 0; }

  .mu-accent { color: #00B8D9; }

  .mu-eyebrow {
    display: block;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #90A3B4;
    font-size: 12px !important;
    font-weight: 500 !important;
    margin-bottom: 12px;
  }
  .mu-eyebrow-light { color: rgba(255,255,255,0.75) !important; }

  @keyframes mu-step-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mu-step { animation: mu-step-in 300ms ease forwards; }

  @keyframes mu-progress { from { width: 0%; } to { width: 100%; } }
  .mu-progress-bar { animation: mu-progress 2500ms ease-in-out forwards; }

  .mu-card-hover { transition: transform 250ms ease; cursor: pointer; }
  .mu-card-hover:hover { transform: translateY(-4px); }

  .mu-input-focus:focus { outline: none !important; border-color: #00B8D9 !important; }

  .mu-h1        { font-size: 64px; font-weight: 700; line-height: 76px;  color: #183B56; }
  .mu-h2        { font-size: 36px; font-weight: 700; line-height: 52px;  color: #183B56; }
  .mu-h3        { font-size: 20px; font-weight: 700; line-height: 28px;  color: #183B56; }
  .mu-h2-detail { font-size: 36px; font-weight: 700; line-height: 52px;  color: #183B56; }

  @media (max-width: 768px) {
    .mu-h1        { font-size: 34px; line-height: 1.2; }
    .mu-h2        { font-size: 28px; line-height: 1.3; }
    .mu-h2-detail { font-size: 26px; line-height: 1.3; }
    .mu-h3        { font-size: 18px; }
  }
`;

// ─── Design tokens (JS) ───────────────────────────────────────────────────────
const S = {
  primary:      '#00B8D9',
  primaryDark:  '#005490',
  primaryDeep:  '#034D82',
  primaryLight: '#27C0EF',
  bgPale:       '#EFFBFF',
  textDark:     '#183B56',
  textBody:     '#90A3B4',
  textMuted:    '#8EA9C1',
  white:        '#FFFFFF',
  bgWhite:      '#FFFFFF',
  bgSoft:       '#F5F9FF',
  bgFooter:     '#081315',
  border:       '#EEF0F2',
  neutral:      '#B3BAC5',
  neutralDark:  '#5A7184',
  success:      '#36B37E',
  warning:      '#FAAD13',
  chartLight:   '#9BE1F8',
  gradHero:    'linear-gradient(216.04deg, #27C0EF 13.84%, #00A8DB 83.53%)',
  gradCta:     'linear-gradient(278.21deg, #005490 1.66%, #328BCB 96.78%)',
  gradSection: 'linear-gradient(270deg, #01B8D9 0%, #24CEED 100%)',
} as const;

const inputStyle: React.CSSProperties = {
  border: `1px solid ${S.border}`,
  borderRadius: '4px',
  padding: '12px 16px',
  fontSize: '16px',
  fontWeight: 400,
  background: S.bgWhite,
  color: S.textDark,
  width: '100%',
  display: 'block',
  letterSpacing: '0.3px',
};

// Primary CTA — gradient, 4px radius, height 57px
const btnNavy: React.CSSProperties = {
  background: S.gradCta,
  color: S.white,
  border: 'none',
  borderRadius: '4px',
  padding: '0 35px',
  height: '57px',
  fontSize: '16px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: '150ms ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  letterSpacing: '0.3px',
};

// Small secondary button — height 38px
const btnSmall: React.CSSProperties = {
  background: S.gradCta,
  color: S.white,
  border: 'none',
  borderRadius: '4px',
  padding: '0 20px',
  height: '38px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: '150ms ease',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  letterSpacing: '0.3px',
};

// Card style shared
const cardStyle: React.CSSProperties = {
  background: S.bgWhite,
  borderRadius: '8px',
  border: `1px solid ${S.border}`,
  filter: 'drop-shadow(0px 20px 47px rgba(0,0,0,0.05))',
};

// ─────────────────────────────────────────────
// BACK BUTTON
// ─────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.textBody, fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', padding: '0', marginBottom: '32px', letterSpacing: '0.3px' }}>
      &larr; Retour
    </button>
  );
}

// ─────────────────────────────────────────────
// STEP 1 — AUTH
// ─────────────────────────────────────────────
function AuthStep({ setCandidateData, goTo }: { setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleLinkedIn = () => {
    setCandidateData(prev => ({ ...prev, firstName: 'Lucas', lastName: 'Moreau', email: 'lucas.moreau@gmail.com', hardSkills: ['Marketing digital', 'SEO/SEA', 'Canva', 'Google Analytics', 'Notion', 'Copywriting'], softSkills: ['Créatif', 'Autonome', 'Orienté résultats'] }));
    goTo('upload');
  };
  const handleCreate = () => {
    setCandidateData(prev => ({ ...prev, firstName: form.firstName || 'Lucas', lastName: form.lastName || 'Moreau', email: form.email || 'lucas.moreau@gmail.com' }));
    goTo('upload');
  };

  return (
    <div className="mu-step" style={{ background: S.bgSoft, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '480px', boxSizing: 'border-box' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <img src="/logo.svg" alt="Match & Go" style={{ height: '48px', width: 'auto' }} />
        </div>

        <h1 className="mu-h1" style={{ marginBottom: '12px', textAlign: 'center', fontSize: isMobile ? '34px' : undefined }}>
          Trouve ton <span className="mu-accent">alternance</span>.
        </h1>
        <p style={{ fontSize: '16px', fontWeight: 400, color: S.textBody, textAlign: 'center', marginBottom: '40px', lineHeight: '28px' }}>
          Analyse ton profil. Compare tes chances. Postule là où ça compte.
        </p>

        {/* LinkedIn */}
        <button onClick={handleLinkedIn} style={{ ...btnNavy, width: '100%', marginBottom: '20px' }}>
          Continuer avec LinkedIn
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: S.border }} />
          <span style={{ fontSize: '14px', color: S.textMuted, fontWeight: 500 }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: S.border }} />
        </div>

        {/* Form card */}
        <div style={{ ...cardStyle, padding: isMobile ? '24px' : '32px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
              <input type="text" placeholder="Prénom" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="mu-input-focus" style={inputStyle} />
              <input type="text" placeholder="Nom" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="mu-input-focus" style={inputStyle} />
            </div>
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="mu-input-focus" style={inputStyle} />
            <input type="password" placeholder="Mot de passe" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="mu-input-focus" style={inputStyle} />
          </div>
        </div>

        <button onClick={handleCreate} style={{ ...btnNavy, width: '100%', marginBottom: '16px' }}>Créer mon compte</button>
        <p style={{ textAlign: 'center', fontSize: '14px', color: S.textBody, cursor: 'pointer', fontWeight: 500 }}>
          Déjà un compte ? <span style={{ color: S.primary }}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 2 — UPLOAD CV
// ─────────────────────────────────────────────
function UploadStep({ setCandidateData, goTo }: { setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState('Lecture du CV...');
  const [fileName, setFileName] = useState('');
  const [progressKey, setProgressKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true); setLoadingText('Lecture du CV...'); setProgressKey(k => k + 1);
    const texts = ['Lecture du CV...', 'Extraction des compétences...', 'Profil presque prêt...'];
    let i = 0;
    const interval = setInterval(() => { i++; if (i < texts.length) setLoadingText(texts[i]); else clearInterval(interval); }, 800);
    setTimeout(() => { clearInterval(interval); setCandidateData(prev => ({ ...prev, hardSkills: ['Marketing digital', 'SEO/SEA', 'Canva', 'Google Analytics', 'Notion', 'Copywriting'], softSkills: ['Créatif', 'Autonome', 'Orienté résultats'] })); goTo('questionnaire'); }, 2500);
  };

  return (
    <div className="mu-step" style={{ background: S.bgSoft, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '600px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo('auth')} />
        <span className="mu-eyebrow">TON CV</span>
        <h2 className="mu-h2" style={{ marginBottom: '32px', fontSize: isMobile ? '28px' : undefined }}>
          Uploade ton <span className="mu-accent">CV</span>
        </h2>
        <div onClick={() => !isAnalyzing && fileRef.current?.click()} style={{ ...cardStyle, padding: isMobile ? '40px 20px' : '64px 32px', border: `1.5px dashed ${S.border}`, cursor: isAnalyzing ? 'default' : 'pointer', marginBottom: '24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '180px' }}>
          {!isAnalyzing ? (
            <><p style={{ fontSize: '16px', fontWeight: 500, color: S.textDark }}>{fileName || 'Glisse ton CV ici ou clique pour sélectionner'}</p><p style={{ fontSize: '14px', color: S.textBody }}>PDF, Word - max 5 Mo</p></>
          ) : (
            <div style={{ width: '100%' }}>
              <div style={{ background: S.border, borderRadius: '100px', height: '6px', marginBottom: '20px', overflow: 'hidden' }}>
                <div key={progressKey} className="mu-progress-bar" style={{ background: S.primary, height: '100%', borderRadius: '100px', width: '0%' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: S.textDark, textAlign: 'center' }}>{loadingText}</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }} />
        <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ ...btnNavy, width: '100%', opacity: isAnalyzing ? 0.6 : 1, cursor: isAnalyzing ? 'default' : 'pointer' }}>
          {isAnalyzing ? 'Analyse en cours...' : 'Analyser mon CV'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 3 — QUESTIONNAIRE
// ─────────────────────────────────────────────
function QuestionnaireStep({ candidateData, setCandidateData, goTo }: { candidateData: CandidateData; setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [newHard, setNewHard] = useState(''); const [newSoft, setNewSoft] = useState('');
  const [addingHard, setAddingHard] = useState(false); const [addingSoft, setAddingSoft] = useState(false);

  const removeHard = (s: string) => setCandidateData(prev => ({ ...prev, hardSkills: prev.hardSkills.filter(x => x !== s) }));
  const removeSoft = (s: string) => setCandidateData(prev => ({ ...prev, softSkills: prev.softSkills.filter(x => x !== s) }));
  const addHard = () => { if (newHard.trim()) { setCandidateData(prev => ({ ...prev, hardSkills: [...prev.hardSkills, newHard.trim()] })); setNewHard(''); setAddingHard(false); } };
  const addSoft = () => { if (newSoft.trim()) { setCandidateData(prev => ({ ...prev, softSkills: [...prev.softSkills, newSoft.trim()] })); setNewSoft(''); setAddingSoft(false); } };
  const toggleAnswer = (key: string, val: string) => setCandidateData(prev => ({ ...prev, personalityAnswers: { ...prev.personalityAnswers, [key]: prev.personalityAnswers[key] === val ? '' : val } }));

  const QUESTIONS = [
    { key: 'workStyle', label: 'Comment tu travailles le mieux ?', options: ['En équipe', 'En autonomie', 'Selon les projets'] },
    { key: 'companyType', label: "Quel type d'entreprise tu recherches ?", options: ['Startup', 'Grand groupe', 'PME', 'Peu importe'] },
    { key: 'missionPriority', label: 'Ce qui compte le plus dans une mission ?', options: ['Impact', 'Apprentissage', 'Créativité', 'Rémunération'] },
  ];

  const addBtnStyle: React.CSSProperties = { background: 'transparent', border: `1px solid ${S.border}`, borderRadius: '27px', padding: '6px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: S.textDark };

  return (
    <div className="mu-step" style={{ background: S.bgSoft, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '900px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo('upload')} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '48px' }}>
          {/* Left — Skills */}
          <div style={{ ...cardStyle, padding: '32px' }}>
            <span className="mu-eyebrow">COMPÉTENCES EXTRAITES</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {candidateData.hardSkills.map(skill => (
                <div key={skill} style={{ background: S.bgPale, color: S.primary, borderRadius: '27px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {skill}<span onClick={() => removeHard(skill)} style={{ cursor: 'pointer', opacity: 0.7, fontSize: '15px', lineHeight: 1 }}>&times;</span>
                </div>
              ))}
              {addingHard ? (
                <input autoFocus value={newHard} onChange={e => setNewHard(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addHard(); if (e.key === 'Escape') setAddingHard(false); }} className="mu-input-focus" style={{ ...inputStyle, width: '160px', padding: '6px 12px', fontSize: '12px', borderRadius: '27px' }} placeholder="Nouvelle compétence" />
              ) : <button onClick={() => setAddingHard(true)} style={addBtnStyle}>+ Ajouter une compétence</button>}
            </div>
            <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, marginBottom: '24px' }} />
            <span className="mu-eyebrow">SOFT SKILLS IDENTIFIÉS</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {candidateData.softSkills.map(skill => (
                <div key={skill} style={{ background: S.bgWhite, border: `1px solid ${S.border}`, color: S.textDark, borderRadius: '27px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {skill}<span onClick={() => removeSoft(skill)} style={{ cursor: 'pointer', opacity: 0.7, fontSize: '15px', lineHeight: 1 }}>&times;</span>
                </div>
              ))}
              {addingSoft ? (
                <input autoFocus value={newSoft} onChange={e => setNewSoft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addSoft(); if (e.key === 'Escape') setAddingSoft(false); }} className="mu-input-focus" style={{ ...inputStyle, width: '140px', padding: '6px 12px', fontSize: '12px', borderRadius: '27px' }} placeholder="Nouveau soft skill" />
              ) : <button onClick={() => setAddingSoft(true)} style={addBtnStyle}>+ Ajouter</button>}
            </div>
          </div>

          {/* Right — Questions */}
          <div style={{ ...cardStyle, padding: '32px' }}>
            <span className="mu-eyebrow">QUELQUES QUESTIONS</span>
            {QUESTIONS.map(q => (
              <div key={q.key} style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '15px', fontWeight: 500, color: S.textDark, marginBottom: '12px', lineHeight: '24px' }}>{q.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {q.options.map(opt => {
                    const sel = candidateData.personalityAnswers[q.key] === opt;
                    return <button key={opt} onClick={() => toggleAnswer(q.key, opt)} style={{ borderRadius: '27px', padding: '8px 18px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: '150ms ease', border: `1px solid ${sel ? 'transparent' : S.border}`, background: sel ? S.gradCta : S.bgWhite, color: sel ? S.white : S.textDark, letterSpacing: '0.3px' }}>{opt}</button>;
                  })}
                </div>
              </div>
            ))}
            <textarea value={candidateData.preferences} onChange={e => setCandidateData(prev => ({ ...prev, preferences: e.target.value }))} placeholder="Ce que tu recherches pour ton alternance - secteur, missions, type d'équipe... (optionnel)" rows={4} className="mu-input-focus" style={{ ...inputStyle, resize: 'none', marginBottom: '24px', lineHeight: '26px', borderRadius: '8px' }} />
            <button onClick={() => goTo('intermediate')} style={{ ...btnNavy, width: '100%' }}>Voir mon profil analysé</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 4 — INTERMEDIATE
// ─────────────────────────────────────────────
function IntermediateStep({ candidateData, goTo }: { candidateData: CandidateData; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const COMPATIBLE_ROLES = ['Chef de projet digital', 'Chargé de marketing', 'Social Media Manager', 'Product Manager junior', 'Traffic Manager'];
  const RECOMMENDATIONS = [
    "Remplace 'gestion de projet' par 'project management' : les ATS favorisent l'anglais en marketing digital",
    "Ajoute une section 'Outils' avec Notion, Canva, Google Analytics : mentionnés dans 80% des offres ciblées",
    "Ton titre actuel est trop générique. Précise : Alternance Marketing Digital, SEO et Content",
    "Intègre des métriques dans tes expériences : '+30% de trafic organique', '5 campagnes gérées en autonomie'",
  ];

  return (
    <div className="mu-step" style={{ background: S.bgWhite, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '800px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo('questionnaire')} />
        <span className="mu-eyebrow">TON PROFIL</span>
        <h2 className="mu-h2" style={{ marginBottom: '8px', fontSize: isMobile ? '28px' : undefined }}>
          Bonjour {candidateData.firstName || 'Lucas'}, voici ce que ton profil <span className="mu-accent">nous dit</span>
        </h2>
        <p style={{ fontSize: '16px', color: S.textBody, marginBottom: '40px', lineHeight: '28px' }}>Analyse basée sur ton CV et tes réponses</p>

        {/* Postes compatibles */}
        <div style={{ ...cardStyle, padding: isMobile ? '24px' : '40px', marginBottom: '24px', width: '100%' }}>
          <span className="mu-eyebrow">POSTES COMPATIBLES</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {COMPATIBLE_ROLES.map(role => (
              <div key={role} style={{ background: S.bgPale, color: S.primary, borderRadius: '27px', padding: '6px 18px', fontSize: '14px', fontWeight: 400 }}>{role}</div>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div style={{ background: S.gradHero, borderRadius: '8px', padding: isMobile ? '24px' : '40px', marginBottom: '48px', width: '100%', boxSizing: 'border-box' }}>
          <span className="mu-eyebrow mu-eyebrow-light">RECOMMANDATIONS CV</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {RECOMMENDATIONS.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: S.chartLight, flexShrink: 0, fontSize: '18px', lineHeight: 1.4 }}>&bull;</span>
                <p style={{ fontSize: '15px', fontWeight: 400, color: S.white, lineHeight: '24px' }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => goTo('match-free')} style={{ ...btnNavy }}>Découvrir mes offres</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 5 — MATCH FREE
// ─────────────────────────────────────────────
function MatchFreeStep({ offers, goTo, setSelectedOffer }: { offers: Offer[]; goTo: (s: Step) => void; setSelectedOffer: (o: Offer) => void }) {
  const isMobile = useWindowSize() < 768;
  const sortedOffers = [...offers].sort((a, b) => b.score - a.score);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(80);

  useEffect(() => {
    if (!bannerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (bannerRef.current) setBannerHeight(bannerRef.current.offsetHeight);
    });
    observer.observe(bannerRef.current);
    setBannerHeight(bannerRef.current.offsetHeight);
    return () => observer.disconnect();
  }, [isMobile]);

  const navHeight = 48;
  const totalOffset = bannerHeight + navHeight;

  return (
    <>
      {/* Banner — hors du conteneur animé pour que position:fixed soit ancré à la fenêtre */}
      <div ref={bannerRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: S.gradSection, color: S.white, padding: '12px 24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '8px', boxSizing: 'border-box' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: S.white, letterSpacing: '0.3px' }}>Tu es en version gratuite : score visible, explications masquées</p>
        <button onClick={() => goTo('payment')} style={{ background: S.bgWhite, color: S.primary, border: 'none', borderRadius: '4px', padding: '0 20px', height: '38px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
          Passer en Premium - 9€/mois
        </button>
      </div>

      {/* Sidebar — hors du conteneur animé */}
      {!isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px', overflowY: 'auto', zIndex: 90, backgroundColor: S.bgSoft, borderRight: `1px solid ${S.border}`, padding: '80px 24px 32px', boxSizing: 'border-box' }}>
          <img src="/logo.svg" alt="Match & Go" style={{ height: '36px', width: 'auto', marginBottom: '32px' }} />
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(['Offres', 'Profil', 'Paramètres'] as const).map((item, i) => (
              item === 'Profil' ? (
                <span key={item} onClick={() => goTo('profile')} style={{ display: 'block', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>Profil</span>
              ) : (
                <div key={item} style={{ padding: '10px 16px', borderRadius: '4px', background: i === 0 ? S.bgPale : 'transparent', fontSize: '14px', fontWeight: 500, color: i === 0 ? S.primary : S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>{item}</div>
              )
            ))}
          </nav>
        </div>
      )}

      {/* Mobile nav — positionnée juste sous la bannière */}
      {isMobile && (
        <div style={{ position: 'fixed', top: `${bannerHeight}px`, left: 0, right: 0, zIndex: 90, backgroundColor: S.bgSoft, borderBottom: `1px solid ${S.border}`, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '12px 16px', boxSizing: 'border-box' }}>
          {(['Offres', 'Profil', 'Paramètres'] as const).map((item, i) => (
            item === 'Profil' ? (
              <span key={item} onClick={() => goTo('profile')} style={{ fontSize: '14px', fontWeight: 500, color: S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>Profil</span>
            ) : (
              <span key={item} style={{ fontSize: '14px', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? S.primary : S.textBody, letterSpacing: '0.3px' }}>{item}</span>
            )
          ))}
        </div>
      )}

      <div className="mu-step" style={{ background: S.bgWhite, minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
        {/* Main content */}
        <div style={{ marginLeft: isMobile ? 0 : '260px', marginTop: isMobile ? `${totalOffset}px` : '48px', padding: isMobile ? '16px' : '40px', boxSizing: 'border-box' }}>
          <h3 className="mu-h3" style={{ marginBottom: '4px', fontSize: isMobile ? '18px' : undefined }}>Tes opportunités</h3>
          <p style={{ fontSize: '16px', color: S.textBody, marginBottom: '32px', lineHeight: '28px' }}>{sortedOffers.length} offres analysées pour ton profil</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sortedOffers.map(offer => <FreeOfferCard key={offer.id} offer={offer} goTo={goTo} setSelectedOffer={setSelectedOffer} isMobile={isMobile} />)}
          </div>
        </div>
      </div>
    </>
  );
}

function FreeOfferCard({ offer, goTo, setSelectedOffer, isMobile }: { offer: Offer; goTo: (s: Step) => void; setSelectedOffer: (o: Offer) => void; isMobile: boolean }) {
  const scoreColor = offer.score >= 70 ? S.primary : offer.score < 55 ? S.textBody : S.textDark;
  return (
    <div className="mu-card-hover" style={{ ...cardStyle, padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: S.bgPale, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: S.primary }}>{offer.company[0]}</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: S.textDark, letterSpacing: '0.3px' }}>{offer.company}</p>
          <p style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>{offer.location}</p>
        </div>
      </div>
      <p style={{ fontSize: '18px', fontWeight: 700, color: S.textDark, marginBottom: '12px', lineHeight: '28px' }}>{offer.title}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{offer.score}%</span>
        <span style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>de compatibilité</span>
      </div>
      <div style={{ backgroundColor: S.bgSoft, borderRadius: '8px', padding: '12px', filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', color: S.textDark }}>██████ ██████ ████ ███████ █████</p>
      </div>
      <button onClick={() => { setSelectedOffer(offer); goTo('offer-detail-free'); }} style={{ ...btnSmall, background: S.gradCta }}>
        Voir l'offre complète
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 6 — PAYMENT
// ─────────────────────────────────────────────
function PaymentStep({ setIsPremium, goTo }: { setIsPremium: (v: boolean) => void; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePay = () => { setIsProcessing(true); setTimeout(() => { setIsPremium(true); goTo('match-premium'); }, 1500); };
  const FEATURES = ['Score de compatibilité expliqué critère par critère', 'Offres classées en 3 niveaux : forts, partiels, faibles', 'Conseils personnalisés CV pour chaque offre', 'Alertes nouvelles offres en temps réel'];

  return (
    <div className="mu-step" style={{ background: S.bgSoft, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '960px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo('match-free')} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '60% 40%', gap: isMobile ? '32px' : '48px' }}>
          <div>
            <span className="mu-eyebrow">OFFRE PREMIUM</span>
            <h2 className="mu-h2" style={{ marginBottom: '32px', fontSize: isMobile ? '28px' : undefined }}>
              Accède à toutes tes <span className="mu-accent">chances</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: S.primary, flexShrink: 0, fontSize: '18px', lineHeight: 1.4 }}>&bull;</span>
                  <p style={{ fontSize: '16px', fontWeight: 400, color: S.textDark, lineHeight: '28px' }}>{f}</p>
                </div>
              ))}
            </div>
            <span style={{ fontSize: '64px', fontWeight: 700, color: S.primary, lineHeight: 1, letterSpacing: '-1px' }}>9€</span>
            <p style={{ fontSize: '16px', color: S.textBody, marginTop: '4px', lineHeight: '28px' }}>par mois - résiliable à tout moment</p>
          </div>
          <div>
            <div style={{ ...cardStyle, padding: isMobile ? '24px' : '40px' }}>
              <span className="mu-eyebrow">INFORMATIONS DE PAIEMENT</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <input type="text" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={e => setForm(p => ({ ...p, cardNumber: e.target.value }))} className="mu-input-focus" style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="MM/AA" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: e.target.value }))} className="mu-input-focus" style={inputStyle} />
                  <input type="text" placeholder="CVV" value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value }))} className="mu-input-focus" style={inputStyle} />
                </div>
                <input type="text" placeholder="Nom sur la carte" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mu-input-focus" style={inputStyle} />
              </div>
              <button onClick={handlePay} disabled={isProcessing} style={{ ...btnNavy, width: '100%', marginBottom: '12px', opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'default' : 'pointer' }}>
                {isProcessing ? 'Traitement en cours...' : 'Activer Premium - 9€/mois'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: S.textBody, letterSpacing: '0.3px' }}>Paiement simulé - aucune donnée réelle collectée</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 7 — MATCH PREMIUM
// ─────────────────────────────────────────────
function MatchPremiumStep({ offers, setSelectedOffer, setIsPremium, setShowDowngradeModal, goTo }: { offers: Offer[]; setSelectedOffer: (o: Offer) => void; setIsPremium: (v: boolean) => void; setShowDowngradeModal: (v: boolean) => void; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [activeTab, setActiveTab] = useState<'strong' | 'partial' | 'weak'>('strong');

  const strongOffers = offers.filter(o => o.score >= 75);
  const partialOffers = offers.filter(o => o.score >= 55 && o.score < 75);
  const weakOffers = offers.filter(o => o.score < 55);
  const filtered = activeTab === 'strong' ? strongOffers : activeTab === 'partial' ? partialOffers : weakOffers;
  const TABS = [
    { key: 'strong' as const, label: `Matchs forts (${strongOffers.length})` },
    { key: 'partial' as const, label: `Matchs partiels (${partialOffers.length})` },
    { key: 'weak' as const, label: `Matchs faibles (${weakOffers.length})` },
  ];

  return (
    <div className="mu-step" style={{ background: S.bgWhite, minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      {/* Sidebar — fixed desktop */}
      {!isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px', overflowY: 'auto', zIndex: 90, backgroundColor: S.bgSoft, borderRight: `1px solid ${S.border}`, padding: '32px 24px', boxSizing: 'border-box' }}>
          <img src="/logo.svg" alt="Match & Go" style={{ height: '36px', width: 'auto', marginBottom: '12px' }} />
          <span onClick={() => setShowDowngradeModal(true)} style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: S.bgPale, color: S.primary, borderRadius: '27px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', userSelect: 'none', marginBottom: '24px', letterSpacing: '0.3px' }}>
            Premium actif
          </span>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(['Offres', 'Profil', 'Paramètres'] as const).map((item, i) => (
              item === 'Profil' ? (
                <span key={item} onClick={() => goTo('profile')} style={{ display: 'block', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, color: S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>Profil</span>
              ) : (
                <div key={item} style={{ padding: '10px 16px', borderRadius: '4px', background: i === 0 ? S.bgPale : 'transparent', fontSize: '14px', fontWeight: 500, color: i === 0 ? S.primary : S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>{item}</div>
              )
            ))}
          </nav>
        </div>
      )}

      {/* Mobile nav — fixed */}
      {isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90, backgroundColor: S.bgSoft, borderBottom: `1px solid ${S.border}`, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '12px 16px', boxSizing: 'border-box' }}>
          {(['Offres', 'Profil', 'Paramètres'] as const).map((item, i) => (
            item === 'Profil' ? (
              <span key={item} onClick={() => goTo('profile')} style={{ fontSize: '14px', fontWeight: 500, color: S.textBody, cursor: 'pointer', letterSpacing: '0.3px' }}>Profil</span>
            ) : (
              <span key={item} style={{ fontSize: '14px', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? S.primary : S.textBody, letterSpacing: '0.3px' }}>{item}</span>
            )
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ marginLeft: isMobile ? 0 : '260px', marginTop: isMobile ? '60px' : '48px', padding: isMobile ? '16px' : '40px', boxSizing: 'border-box' }}>
        {isMobile && (
          <span onClick={() => setShowDowngradeModal(true)} style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: S.bgPale, color: S.primary, borderRadius: '27px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', userSelect: 'none', marginBottom: '16px', letterSpacing: '0.3px' }}>
            Premium actif
          </span>
        )}
        <h3 className="mu-h3" style={{ marginBottom: '4px', fontSize: isMobile ? '18px' : undefined }}>Tes opportunités</h3>
        <p style={{ fontSize: '16px', color: S.textBody, marginBottom: '24px', lineHeight: '28px' }}>{offers.length} offres analysées pour ton profil</p>

        {/* Tabs */}
        <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '8px', marginBottom: '32px', padding: isMobile ? '4px 0 12px' : '0', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'], scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'] }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: activeTab === tab.key ? S.gradCta : S.bgSoft, color: activeTab === tab.key ? S.white : S.textBody, border: `1px solid ${activeTab === tab.key ? 'transparent' : S.border}`, borderRadius: '27px', padding: '8px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: '150ms ease', flexShrink: 0, letterSpacing: '0.3px' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: S.textBody, fontSize: '15px' }}>Aucune offre dans cette catégorie.</p>
          ) : (
            filtered.map(offer => <PremiumOfferCard key={offer.id} offer={offer} isMobile={isMobile} onView={() => { setSelectedOffer(offer); goTo('offer-detail'); }} />)
          )}
        </div>
      </div>
    </div>
  );
}

function PremiumOfferCard({ offer, onView, isMobile }: { offer: Offer; onView: () => void; isMobile: boolean }) {
  const scoreColor = offer.score >= 75 ? S.primary : offer.score < 55 ? S.textBody : S.textDark;
  return (
    <div className="mu-card-hover" style={{ ...cardStyle, padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: S.bgPale, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: S.primary }}>{offer.company[0]}</div>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: S.textDark, letterSpacing: '0.3px' }}>{offer.company}</p>
          <p style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>{offer.location}</p>
        </div>
      </div>
      <p style={{ fontSize: '18px', fontWeight: 700, color: S.textDark, marginBottom: '12px', lineHeight: '28px' }}>{offer.title}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{offer.score}%</span>
        <span style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>de compatibilité</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
        {offer.matchPoints.map(pt => <span key={pt} style={{ background: '#EDFAF3', color: '#1A7A4A', borderRadius: '27px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.3px' }}>&#10003; {pt}</span>)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {offer.gapPoints.map(pt => <span key={pt} style={{ background: '#FEF2F2', color: '#B91C1C', borderRadius: '27px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.3px' }}>&#10007; {pt}</span>)}
      </div>
      <button onClick={onView} style={{ ...btnSmall, background: 'transparent', color: S.primaryDark, border: `1px solid ${S.border}` }}>
        Voir l'offre complète
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// DETAIL LAYOUT (shared free + premium)
// ─────────────────────────────────────────────
function DetailLayout({ offer, backStep, goTo, rightCol }: { offer: Offer; backStep: Step; goTo: (s: Step) => void; rightCol: React.ReactNode }) {
  const isMobile = useWindowSize() < 768;
  const words = offer.title.split(' ');
  const lastWord = words.pop() ?? '';
  const titleStart = words.join(' ');

  return (
    <div className="mu-step" style={{ background: S.bgWhite, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '1100px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo(backStep)} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '60% 40%', gap: isMobile ? '32px' : '48px', alignItems: 'flex-start' }}>
          <div>
            <span className="mu-eyebrow">DÉTAIL DE L'OFFRE</span>
            <h2 className="mu-h2-detail" style={{ marginBottom: '16px', fontSize: isMobile ? '26px' : undefined }}>
              {titleStart} <span className="mu-accent">{lastWord}</span>
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>{offer.company}</span>
              <span style={{ color: S.border }}>&middot;</span>
              <span style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>{offer.location}</span>
              <span style={{ color: S.border }}>&middot;</span>
              <span style={{ fontSize: '14px', color: S.textBody, letterSpacing: '0.3px' }}>{offer.type}</span>
            </div>
            <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, marginBottom: '28px' }} />
            <span className="mu-eyebrow">DESCRIPTION</span>
            <p style={{ fontSize: '16px', lineHeight: '28px', color: S.textDark, marginBottom: '40px' }}>{offer.description}</p>
            <span className="mu-eyebrow">MISSIONS PRINCIPALES</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
              {offer.missions.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: S.primary, flexShrink: 0, fontSize: '18px', lineHeight: 1.4 }}>&bull;</span>
                  <p style={{ fontSize: '16px', lineHeight: '28px', color: S.textDark }}>{m}</p>
                </div>
              ))}
            </div>
            <button onClick={() => alert(`Redirection vers ${offer.source}`)} style={{ ...btnNavy }}>
              Voir l'offre sur {offer.source} &nbsp;&#8599;
            </button>
          </div>
          {rightCol}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP 8 — OFFER DETAIL FREE
// ─────────────────────────────────────────────
function OfferDetailFreeStep({ offer, goTo }: { offer: Offer; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const rightCol = (
    <div>
      <div style={{ ...cardStyle, background: S.bgSoft, padding: '32px', position: isMobile ? 'static' : 'sticky', top: isMobile ? undefined : '40px' }}>
        <span className="mu-eyebrow">TES CHANCES</span>
        <span style={{ fontSize: isMobile ? '36px' : '48px', fontWeight: 700, color: S.primary, lineHeight: 1, display: 'block', marginBottom: '4px' }}>{offer.score}%</span>
        <p style={{ fontSize: '14px', color: S.textBody, marginBottom: '24px', letterSpacing: '0.3px' }}>de compatibilité</p>
        <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, marginBottom: '24px' }} />
        <p style={{ fontSize: '16px', color: S.textDark, lineHeight: '28px', marginBottom: '24px' }}>
          Découvre pourquoi tu matches et comment améliorer tes chances sur cette offre.
        </p>
        <button onClick={() => goTo('payment')} style={{ ...btnNavy, width: '100%' }}>
          Passer en Premium - 9€/mois
        </button>
      </div>
    </div>
  );
  return <DetailLayout offer={offer} backStep="match-free" goTo={goTo} rightCol={rightCol} />;
}

// ─────────────────────────────────────────────
// STEP 9 — OFFER DETAIL PREMIUM
// ─────────────────────────────────────────────
function OfferDetailStep({ offer, goTo }: { offer: Offer; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const rightCol = (
    <div>
      <div style={{ ...cardStyle, background: S.bgSoft, padding: '32px', position: isMobile ? 'static' : 'sticky', top: isMobile ? undefined : '40px' }}>
        <span className="mu-eyebrow">TES CHANCES</span>
        <span style={{ fontSize: isMobile ? '40px' : '56px', fontWeight: 700, color: S.primary, lineHeight: 1, display: 'block', marginBottom: '12px' }}>{offer.score}%</span>
        <div style={{ background: S.border, height: '8px', borderRadius: '100px', marginBottom: '8px', overflow: 'hidden' }}>
          <div style={{ background: S.gradCta, height: '100%', borderRadius: '100px', width: `${offer.score}%`, transition: '1s ease' }} />
        </div>
        <p style={{ fontSize: '14px', color: S.textBody, marginBottom: '24px', letterSpacing: '0.3px' }}>Compatibilité avec ce poste</p>
        <hr style={{ border: 'none', borderTop: `1px solid ${S.border}`, marginBottom: '24px' }} />
        <span className="mu-eyebrow">CONSEILS PERSONNALISÉS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {offer.advice.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: S.primary, flexShrink: 0, fontSize: '18px', lineHeight: 1.4 }}>&bull;</span>
              <p style={{ fontSize: '15px', lineHeight: '26px', color: S.textDark, letterSpacing: '0.3px' }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return <DetailLayout offer={offer} backStep="match-premium" goTo={goTo} rightCol={rightCol} />;
}

// ─────────────────────────────────────────────
// PROFILE STEP
// ─────────────────────────────────────────────
function ProfileStep({ candidateData, setCandidateData, isPremium, onCvUpdate, goTo }: { candidateData: CandidateData; setCandidateData: React.Dispatch<React.SetStateAction<CandidateData>>; isPremium: boolean; onCvUpdate: () => void; goTo: (s: Step) => void }) {
  const isMobile = useWindowSize() < 768;
  const [newHard, setNewHard] = useState(''); const [newSoft, setNewSoft] = useState('');
  const [addingHard, setAddingHard] = useState(false); const [addingSoft, setAddingSoft] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState('');
  const [cvUpdated, setCvUpdated] = useState(false);
  const cvRef = useRef<HTMLInputElement>(null);

  const removeHard = (s: string) => setCandidateData(prev => ({ ...prev, hardSkills: prev.hardSkills.filter(x => x !== s) }));
  const removeSoft = (s: string) => setCandidateData(prev => ({ ...prev, softSkills: prev.softSkills.filter(x => x !== s) }));
  const addHard = () => { if (newHard.trim()) { setCandidateData(prev => ({ ...prev, hardSkills: [...prev.hardSkills, newHard.trim()] })); setNewHard(''); setAddingHard(false); } };
  const addSoft = () => { if (newSoft.trim()) { setCandidateData(prev => ({ ...prev, softSkills: [...prev.softSkills, newSoft.trim()] })); setNewSoft(''); setAddingSoft(false); } };
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); goTo(isPremium ? 'match-premium' : 'match-free'); }, 2000); };

  const handleCvUpload = (file: File) => {
    setCvFileName(file.name);
    setIsAnalyzing(true);
    setCvUpdated(false);
    const steps = ['Lecture du CV...', 'Extraction des compétences...', 'Mise à jour du profil...'];
    let i = 0;
    setAnalyzeText(steps[0]);
    const interval = setInterval(() => { i++; if (i < steps.length) setAnalyzeText(steps[i]); else clearInterval(interval); }, 800);
    setTimeout(() => {
      clearInterval(interval);
      setIsAnalyzing(false);
      setCvUpdated(true);
      onCvUpdate();
    }, 2500);
  };

  const addBtnStyle: React.CSSProperties = { background: 'transparent', border: `1px solid ${S.border}`, borderRadius: '27px', padding: '6px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: S.textDark, letterSpacing: '0.3px' };

  return (
    <div className="mu-step" style={{ background: S.bgSoft, minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px' : '80px 24px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '800px', boxSizing: 'border-box' }}>
        <BackButton onClick={() => goTo(isPremium ? 'match-premium' : 'match-free')} />

        {/* Section 1 */}
        <div style={{ ...cardStyle, padding: '32px', marginBottom: '24px' }}>
          <span className="mu-eyebrow">INFORMATIONS PERSONNELLES</span>
          <p style={{ fontSize: '24px', fontWeight: 700, color: S.textDark, marginBottom: '4px', lineHeight: '32px' }}>{candidateData.firstName} {candidateData.lastName}</p>
          <p style={{ fontSize: '16px', color: S.textBody, lineHeight: '28px' }}>{candidateData.email}</p>
        </div>

        {/* Section CV */}
        <div style={{ ...cardStyle, padding: '32px', marginBottom: '24px' }}>
          <span className="mu-eyebrow">MON CV</span>
          <p style={{ fontSize: '15px', color: S.textBody, marginBottom: '20px', lineHeight: '24px' }}>
            Importe une version à jour de ton CV pour actualiser automatiquement tes compétences.
          </p>
          <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleCvUpload(f); }} />

          {isAnalyzing ? (
            <div style={{ background: S.bgSoft, borderRadius: '8px', padding: '20px' }}>
              <div style={{ background: S.border, borderRadius: '100px', height: '6px', marginBottom: '12px', overflow: 'hidden' }}>
                <div className="mu-progress-bar" style={{ background: S.primary, height: '100%', borderRadius: '100px', width: '0%' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: S.textDark, textAlign: 'center' }}>{analyzeText}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => cvRef.current?.click()} style={{ ...btnSmall }}>
                {cvFileName ? 'Changer de CV' : '+ Importer mon CV'}
              </button>
              {cvFileName && !isAnalyzing && (
                <span style={{ fontSize: '13px', color: S.textBody, letterSpacing: '0.3px' }}>{cvFileName}</span>
              )}
              {cvUpdated && (
                <span style={{ fontSize: '13px', fontWeight: 500, color: S.success, letterSpacing: '0.3px' }}>
                  ✓ Profil mis à jour
                </span>
              )}
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div style={{ ...cardStyle, padding: '32px', marginBottom: '24px' }}>
          <span className="mu-eyebrow">HARD SKILLS</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {candidateData.hardSkills.map(skill => (
              <div key={skill} style={{ background: S.bgPale, color: S.primary, borderRadius: '27px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {skill}<span onClick={() => removeHard(skill)} style={{ cursor: 'pointer', opacity: 0.7, fontSize: '15px', lineHeight: 1 }}>&times;</span>
              </div>
            ))}
            {addingHard ? (
              <input autoFocus value={newHard} onChange={e => setNewHard(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addHard(); if (e.key === 'Escape') setAddingHard(false); }} onBlur={addHard} className="mu-input-focus" style={{ ...inputStyle, width: '180px', padding: '6px 12px', fontSize: '12px', borderRadius: '27px' }} placeholder="Nouvelle compétence" />
            ) : <button onClick={() => setAddingHard(true)} style={addBtnStyle}>+ Ajouter une compétence</button>}
          </div>
        </div>

        {/* Section 3 */}
        <div style={{ ...cardStyle, padding: '32px', marginBottom: '24px' }}>
          <span className="mu-eyebrow">SOFT SKILLS</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {candidateData.softSkills.map(skill => (
              <div key={skill} style={{ background: S.bgWhite, border: `1px solid ${S.border}`, color: S.textDark, borderRadius: '27px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {skill}<span onClick={() => removeSoft(skill)} style={{ cursor: 'pointer', opacity: 0.7, fontSize: '15px', lineHeight: 1 }}>&times;</span>
              </div>
            ))}
            {addingSoft ? (
              <input autoFocus value={newSoft} onChange={e => setNewSoft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addSoft(); if (e.key === 'Escape') setAddingSoft(false); }} onBlur={addSoft} className="mu-input-focus" style={{ ...inputStyle, width: '160px', padding: '6px 12px', fontSize: '12px', borderRadius: '27px' }} placeholder="Nouveau soft skill" />
            ) : <button onClick={() => setAddingSoft(true)} style={addBtnStyle}>+ Ajouter un soft skill</button>}
          </div>
        </div>

        {/* Section 4 */}
        <div style={{ ...cardStyle, padding: '32px', marginBottom: '32px' }}>
          <span className="mu-eyebrow">TES PRÉFÉRENCES</span>
          <textarea value={candidateData.preferences} onChange={e => setCandidateData(prev => ({ ...prev, preferences: e.target.value }))} placeholder="Ce que tu recherches pour ton alternance - secteur, missions, type d'équipe..." className="mu-input-focus" style={{ ...inputStyle, resize: 'none', minHeight: '120px', lineHeight: '28px', borderRadius: '8px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={handleSave} style={{ ...btnNavy }}>Enregistrer les modifications</button>
          {saved && <p style={{ fontSize: '14px', fontWeight: 500, color: S.primary, letterSpacing: '0.3px' }}>Modifications enregistrées</p>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

// Compétences apportées par le nouveau CV — résolvent de vraies lacunes dans les offres
const CV_UPDATE_SKILLS = {
  hard: ['TikTok Ads', 'Google Tag Manager', 'A/B testing', 'Airtable', 'Meta Ads'],
  soft: ['Rigueur', 'Adaptabilité'],
};

function recomputeOffers(offers: Offer[], allSkills: string[]): Offer[] {
  return offers.map(offer => {
    const resolved = offer.gapPoints.filter(g => allSkills.includes(g));
    if (resolved.length === 0) return offer;
    return {
      ...offer,
      score: Math.min(99, offer.score + resolved.length * 5),
      matchPoints: [...offer.matchPoints, ...resolved],
      gapPoints: offer.gapPoints.filter(g => !allSkills.includes(g)),
    };
  });
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('auth');
  const [isPremium, setIsPremium] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateData>({ firstName: '', lastName: '', email: '', hardSkills: [], softSkills: [], personalityAnswers: {}, preferences: '' });
  const [offers, setOffers] = useState<Offer[]>(OFFERS);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);

  const goTo = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleCvUpdate = () => {
    setCandidateData(prev => {
      const newHard = Array.from(new Set([...prev.hardSkills, ...CV_UPDATE_SKILLS.hard]));
      const newSoft = Array.from(new Set([...prev.softSkills, ...CV_UPDATE_SKILLS.soft]));
      setOffers(recomputeOffers(offers, newHard));
      return { ...prev, hardSkills: newHard, softSkills: newSoft };
    });
  };

  return (
    <div className="mu-root" style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {currentStep === 'auth'             && <AuthStep setCandidateData={setCandidateData} goTo={goTo} />}
      {currentStep === 'upload'           && <UploadStep setCandidateData={setCandidateData} goTo={goTo} />}
      {currentStep === 'questionnaire'    && <QuestionnaireStep candidateData={candidateData} setCandidateData={setCandidateData} goTo={goTo} />}
      {currentStep === 'intermediate'     && <IntermediateStep candidateData={candidateData} goTo={goTo} />}
      {currentStep === 'match-free'       && <MatchFreeStep offers={offers} goTo={goTo} setSelectedOffer={setSelectedOffer} />}
      {currentStep === 'payment'          && <PaymentStep setIsPremium={setIsPremium} goTo={goTo} />}
      {currentStep === 'match-premium'    && <MatchPremiumStep offers={offers} setSelectedOffer={setSelectedOffer} setIsPremium={setIsPremium} setShowDowngradeModal={setShowDowngradeModal} goTo={goTo} />}
      {currentStep === 'offer-detail-free'&& selectedOffer && <OfferDetailFreeStep offer={selectedOffer} goTo={goTo} />}
      {currentStep === 'offer-detail'     && selectedOffer && <OfferDetailStep offer={selectedOffer} goTo={goTo} />}
      {currentStep === 'profile'          && <ProfileStep candidateData={candidateData} setCandidateData={setCandidateData} isPremium={isPremium} onCvUpdate={handleCvUpdate} goTo={goTo} />}

      {/* Downgrade modal */}
      {showDowngradeModal && (
        <div onClick={() => setShowDowngradeModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(24, 59, 86, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: S.bgWhite, borderRadius: '8px', padding: '40px', maxWidth: '440px', width: '90%', filter: 'drop-shadow(0px 20px 47px rgba(0,0,0,0.12))' }}>
            <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '24px', fontWeight: 700, color: S.textDark, lineHeight: '32px', marginBottom: '12px' }}>Passer en version gratuite ?</h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '16px', fontWeight: 400, color: S.textBody, lineHeight: '28px', marginBottom: '32px' }}>Tu perdras accès aux explications, aux onglets de tri et aux conseils personnalisés.</p>
            <div style={{ display: 'flex', gap: '12px', flexDirection: window.innerWidth < 480 ? 'column' : 'row' }}>
              <button onClick={() => setShowDowngradeModal(false)} style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${S.border}`, borderRadius: '4px', padding: '13px 28px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500, color: S.textDark, cursor: 'pointer', letterSpacing: '0.3px' }}>
                Annuler
              </button>
              <button onClick={() => { setIsPremium(false); setShowDowngradeModal(false); setCurrentStep('match-free'); }} style={{ flex: 1, background: S.gradCta, border: 'none', borderRadius: '4px', padding: '14px 28px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 500, color: S.white, cursor: 'pointer', letterSpacing: '0.3px' }}>
                Passer en Free
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
