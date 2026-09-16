import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { OFFERS } from '../../../lib/mock-data';

type Step = 'reception' | 'traitement' | 'verification' | 'publiee';

export function OffresScreen() {
  const [step, setStep] = useState<Step>('reception');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [processingLabel, setProcessingLabel] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [profile, setProfile] = useState('');

  const canImport = text.trim().length > 0 || fileName.length > 0;

  const startImport = () => {
    setStep('traitement');
    setProcessingLabel('Import du document…');
    setTimeout(() => {
      setProcessingLabel('Extraction par l\'IA…');
      setTimeout(() => {
        setTitle('Alternance Chargé de Communication Digitale');
        setDescription("Rejoins l'équipe communication pour piloter les campagnes digitales et le contenu éditorial de l'entreprise partenaire.");
        setSkills('Copywriting, Canva, Marketing digital');
        setProfile('Bac+3/4, appétence pour la rédaction et les réseaux sociaux.');
        setStep('verification');
      }, 1100);
    }, 700);
  };

  const reset = () => {
    setStep('reception'); setText(''); setFileName('');
    setTitle(''); setDescription(''); setSkills(''); setProfile('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Offres</h2>
        <p className="text-muted-foreground text-sm mt-1">L'IA pré-remplit la fiche à partir de ce que l'entreprise a envoyé, un humain vérifie avant publication — jamais l'inverse.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Nouvelle offre</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {step === 'reception' && (
            <>
              <Tabs defaultValue="texte">
                <TabsList>
                  <TabsTrigger value="texte">Lien ou texte</TabsTrigger>
                  <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
                </TabsList>
                <TabsContent value="texte" className="mt-3">
                  <Textarea
                    placeholder="Colle le lien de l'offre ou le texte du mail reçu de l'entreprise partenaire"
                    value={text}
                    onChange={(e) => { setText(e.target.value); setFileName(''); }}
                  />
                </TabsContent>
                <TabsContent value="pdf" className="mt-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInput}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      id="offer-pdf"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setText(''); } }}
                    />
                    <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                    <span className="text-sm text-muted-foreground">{fileName || 'Aucun fichier sélectionné'}</span>
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={startImport} disabled={!canImport} className="w-fit">Importer l'offre</Button>
            </>
          )}

          {step === 'traitement' && <p className="text-sm text-muted-foreground py-4">{processingLabel}</p>}

          {step === 'verification' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Titre du poste</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-20" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Compétences attendues</label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Profil recherché</label>
                <Input value={profile} onChange={(e) => setProfile(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Vérifie et corrige avant publication — rien n'est visible des étudiants tant que ce n'est pas validé.</p>
              <Button onClick={() => setStep('publiee')} className="w-fit">Publier au catalogue</Button>
            </>
          )}

          {step === 'publiee' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Offre publiée au catalogue</p>
                <p className="text-xs text-muted-foreground mt-1">Les étudiants concernés sont notifiés par email — le suivi d'ouverture sera disponible sous 24h.</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit" onClick={reset}>Importer une nouvelle offre</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Catalogue publié ({OFFERS.length})</h3></CardHeader>
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
