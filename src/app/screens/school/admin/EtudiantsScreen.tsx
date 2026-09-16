import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { useCvPreview, CvPreviewDialogs } from '../../../components/product/CvPreview';
import { STUDENTS as INITIAL_STUDENTS, COACHES } from '../../../lib/mock-data';

export function EtudiantsScreen() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const cvPreview = useCvPreview();

  const reassign = (studentId: number, coachId: number) => {
    setStudents((list) => list.map((s) => s.id === studentId ? { ...s, coachId } : s));
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-2xl">Étudiants</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue globale, tous coachs confondus. L'assignation est automatique, ajustable ici si besoin.</p>
      </div>
      <Card>
        <CardHeader><h3 className="text-base">Tous les étudiants ({students.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-1 overflow-x-auto">
          <div className="min-w-[520px] flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_180px_90px_70px] gap-3 px-1 pb-2 border-b border-border font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              <span>Étudiant</span>
              <span>Coach</span>
              <span className="text-right">Activité</span>
              <span className="text-right">CV</span>
            </div>
            {students.map((s) => (
              <div key={s.id} className="grid grid-cols-[1fr_180px_90px_70px] gap-3 items-center border-b border-border last:border-0 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.promo}</p>
                </div>
                <select
                  value={s.coachId}
                  onChange={(e) => reassign(s.id, Number(e.target.value))}
                  className="text-xs border border-input rounded-md bg-input-background px-2 py-1.5"
                >
                  {COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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
