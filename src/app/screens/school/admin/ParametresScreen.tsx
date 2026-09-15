import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';

export function ParametresScreen() {
  const [threshold, setThreshold] = useState(7);
  const [domain, setDomain] = useState('hetic.fr');

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <h2 className="text-2xl">Paramètres</h2>
        <p className="text-muted-foreground text-sm mt-1">Réglages globaux de l'école.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Seuil d'inactivité</h3></CardHeader>
        <CardContent className="flex items-center gap-3">
          <Input type="number" min={1} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-24" />
          <span className="text-sm text-muted-foreground">jours sans action de recherche avant l'alerte</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Domaine mail autorisé</h3></CardHeader>
        <CardContent className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@</span>
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} />
        </CardContent>
      </Card>

      <Button className="w-fit">Enregistrer</Button>
    </div>
  );
}
