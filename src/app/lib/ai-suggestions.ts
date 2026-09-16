import type { CvData } from './mock-data';

export interface CvSuggestion {
  id: string;
  fieldLabel: string;
  before: string;
  after: string;
  apply: (cv: CvData) => CvData;
}

const SKILL_PAIRINGS: Record<string, string> = {
  'SEO/SEA': 'Google Ads',
  'Marketing digital': 'Growth marketing',
  'Canva': 'Adobe Suite',
  'Google Analytics': 'GA4',
  'Copywriting': 'Storytelling',
  'Notion': 'Trello',
};

const SOFT_SKILLS_POOL = ['Autonomie', 'Rigueur', 'Curiosité', "Esprit d'équipe", 'Créativité', "Sens de l'organisation", 'Adaptabilité', "Prise d'initiative"];

export function buildSuggestions(cv: CvData): CvSuggestion[] {
  const suggestions: CvSuggestion[] = [];

  if (/^Bachelor [^e]/i.test(cv.formation) && !/^Bachelor en /.test(cv.formation)) {
    const after = cv.formation.replace(/^Bachelor /, 'Bachelor en ');
    suggestions.push({
      id: 'formation-wording',
      fieldLabel: 'Formation',
      before: cv.formation,
      after,
      apply: (c) => ({ ...c, formation: after }),
    });
  }

  if (cv.experience.length < 160 && !cv.experience.includes('coordination')) {
    const after = `${cv.experience.replace(/\.$/, '')}, avec une coordination régulière avec l'équipe créative.`;
    suggestions.push({
      id: 'experience-wording',
      fieldLabel: 'Expérience',
      before: cv.experience,
      after,
      apply: (c) => ({ ...c, experience: after }),
    });
  }

  const pairing = cv.hardSkills.map((s) => SKILL_PAIRINGS[s]).find((s): s is string => !!s && !cv.hardSkills.includes(s));
  if (pairing) {
    suggestions.push({
      id: `hardskill-add-${pairing}`,
      fieldLabel: 'Compétences techniques',
      before: cv.hardSkills.join(', '),
      after: [...cv.hardSkills, pairing].join(', '),
      apply: (c) => ({ ...c, hardSkills: [...c.hardSkills, pairing] }),
    });
  }

  const missingSoft = SOFT_SKILLS_POOL.find((s) => !cv.softSkills.includes(s));
  if (missingSoft) {
    suggestions.push({
      id: `softskill-add-${missingSoft}`,
      fieldLabel: 'Savoir-être',
      before: cv.softSkills.join(', '),
      after: [...cv.softSkills, missingSoft].join(', '),
      apply: (c) => ({ ...c, softSkills: [...c.softSkills, missingSoft] }),
    });
  }

  return suggestions;
}
