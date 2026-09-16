import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { InactivityAlert } from '../../../components/product/AlertCard';
import { STUDENTS, COACHES, OFFERS } from '../../../lib/mock-data';

const totalCandidatures = STUDENTS.reduce((s, x) => s + x.candidatures, 0);
const totalEntretiens = STUDENTS.reduce((s, x) => s + x.entretiens, 0);
const tauxEntretien = Math.round((totalEntretiens / totalCandidatures) * 100);

const chartData = COACHES.map((c) => {
  const mine = STUDENTS.filter((s) => s.coachId === c.id);
  return {
    name: c.name.split(' ')[0],
    candidatures: mine.reduce((s, x) => s + x.candidatures, 0),
    entretiens: mine.reduce((s, x) => s + x.entretiens, 0),
  };
});

const mostInactive = [...STUDENTS].filter((s) => s.inactiveDays > 0).sort((a, b) => b.inactiveDays - a.inactiveDays).slice(0, 5);
const topByEntretiens = [...STUDENTS].sort((a, b) => b.entretiens - a.entretiens)[0];

const ACTIVITY = [
  { text: `Offre publiée — ${OFFERS[0].title}, ${OFFERS[0].company}`, when: 'il y a 2h' },
  { text: `${topByEntretiens.name} a obtenu un entretien`, when: 'il y a 6h' },
  { text: `${mostInactive[0]?.name ?? 'Un étudiant'} — ${mostInactive[0]?.inactiveDays ?? 0}j sans candidature, signalé`, when: 'hier' },
  { text: `Offre publiée — ${OFFERS[1].title}, ${OFFERS[1].company}`, when: 'il y a 2 jours' },
  { text: `Bilan mensuel généré pour ${COACHES.length} coachs`, when: 'il y a 3 jours' },
];

export function AdminDashboardScreen() {
  const avgInactive = (STUDENTS.reduce((s, x) => s + x.inactiveDays, 0) / STUDENTS.length).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'école — consultation passive, aucune saisie requise.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{STUDENTS.length}</p><p className="text-xs text-muted-foreground mt-1">Étudiants actifs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{COACHES.length}</p><p className="text-xs text-muted-foreground mt-1">Coachs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{OFFERS.length}</p><p className="text-xs text-muted-foreground mt-1">Offres exclusives publiées</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{avgInactive}j</p><p className="text-xs text-muted-foreground mt-1">Inactivité moyenne</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4 items-start">
        <Card>
          <CardHeader className="flex-row items-baseline justify-between">
            <h3 className="text-base">Candidatures &amp; entretiens par coach</h3>
            <p className="font-mono text-sm text-primary font-semibold">{tauxEntretien}% de taux d'entretien</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  cursor={{ fill: 'var(--secondary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="candidatures" name="Candidatures" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={64} isAnimationActive={false} />
                <Bar dataKey="entretiens" name="Entretiens" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={64} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-base">Signaux d'inactivité</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mostInactive.length === 0 && <p className="text-sm text-muted-foreground">Aucun signal — tous les étudiants sont actifs.</p>}
            {mostInactive.map((s) => <InactivityAlert key={s.id} name={s.name} days={s.inactiveDays} />)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Activité récente</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 text-sm">
              <span>{a.text}</span>
              <span className="text-xs text-muted-foreground flex-none pl-4">{a.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
