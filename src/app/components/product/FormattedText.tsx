const HEADER_KEYWORDS =
  /^(formation|parcours|cursus|dipl[oô]mes?|scolarit[eé]|exp[eé]riences?(\s+professionnelles?)?|stages?(\s+et\s+alternances?)?|comp[eé]tences?(\s+techniques?)?|savoir-[eê]tre|langues?|missions?|responsabilit[eé]s?|le\s+poste|profil(\s+recherch[eé])?|contrat|conditions?|r[eé]mun[eé]ration|certifications?|portfolio|projets?(\s+personnels?)?|centres?\s+d'int[eé]r[eê]t|loisirs?|hobbies|contact|coordonn[eé]es?|informations?(\s+personnelles?)?|pr[eé]sentation|[aà]\s+propos(\s+de\s+l'entreprise)?|qui\s+sommes[- ]nous|avantages?|modalit[eé]s?\s+de\s+candidature|candidature|r[eé]seaux(\s+sociaux)?|liens?|objectifs?(\s+professionnels?)?|r[eé]sum[eé])\s*:?\s*$/i;

function looksLikeHeader(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (HEADER_KEYWORDS.test(trimmed)) return true;
  if (trimmed.length > 40) return false;
  if (/[.,;!?]$/.test(trimmed)) return false;
  if (trimmed.split(/\s+/).length > 6) return false;
  return /:\s*$/.test(trimmed);
}

interface Section {
  header: string | null;
  paragraphs: string[];
}

function splitIntoSections(text: string): Section[] {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const sections: Section[] = [];
  let current: Section = { header: null, paragraphs: [] };

  for (const block of blocks) {
    const lines = block.split('\n');
    const firstLine = lines[0].trim();

    if (looksLikeHeader(firstLine)) {
      if (current.header !== null || current.paragraphs.length > 0) sections.push(current);
      const rest = lines.slice(1).join('\n').trim();
      current = { header: firstLine.replace(/:\s*$/, ''), paragraphs: rest ? [rest] : [] };
    } else {
      current.paragraphs.push(block);
    }
  }
  if (current.header !== null || current.paragraphs.length > 0) sections.push(current);
  return sections;
}

export function FormattedText({ text }: { text: string }) {
  const sections = splitIntoSections(text);

  return (
    <div className="flex flex-col gap-5">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-2">
          {section.header && (
            <p className="text-sm font-semibold border-b border-border pb-1">{section.header}</p>
          )}
          {section.paragraphs.map((p, j) => (
            <p key={j} className="text-sm text-muted-foreground whitespace-pre-line">{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
