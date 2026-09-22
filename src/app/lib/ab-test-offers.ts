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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-product-manager-paris
Alternance Product Manager Junior
Entreprise partenaire — Produit · Paris · Alternance · 12 à 24 mois, début en novembre
Rejoins l'équipe produit d'une entreprise partenaire à Paris pour contribuer au développement
de nouvelles fonctionnalités, aux côtés d'une équipe pluridisciplinaire (produit, tech, design).
Tu participeras aux rituels agiles et monteras en compétence sur l'ensemble du cycle de vie
produit, de l'idée au lancement.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école conçoit des produits digitaux utilisés par plusieurs
centaines de milliers d'utilisateurs. L'équipe produit, une dizaine de personnes, travaille en
méthode agile avec des cycles de développement courts.
MISSIONS
• Contribuer à la définition de la roadmap produit
• Rédiger les spécifications fonctionnelles
• Coordonner les retours entre équipes tech, design et business
COMPÉTENCES ATTENDUES
Figma, Notion, Anglais courant
PROFIL RECHERCHÉ
Bac+3/4 minimum
AVANTAGES
Tickets restaurant, mutuelle d'entreprise, remboursement transport à 50%, matériel
informatique fourni, 2 jours de télétravail par semaine.
MODALITÉS DE CANDIDATURE
Pour candidater, transmets ton CV et une courte lettre de motivation à
recrutement@entreprise-partenaire.exemple. Un premier échange téléphonique est prévu
sous 10 jours.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-product-manager-paris',
    pdfFileName: 'offre-product-manager-paris.pdf',
    title: 'Alternance Product Manager Junior',
    company: 'Entreprise partenaire, pôle Produit',
    location: 'Paris',
    contractType: 'Alternance, 12 à 24 mois, début en novembre',
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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-data-growth-lyon
Alternance Data & Growth
Entreprise partenaire — Data/Growth · Lyon (2 jours de télétravail possibles) · Alternance · rythme 3j
entreprise / 2j école, début en septembre
Rejoins l'équipe data & growth d'une entreprise partenaire à Lyon pour accompagner
l'acquisition et l'analyse des données, sur un poste à la croisée de l'analyse et de
l'automatisation. Tu travailleras en lien direct avec les équipes marketing et produit pour
transformer les données en décisions concrètes.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école développe des outils no-code pour les équipes
marketing. L'équipe data & growth, encore petite, dispose d'une forte autonomie sur ses
sujets.
MISSIONS
• Analyser les données d'acquisition et de rétention
• Automatiser des tableaux de suivi avec Airtable et Make
• Proposer des pistes d'optimisation du funnel
COMPÉTENCES ATTENDUES
Analyse de données, Airtable, Make, SQL (un plus)
PROFIL RECHERCHÉ
Bac+5
AVANTAGES
Tickets restaurant, mutuelle, 2 jours de télétravail par semaine, prime de transport, ambiance
start-up.
MODALITÉS DE CANDIDATURE
Candidature à adresser à recrutement@entreprise-partenaire.exemple, accompagnée d'un
CV à jour.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-data-growth-lyon',
    pdfFileName: 'offre-data-growth-lyon.pdf',
    title: 'Alternance Data & Growth',
    company: 'Entreprise partenaire, pôle Data/Growth',
    location: 'Lyon (2 jours de télétravail possibles)',
    contractType: 'Alternance, rythme 3j entreprise / 2j école, début en septembre',
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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-marketing-digital-nantes
Alternance Chargé(e) de Marketing Digital
Entreprise partenaire — Marketing · Nantes · Alternance · 12 mois, début en janvier
Rejoins l'équipe marketing d'une entreprise partenaire à Nantes pour animer la présence
digitale de la marque sur les réseaux sociaux et contribuer aux campagnes de communication.
Tu seras formé(e) aux outils et méthodes de l'équipe dès ton arrivée.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école est une marque grand public reconnue sur son secteur.
L'équipe marketing compte une quinzaine de personnes réparties entre communication,
contenu et acquisition.
MISSIONS
• Créer et planifier les contenus Instagram et LinkedIn
• Concevoir des visuels sur Canva pour les campagnes
• Suivre les indicateurs d'engagement
COMPÉTENCES ATTENDUES
Canva, Réseaux sociaux (Instagram, LinkedIn)
PROFIL RECHERCHÉ
Bac+3
AVANTAGES
Tickets restaurant, mutuelle, prime de transport, accès à des formations internes.
MODALITÉS DE CANDIDATURE
Envoie ton CV et quelques exemples de créations (réseaux sociaux, visuels) à
recrutement@entreprise-partenaire.exemple.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-marketing-digital-nantes',
    pdfFileName: 'offre-marketing-digital-nantes.pdf',
    title: 'Alternance Chargé(e) de Marketing Digital',
    company: 'Entreprise partenaire, pôle Marketing',
    location: 'Nantes',
    contractType: 'Alternance de 12 mois, début en janvier',
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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-ux-ui-bordeaux
Alternance UX/UI Designer
Entreprise partenaire — Design · Bordeaux · Alternance · rythme 4j entreprise / 1j école, début en
septembre
Rejoins l'équipe produit d'une entreprise partenaire à Bordeaux pour concevoir des parcours
utilisateurs clairs et efficaces, du wireframe au prototype testé. Tu travailleras en binôme avec
les développeurs et participeras aux sessions de recherche utilisateur.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école conçoit un produit SaaS utilisé par plusieurs milliers de
professionnels. L'équipe design compte 3 personnes et collabore étroitement avec la tech.
MISSIONS
• Concevoir des maquettes et prototypes sur Figma
• Participer aux sessions de recherche utilisateur
• Itérer sur les parcours avec les équipes produit et tech
COMPÉTENCES ATTENDUES
Figma, Recherche utilisateur (un plus)
PROFIL RECHERCHÉ
Bac+4/5
AVANTAGES
Tickets restaurant, mutuelle, matériel Apple fourni, 1 jour de télétravail par semaine.
MODALITÉS DE CANDIDATURE
Merci d'envoyer ton portfolio et ton CV à recrutement@entreprise-partenaire.exemple.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-ux-ui-bordeaux',
    pdfFileName: 'offre-ux-ui-bordeaux.pdf',
    title: 'Alternance UX/UI Designer',
    company: 'Entreprise partenaire, pôle Design',
    location: 'Bordeaux',
    contractType: 'Alternance, rythme 4j entreprise / 1j école, début en septembre',
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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-dev-frontend-lille
Alternance Développeur(se) Web Front-End
Entreprise partenaire — Tech · Lille (télétravail partiel possible) · Alternance · 24 mois
Rejoins l'équipe technique d'une entreprise partenaire à Lille pour développer des interfaces
web modernes en React et TypeScript, au sein d'une équipe tech d'une quinzaine de
développeurs. Tu monteras en compétence sur les bonnes pratiques du développement
front-end en production.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école développe une plateforme utilisée par des clients
professionnels dans toute l'Europe. Le code est en revue systématique et les déploiements
sont fréquents.
MISSIONS
• Développer des interfaces en React et TypeScript
• Participer aux revues de code
• Collaborer avec les équipes design et back-end
COMPÉTENCES ATTENDUES
React, TypeScript
PROFIL RECHERCHÉ
Première expérience en stage appréciée (non obligatoire)
AVANTAGES
Tickets restaurant, mutuelle, télétravail partiel, matériel au choix, budget formation annuel.
MODALITÉS DE CANDIDATURE
Candidature (CV et lien GitHub si disponible) à envoyer à
recrutement@entreprise-partenaire.exemple.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-dev-frontend-lille',
    pdfFileName: 'offre-dev-frontend-lille.pdf',
    title: 'Alternance Développeur(se) Web Front-End',
    company: 'Entreprise partenaire, pôle Tech',
    location: 'Lille (télétravail partiel possible)',
    contractType: 'Alternance de 24 mois',
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
    rawText: `LIEN DE L'OFFRE
https://offres-partenaires.exemple/alt-chef-projet-marseille
Alternance Assistant(e) Chef de Projet
Entreprise partenaire — Projet · Marseille · Alternance · 12 à 18 mois, début en octobre
Rejoins la direction de projet d'une entreprise partenaire à Marseille pour accompagner le
déploiement d'un nouvel outil interne, de la phase de cadrage jusqu'au déploiement auprès
des équipes. Tu seras en contact régulier avec plusieurs services de l'entreprise.
À PROPOS DE L'ENTREPRISE
Cette entreprise partenaire de l'école emploie plusieurs centaines de personnes réparties sur
plusieurs sites. Le projet auquel tu contribueras est suivi directement par la direction des
systèmes d'information.
MISSIONS
• Accompagner le déploiement d'un nouvel outil interne
• Suivre les plannings et rédiger les comptes-rendus
• Assurer le lien entre les équipes concernées
COMPÉTENCES ATTENDUES
Excel, Notion, Anglais professionnel (apprécié)
PROFIL RECHERCHÉ
Non précisé
AVANTAGES
Tickets restaurant, mutuelle, remboursement transport, accès au restaurant d'entreprise.
MODALITÉS DE CANDIDATURE
Merci d'adresser ton CV à recrutement@entreprise-partenaire.exemple.`,
    fakeLink: 'https://offres-partenaires.exemple/alt-chef-projet-marseille',
    pdfFileName: 'offre-chef-projet-marseille.pdf',
    title: 'Alternance Assistant(e) Chef de Projet',
    company: 'Entreprise partenaire, pôle Projet',
    location: 'Marseille',
    contractType: "Alternance, 12 à 18 mois, début en octobre",
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
