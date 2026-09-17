const HEADER_PATTERN = /^(formation|expériences?(\s+professionnelles?)?|compétences?(\s+techniques?)?|langues?|missions?|profil(\s+recherché)?|contrat|certifications?|portfolio|centres?\s+d'intérêt|savoir-être|présentation|à propos(\s+de l'entreprise)?|avantages?|modalités?\s+de\s+candidature|contact)\s*:?\s*$/i;

function splitBlocks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

export function FormattedText({ text }: { text: string }) {
  const blocks = splitBlocks(text);

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const firstLine = lines[0].trim();
        const isHeader = HEADER_PATTERN.test(firstLine) && lines.length > 1;

        if (isHeader) {
          const body = lines.slice(1).join('\n').trim();
          return (
            <div key={i}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">{firstLine.replace(/:\s*$/, '')}</p>
              <p className="text-sm whitespace-pre-line">{body}</p>
            </div>
          );
        }

        return <p key={i} className="text-sm whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}
