import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../components/ui/alert-dialog';
import { ScoreCard } from '../../components/product/ScoreCard';
import { StatusPill } from '../../components/product/StatusPill';
import { CvFieldsEditor } from '../../components/product/CvFieldsEditor';
import { CvSummary } from '../../components/product/CvSummary';
import { FormattedText } from '../../components/product/FormattedText';
import type { Offer, CandidatureStatus, CvData } from '../../lib/mock-data';
import { STATUS_LABEL } from '../../lib/mock-data';
import { computeMatch, type MatchResult } from '../../lib/scoring';
import { buildOfferSuggestions } from '../../lib/offer-suggestions';
import { exportTextAsPdf, exportTextAsWord } from '../../lib/export';

const ORDER: CandidatureStatus[] = ['a-preparer', 'postulee', 'entretien', 'reponse'];
const STUDENT_NAME = 'Léa Bernard';

function excerpt(text: string, maxLen = 220): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const cut = clean.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function buildLetter(offer: Offer, cv: CvData, match: MatchResult): string {
  const skillsList = match.matchedSkills.length > 0 ? match.matchedSkills.slice(0, 3) : cv.hardSkills.slice(0, 3);
  const mission = offer.missions[0];
  const missionLine = mission ? `, notamment pour ${mission.charAt(0).toLowerCase()}${mission.slice(1)}` : '';
  const hasRealCompany = offer.company.trim().length > 0 && !/^entreprise\s*\(offre externe\)$/i.test(offer.company.trim());
  const companyClause = hasRealCompany ? ` au sein de ${offer.company}` : '';

  return `Madame, Monsieur,

Actuellement en ${cv.formation || 'formation'}, je vous adresse ma candidature pour le poste de ${offer.title}${companyClause}.

${excerpt(cv.experience)}

Je maîtrise notamment ${skillsList.join(', ') || 'les compétences requises pour ce poste'}, des compétences qui correspondent directement aux besoins exprimés dans votre offre${missionLine}. Je suis convaincu(e) que mon profil et ma motivation seront un atout pour votre équipe.

Je reste à votre disposition pour un entretien et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${STUDENT_NAME}`;
}

function formatCvForExport(cv: CvData): string {
  const sections = [
    cv.title && `Titre\n${cv.title}`,
    cv.bio && `Présentation\n${cv.bio}`,
    (cv.phone || cv.contactEmail) && `Contact\n${[cv.phone, cv.contactEmail].filter(Boolean).join(' · ')}`,
    `Formation\n${cv.formation}`,
    `Expérience\n${cv.experience}`,
    cv.personalProjects && `Projets personnels ou associatifs\n${cv.personalProjects}`,
    `Compétences techniques\n${cv.hardSkills.join(', ')}`,
    cv.certifications.length > 0 && `Certifications\n${cv.certifications.join(', ')}`,
    `Savoir-être\n${cv.softSkills.join(', ')}`,
    `Langues\n${cv.languages}`,
    cv.portfolioLinks && `Portfolio / liens\n${cv.portfolioLinks}`,
    cv.interests && `Centres d'intérêt\n${cv.interests}`,
    cv.drivingLicense && `Permis de conduire\nOui`,
    cv.availability && `Disponibilité / mobilité géographique\n${cv.availability}`,
    cv.attentionNote && `Note d'attention\n${cv.attentionNote}`,
  ];
  return sections.filter(Boolean).join('\n\n');
}

