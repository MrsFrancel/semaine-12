import { useState } from 'react';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';

const HISTORY = [
  { offer: 'Alternance Chef de Projet Digital', company: 'Publicis Groupe', date: '2 mars' },
  { offer: 'Alternance Content Manager', company: 'Ubisoft', date: '28 févr.' },
  { offer: 'Alternance Growth Marketing', company: 'Alan', date: '20 févr.' },
];

export function MonCvScreen() {
  const [consent, setConsent] = useState(true);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl">Mon CV</h2>
        <p className="text-muted-foreground text-sm mt-1">Ta mise en page d'origine est toujours préservée — l'IA ne touche jamais à la structure.</p>
      </div>

      <Card>
        <CardContent className="pt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Consentement IA</p>
            <p className="text-xs text-muted-foreground mt-1">Accordé à l'onboarding — modifiable à tout moment.</p>
          </div>
          <Switch checked={consent} onCheckedChange={setConsent} />
        </CardContent>
      </Card>

      <Tabs defaultValue="ia">
        <TabsList>
          <TabsTrigger value="manuelle">Édition manuelle</TabsTrigger>
          <TabsTrigger value="ia" disabled={!consent}>Édition IA</TabsTrigger>
        </TabsList>
        <TabsContent value="manuelle" className="mt-4">
          <Card><CardContent className="pt-6 text-sm text-muted-foreground">Copie ton CV directement dans l'éditeur pour ajuster le texte toi-même.</CardContent></Card>
        </TabsContent>
        <TabsContent value="ia" className="mt-4">
          <Card><CardContent className="pt-6 text-sm text-muted-foreground">L'IA propose des reformulations de wording, jamais une refonte du profil. Chaque suggestion attend ta validation.</CardContent></Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader><h3 className="font-serif text-base">Historique des versions</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {HISTORY.map((h) => (
            <div key={h.offer} className="flex items-center justify-between text-sm border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="font-medium">{h.offer}</p>
                <p className="text-xs text-muted-foreground">{h.company}</p>
              </div>
              <span className="text-xs text-muted-foreground">{h.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
