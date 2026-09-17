import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { CvFieldsEditor } from '../../components/product/CvFieldsEditor';
import { CvSummary } from '../../components/product/CvSummary';
import { slugify, type CvData, type CvHistoryEntry } from '../../lib/mock-data';
import { exportTextAsPdf, exportTextAsWord } from '../../lib/export';
import { buildSuggestions } from '../../lib/ai-suggestions';

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

export function MonCvScreen({
  cv,
  history,
  onUpdateCv,
  studentName,
}: {
  cv: CvData;
  history: CvHistoryEntry[];
  onUpdateCv: (cv: CvData, label: string) => void;
  studentName: string;
}) {
  const cvFileName = `cv-${slugify(studentName)}`;
  const [consent, setConsent] = useState(true);

  const [draftCv, setDraftCv] = useState<CvData>(cv);

  const draftDirty = JSON.stringify(draftCv) !== JSON.stringify(cv);
  const saveManual = () => onUpdateCv(draftCv, 'Modifié manuellement');
  const resetDraft = () => setDraftCv(cv);

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const suggestions = useMemo(() => buildSuggestions(cv).filter((s) => !dismissed.has(s.id)), [cv, dismissed]);
  const acceptSuggestion = (id: string, fieldLabel: string, apply: (c: CvData) => CvData) => {
    onUpdateCv(apply(cv), `Suggestion IA appliquée : ${fieldLabel}`);
  };
  const dismissSuggestion = (id: string) => setDismissed((d) => new Set(d).add(id));

  const [detailEntry, setDetailEntry] = useState<CvHistoryEntry | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Mon CV</h2>
        <p className="text-muted-foreground text-sm mt-1">Ta mise en page d'origine reste intacte, l'IA ne touche jamais à la structure.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">CV principal du profil</h3></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <CvSummary cv={cv} />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => exportTextAsPdf(cvFileName, 'CV', formatCvForExport(cv))}>Exporter en PDF</Button>
            <Button variant="outline" size="sm" onClick={() => exportTextAsWord(cvFileName, 'CV', formatCvForExport(cv))}>Exporter en Word</Button>
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

      <Tabs defaultValue="manuelle" onValueChange={() => setDraftCv(cv)}>
        <TabsList>
          <TabsTrigger value="manuelle">Édition manuelle</TabsTrigger>
          <TabsTrigger value="ia" disabled={!consent}>Édition IA</TabsTrigger>
        </TabsList>

        <TabsContent value="manuelle" className="mt-4">
          <Card>
            <CardHeader><h3 className="text-base">Modifier ton CV</h3></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 border border-border rounded-lg p-3">
                <CvFieldsEditor cv={draftCv} onChange={setDraftCv} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" disabled={!draftDirty} onClick={saveManual}>Enregistrer</Button>
                <Button variant="ghost" size="sm" disabled={!draftDirty} onClick={resetDraft}>Annuler</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia" className="mt-4">
          <Card>
            <CardHeader>
              <h3 className="text-base">Propositions de l'IA</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Reformulations de wording, jamais une refonte du profil. Chaque proposition attend ta validation, champ par champ.</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {suggestions.length === 0 && (
                <p className="text-sm text-muted-foreground">Aucune proposition pour l'instant, ton CV est déjà bien formulé.</p>
              )}
              {suggestions.map((s) => (
                <div key={s.id} className="rounded-lg border border-border p-4 flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">{s.fieldLabel}</p>
                  <p className="text-sm text-muted-foreground line-through">{s.before}</p>
                  <p className="text-sm">{s.after}</p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={() => acceptSuggestion(s.id, s.fieldLabel, s.apply)}>Accepter</Button>
                    <Button size="sm" variant="ghost" onClick={() => dismissSuggestion(s.id)}>Ignorer</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader><h3 className="text-base">Historique des versions</h3></CardHeader>
        <CardContent className="flex flex-col gap-1">
          {history.map((h) => (
            <button
              key={h.id}
              onClick={() => setDetailEntry(h)}
              className="flex items-center justify-between text-sm border-b border-border last:border-0 py-3 text-left hover:opacity-80"
            >
              <p className="font-medium">{h.label}</p>
              <span className="text-xs text-muted-foreground flex-none pl-4">{h.date}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!detailEntry} onOpenChange={(open) => !open && setDetailEntry(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {detailEntry && (
            <div className="flex flex-col gap-5">
              <DialogHeader className="text-left sm:text-left">
                <DialogTitle>{detailEntry.label}</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground -mt-3">{detailEntry.date}</p>
              <CvSummary cv={detailEntry.cv} />
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => { onUpdateCv(detailEntry.cv, `Version restaurée : ${detailEntry.label}`); setDetailEntry(null); }}
              >
                Restaurer cette version
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
