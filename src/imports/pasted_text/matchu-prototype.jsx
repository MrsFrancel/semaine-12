RÔLE :
Tu es un développeur React expert en design systems et prototypage SaaS.
Tu génères un prototype React complet, interactif et responsive.
Tu ne déroges à aucune règle de design listée ci-dessous.

---

PRODUIT : MatchU
SaaS de matching candidats 18-25 ans avec des offres d'alternance et de stage.
Le candidat crée un compte, uploade son CV, la plateforme analyse son profil,
et lui présente des offres classées par compatibilité avec un score expliqué.

---

ARCHITECTURE REACT :

Un seul fichier App.jsx avec les composants suivants.

State global (useState au niveau App) :
- currentStep : string — gère quelle étape est affichée
- isPremium : boolean — false par défaut
- candidateData : object — propage les données entre les étapes
  {
    firstName: '',
    lastName: '',
    email: '',
    hardSkills: [],
    softSkills: [],
    personalityAnswers: {},
    preferences: ''
  }

Navigation :
- Chaque CTA "Continuer" incrémente currentStep vers l'étape suivante
- Chaque bouton "Retour" décrémente currentStep vers l'étape précédente
- Transition entre étapes : opacity 0 → 1, translateY 20px → 0, 300ms

Étapes dans l'ordre :
'auth' → 'upload' → 'questionnaire' → 'intermediate' → 'match-free' → 'payment' → 'match-premium' → 'offer-detail'

---

DESIGN SYSTEM — TOKENS CSS (injecter dans un fichier CSS global ou style tag) :

:root {
  /* Accent */
  --color-accent: #7B3FF2;
  --color-accent-light: #F3EEFF;

  /* Fonds */
  --color-bg-cream: #F5F0E8;
  --color-bg-white: #FFFFFF;
  --color-bg-navy: #1C1B2E;
  --color-bg-pink: #FDF0F5;

  /* Texte */
  --color-text-default: #1C1B2E;
  --color-text-muted: rgba(28, 27, 46, 0.55);
  --color-text-accent: #7B3FF2;
  --color-text-inverse: #FFFFFF;

  /* Borders */
  --color-border-default: rgba(28, 27, 46, 0.12);
  --color-border-strong: #1C1B2E;

  /* Typographie */
  --font-primary: 'Poppins', sans-serif;

  /* Spacing */
  --radius-btn: 100px;
  --radius-card: 16px;
  --radius-card-lg: 24px;
  --radius-badge: 100px;
  --radius-input: 12px;

  --gap-sm: 16px;
  --gap-md: 24px;
  --gap-lg: 40px;
  --gap-xl: 64px;
}

Import Google Fonts dans le head :
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

RÈGLES ABSOLUES DESIGN — NE JAMAIS DÉROGER :
- Police unique : Poppins — hiérarchie par poids uniquement (400 / 600 / 700)
- Accent #7B3FF2 uniquement sur 1 à 3 mots dans les titres H1/H2 via <span className="accent"> — jamais en fond, jamais sur les boutons
- Boutons : border-radius 100px (pill) — jamais inférieur
- Zéro box-shadow — profondeur par contraste de fond et border uniquement
- Navy #1C1B2E — jamais #000000
- 4 fonds en alternance : cream / white / navy / pink
- Cards : border-radius 16px standard, 24px grande
- Transitions : 150ms à 300ms uniquement
- Hover cards : transform translateY(-4px), transition 250ms
- Scroll reveal : opacity 0→1 + translateY 20px→0, 500ms, stagger 80ms
- Zéro tiret cadratin dans le contenu
- Zéro emoji dans le contenu éditorial
- Eyebrows : uppercase + letterSpacing 2px + color muted

RESPONSIVE :
Mobile first.
Breakpoints : 768px (tablet) et 1024px (desktop).
Sur mobile : colonnes empilées, padding 24px, textes réduits.
Sur desktop : grilles 2 colonnes, padding 80px, textes full size.

---

DONNÉES FICTIVES :

