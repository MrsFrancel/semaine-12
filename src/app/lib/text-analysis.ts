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

function extractTitle(text: string): string {
  const roleMatch = text.match(
    /(?:Alternance|Stage|alternant\(?e?\)?|stagiaire)\s+([A-ZÀ-Ü][^,.:\n]{3,60}?)(?=\s+(?:pour|à|chez|basé\(?e?\)?|disponible|de notre|,|\.|$))/i
  );
  if (roleMatch) {
    const isStage = /stage|stagiaire/i.test(roleMatch[0].split(/\s+/)[0]);
    return `${isStage ? 'Stage' : 'Alternance'} ${roleMatch[1].trim()}`;
  }
  const firstSentence = text.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).find(Boolean) ?? '';
  if (firstSentence.length <= 70) return firstSentence;
  const truncated = firstSentence.slice(0, 70);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${(lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim()}…`;
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

export function analyzeCvText(text: string, vocabulary: string[]): CvAnalysis {
  const clean = text.trim();
  const formation = clean.match(/(Bachelor|Master|BTS|Licence|BUT|DUT|Mastère)[^\n.]{0,60}/i)?.[0].trim() ?? '';
  const experience = clean.match(/(Stage|Alternance)[^\n]{0,160}/i)?.[0].trim() ?? '';
  const languages: string[] = [];
  if (/anglais/i.test(clean)) languages.push('Anglais');
  if (/espagnol/i.test(clean)) languages.push('Espagnol');
  if (/allemand/i.test(clean)) languages.push('Allemand');
  return {
    formation,
    experience,
    hardSkills: extractSkills(clean, vocabulary),
    languages: languages.length ? `Français (natif), ${languages.join(', ')}` : 'Français (natif)',
  };
}
