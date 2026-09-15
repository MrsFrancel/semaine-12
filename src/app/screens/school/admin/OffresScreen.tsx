import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { OFFERS } from '../../../lib/mock-data';

type Step = 'reception' | 'extraction' | 'verification' | 'publiee';

export function OffresScreen() {
  const [step, setStep] = useState<Step>('reception');
  const [source, setSource] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');

  const extract = () => {
    if (!source.trim()) return;
    setStep('extraction');
    setTimeout(() => {
      setTitle('Alternance Chargé de Communication');
      setSkills('Copywriting, Canva, Marketing digital');
      setStep('verification');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl">Offres</h2>
        <p className="text-muted-foreground text-sm mt-1">L'IA pré-remplit la fiche, un humain vérifie avant publication — jamais l'inverse.</p>
      </div>

      <Card>
        <CardHeader><h3 className="font-serif text-base">Nouvelle offre</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {step === 'reception' && (
            <>
              <Textarea placeholder="Colle le mail, le lien ou le contenu du PDF reçu de l'entreprise partenaire" value={source} onChange={(e) => setSource(e.target.value)} />
              <Button onClick={extract} className="w-fit">Extraire la fiche de poste</Button>
            </>
          )}
          {step === 'extraction' && <p className="text-sm text-muted-foreground py-4">Extraction en cours par l'IA…</p>}
          {step === 'verification' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Titre du poste</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Compétences attendues</label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Vérifie et corrige avant publication — rien n'est visible des étudiants tant que ce n'est pas validé.</p>
              <Button onClick={() => setStep('publiee')} className="w-fit">Publier au catalogue</Button>
            </>
          )}
          {step === 'publiee' && (
            <div className="rounded-lg border border-border bg-accent p-4">
              <p className="text-sm font-medium text-accent-foreground">Offre publiée</p>
              <p className="text-xs text-muted-foreground mt-1">Les étudiants concernés sont notifiés par mail.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="font-serif text-base">Catalogue publié ({OFFERS.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {OFFERS.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 text-sm">
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.company}</p>
              </div>
              <span className="text-xs text-muted-foreground">{o.type}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
