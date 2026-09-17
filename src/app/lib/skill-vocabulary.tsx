import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export const DEFAULT_SKILL_VOCABULARY: string[] = [
  'Marketing digital', 'SEO/SEA', 'Google Analytics', 'GA4', 'Acquisition payante',
  'Copywriting', 'Notion', 'Trello', 'Asana', 'Réseaux sociaux', 'Canva', 'TikTok Ads',
  'Instagram', 'LinkedIn', 'Gestion de projet', 'Communication', 'Comptabilité', 'Audit',
  'Excel', 'Finance', 'A/B testing', 'Funnel', 'Adobe Suite', 'Anglais', 'Culture musicale',
  'Figma', 'Recherche utilisateur', 'React', 'TypeScript', 'SQL', 'Airtable', 'Make',
  'HubSpot Academy', 'Google Ads', 'Scrum Fundamentals', 'Analyse de données', 'UX Writing',
  'Growth marketing', 'Storytelling', 'PowerPoint', 'InDesign',
];

interface SkillVocabularyContextValue {
  vocabulary: string[];
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
}

const SkillVocabularyContext = createContext<SkillVocabularyContextValue | null>(null);

export function SkillVocabularyProvider({ children }: { children: ReactNode }) {
  const [vocabulary, setVocabulary] = useState<string[]>(DEFAULT_SKILL_VOCABULARY);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setVocabulary((v) => (v.some((s) => s.toLowerCase() === trimmed.toLowerCase()) ? v : [...v, trimmed]));
  };
  const removeSkill = (skill: string) => setVocabulary((v) => v.filter((s) => s !== skill));

  const value = useMemo(() => ({ vocabulary, addSkill, removeSkill }), [vocabulary]);
  return <SkillVocabularyContext.Provider value={value}>{children}</SkillVocabularyContext.Provider>;
}

export function useSkillVocabulary(): SkillVocabularyContextValue {
  const ctx = useContext(SkillVocabularyContext);
  if (!ctx) throw new Error('useSkillVocabulary must be used within SkillVocabularyProvider');
  return ctx;
}
