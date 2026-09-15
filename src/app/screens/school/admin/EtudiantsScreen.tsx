import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { STUDENTS, COACHES } from '../../../lib/mock-data';

export function EtudiantsScreen() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="font-serif text-2xl">Étudiants</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue globale, tous coachs confondus. L'assignation est automatique, ajustable ici si besoin.</p>
      </div>
      <Card>
        <CardHeader><h3 className="font-serif text-base">Tous les étudiants ({STUDENTS.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {STUDENTS.map((s) => (
            <div key={s.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.promo}</p>
              </div>
              <div className="flex items-center gap-4">
                <select defaultValue={COACHES[s.id % COACHES.length].id} className="text-xs border border-border rounded-md bg-input-background px-2 py-1">
                  {COACHES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <span className="text-xs text-muted-foreground w-16 text-right">{s.inactiveDays === 0 ? 'Actif' : `${s.inactiveDays}j inactif`}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
