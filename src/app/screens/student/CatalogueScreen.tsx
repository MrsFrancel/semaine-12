import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { OfferCard } from '../../components/product/OfferCard';
import { OFFERS, EXTERNAL_OFFERS, type Offer } from '../../lib/mock-data';

export function CatalogueScreen({ onOpenOffer }: { onOpenOffer: (offer: Offer) => void }) {
  const [link, setLink] = useState('');
  const [checking, setChecking] = useState(false);

  const check = () => {
    if (!link.trim()) return;
    setChecking(true);
    setTimeout(() => setChecking(false), 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Offres</h2>
        <p className="text-muted-foreground text-sm mt-1">Le catalogue école reste séparé de tes propres offres : les deux ne se mélangent jamais.</p>
      </div>

      <Tabs defaultValue="ecole">
        <TabsList>
          <TabsTrigger value="ecole">Offres école ({OFFERS.length})</TabsTrigger>
          <TabsTrigger value="externes">Offres externes ({EXTERNAL_OFFERS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ecole" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OFFERS.map((o) => <OfferCard key={o.id} offer={o} onOpen={() => onOpenOffer(o)} />)}
          </div>
        </TabsContent>

        <TabsContent value="externes" className="mt-4 flex flex-col gap-5">
          <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
            <p className="text-sm font-medium">Vérifier une nouvelle offre</p>
            <div className="flex gap-2">
              <Input placeholder="Colle un lien, une adresse mail ou dépose un PDF" value={link} onChange={(e) => setLink(e.target.value)} />
              <Button onClick={check} disabled={checking}>{checking ? 'Analyse…' : 'Vérifier'}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Usage privé : ces offres ne rejoignent jamais le catalogue de l'école.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXTERNAL_OFFERS.map((o) => <OfferCard key={o.id} offer={o} onOpen={() => onOpenOffer(o)} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
