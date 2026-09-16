import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useCvPreview, CvPreviewDialogs } from '../../../components/product/CvPreview';
import { STUDENTS, CURRENT_COACH_ID, type Student } from '../../../lib/mock-data';

const mine = STUDENTS.filter((s) => s.coachId === CURRENT_COACH_ID);

export function MesEtudiantsScreen({
  onMessageStudent,
  onProposeRdv,
}: {
  onMessageStudent: (studentId: number) => void;
  onProposeRdv: () => void;
}) {
  const [open, setOpen] = useState<Student | null>(null);
  const cvPreview = useCvPreview();

  if (open) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <button onClick={() => setOpen(null)} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour à mes étudiants</button>
        <div>
          <h2 className="text-2xl">{open.name}</h2>
          <p className="text-muted-foreground text-sm mt-1">{open.promo}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.candidatures}</p><p className="text-xs text-muted-foreground mt-1">Candidatures</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.entretiens}</p><p className="text-xs text-muted-foreground mt-1">Entretiens</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.lastActivity}</p><p className="text-xs text-muted-foreground mt-1">Dernière activité</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><h3 className="text-base">Messagerie</h3></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => onMessageStudent(open.id)}>Envoyer un message</Button>
            <Button variant="ghost" size="sm" onClick={onProposeRdv}>Proposer un rendez-vous</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Mes étudiants</h2>
        <p className="text-muted-foreground text-sm mt-1">Dashboard, messagerie et inactivité, par étudiant.</p>
      </div>
      <Card>
        <CardHeader><h3 className="text-base">Tes étudiants ({mine.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-1 overflow-x-auto">
          <div className="min-w-[420px] flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_90px_70px] gap-3 px-1 pb-2 border-b border-border font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              <span>Étudiant</span>
              <span className="text-right">Activité</span>
              <span className="text-right">CV</span>
            </div>
            {mine.map((s) => (
              <div key={s.id} className="grid grid-cols-[1fr_90px_70px] gap-3 items-center border-b border-border last:border-0 py-3">
                <button onClick={() => setOpen(s)} className="text-left hover:opacity-80 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.candidatures} candidatures · {s.entretiens} entretiens</p>
                </button>
                <span className="text-xs text-muted-foreground text-right">{s.inactiveDays === 0 ? 'Actif' : `${s.inactiveDays}j inactif`}</span>
                <Button variant="ghost" size="sm" className="justify-self-end" onClick={() => cvPreview.setPreviewStudent(s)}>Voir</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CvPreviewDialogs {...cvPreview} />
    </div>
  );
}
