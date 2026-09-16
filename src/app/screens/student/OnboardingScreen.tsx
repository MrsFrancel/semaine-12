import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent } from '../../components/ui/card';

type Step = 'inscription' | 'consentement' | 'upload' | 'secours' | 'verification' | 'pret';

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>('inscription');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [formation, setFormation] = useState('');
  const [experience, setExperience] = useState('');
  const [hardSkills, setHardSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [languages, setLanguages] = useState('');

  const emailValid = /@hetic\.fr$/i.test(email.trim());

  const startUpload = (fail: boolean) => {
    setStep('upload');
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      if (fail) {
        setStep('secours');
      } else {
        setFormation('Bachelor Marketing Digital, HETIC');
        setExperience('Stage 6 mois, chargé de communication digitale dans une agence. Gestion des réseaux sociaux et création de contenus.');
        setHardSkills('Marketing digital, SEO/SEA, Google Analytics, Canva');
        setSoftSkills("Autonomie, Curiosité, Esprit d'équipe");
        setLanguages('Français (natif), Anglais (professionnel)');
        setStep('verification');
      }
    }, 1400);
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
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => startUpload(false)}>Déposer mon CV</Button>
                    <Button variant="outline" onClick={() => startUpload(true)}>Simuler un échec</Button>
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
              <Input placeholder="Ex. Marketing digital, SEO/SEA, Canva…" value={hardSkills} onChange={(e) => setHardSkills(e.target.value)} />
              <Button onClick={() => setStep('verification')}>Continuer</Button>
            </div>
          )}

          {step === 'verification' && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground">Voici ce qu'on a retenu de ton CV. Corrige ce qui doit l'être, rien n'est figé.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Formation</label>
                <Input placeholder="Ex. Bachelor Marketing Digital, HETIC" value={formation} onChange={(e) => setFormation(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Expérience</label>
                <Textarea placeholder="Ex. Stage 6 mois, chargé de communication digitale. Missions principales." value={experience} onChange={(e) => setExperience(e.target.value)} className="min-h-24" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Compétences techniques (séparées par une virgule)</label>
                  <Input placeholder="Ex. Marketing digital, SEO/SEA, Canva…" value={hardSkills} onChange={(e) => setHardSkills(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Savoir-être (séparés par une virgule)</label>
                  <Input placeholder="Ex. Autonomie, Curiosité, Esprit d'équipe…" value={softSkills} onChange={(e) => setSoftSkills(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Langues</label>
                <Input placeholder="Ex. Français (natif), Anglais (professionnel)" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <Button disabled={!formation.trim()} onClick={() => setStep('pret')}>Confirmer mon profil</Button>
            </div>
          )}

          {step === 'pret' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-accent p-4">
                <p className="text-sm font-medium text-accent-foreground">Profil prêt</p>
                <p className="text-xs text-muted-foreground mt-1">Ton catalogue est maintenant scoré et prêt à consulter.</p>
              </div>
              <Button onClick={onDone}>Accéder à mon espace</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
