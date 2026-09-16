// Matériel du protocole de test AB — agrégateur d'offres (côté école).
// Une même offre existe sous 3 formes équivalentes (texte, lien, PDF) pour que
// le testeur puisse utiliser celle qu'il choisit ; les 3 pointent vers la même
// fiche correcte, qui sert de résultat simulé de l'extraction IA.

export interface AbTestOffer {
  id: string;
  rawText: string;
  fakeLink: string;
  pdfFileName: string;
  title: string;
  company: string;
  location: string;
  contractType: string;
  description: string;
  missions: string[];
  skills: string;
  profile: string;
}

export const AB_TEST_OFFERS: AbTestOffer[] = [
  {
    id: 'pm-paris',
    rawText: "Bonjour, nous recherchons un(e) alternant(e) Product Manager Junior pour notre équipe produit à Paris, à partir de novembre, contrat de 12 à 24 mois. Profil : bac+3/4 minimum, à l'aise avec Figma et Notion, anglais courant. Rémunération selon grille légale. Merci de nous transmettre les profils intéressants.",
    fakeLink: 'https://offres-partenaires.exemple/alt-product-manager-paris',
    pdfFileName: 'offre-product-manager-paris.pdf',
    title: 'Alternance Product Manager Junior',
    company: 'Entreprise partenaire — Produit',
    location: 'Paris',
    contractType: 'Alternance · 12 à 24 mois, début en novembre',
    description: "Rejoins l'équipe produit d'une entreprise partenaire à Paris pour contribuer au développement de nouvelles fonctionnalités.",
    missions: [
      'Contribuer à la définition de la roadmap produit',
      'Rédiger les spécifications fonctionnelles',
      'Coordonner les retours entre équipes tech, design et business',
    ],
    skills: 'Figma, Notion, Anglais courant',
    profile: 'Bac+3/4 minimum',
  },
  {
    id: 'data-growth-lyon',
    rawText: "Salut, du coup on a un poste à pourvoir chez nous, c'est pour de la data/growth, plutôt orienté analyse mais faut aussi être à l'aise avec les outils no-code genre Airtable ou Make, et un peu de SQL c'est un plus mais pas obligatoire. C'est basé à Lyon (possibilité 2j télétravail). On cherche quelqu'un pour la rentrée de septembre prochain idéalement, sur un rythme 3j entreprise / 2j école. Niveau bac+5. Salaire : grille alternance + tickets restau.",
    fakeLink: 'https://offres-partenaires.exemple/alt-data-growth-lyon',
    pdfFileName: 'offre-data-growth-lyon.pdf',
    title: 'Alternance Data & Growth',
    company: 'Entreprise partenaire — Data/Growth',
    location: 'Lyon (2 jours de télétravail possibles)',
    contractType: 'Alternance · rythme 3j entreprise / 2j école, début en septembre',
    description: "Rejoins l'équipe data & growth d'une entreprise partenaire à Lyon pour accompagner l'acquisition et l'analyse des données.",
    missions: [
      "Analyser les données d'acquisition et de rétention",
      'Automatiser des tableaux de suivi avec Airtable et Make',
      'Proposer des pistes d’optimisation du funnel',
    ],
    skills: 'Analyse de données, Airtable, Make, SQL (un plus)',
    profile: 'Bac+5',
  },
  {
    id: 'marketing-digital-nantes',
    rawText: "Hello, nous recrutons un(e) alternant(e) Chargé(e) de Marketing Digital, basé à Nantes, disponible dès janvier, contrat 12 mois. Bonne maîtrise de Canva et des réseaux sociaux (Instagram, LinkedIn) souhaitée. Niveau bac+3. Merci de faire suivre aux étudiants intéressés.",
    fakeLink: 'https://offres-partenaires.exemple/alt-marketing-digital-nantes',
    pdfFileName: 'offre-marketing-digital-nantes.pdf',
    title: 'Alternance Chargé(e) de Marketing Digital',
    company: 'Entreprise partenaire — Marketing',
    location: 'Nantes',
    contractType: 'Alternance · 12 mois, début en janvier',
    description: "Rejoins l'équipe marketing d'une entreprise partenaire à Nantes pour animer la présence digitale de la marque.",
    missions: [
      'Créer et planifier les contenus Instagram et LinkedIn',
      'Concevoir des visuels sur Canva pour les campagnes',
      "Suivre les indicateurs d'engagement",
    ],
    skills: 'Canva, Réseaux sociaux (Instagram, LinkedIn)',
    profile: 'Bac+3',
  },
  {
    id: 'ux-ui-bordeaux',
    rawText: "Nous recherchons un(e) alternant(e) UX/UI Designer pour rejoindre notre équipe produit à Bordeaux. Maîtrise de Figma exigée, une sensibilité pour la recherche utilisateur est un plus. Rythme 4 jours entreprise / 1 jour école. Début souhaité : septembre. Niveau bac+4/5.",
    fakeLink: 'https://offres-partenaires.exemple/alt-ux-ui-bordeaux',
    pdfFileName: 'offre-ux-ui-bordeaux.pdf',
    title: 'Alternance UX/UI Designer',
    company: 'Entreprise partenaire — Design',
    location: 'Bordeaux',
    contractType: 'Alternance · rythme 4j entreprise / 1j école, début en septembre',
    description: "Rejoins l'équipe produit d'une entreprise partenaire à Bordeaux pour concevoir des parcours utilisateurs clairs et efficaces.",
    missions: [
      'Concevoir des maquettes et prototypes sur Figma',
      'Participer aux sessions de recherche utilisateur',
      'Itérer sur les parcours avec les équipes produit et tech',
    ],
    skills: 'Figma, Recherche utilisateur (un plus)',
    profile: 'Bac+4/5',
  },
  {
    id: 'dev-frontend-lille',
    rawText: "Poste d'alternant(e) Développeur(se) Web Front-End à pourvoir à Lille. Stack : React, TypeScript. Une première expérience en stage appréciée mais pas obligatoire. Contrat de 24 mois, télétravail partiel possible. Merci de transmettre les candidatures rapidement.",
    fakeLink: 'https://offres-partenaires.exemple/alt-dev-frontend-lille',
    pdfFileName: 'offre-dev-frontend-lille.pdf',
    title: 'Alternance Développeur(se) Web Front-End',
    company: 'Entreprise partenaire — Tech',
    location: 'Lille (télétravail partiel possible)',
    contractType: 'Alternance · 24 mois',
    description: "Rejoins l'équipe technique d'une entreprise partenaire à Lille pour développer des interfaces web modernes.",
    missions: [
      'Développer des interfaces en React et TypeScript',
      'Participer aux revues de code',
      'Collaborer avec les équipes design et back-end',
    ],
    skills: 'React, TypeScript',
    profile: 'Première expérience en stage appréciée (non obligatoire)',
  },
  {
    id: 'chef-projet-marseille',
    rawText: "Nous cherchons un(e) alternant(e) Assistant(e) Chef de Projet, à Marseille, pour accompagner le déploiement d'un nouvel outil interne. Bon niveau Excel/Notion attendu, anglais professionnel apprécié. Alternance de 12 à 18 mois, à partir d'octobre.",
    fakeLink: 'https://offres-partenaires.exemple/alt-chef-projet-marseille',
    pdfFileName: 'offre-chef-projet-marseille.pdf',
    title: 'Alternance Assistant(e) Chef de Projet',
    company: 'Entreprise partenaire — Projet',
    location: 'Marseille',
    contractType: "Alternance · 12 à 18 mois, début en octobre",
    description: "Rejoins la direction de projet d'une entreprise partenaire à Marseille pour accompagner le déploiement d'un nouvel outil interne.",
    missions: [
      "Accompagner le déploiement d'un nouvel outil interne",
      'Suivre les plannings et rédiger les comptes-rendus',
      'Assurer le lien entre les équipes concernées',
    ],
    skills: 'Excel, Notion, Anglais professionnel (apprécié)',
    profile: 'Non précisé',
  },
];

export function findAbTestOffer(input: { text?: string; fileName?: string }): AbTestOffer | undefined {
  const text = input.text?.trim();
  if (text) {
    const byText = AB_TEST_OFFERS.find((o) => o.rawText.trim() === text || o.fakeLink === text);
    if (byText) return byText;
  }
  const fileName = input.fileName?.trim().toLowerCase();
  if (fileName) {
    const byFile = AB_TEST_OFFERS.find((o) => o.pdfFileName.toLowerCase() === fileName);
    if (byFile) return byFile;
  }
  return undefined;
}
