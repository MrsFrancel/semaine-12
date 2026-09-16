import { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { type Student, softSkillsFor, studentEmail, studentPhone, promoYear } from '../../lib/mock-data';

export function useCvPreview() {
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [fullStudent, setFullStudent] = useState<Student | null>(null);
  return { previewStudent, setPreviewStudent, fullStudent, setFullStudent };
}

export function CvPreviewDialogs({
  previewStudent, setPreviewStudent, fullStudent, setFullStudent,
}: ReturnType<typeof useCvPreview>) {
  return (
    <>
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
    </>
  );
}
