import { Card } from '../ui/card';
import type { Offer } from '../../lib/mock-data';

export function OfferCard({ offer, onOpen }: { offer: Offer; onOpen: () => void }) {
  return (
    <Card className="p-5 gap-3 cursor-pointer hover:border-primary/50 transition-colors" onClick={onOpen}>
      {offer.exclusive && (
        <span className="font-mono text-[10px] uppercase tracking-wide bg-brand text-brand-foreground px-2 py-1 rounded-md w-fit">
          Exclusif école
        </span>
      )}
      <h3 className="text-base font-semibold leading-snug">{offer.title}</h3>
      <p className="text-muted-foreground text-sm">{offer.company} · {offer.type} · {offer.location}</p>
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
        <span className="font-mono text-sm text-primary font-semibold">{offer.score}% match</span>
        <span className="text-sm text-muted-foreground">Voir →</span>
      </div>
    </Card>
  );
}
