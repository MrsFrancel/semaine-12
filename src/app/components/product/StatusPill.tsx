import type { CandidatureStatus } from '../../lib/mock-data';
import { STATUS_LABEL } from '../../lib/mock-data';

export function StatusPill({ status }: { status: CandidatureStatus }) {
  const active = status === 'entretien' || status === 'reponse';
  return (
    <span
      className={`text-xs px-3 py-1.5 rounded-full border ${
        active ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground bg-card'
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
