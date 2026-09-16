import { Card, CardContent, CardHeader } from '../ui/card';
import type { Criterion, Offer } from '../../lib/mock-data';

const LEVEL_LABEL: Record<Criterion['level'], string> = { strong: 'Fort', mid: 'Moyen', low: 'À travailler' };
const LEVEL_CLASS: Record<Criterion['level'], string> = {
  strong: 'bg-match-strong text-match-strong-foreground',
  mid: 'bg-match-mid text-match-mid-foreground',
  low: 'bg-match-low text-match-low-foreground',
};
const LEVEL_BAR: Record<Criterion['level'], string> = {
  strong: 'bg-match-strong',
  mid: 'bg-match-mid',
  low: 'bg-match-low',
};

export function ScoreCard({ offer, score, criteria }: { offer: Offer; score: number; criteria: Criterion[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg">{offer.title}</h3>
          <p className="text-muted-foreground text-sm mt-0.5">{offer.company} · {offer.location} · {offer.type}</p>
        </div>
        <div className="font-mono text-3xl font-semibold text-primary tabular-nums">
          {score}<span className="text-sm text-muted-foreground font-sans font-normal">% de match</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground -mt-2">Recalculé à partir de ton CV et de ta lettre actuels pour cette offre.</p>
        {criteria.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{c.name}</span>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${LEVEL_CLASS[c.level]}`}>{LEVEL_LABEL[c.level]}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full rounded-full ${LEVEL_BAR[c.level]}`} style={{ width: `${c.fill}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">{c.note}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
