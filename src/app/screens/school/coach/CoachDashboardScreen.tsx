import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { InactivityAlert } from '../../../components/product/AlertCard';
import { STUDENTS } from '../../../lib/mock-data';

export function CoachDashboardScreen() {
  const inactive = STUDENTS.filter((s) => s.inactiveDays >= 7);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Tes étudiants, en un coup d'œil — sans saisie de ta part.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{STUDENTS.length}</p><p className="text-xs text-muted-foreground mt-1">Étudiants suivis</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{inactive.length}</p><p className="text-xs text-muted-foreground mt-1">Signaux d'inactivité</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">3</p><p className="text-xs text-muted-foreground mt-1">RDV cette semaine</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><h3 className="text-base">Signaux d'inactivité</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {inactive.length ? inactive.map((s) => <InactivityAlert key={s.id} name={s.name} days={s.inactiveDays} />) : (
            <p className="text-sm text-muted-foreground">Aucun signal — tous tes étudiants sont actifs.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
