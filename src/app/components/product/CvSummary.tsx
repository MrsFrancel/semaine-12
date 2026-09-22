import type { CvData } from '../../lib/mock-data';

export function CvSummary({
  cv,
  matchedSkills,
  missingSkills,
}: {
  cv: CvData;
  matchedSkills?: string[];
  missingSkills?: string[];
}) {
  const isMatched = (skill: string) => matchedSkills?.some((m) => m.toLowerCase() === skill.toLowerCase()) ?? false;

  return (
    <div className="flex flex-col gap-4">
      {(cv.photoUrl || cv.title) && (
        <div className="flex items-center gap-3">
          {cv.photoUrl && <img src={cv.photoUrl} alt="Photo de profil" className="size-12 rounded-full object-cover border border-border" />}
          {cv.title && <p className="text-sm font-medium">{cv.title}</p>}
        </div>
      )}
      {cv.bio && <p className="text-sm text-muted-foreground">{cv.bio}</p>}
      {(cv.phone || cv.contactEmail) && (
        <p className="font-mono text-xs text-muted-foreground">{[cv.phone, cv.contactEmail].filter(Boolean).join(' / ')}</p>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Formation</p>
        <p className="text-sm">{cv.formation}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Expérience</p>
        <p className="text-sm">{cv.experience}</p>
      </div>
      {cv.personalProjects && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Projets personnels ou associatifs</p>
          <p className="text-sm">{cv.personalProjects}</p>
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Compétences techniques</p>
        <div className="flex flex-wrap gap-1.5">
          {cv.hardSkills.map((s) => (
            <span
              key={s}
              className={`font-mono text-[11px] px-2 py-0.5 rounded ${isMatched(s) ? 'bg-match-strong text-match-strong-foreground' : 'bg-secondary'}`}
            >
              {s}
            </span>
          ))}
          {missingSkills?.map((s) => (
            <span key={`missing-${s}`} className="font-mono text-[11px] px-2 py-0.5 rounded border border-dashed border-border text-muted-foreground">
              {s} (manquant)
            </span>
          ))}
        </div>
      </div>
      {cv.certifications.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Certifications</p>
          <div className="flex flex-wrap gap-1.5">
            {cv.certifications.map((c) => <span key={c} className="font-mono text-[11px] border border-border px-2 py-0.5 rounded">{c}</span>)}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Savoir-être</p>
        <div className="flex flex-wrap gap-1.5">
          {cv.softSkills.map((s) => <span key={s} className="font-mono text-[11px] border border-border px-2 py-0.5 rounded">{s}</span>)}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Langues</p>
        <p className="text-sm">{cv.languages}</p>
      </div>
      {cv.portfolioLinks && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Portfolio / liens</p>
          <p className="text-sm whitespace-pre-wrap">{cv.portfolioLinks}</p>
        </div>
      )}
      {cv.interests && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Centres d'intérêt</p>
          <p className="text-sm">{cv.interests}</p>
        </div>
      )}
      {cv.drivingLicense && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Permis de conduire</p>
          <p className="text-sm">Oui</p>
        </div>
      )}
      {cv.availability && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Disponibilité / mobilité géographique</p>
          <p className="text-sm">{cv.availability}</p>
        </div>
      )}
      {cv.attentionNote && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Note d'attention</p>
          <p className="text-sm">{cv.attentionNote}</p>
        </div>
      )}
    </div>
  );
}
