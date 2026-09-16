# Matériel complémentaire — Test AB Agrégateur

Complète le protocole (section 6.4) : chaque offre existe sous 3 formes équivalentes. Le testeur peut utiliser le texte brut, le lien ou le PDF — les 3 donnent le même résultat correct dans l'écran de vérification/l'assistant, vérifié pour les deux versions (A et B).

Les 6 PDF sont versés dans le repo, dossier [`test-material/ab-test-offres/`](../test-material/ab-test-offres). Chacun est une vraie fiche de poste mise en forme (titre, entreprise/lieu/contrat, description, à propos de l'entreprise, missions, compétences, profil, avantages, modalités de candidature) — avec le lien de l'offre affiché en en-tête, avant la fiche elle-même.

## Lot 1

### 1. Alternance Product Manager Junior — Paris
- **Texte** : "Bonjour, nous recherchons un(e) alternant(e) Product Manager Junior pour notre équipe produit à Paris, à partir de novembre, contrat de 12 à 24 mois. Profil : bac+3/4 minimum, à l'aise avec Figma et Notion, anglais courant. Rémunération selon grille légale. Merci de nous transmettre les profils intéressants."
- **Lien** : `https://offres-partenaires.exemple/alt-product-manager-paris`
- **PDF** : `offre-product-manager-paris.pdf`

### 2. Alternance Data & Growth — Lyon
- **Texte** : "Salut, du coup on a un poste à pourvoir chez nous, c'est pour de la data/growth, plutôt orienté analyse mais faut aussi être à l'aise avec les outils no-code genre Airtable ou Make, et un peu de SQL c'est un plus mais pas obligatoire. C'est basé à Lyon (possibilité 2j télétravail). On cherche quelqu'un pour la rentrée de septembre prochain idéalement, sur un rythme 3j entreprise / 2j école. Niveau bac+5. Salaire : grille alternance + tickets restau."
- **Lien** : `https://offres-partenaires.exemple/alt-data-growth-lyon`
- **PDF** : `offre-data-growth-lyon.pdf`

### 3. Alternance Chargé(e) de Marketing Digital — Nantes
- **Texte** : "Hello, nous recrutons un(e) alternant(e) Chargé(e) de Marketing Digital, basé à Nantes, disponible dès janvier, contrat 12 mois. Bonne maîtrise de Canva et des réseaux sociaux (Instagram, LinkedIn) souhaitée. Niveau bac+3. Merci de faire suivre aux étudiants intéressés."
- **Lien** : `https://offres-partenaires.exemple/alt-marketing-digital-nantes`
- **PDF** : `offre-marketing-digital-nantes.pdf`

## Lot 2

### 4. Alternance UX/UI Designer — Bordeaux
- **Texte** : "Nous recherchons un(e) alternant(e) UX/UI Designer pour rejoindre notre équipe produit à Bordeaux. Maîtrise de Figma exigée, une sensibilité pour la recherche utilisateur est un plus. Rythme 4 jours entreprise / 1 jour école. Début souhaité : septembre. Niveau bac+4/5."
- **Lien** : `https://offres-partenaires.exemple/alt-ux-ui-bordeaux`
- **PDF** : `offre-ux-ui-bordeaux.pdf`

### 5. Alternance Développeur(se) Web Front-End — Lille
- **Texte** : "Poste d'alternant(e) Développeur(se) Web Front-End à pourvoir à Lille. Stack : React, TypeScript. Une première expérience en stage appréciée mais pas obligatoire. Contrat de 24 mois, télétravail partiel possible. Merci de transmettre les candidatures rapidement."
- **Lien** : `https://offres-partenaires.exemple/alt-dev-frontend-lille`
- **PDF** : `offre-dev-frontend-lille.pdf`

### 6. Alternance Assistant(e) Chef de Projet — Marseille
- **Texte** : "Nous cherchons un(e) alternant(e) Assistant(e) Chef de Projet, à Marseille, pour accompagner le déploiement d'un nouvel outil interne. Bon niveau Excel/Notion attendu, anglais professionnel apprécié. Alternance de 12 à 18 mois, à partir d'octobre."
- **Lien** : `https://offres-partenaires.exemple/alt-chef-projet-marseille`
- **PDF** : `offre-chef-projet-marseille.pdf`

---

## Notes pour l'animateur

- Les liens sont volontairement faux (domaine `.exemple`) — ils ne sont pas cliqués/résolus, seulement collés dans le champ "Lien ou texte" de l'écran de dépôt : le prototype les reconnaît par correspondance exacte, comme un vrai backend le ferait après résolution. Chaque lien figure aussi en en-tête du PDF correspondant, si besoin de le retrouver rapidement.
- Les 6 PDF (dossier `test-material/ab-test-offres/`) sont reconnus par le prototype par leur nom de fichier exact, pas par leur contenu — ne pas les renommer avant de les donner aux testeurs.
- Le texte brut à coller (colonne "Texte" ci-dessus) reste celui du protocole, plus court que le contenu du PDF — c'est volontaire : PDF et lien sont les versions "mises en forme" de la même offre, le texte reste la version "mail brut".
- Le sélecteur "Version A / Version B" est sur l'écran de login, à choisir avant d'entrer dans l'espace École (Admin ou Coach) pour chaque créneau de 8 minutes.
- Vérifié en conditions réelles (upload de fichier, pas seulement en théorie) : les 3 canaux déclenchent le bon préremplissage dans les deux versions.
- Si un testeur colle un texte hors des 6 connus (improvisation), le prototype retombe sur un exemple générique de démonstration plutôt que de planter — utile à savoir si ça arrive en session, mais à éviter pour ne pas fausser la mesure.