export function CandidatureScreen({
  offer,
  profileCv,
  onPushProfileCv,
  onBack,
  initialStatus,
  onStatusChange,
}: {
  offer: Offer;
  profileCv: CvData;
  onPushProfileCv: (cv: CvData, label: string) => void;
  onBack: () => void;
  initialStatus: CandidatureStatus;
  onStatusChange: (status: CandidatureStatus) => void;
}) {
  const [status, setStatus] = useState<CandidatureStatus>(initialStatus);

  const [cv, setCv] = useState<CvData>(profileCv);
  const [baseExperience] = useState(profileCv.experience);
  const [cvEditorOpen, setCvEditorOpen] = useState(false);
  const [draftCv, setDraftCv] = useState<CvData>(profileCv);
  const [saveScopeOpen, setSaveScopeOpen] = useState(false);

  const [letterGenerated, setLetterGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [letterText, setLetterText] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const match = useMemo(
    () => computeMatch(offer, cv, baseExperience, letterGenerated),
    [offer, cv, baseExperience, letterGenerated]
  );

  const draftMatch = useMemo(
    () => computeMatch(offer, draftCv, baseExperience, letterGenerated),
    [offer, draftCv, baseExperience, letterGenerated]
  );

  const suggestions = useMemo(
    () => buildOfferSuggestions(draftCv, offer, draftMatch).filter((s) => !dismissedSuggestions.has(s.id)),
    [draftCv, offer, draftMatch, dismissedSuggestions]
  );

  const advance = () => {
    const i = ORDER.indexOf(status);
    if (i < ORDER.length - 1) {
      const next = ORDER[i + 1];
      setStatus(next);
      onStatusChange(next);
    }
  };

  const generateLetter = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setLetterGenerated(true);
      setLetterText(buildLetter(offer, cv, match));
    }, 1100);
  };

  const openCvEditor = () => {
    setDraftCv(cv);
    setCvEditorOpen(true);
  };

  const acceptSuggestion = (apply: (c: CvData) => CvData) => {
    setDraftCv((d) => apply(d));
  };

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions((d) => new Set(d).add(id));
  };

  const commitSave = (scope: 'offer' | 'profile') => {
    setCv(draftCv);
    if (scope === 'profile') onPushProfileCv(draftCv, `Adapté pour "${offer.title}" chez ${offer.company}`);
    setSaveScopeOpen(false);
    setCvEditorOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour au catalogue</button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <ScoreCard offer={offer} score={match.score} criteria={match.criteria} />

          <Card>
            <CardHeader><h3 className="text-base">Offre complète</h3></CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto pr-2 -mr-2 border border-border rounded-lg p-3">
                {offer.rawText?.trim() ? (
                  <FormattedText text={offer.rawText} />
                ) : (
                  <div className="flex flex-col gap-4">
                    {offer.description && <p className="text-sm">{offer.description}</p>}
                    {offer.missions.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Missions</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground flex flex-col gap-1">
                          {offer.missions.map((m) => <li key={m}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-base">Correspondance avec ton profil</h3></CardHeader>
            <CardContent>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Compétences attendues</p>
              {offer.expectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {offer.expectedSkills.map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                        match.matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase())
                          ? 'bg-match-strong text-match-strong-foreground'
                          : 'bg-match-low text-match-low-foreground'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Non précisées.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><h3 className="text-base">CV complet</h3></CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto pr-2 -mr-2 border border-border rounded-lg p-3">
                <CvSummary cv={cv} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-base">Correspondance avec cette offre</h3></CardHeader>
            <CardContent>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Tes compétences</p>
              {cv.hardSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {cv.hardSkills.map((s) => (
                    <span
                      key={s}
                      className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
                        match.matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase())
                          ? 'bg-match-strong text-match-strong-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                  {match.missingSkills.map((s) => (
                    <span key={`missing-${s}`} className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-dashed border-border text-muted-foreground">
                      {s} (manquant)
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune compétence renseignée dans ton CV.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Suggestions pour cette offre</p>
                  {suggestions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Aucune suggestion pour l'instant, ton CV couvre bien cette offre.</p>
                  ) : (
                    suggestions.map((s) => (
                      <div key={s.id} className="rounded-lg border border-border p-3 flex flex-col gap-2">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">{s.fieldLabel}</p>
                        <p className="text-sm text-muted-foreground line-through">{s.before}</p>
                        <p className="text-sm">{s.after}</p>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={() => acceptSuggestion(s.apply)}>Accepter</Button>
                          <Button size="sm" variant="ghost" onClick={() => dismissSuggestion(s.id)}>Ignorer</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 border border-border rounded-lg p-3">
                  <CvFieldsEditor cv={draftCv} onChange={setDraftCv} />
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
