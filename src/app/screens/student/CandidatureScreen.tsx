import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../components/ui/alert-dialog';
import { ScoreCard } from '../../components/product/ScoreCard';
import { StatusPill } from '../../components/product/StatusPill';
import type { Offer, CandidatureStatus, CvData } from '../../lib/mock-data';
import { STATUS_LABEL } from '../../lib/mock-data';
import { computeMatch } from '../../lib/scoring';
import { exportTextAsPdf, exportTextAsWord } from '../../lib/export';

const ORDER: CandidatureStatus[] = ['a-preparer', 'postulee', 'entretien', 'reponse'];
const STUDENT_NAME = 'Léa Bernard';

function buildLetter(offer: Offer, cv: CvData): string {
  return `Madame, Monsieur,

Actuellement en ${cv.formation}, je vous adresse ma candidature pour le poste de ${offer.title} au sein de ${offer.company}.

${cv.experience}

Je maîtrise notamment ${cv.hardSkills.slice(0, 3).join(', ')}, des compétences qui correspondent aux besoins du poste. Je suis convaincu(e) que mon profil et ma motivation seront un atout pour votre équipe.

Je reste à votre disposition pour un entretien et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${STUDENT_NAME}`;
}

function formatCvForExport(cv: CvData): string {
  return [
    `Formation\n${cv.formation}`,
    `Expérience\n${cv.experience}`,
    `Compétences techniques\n${cv.hardSkills.join(', ')}`,
    `Savoir-être\n${cv.softSkills.join(', ')}`,
    `Langues\n${cv.languages}`,
  ].join('\n\n');
}