Candidat : Lucas Moreau, 22 ans, Master 1 Marketing Digital
Hard skills extraits : ['Marketing digital', 'SEO/SEA', 'Canva', 'Google Analytics', 'Notion', 'Copywriting']
Soft skills extraits : ['Créatif', 'Autonome', 'Orienté résultats']

Offres fictives :
[
  {
    id: 1,
    title: 'Alternance Chef de Projet Digital',
    company: 'Publicis Groupe',
    location: 'Paris 8e',
    type: 'Alternance 12 mois',
    score: 87,
    matchPoints: ['Marketing digital', 'Gestion de projet', 'Canva'],
    gapPoints: ['SQL', 'Expérience +6 mois'],
    description: "Rejoins l'équipe digitale de Publicis pour piloter des projets de transformation online pour des clients du secteur luxe et retail.",
    missions: [
      'Coordonner les équipes créa, tech et media sur les projets clients',
      'Rédiger les briefs et assurer le suivi des livrables',
      'Analyser les performances et produire les reportings hebdomadaires',
      'Participer aux réunions clients et prises de brief'
    ],
    advice: [
      "Mets en avant ton projet SEO de la démo client en Master 1 — Publicis valorise les cas concrets mesurables",
      "Reformule 'stage de 2 mois' en 'mission de gestion de campagnes digitales' pour passer le premier filtre RH",
      "Ajoute Trello ou Asana à tes outils — mentionnés 3 fois dans la fiche"
    ],
    source: 'LinkedIn'
  },
  {
    id: 2,
    title: 'Alternance Marketing Manager',
    company: 'Decathlon Digital',
    location: 'Lille',
    type: 'Alternance 12 mois',
    score: 74,
    matchPoints: ['SEO/SEA', 'Google Analytics', 'Copywriting'],
    gapPoints: ['Adobe Suite', 'Expérience e-commerce'],
    description: "Intègre l'équipe marketing de Decathlon Digital pour piloter la stratégie de contenu et les campagnes d'acquisition.",
    missions: [
      'Piloter les campagnes SEA sur Google et Meta',
      'Produire les contenus éditoriaux du blog et des réseaux sociaux',
      'Analyser les KPIs et optimiser les performances',
      'Collaborer avec les équipes produit et design'
    ],
    advice: [
      "Mentionne ton expérience avec Google Analytics dans l'accroche de ton CV",
      "Ajoute des métriques concrètes à tes expériences passées",
      "Le mot-clé 'e-commerce' revient 5 fois dans la fiche — contextualise tes projets autour de ça"
    ],
    source: 'Indeed'
  },
  {
    id: 3,
    title: 'Stage Chargé de Communication',
    company: 'BNP Paribas',
    location: 'Paris La Défense',
    type: 'Stage 6 mois',
    score: 51,
    matchPoints: ['Copywriting', 'Canva'],
    gapPoints: ['Relations presse', 'InDesign', 'Secteur bancaire'],
    description: "Rejoins la direction de la communication de BNP Paribas pour participer aux campagnes institutionnelles et aux relations médias.",
    missions: [
      'Rédiger les communiqués de presse et les contenus institutionnels',
      'Gérer les relations avec les journalistes et influenceurs',
      'Produire les supports visuels pour les événements internes',
      'Veille médiatique quotidienne'
    ],
    advice: [
      "Ton profil est orienté digital — ce poste est très print et institutionnel",
      "Maîtriser InDesign serait un vrai plus pour ce poste",
      "Mentionner une expérience en secteur réglementé aiderait ta candidature"
    ],
    source: 'Welcome to the Jungle'
  }
]

---

COMPOSANTS À GÉNÉRER :

---

ÉTAPE 1 — AUTH (currentStep === 'auth')
Fond : --color-bg-cream
Layout : centré, max-width 480px, margin auto, padding-top 120px

Contenu :
- Logo [Poppins 700 24px navy] : "MatchU"
- H1 [Poppins 52px 700 mobile:34px, letterSpacing -1.5px] :
  "Trouve ton <span class='accent'>alternance</span>."
