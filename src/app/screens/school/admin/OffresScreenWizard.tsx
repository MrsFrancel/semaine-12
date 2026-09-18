import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { type Offer } from '../../../lib/mock-data';
import { findAbTestOffer } from '../../../lib/ab-test-offers';
import { useSkillVocabulary } from '../../../lib/skill-vocabulary';
import { analyzeOfferText } from '../../../lib/text-analysis';
import { extractPdfText } from '../../../lib/pdf-extract';
import { useOfferPreview, OfferPreviewDialog } from '../../../components/product/OfferPreviewDialog';

type Step = 'reception' | 'traitement' | 'infos' | 'competences' | 'conditions' | 'apercu' | 'publiee';

const STEP_ORDER: Step[] = ['infos', 'competences', 'conditions', 'apercu'];
const STEP_LABEL: Record<Step, string> = {
  reception: '',
  traitement: '',
  infos: 'Informations générales',
  competences: 'Compétences & prérequis',
  conditions: 'Conditions',
  apercu: 'Aperçu final',
  publiee: '',
};

export function OffresScreenWizard({
  offers,
  onPublish,
  onRemoveOffer,
}: {
  offers: Offer[];
  onPublish: (draft: Omit<Offer, 'id'>) => void;
  onRemoveOffer: (id: number) => void;
}) {
  const [step, setStep] = useState<Step>('reception');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [processingLabel, setProcessingLabel] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const { vocabulary } = useSkillVocabulary();
  const offerPreview = useOfferPreview();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [description, setDescription] = useState('');
  const [missions, setMissions] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [profile, setProfile] = useState('');
  const [rawText, setRawText] = useState('');

  const canImport = text.trim().length > 0 || fileName.length > 0;

  const startImport = async () => {
    setStep('traitement');
    setProcessingLabel('Import du document…');
    await new Promise((r) => setTimeout(r, 500));
    setProcessingLabel("Extraction par l'IA…");
    const match = file ? undefined : findAbTestOffer({ text: text || undefined });
    if (match) {
      await new Promise((r) => setTimeout(r, 600));
      setTitle(match.title);
      setCompany(match.company);
      setLocation(match.location);
      setContractType(match.contractType);
      setDescription(match.description);
      setSkills(match.skills.split(',').map((s) => s.trim()).filter(Boolean));
      setProfile(match.profile);
      setMissions(match.missions.join('\n'));
      setRawText(match.rawText);
    } else {
      const content = file ? await extractPdfText(file) : text;
      const analysis = analyzeOfferText(content, vocabulary);
      setTitle(analysis.title);
      setCompany('Entreprise partenaire');
      setLocation(analysis.location);
      setContractType(analysis.contractType);
      setDescription(analysis.description);
      setSkills(analysis.skills);
      setProfile(analysis.profile);
      setMissions('');
      setRawText(content);
    }
    setStep('infos');
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills((s) => [...s, value]);
    setSkillInput('');
  };
  const removeSkill = (value: string) => setSkills((s) => s.filter((x) => x !== value));

  const goNext = () => {
    const i = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);
    if (i >= 0 && i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1]);
  };

  const publish = () => {
    onPublish({
      title,
      company,
      location,
      type: contractType,
      score: 70,
      criteria: [
        { name: 'Compétences techniques', level: 'mid', fill: 60, note: `Basé sur : ${skills.join(', ') || 'compétences non précisées'}.` },
        { name: 'Expérience', level: 'mid', fill: 55, note: 'Pas encore évalué pour un profil précis.' },
        { name: 'Mots-clés du secteur', level: 'mid', fill: 50, note: profile || 'Profil recherché non précisé.' },
      ],
      expectedSkills: skills,
      description,
      missions: missions.split('\n').map((m) => m.trim()).filter(Boolean),
      exclusive: true,
      rawText: rawText || undefined,
    });
    setStep('publiee');
  };

  const reset = () => {
    setStep('reception'); setText(''); setFileName(''); setFile(null);
    setTitle(''); setCompany(''); setLocation(''); setContractType('');
    setDescription(''); setSkills([]); setSkillInput(''); setProfile(''); setMissions(''); setRawText('');
  };

  const wizardIndex = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Dépôt d'offres</h2>
        <p className="text-muted-foreground text-sm mt-1">L'IA pré-remplit la fiche à partir de ce que l'entreprise a envoyé. Un humain vérifie toujours avant publication.</p>
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
                    onChange={(e) => { setText(e.target.value); setFileName(''); setFile(null); }}
                  />
                </TabsContent>
                <TabsContent value="pdf" className="mt-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInput}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      id="offer-pdf-wizard"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setFile(f); setText(''); } }}
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

          {wizardIndex >= 0 && (
            <>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    Étape {wizardIndex + 1}/4 — {STEP_LABEL[step]}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((wizardIndex + 1) / STEP_ORDER.length) * 100}%` }}
                  />
                </div>
              </div>

              {step === 'infos' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Titre du poste</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Entreprise</label>
                      <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Lieu</label>
                      <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Type de contrat</label>
                    <Input value={contractType} onChange={(e) => setContractType(e.target.value)} placeholder="Ex. Alternance · 12 mois" />
                  </div>
                  <Button onClick={goNext} disabled={!title || !company} className="w-fit">Valider et continuer</Button>
                </>
              )}

              {step === 'competences' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Compétences attendues</label>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="font-mono text-[11px] bg-accent text-accent-foreground px-2 py-1 rounded-full flex items-center gap-1.5">
                          {s}
                          <button type="button" onClick={() => removeSkill(s)} className="opacity-60 hover:opacity-100" aria-label={`Retirer ${s}`}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="Ajouter une compétence"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      />
                      <Button type="button" variant="outline" onClick={addSkill}>Ajouter</Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Profil recherché</label>
                    <Input value={profile} onChange={(e) => setProfile(e.target.value)} />
                  </div>
                  <Button onClick={goNext} className="w-fit">Valider et continuer</Button>
                </>
              )}

              {step === 'conditions' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Description</label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-20" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-muted-foreground">Missions (une par ligne)</label>
                    <Textarea value={missions} onChange={(e) => setMissions(e.target.value)} className="min-h-20" />
                  </div>
                  <Button onClick={goNext} className="w-fit">Valider et continuer</Button>
                </>
              )}

              {step === 'apercu' && (
                <>
                  <div className="flex flex-col gap-3 text-sm rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">{title || 'Titre du poste'}</p>
                      <p className="text-xs text-muted-foreground">{company} · {location} · {contractType}</p>
                    </div>
                    <p className="text-muted-foreground">{description}</p>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-mono">Missions</p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {missions.split('\n').map((m) => m.trim()).filter(Boolean).map((m) => <li key={m}>{m}</li>)}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => <span key={s} className="font-mono text-[11px] bg-secondary px-2 py-0.5 rounded-full">{s}</span>)}
                    </div>
                    <p className="text-xs text-muted-foreground">Profil recherché : {profile || 'non précisé'}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Vérifie et corrige avant de publier : les étudiants ne verront rien tant que ce n'est pas validé.</p>
                  <Button onClick={publish} disabled={!title || !company} className="w-fit">Publier au catalogue</Button>
                </>
              )}
            </>
          )}

          {step === 'publiee' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Offre publiée au catalogue</p>
                <p className="text-xs text-muted-foreground mt-1">Les étudiants concernés reçoivent un email. Le suivi d'ouverture sera disponible sous 24h.</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit" onClick={reset}>Importer une nouvelle offre</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Catalogue publié ({offers.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {offers.map((o) => (
            <div key={o.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 text-sm">
              <div>
                <p className="font-medium">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{o.type}</span>
                <Button variant="ghost" size="sm" onClick={() => offerPreview.setPreviewOffer(o)}>Voir</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onRemoveOffer(o.id)}>Retirer</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <OfferPreviewDialog {...offerPreview} />
    </div>
  );
}
