import { useState, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { STUDENTS, type Student, softSkillsFor, studentEmail, studentPhone, promoYear } from '../../../lib/mock-data';

type Step = 'reception' | 'traitement' | 'apercu' | 'classement';

function scoreFor(student: Student): number {
  // pseudo-score déterministe basé sur l'id, pour une démo stable
  const base = (student.id * 37) % 43;
  return Math.max(38, 96 - base);
}

export function CvBookScreen() {
  const [step, setStep] = useState<Step>('reception');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [fullStudent, setFullStudent] = useState<Student | null>(null);

  const canImport = text.trim().length > 0 || fileName.length > 0;

  const startImport = () => {
    setStep('traitement');
    setTimeout(() => setStep('apercu'), 900);
  };

  const ranked = [...STUDENTS].map((s) => ({ student: s, score: scoreFor(s) })).sort((a, b) => b.score - a.score);
  const toggle = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">CV Book</h2>
        <p className="text-muted-foreground text-sm mt-1">Une entreprise vous transmet une offre : on classe toute la base étudiante par pertinence.</p>
      </div>

      {step !== 'classement' && (
        <Card>
          <CardHeader><h3 className="text-base">Offre reçue</h3></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {step === 'reception' && (
              <>
                <Tabs defaultValue="texte">
                  <TabsList>
                    <TabsTrigger value="texte">Lien ou texte</TabsTrigger>
                    <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
                  </TabsList>
                  <TabsContent value="texte" className="mt-3">
                    <Textarea placeholder="Colle le lien, le mail ou le texte transmis par l'entreprise" value={text} onChange={(e) => { setText(e.target.value); setFileName(''); }} />
                  </TabsContent>
                  <TabsContent value="pdf" className="mt-3">
                    <div className="flex items-center gap-3">
                      <input ref={fileInput} type="file" accept="application/pdf" className="hidden" id="cvbook-pdf"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFileName(f.name); setText(''); } }} />
                      <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                      <span className="text-sm text-muted-foreground">{fileName || 'Aucun fichier sélectionné'}</span>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button onClick={startImport} disabled={!canImport} className="w-fit">Analyser l'offre</Button>
              </>
            )}
            {step === 'traitement' && <p className="text-sm text-muted-foreground py-4">Extraction de l'offre en cours…</p>}
            {step === 'apercu' && (
              <>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium">Chargé(e) de Communication Digitale</p>
                  <p className="text-xs text-muted-foreground mt-1">Entreprise partenaire · Contrat non précisé</p>
                  <p className="text-xs text-muted-foreground mt-2">Compétences recherchées : Copywriting, Canva, Marketing digital, Réseaux sociaux</p>
                </div>
                <Button onClick={() => setStep('classement')} className="w-fit">Classer les profils sur cette offre</Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {step === 'classement' && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <h3 className="text-base">Profils classés par pertinence ({ranked.length})</h3>
            <Button variant="ghost" size="sm" onClick={() => { setStep('reception'); setText(''); setFileName(''); setSelected([]); }}>Nouvelle offre</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {ranked.map(({ student, score }) => (
              <div key={student.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <label className="flex items-center gap-3 cursor-pointer min-w-0">
                  <input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggle(student.id)} className="accent-primary flex-none" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{student.promo}</p>
                  </div>
                </label>
                <div className="flex items-center gap-3 flex-none">
                  <span className="font-mono text-sm text-primary font-semibold">{score}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewStudent(student)}>Voir le CV</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-fit mt-1" disabled={!selected.length}>
              Télécharger {selected.length || ''} CV sélectionné{selected.length > 1 ? 's' : ''}
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!previewStudent} onOpenChange={(open) => !open && setPreviewStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewStudent?.name}</DialogTitle>
          </DialogHeader>
          {previewStudent && (
            <div className="flex flex-col gap-3 text-sm">
              <p className="text-muted-foreground">{previewStudent.promo}</p>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Formation</p>
                <p>{previewStudent.cv.formation}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compétences</p>
                <div className="flex flex-wrap gap-1.5">
                  {previewStudent.cv.hardSkills.map((s) => (
                    <span key={s} className="font-mono text-[11px] bg-secondary px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expérience</p>
                <p>{previewStudent.cv.experience}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-fit mt-1"
                onClick={() => { setFullStudent(previewStudent); setPreviewStudent(null); }}
              >
                Voir le CV complet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!fullStudent} onOpenChange={(open) => !open && setFullStudent(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {fullStudent && (
            <div className="flex flex-col gap-5 text-sm">
              <div>
                <DialogHeader className="text-left sm:text-left">
                  <DialogTitle className="text-xl">{fullStudent.name}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mt-1">{fullStudent.cv.formation} · {fullStudent.promo}</p>
                <p className="font-mono text-xs text-muted-foreground mt-2">{studentEmail(fullStudent)} · {studentPhone(fullStudent)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Formation</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between"><span>{fullStudent.cv.formation}</span><span className="text-muted-foreground">{promoYear(fullStudent)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Baccalauréat général</span><span>{Number(promoYear(fullStudent)) - 3}</span></div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Expérience</p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-medium">{fullStudent.cv.experience}</p>
                  </div>
                  <div>
                    <p className="font-medium">Projet fil rouge — HETIC ({promoYear(fullStudent)})</p>
                    <p className="text-muted-foreground text-xs mt-0.5">Conception d'une stratégie marketing digital pour une marque fictive, en groupe de 4.</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Compétences techniques</p>
                <div className="flex flex-wrap gap-1.5">
                  {fullStudent.cv.hardSkills.map((s) => (
                    <span key={s} className="font-mono text-[11px] bg-secondary px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Savoir-être</p>
                <div className="flex flex-wrap gap-1.5">
                  {softSkillsFor(fullStudent).map((s) => (
                    <span key={s} className="font-mono text-[11px] border border-border px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-mono">Langues</p>
                <p>Français (natif) · Anglais (professionnel)</p>
              </div>

              <Button variant="outline" size="sm" className="w-fit">Télécharger le CV</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
