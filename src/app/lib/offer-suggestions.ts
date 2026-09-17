import type { CvData, Offer } from './mock-data';
import type { MatchResult } from './scoring';
import type { CvSuggestion } from './ai-suggestions';

const SOFT_SKILLS_POOL = ['Autonomie', 'Rigueur', 'Curiosité', "Esprit d'équipe", 'Créativité', "Sens de l'organisation", 'Adaptabilité', "Prise d'initiative"];
const LANGUAGES = ['Anglais', 'Espagnol', 'Allemand', 'Italien', 'Chinois', 'Portugais'];

export function buildOfferSuggestions(cv: CvData, offer: Offer, match: MatchResult): CvSuggestion[] {
  const suggestions: CvSuggestion[] = [];
  const offerText = `${offer.description} ${offer.missions.join(' ')} ${offer.rawText ?? ''}`;

  for (const skill of match.missingSkills) {
    suggestions.push({
      id: `offer-skill-${skill}`,
      fieldLabel: 'Compétences techniques',
      before: cv.hardSkills.join(', ') || '(aucune)',
      after: [...cv.hardSkills, skill].join(', '),
      apply: (c) => ({ ...c, hardSkills: [...c.hardSkills, skill] }),
    });
  }

  if (!cv.title.trim()) {
    suggestions.push({
      id: 'offer-title',
      fieldLabel: 'Titre',
      before: '(vide)',
      after: offer.title,
      apply: (c) => ({ ...c, title: offer.title }),
    });
  }

  if (match.matchedSkills.length > 0) {
    const alreadyMentioned = match.matchedSkills.every((s) => cv.experience.toLowerCase().includes(s.toLowerCase()));
    if (!alreadyMentioned) {
      const addition = `Compétences mobilisées : ${match.matchedSkills.join(', ')}.`;
      if (!cv.experience.includes(addition)) {
        const after = `${cv.experience.replace(/\s+$/, '')} ${addition}`;
        suggestions.push({
          id: 'offer-experience-skills',
          fieldLabel: 'Expérience',
          before: cv.experience,
          after,
          apply: (c) => ({ ...c, experience: after }),
        });
      }
    }
  }

  if (!cv.bio.trim()) {
    const after = `Étudiant(e) en recherche d'une alternance en ${offer.title.toLowerCase()}, motivé(e) par ce type de poste chez ${offer.company}.`;
    suggestions.push({
      id: 'offer-bio',
      fieldLabel: 'Présentation',
      before: '(vide)',
      after,
      apply: (c) => ({ ...c, bio: after }),
    });
  }

  if (cv.softSkills.length === 0) {
    const picks = SOFT_SKILLS_POOL.slice(0, 3);
    suggestions.push({
      id: 'offer-soft-skills',
      fieldLabel: 'Savoir-être',
      before: '(aucun)',
      after: picks.join(', '),
      apply: (c) => ({ ...c, softSkills: picks }),
    });
  }

  const missingLanguage = LANGUAGES.find(
    (lang) => new RegExp(`\\b${lang}\\b`, 'i').test(offerText) && !cv.languages.toLowerCase().includes(lang.toLowerCase())
  );
  if (missingLanguage) {
    const after = cv.languages.trim() ? `${cv.languages.replace(/\s+$/, '')}, ${missingLanguage}` : missingLanguage;
    suggestions.push({
      id: `offer-language-${missingLanguage}`,
      fieldLabel: 'Langues',
      before: cv.languages.trim() || '(vide)',
      after,
      apply: (c) => ({ ...c, languages: after }),
    });
  }

  const locationCity = offer.location.split(/[\s(),·]+/)[0]?.trim();
  if (!cv.availability.trim() && locationCity) {
    const after = `Disponible, mobile ${locationCity}`;
    suggestions.push({
      id: 'offer-availability',
      fieldLabel: 'Disponibilité / mobilité géographique',
      before: '(vide)',
      after,
      apply: (c) => ({ ...c, availability: after }),
    });
  }

  return suggestions;
}
