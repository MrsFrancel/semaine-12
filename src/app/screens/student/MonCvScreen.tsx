import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import type { CvData } from '../../lib/mock-data';
import { exportTextAsPdf, exportTextAsWord } from '../../lib/export';

const HISTORY = [
  { offer: 'Alternance Chef de Projet Digital', company: 'Publicis Groupe', date: '2 mars' },
  { offer: 'Alternance Content Manager', company: 'Ubisoft', date: '28 févr.' },
  { offer: 'Alternance Growth Marketing', company: 'Alan', date: '20 févr.' },
];

function formatCvForExport(cv: CvData): string {
  return [
    `Formation\n${cv.formation}`,
    `Expérience\n${cv.experience}`,
    `Compétences techniques\n${cv.hardSkills.join(', ')}`,
    `Savoir-être\n${cv.softSkills.join(', ')}`,
    `Langues\n${cv.languages}`,
  ].join('\n\n');
}

export function MonCvScreen({ cv }: { cv: CvData }) {
  const [consent, setConsent] = useState(true);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Mon CV</h2>
        <p className="text-muted-foreground text-sm mt-1">Ta mise en page d'origine reste intacte, l'IA ne touche jamais à la structure.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">CV principal du profil</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Formation</p>
            <p className="text-sm">{cv.formation}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Expérience</p>
            <p className="text-sm">{cv.experience}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Compétences techniques</p>
            <div className="flex flex-wrap gap-1.5">
              {cv.hardSkills.map((s) => <span key={s} className="font-mono text-[11px] bg-secondary px-2 py-0.5 rounded">{s}</span>)}
            </div>
          </div>
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
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => exportTextAsPdf('cv-lea-bernard', 'CV', formatCvForExport(cv))}>Exporter en PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportTextAsWord('cv-lea-bernard', 'CV', formatCvForExport(cv))}>Exporter en Word</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Consentement IA</p>
            <p className="text-xs text-muted-foreground mt-1">Accordé pendant l'onboarding, modifiable à tout moment.</p>
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
        <CardHeader><h3 className="text-base">Historique des versions</h3></CardHeader>
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
