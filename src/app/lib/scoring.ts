import type { Offer, Criterion, CvData } from './mock-data';

function levelFor(fill: number): Criterion['level'] {
  if (fill >= 75) return 'strong';
  if (fill >= 45) return 'mid';
  return 'low';
}

export interface MatchResult {
  score: number;
  criteria: Criterion[];
  matchedSkills: string[];
  missingSkills: string[];
}

export function computeMatch(offer: Offer, cv: CvData, baseExperience: string, hasLetter: boolean): MatchResult {
  const ownedSkills = [...cv.hardSkills, ...cv.certifications];
  const matchedSkills = offer.expectedSkills.filter((expected) =>
    ownedSkills.some((s) => s.toLowerCase() === expected.toLowerCase())
  );
  const missingSkills = offer.expectedSkills.filter((expected) => !matchedSkills.includes(expected));
  const skillsFill = offer.expectedSkills.length
    ? Math.round((matchedSkills.length / offer.expectedSkills.length) * 100)
    : 50;

  const experienceEdited = cv.experience.trim() !== baseExperience.trim();
  const hasPersonalProjects = cv.personalProjects.trim().length > 0;
  const baseExperienceFill = offer.criteria[1]?.fill ?? 50;
  const experienceFill = Math.min(100, baseExperienceFill + (experienceEdited ? 10 : 0) + (hasPersonalProjects ? 8 : 0));

  const offerText = `${offer.description} ${offer.missions.join(' ')}`.toLowerCase();
  const hasTitle = cv.title.trim().length > 0;
  const hasInterests = cv.interests.trim().length > 0;
  const drivingLicenseRelevant = cv.drivingLicense && offerText.includes('permis');
  const locationCity = offer.location.split(/[\s(),·]+/)[0]?.toLowerCase() ?? '';
  const availabilityMatchesLocation = cv.availability.trim().length > 0 && locationCity.length > 0 && cv.availability.toLowerCase().includes(locationCity);

  const baseKeywordsFill = offer.criteria[2]?.fill ?? 40;
  const keywordsFill = Math.min(
    100,
    baseKeywordsFill
      + (hasLetter ? 15 : 0)
      + (hasTitle ? 5 : 0)
      + (hasInterests ? 3 : 0)
      + (drivingLicenseRelevant ? 5 : 0)
      + (availabilityMatchesLocation ? 5 : 0)
  );

  const score = Math.round((skillsFill + experienceFill + keywordsFill) / 3);

  const skillsNote = matchedSkills.length
    ? `${matchedSkills.length}/${offer.expectedSkills.length} compétences attendues retrouvées : ${matchedSkills.join(', ')}.${missingSkills.length ? ` Il manque : ${missingSkills.join(', ')}.` : ''}`
    : `Aucune des compétences attendues n'est présente dans ton CV. Il manque : ${missingSkills.join(', ')}.`;

  const experienceNote = experienceEdited || hasPersonalProjects
    ? [experienceEdited && 'Ton expérience a été mise à jour pour cette candidature.', hasPersonalProjects && 'Tes projets personnels renforcent ce critère.'].filter(Boolean).join(' ')
    : (offer.criteria[1]?.note ?? 'Pas encore évalué pour ce profil.');

  const keywordsNote = hasLetter || hasTitle || hasInterests || drivingLicenseRelevant || availabilityMatchesLocation
    ? 'Ton profil (lettre, titre, disponibilité...) renforce les mots-clés du secteur.'
    : (offer.criteria[2]?.note ?? 'Génère ta lettre pour renforcer ce critère.');

  const criteria: Criterion[] = [
    { name: 'Compétences techniques', level: levelFor(skillsFill), fill: skillsFill, note: skillsNote },
    { name: 'Expérience', level: levelFor(experienceFill), fill: experienceFill, note: experienceNote },
    { name: 'Mots-clés du secteur', level: levelFor(keywordsFill), fill: keywordsFill, note: keywordsNote },
  ];

  return { score, criteria, matchedSkills, missingSkills };
}
