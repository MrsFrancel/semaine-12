// Analyse de texte "réelle" (règles + mots-clés), sans backend ni IA externe :
// on ne peut pas appeler un vrai modèle depuis le navigateur sans exposer de clé,
// donc on travaille uniquement sur le texte réellement fourni (collé ou extrait
// d'un PDF), avec des règles déterministes plutôt qu'une correspondance figée.

const KNOWN_CITIES = [
  'Paris', 'Lyon', 'Nantes', 'Bordeaux', 'Lille', 'Marseille', 'Toulouse', 'Nice',
  'Strasbourg', 'Rennes', 'Montpellier', "Villeneuve d'Ascq", 'Clichy',
  'Issy-les-Moulineaux', 'Boulogne-Billancourt', 'Saint-Denis',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSkills(text: string, vocabulary: string[]): string[] {
  return vocabulary.filter((skill) => {
    const pattern = new RegExp(`(^|[^\\p{L}])${escapeRegExp(skill)}([^\\p{L}]|$)`, 'iu');
    return pattern.test(text);
  });
}

function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function extractTitle(text: string): string {
  const roleMatch = text.match(
    /(?:Alternance|Stage|alternant\(?e?\)?|stagiaire)\s+([A-ZÀ-Ü][^,.:\n]{3,60}?)(?=\n|\s+(?:pour|à|chez|basé\(?e?\)?|disponible|de notre)|[,.]|$)/i
  );
  if (roleMatch) {
    const isStage = /stage|stagiaire/i.test(roleMatch[0].split(/\s+/)[0]);
    return `${isStage ? 'Stage' : 'Alternance'} ${roleMatch[1].trim()}`;
  }
  const firstSentence = text.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).find(Boolean) ?? '';
  return truncateAtWord(firstSentence, 70);
}

function extractLocation(text: string): string {
  for (const city of KNOWN_CITIES) {
    if (new RegExp(`\\b${escapeRegExp(city)}\\b`, 'i').test(text)) return city;
  }
  return '';
}

function extractContractType(text: string): string {
  const duration = text.match(/(\d+\s*(?:à\s*\d+\s*)?mois)/i)?.[1];
  const kindMatch = text.match(/\b(alternance|stage|cdi|cdd)\b/i)?.[1];
  const kind = kindMatch ? kindMatch[0].toUpperCase() + kindMatch.slice(1).toLowerCase() : '';
  if (kind && duration) return `${kind} · ${duration}`;
  return kind || duration || '';
}

function extractEducationLevel(text: string): string {
  return text.match(/bac\s*\+\s*\d(?:\s*\/\s*\d)?/i)?.[0].replace(/\s+/g, '') ?? '';
}

export interface OfferAnalysis {
  title: string;
  location: string;
  contractType: string;
  skills: string[];
  profile: string;
  description: string;
}

export function analyzeOfferText(text: string, vocabulary: string[]): OfferAnalysis {
  const clean = text.trim();
  return {
    title: extractTitle(clean),
    location: extractLocation(clean),
    contractType: extractContractType(clean),
    skills: extractSkills(clean, vocabulary),
    profile: extractEducationLevel(clean),
    description: clean,
  };
}

export interface CvAnalysis {
  formation: string;
  experience: string;
  hardSkills: string[];
  languages: string;
}

// Les CV réels varient trop dans leur formulation pour qu'une seule regex
// fonctionne partout (ex. "Stage 6 mois, ..." vs "2024-2025 : Community
// manager..."). On repère d'abord les en-têtes de section (Formation,
// Expérience, Compétences, Langues) pour cadrer l'extraction ; seulement si
// aucun en-tête n'est trouvé, on retombe sur une recherche libre dans tout
// le texte.
const SECTION_PATTERNS: Record<string, RegExp> = {
  formation: /^(formation|éducation|education|diplômes?|parcours académique|scolarité)\b\s*:?\s*/i,
  experience: /^(expériences?(\s+professionnelles?)?|parcours professionnel|stages? et alternances?)\b\s*:?\s*/i,
  langues: /^(langues?|languages?)\b\s*:?\s*/i,
};
const NEXT_SECTION_HINT = /(compétences|formation|langues|savoir-être)/i;

function splitIntoSections(text: string): Record<string, string[]> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let current: string | null = null;
  for (const line of lines) {
    const found = Object.entries(SECTION_PATTERNS).find(([, re]) => re.test(line));
    if (found) {
      const [key, re] = found;
      current = key;
      const rest = line.replace(re, '').trim();
      sections[key] = sections[key] ?? [];
      if (rest) sections[key].push(rest);
      continue;
    }
    if (current) (sections[current] ??= []).push(line);
  }
  return sections;
}

function cutBeforeNextSection(text: string): string {
  const m = text.match(NEXT_SECTION_HINT);
  return m ? text.slice(0, m.index).trim() : text;
}

export function analyzeCvText(text: string, vocabulary: string[]): CvAnalysis {
  const clean = text.trim();
  const sections = splitIntoSections(clean);

  let formation = sections.formation?.[0]?.trim() ?? '';
  if (!formation) {
    formation = clean.match(/(Bachelor|Master|BTS|Licence|BUT|DUT|Mastère)\s*[^\n,.;:)]{0,60}/i)?.[0].trim() ?? '';
  }

  let experience = sections.experience?.join(' ').trim() ?? '';
  if (!experience) {
    const m = clean.match(/(Stage|Alternance)[^\n]{0,300}/i)?.[0];
    experience = m ? cutBeforeNextSection(m).trim() : '';
  }
  experience = truncateAtWord(experience, 320);

  const languages: string[] = [];
  const languageSource = sections.langues?.join(' ') ?? clean;
  for (const lang of ['Anglais', 'Espagnol', 'Allemand', 'Italien', 'Chinois', 'Portugais']) {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(languageSource)) languages.push(lang);
  }

  return {
    formation,
    experience,
    hardSkills: extractSkills(clean, vocabulary),
    languages: languages.length ? `Français (natif), ${languages.join(', ')}` : 'Français (natif)',
  };
}
