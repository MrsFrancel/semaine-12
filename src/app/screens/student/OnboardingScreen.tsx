import { useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { CvFieldsEditor } from '../../components/product/CvFieldsEditor';
import type { CvData } from '../../lib/mock-data';
import { useSkillVocabulary } from '../../lib/skill-vocabulary';
import { analyzeCvText } from '../../lib/text-analysis';
import { extractPdfText } from '../../lib/pdf-extract';

type Step = 'inscription' | 'consentement' | 'upload' | 'secours' | 'verification' | 'pret';

const EMPTY_CV: CvData = {
  title: '', photoUrl: '', bio: '', phone: '', contactEmail: '',
  formation: '', experience: '', hardSkills: [], certifications: [],
  softSkills: [], languages: '', portfolioLinks: '', personalProjects: '',
  interests: '', drivingLicense: false, availability: '', attentionNote: '',
};

export function OnboardingScreen({ onDone }: { onDone: (cv: CvData) => void }) {
  const [step, setStep] = useState<Step>('inscription');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [cv, setCv] = useState<CvData>(EMPTY_CV);
  const { vocabulary } = useSkillVocabulary();

  const [cvText, setCvText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const canAnalyze = cvText.trim().length > 0 || !!cvFile;

  const emailValid = /@hetic\.fr$/i.test(email.trim());

  const applyResult = (result: ReturnType<typeof analyzeCvText>) => {
    const hasSignal = result.formation.trim().length > 0 || result.hardSkills.length > 0;
    if (!hasSignal) {
      setStep('secours');
      return;
    }
    setCv((d) => ({
      ...d,
      formation: result.formation || d.formation,
      experience: result.experience || d.experience,
      hardSkills: result.hardSkills.length ? result.hardSkills : d.hardSkills,
      softSkills: ['Autonomie', 'Curiosité', "Esprit d'équipe"],
      languages: result.languages,
      contactEmail: email,
    }));
    setStep('verification');
  };

  const startUpload = async () => {
    setStep('upload');
    setAnalyzing(true);
    try {
      const text = cvFile ? await extractPdfText(cvFile) : cvText;
      const result = analyzeCvText(text, vocabulary);
      setAnalyzing(false);
      applyResult(result);
    } catch {
      setAnalyzing(false);
      setStep('secours');
    }
  };

  const simulateFailure = () => {
    setStep('upload');
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep('secours');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className={`w-full p-2 ${step === 'verification' ? 'max-w-xl' : 'max-w-md'}`}>
        <CardContent className="pt-4 flex flex-col gap-5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary">Match&amp;Go · Étudiant</p>
            <h1 className="text-2xl mt-1">Rejoindre ta plateforme</h1>
          </div>

          {step === 'inscription' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Adresse mail de ton école</label>
                <Input placeholder="prenom.nom@hetic.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
                <p className="text-xs text-muted-foreground">Réservé aux mails du domaine de ton école.</p>
              </div>
              <Button disabled={!emailValid} onClick={() => setStep('consentement')}>Continuer</Button>
            </div>
          )}

          {step === 'consentement' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 rounded-xl border border-border p-4">
                <Switch checked={consent} onCheckedChange={setConsent} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium">J'autorise l'IA à me proposer des ajustements de CV</p>
                  <p className="text-xs text-muted-foreground mt-1">Chaque suggestion te sera présentée pour validation, rien n'est modifié automatiquement.</p>
                </div>
              </div>
              <Button disabled={!consent} onClick={() => setStep('upload')}>Continuer</Button>
            </div>
          )}

          {step === 'upload' && (
            <div className="flex flex-col gap-4">
              {analyzing ? (
                <p className="text-sm text-muted-foreground py-6 text-center">Lecture de ton CV en cours…</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Dépose ton CV pour débloquer le catalogue scoré.</p>
                  <Tabs defaultValue="pdf">
                    <TabsList>
                      <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
                      <TabsTrigger value="texte">Coller le texte</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pdf" className="mt-3">
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInput}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          id="cv-pdf"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCvFile(f); setCvText(''); } }}
                        />
                        <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir mon CV (PDF)</Button>
                        <span className="text-sm text-muted-foreground truncate">{cvFile?.name || 'Aucun fichier sélectionné'}</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="texte" className="mt-3">
                      <Textarea
                        placeholder="Colle le texte de ton CV"
                        value={cvText}
                        onChange={(e) => { setCvText(e.target.value); setCvFile(null); }}
                      />
                    </TabsContent>
                  </Tabs>
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={!canAnalyze} onClick={startUpload}>Analyser mon CV</Button>
                    <Button variant="outline" onClick={simulateFailure}>Simuler un échec</Button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'secours' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-secondary p-4">
                <p className="text-sm font-medium">Mode secours manuel</p>
                <p className="text-xs text-muted-foreground mt-1">La mise en page de ton CV n'a pas pu être analysée automatiquement. Renseigne tes compétences clés à la main, ça n'empêche pas de continuer.</p>
              </div>
              <Input
                placeholder="Ex. Marketing digital, SEO/SEA, Canva…"
                value={cv.hardSkills.join(', ')}
                onChange={(e) => setCv((d) => ({ ...d, hardSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
              />
              <Button onClick={() => setStep('verification')}>Continuer</Button>
            </div>
          )}

          {step === 'verification' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground">Voici ce qu'on a retenu de ton CV. Corrige ce qui doit l'être, complète ce qui manque, rien n'est figé.</p>
              <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 border border-border rounded-lg p-3">
                <CvFieldsEditor cv={cv} onChange={(updater) => setCv(updater)} />
              </div>
              <Button disabled={!cv.formation.trim()} onClick={() => setStep('pret')}>Confirmer mon profil</Button>
            </div>
          )}

          {step === 'pret' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Profil prêt</p>
                <p className="text-xs text-muted-foreground mt-1">Ton catalogue est maintenant scoré et prêt à consulter.</p>
              </div>
              <Button onClick={() => onDone(cv)}>Accéder à mon espace</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
