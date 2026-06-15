Tu vas modifier uniquement 2 choses dans le prototype React MatchU
déjà généré. Ne touche à rien d'autre.

---

MODIFICATION 1 — BARRE FREE ET MENU FIXES AU SCROLL

Dans les composants 'match-free' et 'match-premium' :

1. La bannière Free (barre navy avec "Tu es en version gratuite"
   et "Passer en Premium — 9€/mois") doit être fixe au scroll.

Applique ce style sur le conteneur de la bannière :
{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  backgroundColor: '#1C1B2E',
  color: '#FFFFFF',
  padding: '12px 24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  boxSizing: 'border-box',
}

Sur mobile (isMobile === true) :
flexDirection: 'column', alignItems: 'flex-start'

2. Le menu de navigation (Offres / Profil / Paramètres)
   doit être fixe au scroll.

Sur desktop : la sidebar entière est fixe :
{
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: '260px',
  overflowY: 'auto',
  zIndex: 90,
  backgroundColor: '#F5F0E8',
  borderRight: '1px solid rgba(28,27,46,0.12)',
  padding: '32px 24px',
  boxSizing: 'border-box',
}

Le contenu principal doit avoir une marge pour compenser :
Sur desktop :
{
  marginLeft: '260px',
  marginTop: '48px',
  padding: '40px',
  boxSizing: 'border-box',
}

Sur mobile : la barre de navigation en haut est fixe :
{
  position: 'fixed',
  top: '80px',
  left: 0,
  right: 0,
  zIndex: 90,
  backgroundColor: '#F5F0E8',
  borderBottom: '1px solid rgba(28,27,46,0.12)',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: '12px 16px',
  boxSizing: 'border-box',
}

Le contenu principal sur mobile doit avoir une marge :
{
  marginTop: '140px',
  padding: '16px',
  boxSizing: 'border-box',
}

---

MODIFICATION 2 — CLIC SUR "PROFIL" RENVOIE AU PROFIL DU CANDIDAT

Dans les composants 'match-free' et 'match-premium',
le clic sur l'item "Profil" dans le menu de navigation
doit afficher l'écran de profil du candidat.

ÉTAPE 1 — Ajoute un nouvel état dans App :
currentStep peut maintenant valoir 'profile'

ÉTAPE 2 — Dans la sidebar et la nav mobile,
l'item "Profil" devient :

<span
  onClick={() => setCurrentStep('profile')}
  style={{ cursor: 'pointer' }}
>
  Profil
</span>

ÉTAPE 3 — Crée un nouveau composant Profile
affiché quand currentStep === 'profile'.

Ce composant affiche les données de candidateData.
Il permet de modifier les skills comme dans l'étape 3
(questionnaire), et il a un bouton retour.

Fond : --color-bg-cream (#F5F0E8)
Max-width : 800px centré, padding 80px 24px mobile: 40px 16px

Bouton retour :
onClick → setCurrentStep(isPremium ? 'match-premium' : 'match-free')

Contenu du composant Profile :

SECTION 1 — Informations personnelles
[card bg white, borderRadius 16px, border 1px rgba(28,27,46,0.12), padding 32px]
- Eyebrow [uppercase, letterSpacing 2px, color rgba(28,27,46,0.55)] :
  "INFORMATIONS PERSONNELLES"
- Affiche : candidateData.firstName + ' ' + candidateData.lastName
  [Poppins 24px 700 #1C1B2E]
- Affiche : candidateData.email
  [Poppins 16px 400 rgba(28,27,46,0.55)]

SECTION 2 — Hard skills modifiables
[card bg white, borderRadius 16px, border 1px rgba(28,27,46,0.12), padding 32px, marginTop 24px]
- Eyebrow : "HARD SKILLS"
- Liste des hard skills en badges pills modifiables :
  [bg #F3EEFF, color #7B3FF2, borderRadius 100px,
  padding 6px 14px, Poppins 12px 500]
  Chaque badge a une croix × cliquable
  onClick → retire le skill de candidateData.hardSkills

- Bouton "Ajouter une compétence"
  [outline pill, border 1px #1C1B2E, borderRadius 100px,
  padding 6px 16px, Poppins 12px 600, bg transparent,
  color #1C1B2E, cursor pointer]
  onClick → affiche un input inline
  onBlur ou onKeyDown Enter → ajoute le skill saisi
  à candidateData.hardSkills si non vide

SECTION 3 — Soft skills modifiables
[card bg white, borderRadius 16px, border 1px rgba(28,27,46,0.12), padding 32px, marginTop 24px]
- Eyebrow : "SOFT SKILLS"
- Liste des soft skills en badges pills modifiables :
  [bg #FFFFFF, border 1px rgba(28,27,46,0.12),
  color #1C1B2E, borderRadius 100px, padding 6px 14px,
  Poppins 12px 500]
  Chaque badge a une croix × cliquable
  onClick → retire le skill de candidateData.softSkills

- Bouton "Ajouter un soft skill"
  [même style que le bouton hard skills]
  onClick → même logique d'input inline

SECTION 4 — Préférences
[card bg white, borderRadius 16px, border 1px rgba(28,27,46,0.12), padding 32px, marginTop 24px]
- Eyebrow : "TES PRÉFÉRENCES"
- Textarea éditable [borderRadius 12px, border 1px rgba(28,27,46,0.12), padding 16px, Poppins 16px 400, resize none, width 100%, minHeight 120px]
  value : candidateData.preferences
  onChange → met à jour candidateData.preferences
  Placeholder : "Ce que tu recherches pour ton alternance — secteur, missions, type d'équipe..."

BOUTON DE SAUVEGARDE en bas de page :
[pill bg #1C1B2E, color white, padding 14px 28px,
Poppins 600 15px, border none, cursor pointer,
marginTop 32px]
"Enregistrer les modifications"
onClick → affiche pendant 2 secondes un texte de confirmation
[color #7B3FF2, Poppins 14px 600] :
"Modifications enregistrées"
puis revient à currentStep(isPremium ? 'match-premium' : 'match-free')