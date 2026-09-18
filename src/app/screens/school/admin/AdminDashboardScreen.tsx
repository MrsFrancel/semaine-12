import { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { InactivityAlert } from '../../../components/product/AlertCard';
import { STUDENTS, COACHES, type Offer } from '../../../lib/mock-data';
import { findAbTestOffer } from '../../../lib/ab-test-offers';
import { useSkillVocabulary } from '../../../lib/skill-vocabulary';
import { analyzeOfferText } from '../../../lib/text-analysis';
import { extractPdfText } from '../../../lib/pdf-extract';

const totalCandidatures = STUDENTS.reduce((s, x) => s + x.candidatures, 0);
const totalEntretiens = STUDENTS.reduce((s, x) => s + x.entretiens, 0);
const tauxEntretien = Math.round((totalEntretiens / totalCandidatures) * 100);

const chartData = COACHES.map((c) => {
  const mine = STUDENTS.filter((s) => s.coachId === c.id);
  return {
    name: c.name.split(' ')[0],
    candidatures: mine.reduce((s, x) => s + x.candidatures, 0),
    entretiens: mine.reduce((s, x) => s + x.entretiens, 0),
  };
});

const mostInactive = [...STUDENTS].filter((s) => s.inactiveDays > 0).sort((a, b) => b.inactiveDays - a.inactiveDays).slice(0, 5);
const topByEntretiens = [...STUDENTS].sort((a, b) => b.entretiens - a.entretiens)[0];

type DepositStep = 'reception' | 'traitement' | 'verification' | 'infos' | 'competences' | 'publiee';

const WIZARD_STEP_ORDER: DepositStep[] = ['infos', 'competences'];
const WIZARD_STEP_LABEL: Partial<Record<DepositStep, string>> = {
  infos: 'Informations générales',
  competences: 'Compétences & prérequis',
};

export function AdminDashboardScreen({
  offers,
  onPublish,
  abVersion,
}: {
  offers: Offer[];
  onPublish: (draft: Omit<Offer, 'id'>) => void;
  abVersion: 'A' | 'B';
}) {
  const avgInactive = (STUDENTS.reduce((s, x) => s + x.inactiveDays, 0) / STUDENTS.length).toFixed(1);

  const ACTIVITY = [
    ...(offers[0] ? [{ text: `Nouvelle offre publiée : ${offers[0].title} chez ${offers[0].company}`, when: 'il y a 2h' }] : []),
    { text: `${topByEntretiens.name} a obtenu un entretien`, when: 'il y a 6h' },
    { text: `${mostInactive[0]?.name ?? 'Un étudiant'} signalé pour inactivité (${mostInactive[0]?.inactiveDays ?? 0}j sans candidature)`, when: 'hier' },
    ...(offers[1] ? [{ text: `Nouvelle offre publiée : ${offers[1].title} chez ${offers[1].company}`, when: 'il y a 2 jours' }] : []),
    { text: `Bilan mensuel généré pour ${COACHES.length} coachs`, when: 'il y a 3 jours' },
  ];

  const [depositStep, setDepositStep] = useState<DepositStep>('reception');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { vocabulary } = useSkillVocabulary();

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [profile, setProfile] = useState('');
  const [rawText, setRawText] = useState('');

  const canImport = text.trim().length > 0 || fileName.length > 0;

  const startImport = async () => {
    setDepositStep('traitement');
    const match = file ? undefined : findAbTestOffer({ text: text || undefined });
    if (match) {
      setTitle(match.title);
      setCompany(match.company);
      setLocation(match.location);
      setContractType(match.contractType);
      setDescription(match.description);
      setSkills(match.skills.split(',').map((s) => s.trim()).filter(Boolean));
      setProfile(match.profile);
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
      setRawText(content);
    }
    setDepositStep(abVersion === 'B' ? 'infos' : 'verification');
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills((s) => [...s, value]);
    setSkillInput('');
  };
  const removeSkill = (value: string) => setSkills((s) => s.filter((x) => x !== value));

  const goNextWizardStep = () => {
    const i = WIZARD_STEP_ORDER.indexOf(depositStep);
    if (i >= 0 && i < WIZARD_STEP_ORDER.length - 1) setDepositStep(WIZARD_STEP_ORDER[i + 1]);
  };

  const publishDraft = () => {
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
      missions: [],
      exclusive: true,
      rawText: rawText || undefined,
    });
    setDepositStep('publiee');
  };

  const resetDeposit = () => {
    setDepositStep('reception'); setText(''); setFileName(''); setFile(null);
    setTitle(''); setCompany(''); setLocation(''); setContractType(''); setDescription(''); setSkills([]); setSkillInput(''); setProfile(''); setRawText('');
  };

  const wizardIndex = WIZARD_STEP_ORDER.indexOf(depositStep);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'école : tout est déjà calculé, il n'y a rien à saisir.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{STUDENTS.length}</p><p className="text-xs text-muted-foreground mt-1">Étudiants actifs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{COACHES.length}</p><p className="text-xs text-muted-foreground mt-1">Coachs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{offers.length}</p><p className="text-xs text-muted-foreground mt-1">Offres exclusives publiées</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{avgInactive}j</p><p className="text-xs text-muted-foreground mt-1">Inactivité moyenne</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base">Dépôt rapide d'une offre</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Colle un texte ou dépose un PDF, sans changer d'écran.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {depositStep === 'reception' && (
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
                      id="dashboard-offer-pdf"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setFile(f); setText(''); } }}
                    />
                    <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                    <span className="text-sm text-muted-foreground truncate">{fileName || 'Aucun fichier sélectionné'}</span>
                  </div>
                </TabsContent>
              </Tabs>
              <Button onClick={startImport} disabled={!canImport} className="w-fit">Importer l'offre</Button>
            </>
          )}

          {depositStep === 'traitement' && <p className="text-sm text-muted-foreground py-4">Extraction en cours…</p>}

          {depositStep === 'verification' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Titre du poste</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Entreprise</label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Lieu</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Type de contrat</label>
                  <Input value={contractType} onChange={(e) => setContractType(e.target.value)} placeholder="Ex. Alternance · 12 mois" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs text-muted-foreground">Compétences attendues</label>
                  <Input
                    value={skills.join(', ')}
                    onChange={(e) => setSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Vérifie et corrige avant de publier. Pour ajouter missions et description détaillée, utilise "Dépôt d'offres" dans la navigation.</p>
              <Button onClick={publishDraft} disabled={!title || !company} className="w-fit">Publier au catalogue</Button>
            </>
          )}

          {wizardIndex >= 0 && (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  Étape {wizardIndex + 1}/{WIZARD_STEP_ORDER.length} — {WIZARD_STEP_LABEL[depositStep]}
                </span>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${((wizardIndex + 1) / WIZARD_STEP_ORDER.length) * 100}%` }}
                  />
                </div>
              </div>

              {depositStep === 'infos' && (
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
                  <Button onClick={goNextWizardStep} disabled={!title || !company} className="w-fit">Valider et continuer</Button>
                </>
              )}

              {depositStep === 'competences' && (
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
                  <p className="text-xs text-muted-foreground">Vérifie et corrige avant de publier. Pour ajouter missions et description détaillée, utilise "Dépôt d'offres" dans la navigation.</p>
                  <Button onClick={publishDraft} disabled={!title || !company} className="w-fit">Publier au catalogue</Button>
                </>
              )}
            </>
          )}

          {depositStep === 'publiee' && (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Offre publiée au catalogue</p>
                <p className="text-xs text-muted-foreground mt-1">Les étudiants concernés reçoivent un email.</p>
              </div>
              <Button variant="outline" size="sm" className="w-fit" onClick={resetDeposit}>Déposer une nouvelle offre</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        <Card>
          <CardHeader className="flex-row items-baseline justify-between">
            <h3 className="text-base">Candidatures &amp; entretiens par coach</h3>
            <p className="font-mono text-sm text-primary font-semibold">{tauxEntretien}% de taux d'entretien</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  cursor={{ fill: 'var(--secondary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="candidatures" name="Candidatures" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={64} isAnimationActive={false} />
                <Bar dataKey="entretiens" name="Entretiens" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={64} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-base">Signaux d'inactivité</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mostInactive.length === 0 && <p className="text-sm text-muted-foreground">Tous les étudiants sont actifs, aucun signal à afficher.</p>}
            {mostInactive.map((s) => <InactivityAlert key={s.id} name={s.name} days={s.inactiveDays} />)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Activité récente</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 text-sm">
              <span>{a.text}</span>
              <span className="text-xs text-muted-foreground flex-none pl-4">{a.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