- Sous-titre [16px 400 muted] :
  "Analyse ton profil. Compare tes chances. Postule là où ça compte."
- Bouton LinkedIn [pill navy pleine largeur] : "Continuer avec LinkedIn"
  onClick → simule connexion LinkedIn, pré-remplit candidateData avec données fictives Lucas Moreau, passe à 'upload'
- Séparateur "ou" [centré muted 14px]
- Formulaire contrôlé par useState local :
  2 inputs côte à côte [Prénom / Nom] — onChange met à jour candidateData.firstName et candidateData.lastName
  1 input [Email] — onChange met à jour candidateData.email
  1 input password [Mot de passe]
  Style inputs : border 1px --color-border-default, borderRadius 12px, padding 12px 16px, Poppins 16px 400, fond blanc
- Bouton CTA [pill navy pleine largeur] : "Créer mon compte"
  onClick → met à jour candidateData avec les valeurs du formulaire, passe à 'upload'
- Lien texte centré [muted 14px] : "Déjà un compte ? Se connecter"

---

ÉTAPE 2 — UPLOAD CV (currentStep === 'upload')
Fond : --color-bg-cream
Layout : centré, max-width 600px, margin auto, padding 80px 24px

Contenu :
- Bouton retour [texte muted, flèche ←] onClick → passe à 'auth'
- Eyebrow : "TON CV"
- H2 [Poppins 52px 700 mobile:32px] : "Uploade ton <span class='accent'>CV</span>"
- Zone de drop [border 2px dashed --color-border-strong, borderRadius 24px, padding 64px, centré]
  Texte : "Glisse ton CV ici ou clique pour sélectionner"
  Sous-texte muted : "PDF, Word — max 5 Mo"
  Input file caché déclenché au clic
- Bouton CTA [pill navy] : "Analyser mon CV"
  onClick →
    1. Affiche un état de chargement dans la zone (barre de progression animée, texte "Analyse en cours...")
    2. Après 2500ms setTimeout :
       - Met à jour candidateData.hardSkills avec les données fictives
       - Met à jour candidateData.softSkills avec les données fictives
       - Passe à 'questionnaire'

