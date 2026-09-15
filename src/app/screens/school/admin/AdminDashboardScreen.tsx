import { Card, CardContent } from '../../../components/ui/card';
import { STUDENTS, COACHES, OFFERS } from '../../../lib/mock-data';

export function AdminDashboardScreen() {
  const avgInactive = (STUDENTS.reduce((s, x) => s + x.inactiveDays, 0) / STUDENTS.length).toFixed(1);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'école — consultation passive, aucune saisie requise.</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-3xl font-semibold">{STUDENTS.length}</p><p className="text-xs text-muted-foreground mt-1">Étudiants actifs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-3xl font-semibold">{COACHES.length}</p><p className="text-xs text-muted-foreground mt-1">Coachs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-3xl font-semibold">{OFFERS.length}</p><p className="text-xs text-muted-foreground mt-1">Offres exclusives publiées</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-3xl font-semibold">{avgInactive}j</p><p className="text-xs text-muted-foreground mt-1">Inactivité moyenne</p></CardContent></Card>
      </div>
    </div>
  );
}
