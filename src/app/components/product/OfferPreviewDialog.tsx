import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { Offer } from '../../lib/mock-data';

export function useOfferPreview() {
  const [previewOffer, setPreviewOffer] = useState<Offer | null>(null);
  return { previewOffer, setPreviewOffer };
}

export function OfferPreviewDialog({
  previewOffer,
  setPreviewOffer,
}: ReturnType<typeof useOfferPreview>) {
  return (
    <Dialog open={!!previewOffer} onOpenChange={(open) => !open && setPreviewOffer(null)}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {previewOffer && (
          <div className="flex flex-col gap-4 text-sm">
            <DialogHeader className="text-left sm:text-left">
              <DialogTitle>{previewOffer.title}</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground -mt-2">{previewOffer.company}, {previewOffer.location}, {previewOffer.type}</p>
            <p>{previewOffer.description}</p>
            {previewOffer.missions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Missions</p>
                <ul className="list-disc list-inside text-muted-foreground flex flex-col gap-1">
                  {previewOffer.missions.map((m) => <li key={m}>{m}</li>)}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Compétences attendues</p>
              <div className="flex flex-wrap gap-1.5">
                {previewOffer.expectedSkills.length
                  ? previewOffer.expectedSkills.map((s) => <span key={s} className="font-mono text-[11px] bg-secondary px-2 py-0.5 rounded">{s}</span>)
                  : <p className="text-muted-foreground">Non précisées.</p>}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