Zone de chargement (pendant l'analyse) :
- Barre de progression [fond --color-border-default, rempli --color-accent, animée de 0 à 100% en 2500ms, borderRadius 100px, height 6px]
- Textes séquentiels toutes les 800ms : "Lecture du CV..." → "Extraction des compétences..." → "Profil presque prêt..."

---

ÉTAPE 3 — QUESTIONNAIRE (currentStep === 'questionnaire')
Fond : --color-bg-cream
Layout desktop : 2 colonnes gap 64px / Mobile : 1 colonne
Max-width : 900px centré, padding 80px 24px

Bouton retour onClick → passe à 'upload'

COLONNE GAUCHE — Skills extraits :
- Eyebrow : "COMPÉTENCES EXTRAITES"
- Hard skills affichés comme badges pills modifiables
  [bg --color-accent-light, color --color-text-accent, borderRadius 100px, padding 6px 14px, Poppins 12px 500]
  Chaque badge a une croix × pour le supprimer (onClick retire du tableau hardSkills)
  Bouton "Ajouter une compétence" [outline pill, borderRadius 100px] → input inline pour ajouter un skill
- Séparateur
- Eyebrow : "SOFT SKILLS IDENTIFIÉS"
- Soft skills en badges pills [bg --color-bg-white, border 1px --color-border-default, borderRadius 100px]
  Même logique ajout/suppression

COLONNE DROITE — Questionnaire :
- Eyebrow : "QUELQUES QUESTIONS"
- Question 1 : "Comment tu travailles le mieux ?"
  Chips : "En équipe" / "En autonomie" / "Selon les projets"
- Question 2 : "Quel type d'entreprise tu recherches ?"
  Chips : "Startup" / "Grand groupe" / "PME" / "Peu importe"
- Question 3 : "Ce qui compte le plus dans une mission ?"
  Chips : "Impact" / "Apprentissage" / "Créativité" / "Rémunération"
Chip state : sélectionné [bg --color-text-default, color white, borderRadius 100px] / non sélectionné [bg transparent, border 1px --color-border-strong, color --color-text-default, borderRadius 100px]
onClick toggle sélection, stocké dans candidateData.personalityAnswers

- Textarea optionnel [borderRadius 12px, border 1px --color-border-default, padding 16px, Poppins 16px 400, fond blanc, resize none]
  Placeholder : "Ce que tu recherches pour ton alternance — secteur, missions, type d'équipe... (optionnel)"
  onChange met à jour candidateData.preferences

- CTA [pill navy] : "Voir mon profil analysé"
  onClick → passe à 'intermediate'

---

ÉTAPE 4 — INTERMEDIATE (currentStep === 'intermediate')
Fond : --color-bg-white
Layout : max-width 800px centré, padding 80px 24px

Bouton retour onClick → passe à 'questionnaire'

- Eyebrow : "TON PROFIL"
- H2 [Poppins 52px 700 mobile:32px] : "Voici ce que ton profil <span class='accent'>nous dit</span>"

BLOC 1 [card bg white, border 1px --color-border-default, borderRadius 24px, padding 40px] :
- Eyebrow : "POSTES COMPATIBLES"
- 5 pills [bg --color-accent-light, color --color-text-accent, borderRadius 100px] :
  "Chef de projet digital" "Chargé de marketing" "Social Media Manager" "Product Manager junior" "Traffic Manager"

BLOC 2 [card bg --color-bg-navy, borderRadius 24px, padding 40px] :
- Eyebrow [color rgba(255,255,255,0.55)] : "RECOMMANDATIONS CV"
- 4 recommandations [Poppins 15px 400, color white, gap 16px]
  Chaque recommandation précédée d'un bullet [color --color-text-accent]
  "Remplace 'gestion de projet' par 'project management' — les ATS favorisent l'anglais en marketing digital"
  "Ajoute une section 'Outils' avec Notion, Canva, Google Analytics — mentionnés dans 80% des offres ciblées"
  "Ton titre actuel est trop générique. Précise : 'Alternance Marketing Digital — SEO et Content'"
  "Intègre des métriques dans tes expériences : '+30% de trafic organique', '5 campagnes gérées en autonomie'"

- CTA [pill navy centré] : "Découvrir mes offres"
  onClick → passe à 'match-free'

---

ÉTAPE 5 — MATCH FREE (currentStep === 'match-free')
Fond : --color-bg-white
Layout desktop : sidebar 260px + contenu principal / Mobile : sidebar cachée, nav en haut

BANNIÈRE FREE [sticky top, bg --color-bg-navy, color white, padding 12px 24px, display flex, justify-content space-between, align-items center] :
- Texte gauche [Poppins 13px 400] : "Tu es en version gratuite — score visible, explications masquées"
- Bouton droite [bg --color-accent, color white, pill, Poppins 13px 600, padding 8px 20px] : "Passer en Premium — 9€/mois"
  onClick → passe à 'payment'

SIDEBAR [bg --color-bg-cream, borderRight 1px --color-border-default, padding 32px 24px] :
- Logo "MatchU" [Poppins 700 20px navy]
- Nav items [Poppins 14px 500, gap 4px] :
  "Offres" [actif : bg white, borderRadius 8px, padding 10px 16px] / "Profil" / "Paramètres"

CONTENU PRINCIPAL [padding 40px] :
- H3 [Poppins 36px 700 mobile:24px] : "Tes opportunités"
- Sous-titre [muted 16px] : "3 offres analysées pour ton profil"

LISTE D'OFFRES — version FREE [gap 16px] :
3 cartes [borderRadius 16px, border 1px --color-border-default, bg white, padding 24px]
Hover : translateY(-4px), transition 250ms

Chaque carte FREE affiche :
- Ligne 1 : Cercle logo 40px [bg --color-bg-cream] + Nom entreprise [14px 600] + Localisation [muted 14px]
- Ligne 2 : Titre du poste [Poppins 18px 700]
- Ligne 3 : Score [Poppins 48px 700, color --color-text-accent pour ≥70%, --color-text-muted pour <60%] + "de compatibilité" [14px muted]
- Ligne 4 : Bloc masqué [bg --color-bg-cream, borderRadius 8px, padding 12px, blur filter: blur(4px), pointer-events none]
  Texte placeholder illisible simulant les points de match
- Ligne 5 : CTA [pill bg --color-accent, color white, Poppins 13px 600, padding 8px 20px] : "Débloquer les explications — 9€/mois"
  onClick → passe à 'payment'

---

ÉTAPE 6 — PAYMENT (currentStep === 'payment')
Fond : --color-bg-cream
Layout : 2 colonnes desktop (60%/40%) / 1 colonne mobile
Max-width 960px centré, padding 80px 24px

Bouton retour onClick → passe à 'match-free'

COLONNE GAUCHE — Récapitulatif :
- Eyebrow : "OFFRE PREMIUM"
- H2 [Poppins 52px 700 mobile:32px] : "Accède à toutes tes <span class='accent'>chances</span>"
- Liste des fonctionnalités Premium [gap 16px] :
  Chaque item : bullet violet + texte [Poppins 16px 400]
  "Score de compatibilité expliqué critère par critère"
  "Offres classées en 3 niveaux : forts, partiels, faibles"
  "Conseils personnalisés CV pour chaque offre"
  "Alertes nouvelles offres en temps réel"
- Prix [Poppins 72px 700 --color-text-accent] : "9€"
  Sous le prix [muted 16px] : "par mois — résiliable à tout moment"

COLONNE DROITE — Formulaire de paiement [card bg white, borderRadius 24px, border 1px --color-border-default, padding 40px] :
- Label [eyebrow] : "INFORMATIONS DE PAIEMENT"
- Input "Numéro de carte" [borderRadius 12px, border 1px --color-border-default, padding 12px 16px, Poppins 16px]
  Placeholder : "1234 5678 9012 3456"
- 2 inputs côte à côte : "Date d'expiration" (MM/AA) + "CVV" (3 chiffres)
- Input "Nom sur la carte" [pleine largeur]
- CTA [pill navy pleine largeur, Poppins 600 16px, padding 16px] : "Activer Premium — 9€/mois"
  onClick →
    1. Affiche loader 1500ms sur le bouton (texte "Traitement en cours...")
    2. Après 1500ms : isPremium = true, currentStep = 'match-premium'
- Texte sécurité centré [muted 12px] : "Paiement simulé — aucune donnée réelle collectée"

---

ÉTAPE 7 — MATCH PREMIUM (currentStep === 'match-premium')
Fond : --color-bg-white
Layout desktop : sidebar 260px + contenu principal / Mobile : nav en haut

Pas de bannière Free.
Badge Premium [bg --color-accent-light, color --color-text-accent, borderRadius 100px, padding 4px 12px, Poppins 12px 600] dans la sidebar : "Premium actif"

SIDEBAR identique à l'étape 5 avec badge Premium.

ONGLETS [3 onglets sticky sous le header] :
"Matchs forts (1)" / "Matchs partiels (1)" / "Matchs faibles (1)"
Onglet actif : bg --color-text-default, color white, borderRadius 100px, padding 8px 20px, Poppins 14px 600
Onglet inactif : bg transparent, color --color-text-muted, borderRadius 100px, padding 8px 20px
onClick sur onglet filtre les offres affichées selon leur score (forts ≥75%, partiels 55-74%, faibles <55%)
State local activeTab géré dans ce composant

LISTE D'OFFRES — version PREMIUM [gap 16px] :
Offres filtrées selon l'onglet actif.

Chaque carte PREMIUM [borderRadius 16px, border 1px --color-border-default, bg white, padding 24px] :
- Ligne 1 : Cercle logo 40px + Nom entreprise [14px 600] + Localisation [muted 14px]
- Ligne 2 : Titre du poste [Poppins 18px 700]
- Ligne 3 : Score [Poppins 48px 700, --color-text-accent si ≥75%, --color-text-muted si <55%] + "de compatibilité"
- Ligne 4 : Tags verts [bg #EDFAF3, color #1A7A4A, borderRadius 100px, Poppins 12px 500, padding 4px 12px] :
  "✓ " + chaque matchPoint de l'offre
- Ligne 5 : Tags rouges [bg #FEF2F2, color #B91C1C, borderRadius 100px, Poppins 12px 500, padding 4px 12px] :
  "✗ " + chaque gapPoint de l'offre
- CTA [outline pill, border 1px --color-border-strong, Poppins 13px 600, padding 10px 20px] : "Voir l'offre complète"
  onClick → stocke l'offre sélectionnée dans un state selectedOffer, passe à 'offer-detail'

Hover carte : translateY(-4px), transition 250ms

---

ÉTAPE 8 — OFFER DETAIL (currentStep === 'offer-detail')
Fond : --color-bg-white
Layout desktop : 2 colonnes 60%/40% gap 48px / Mobile : 1 colonne
Max-width 1100px, padding 80px 24px

Bouton retour onClick → passe à 'match-premium'

Affiche les données de selectedOffer.

COLONNE GAUCHE (60%) :
- Eyebrow : "DÉTAIL DE L'OFFRE"
- H2 [Poppins 52px 700 mobile:28px] : titre du poste avec dernier mot en <span class='accent'>
- Meta [Poppins 14px 400 muted, gap 8px] : company + location + type
- Séparateur [1px --color-border-default]
- Eyebrow : "DESCRIPTION"
- Corps texte [Poppins 16px 400, lineHeight 1.6] : selectedOffer.description
- Eyebrow [marginTop 32px] : "MISSIONS PRINCIPALES"
- Liste [gap 12px] : chaque mission précédée d'un bullet violet
- CTA [pill navy, padding 14px 28px, Poppins 600 15px, marginTop 40px] :
  "Voir l'offre sur " + selectedOffer.source + " ↗"
  onClick → window.open simulé (alert "Redirection vers " + selectedOffer.source)

COLONNE DROITE (40%) :
Card [bg --color-bg-cream, borderRadius 16px, border 1px --color-border-default, padding 32px, position sticky, top 40px]
- Eyebrow : "TES CHANCES"
- Score [Poppins 56px 700 --color-text-accent] : selectedOffer.score + "%"
- Barre de progression :
  Track [bg --color-border-default, height 8px, borderRadius 100px]
  Fill [bg --color-text-accent, width selectedOffer.score + "%", borderRadius 100px, transition 1s ease]
- Label [14px muted marginTop 8px] : "Compatibilité avec ce poste"
- Séparateur
- Eyebrow : "CONSEILS PERSONNALISÉS"
- 3 conseils [gap 16px] : chaque conseil [Poppins 15px 400] précédé d'un bullet [color --color-text-accent]
  Contenus : selectedOffer.advice

---

RÈGLES FINALES DE GÉNÉRATION :

1. Un seul fichier App.jsx exporté par défaut
2. Tous les styles en CSS-in-JS (style={{...}}) ou module CSS — les tokens CSS sont dans :root
3. Aucune librairie externe sauf React et Google Fonts
4. Aucun box-shadow dans tout le code
5. Tous les boutons ont border-radius 100px
6. Accent violet #7B3FF2 uniquement dans les titres sur 1 à 3 mots — jamais ailleurs
7. Toutes les transitions entre 150ms et 300ms
8. Responsive mobile first avec breakpoint 768px
9. Le state candidateData.firstName est affiché dans l'étape 4 : "Bonjour {firstName}, voici ce que ton profil nous dit"
10. Les données des offres sont définies comme constante JS en haut du fichier
11. Zéro tiret cadratin dans tout le contenu textuel
12. Zéro emoji dans tout le contenu textuel