export function CandidatureScreen({
  offer,
  profileCv,
  onPushProfileCv,
  onBack,
}: {
  offer: Offer;
  profileCv: CvData;
  onPushProfileCv: (cv: CvData, label: string) => void;
  onBack: () => void;
}) {
  const [status, setStatus] = useState<CandidatureStatus>('a-preparer');

  const [cv, setCv] = useState<CvData>(profileCv);
  const [baseExperience] = useState(profileCv.experience);
  const [cvEditorOpen, setCvEditorOpen] = useState(false);
  const [draftCv, setDraftCv] = useState<CvData>(profileCv);
  const [newSkill, setNewSkill] = useState('');
  const [saveScopeOpen, setSaveScopeOpen] = useState(false);

  const [letterGenerated, setLetterGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [letterText, setLetterText] = useState('');

  const match = useMemo(
    () => computeMatch(offer, cv, baseExperience, letterGenerated),
    [offer, cv, baseExperience, letterGenerated]
  );

  const advance = () => {
    const i = ORDER.indexOf(status);
    if (i < ORDER.length - 1) setStatus(ORDER[i + 1]);
  };

  const generateLetter = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setLetterGenerated(true);
      setLetterText(buildLetter(offer, cv));
    }, 1100);
  };

  const openCvEditor = () => {
    setDraftCv(cv);
    setNewSkill('');
    setCvEditorOpen(true);
  };

  const removeSkill = (skill: string) => setDraftCv((d) => ({ ...d, hardSkills: d.hardSkills.filter((s) => s !== skill) }));
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || draftCv.hardSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setDraftCv((d) => ({ ...d, hardSkills: [...d.hardSkills, trimmed] }));
  };

  const draftMissingSkills = offer.expectedSkills.filter(
    (e) => !draftCv.hardSkills.some((s) => s.toLowerCase() === e.toLowerCase())
  );

  const commitSave = (scope: 'offer' | 'profile') => {
    setCv(draftCv);
    if (scope === 'profile') onPushProfileCv(draftCv, `Adapté pour "${offer.title}" chez ${offer.company}`);
    setSaveScopeOpen(false);
    setCvEditorOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour au catalogue</button>

      <ScoreCard offer={offer} score={match.score} criteria={match.criteria} />

      <Card>
        <CardHeader><h3 className="text-base">CV &amp; lettre de motivation</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">CV adapté à cette offre</p>
                <p className="text-xs text-muted-foreground">Édition manuelle, chaque changement reste à valider avant de s'appliquer.</p>
              </div>
              <Button variant="outline" size="sm" onClick={cvEditorOpen ? () => setCvEditorOpen(false) : openCvEditor}>
                {cvEditorOpen ? 'Fermer' : 'Adapter mon CV'}
              </Button>
            </div>

            {cvEditorOpen && (
              <div className="flex flex-col gap-4 pt-3 border-t border-border">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Formation</label>
                  <Input value={draftCv.formation} onChange={(e) => setDraftCv((d) => ({ ...d, formation: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Expérience</label>
                  <Textarea className="min-h-24" value={draftCv.experience} onChange={(e) => setDraftCv((d) => ({ ...d, experience: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Compétences techniques</label>
                  <div className="flex flex-wrap gap-1.5">
                    {draftCv.hardSkills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 font-mono text-[11px] bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:opacity-70" aria-label={`Retirer ${s}`}>×</button>
                      </span>
                    ))}
                  </div>
                  {draftMissingSkills.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <p className="text-xs text-muted-foreground">Attendues pour cette offre, absentes de ton CV :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {draftMissingSkills.map((s) => (
                          <button
                            key={s}
                            onClick={() => addSkill(s)}
                            className="font-mono text-[11px] border border-dashed border-border text-muted-foreground px-2 py-0.5 rounded hover:border-primary/50 hover:text-primary transition-colors"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Ajouter une compétence…"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { addSkill(newSkill); setNewSkill(''); } }}
                    />
                    <Button variant="outline" size="sm" onClick={() => { addSkill(newSkill); setNewSkill(''); }}>Ajouter</Button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Savoir-être (séparés par une virgule)</label>
                  <Input
                    value={draftCv.softSkills.join(', ')}
                    onChange={(e) => setDraftCv((d) => ({ ...d, softSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">Langues</label>
                  <Input value={draftCv.languages} onChange={(e) => setDraftCv((d) => ({ ...d, languages: e.target.value }))} />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button size="sm" onClick={() => setSaveScopeOpen(true)}>Enregistrer les modifications</Button>
                  <Button variant="outline" size="sm" onClick={() => exportTextAsPdf('cv-lea-bernard', 'CV', formatCvForExport(draftCv))}>Exporter en PDF</Button>
                  <Button variant="outline" size="sm" onClick={() => exportTextAsWord('cv-lea-bernard', 'CV', formatCvForExport(draftCv))}>Exporter en Word</Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Lettre de motivation</p>
                <p className="text-xs text-muted-foreground">{letterGenerated ? 'Générée, modifiable avant envoi.' : 'Pas encore générée.'}</p>
              </div>
              <Button variant="outline" size="sm" onClick={generateLetter} disabled={generating}>
                {generating ? 'Génération…' : letterGenerated ? 'Régénérer' : 'Générer'}
              </Button>
            </div>
            {letterGenerated && (
              <div className="flex flex-col gap-3 pt-3 border-t border-border">
                <Textarea className="min-h-48" value={letterText} onChange={(e) => setLetterText(e.target.value)} />
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => exportTextAsPdf('lettre-motivation', `Lettre de motivation, ${offer.company}`, letterText)}>Exporter en PDF</Button>
                  <Button variant="outline" size="sm" onClick={() => exportTextAsWord('lettre-motivation', `Lettre de motivation, ${offer.company}`, letterText)}>Exporter en Word</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <h3 className="text-base">Statut de ta candidature</h3>
          <StatusPill status={status} />
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {status !== 'reponse' ? (
            <Button onClick={advance}>
              {status === 'a-preparer' ? 'Marquer comme postulée' : status === 'postulee' ? "J'ai un entretien" : 'Marquer la réponse reçue'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">Candidature clôturée : {STATUS_LABEL[status]}.</p>
          )}
        </CardContent>
      </Card>

      {status === 'entretien' && (
        <Card className="border-primary/30">
          <CardHeader><h3 className="text-base">Préparer l'entretien avec ton coach</h3></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" size="sm">Prendre rendez-vous</Button>
            <Button variant="ghost" size="sm">Ouvrir la messagerie</Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={saveScopeOpen} onOpenChange={setSaveScopeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Garder ce CV pour cette offre, ou en faire ton profil principal ?</AlertDialogTitle>
            <AlertDialogDescription>
              Tu peux limiter ces changements à cette candidature, ou les appliquer à ton CV principal pour toutes tes prochaines candidatures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => commitSave('offer')}>Garder pour cette offre</AlertDialogAction>
            <AlertDialogAction onClick={() => commitSave('profile')}>Définir comme CV principal</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
