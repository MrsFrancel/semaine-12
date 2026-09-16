import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { InactivityAlert } from '../../../components/product/AlertCard';
import { STUDENTS, RDVS, EVENT_TYPES, CURRENT_COACH_ID } from '../../../lib/mock-data';

const mine = STUDENTS.filter((s) => s.coachId === CURRENT_COACH_ID);
const myRdvs = RDVS.filter((r) => r.coachId === CURRENT_COACH_ID);

const totalCandidatures = mine.reduce((s, x) => s + x.candidatures, 0);
const totalEntretiens = mine.reduce((s, x) => s + x.entretiens, 0);
const tauxEntretien = totalCandidatures ? Math.round((totalEntretiens / totalCandidatures) * 100) : 0;

const chartData = [...mine]
  .sort((a, b) => b.candidatures - a.candidatures)
  .slice(0, 6)
  .map((s) => ({ name: s.name.split(' ')[0], candidatures: s.candidatures, entretiens: s.entretiens }));

const inactive = [...mine].filter((s) => s.inactiveDays >= 7).sort((a, b) => b.inactiveDays - a.inactiveDays);
const topByEntretiens = [...mine].sort((a, b) => b.entretiens - a.entretiens)[0];
const mostActive = [...mine].sort((a, b) => b.candidatures - a.candidatures)[0];

const nextRdv = myRdvs[0];
const nextRdvStudent = nextRdv ? mine.find((s) => s.id === nextRdv.studentId) : undefined;
const nextRdvType = nextRdv ? EVENT_TYPES.find((e) => e.id === nextRdv.eventTypeId) : undefined;

const ACTIVITY = [
  ...(topByEntretiens ? [{ text: `${topByEntretiens.name} a obtenu un entretien`, when: 'il y a 3h' }] : []),
  ...(nextRdvStudent ? [{ text: `RDV confirmé avec ${nextRdvStudent.name} : ${nextRdvType?.label}`, when: 'il y a 5h' }] : []),
  ...(inactive[0] ? [{ text: `${inactive[0].name} signalé pour inactivité (${inactive[0].inactiveDays}j sans candidature)`, when: 'hier' }] : []),
  ...(mostActive ? [{ text: `${mostActive.name} a envoyé ${mostActive.candidatures} candidatures ce mois-ci`, when: 'il y a 2 jours' }] : []),
];

export function CoachDashboardScreen() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Tes étudiants, en un coup d'œil. Rien à saisir de ton côté.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{mine.length}</p><p className="text-xs text-muted-foreground mt-1">Étudiants suivis</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{totalEntretiens}</p><p className="text-xs text-muted-foreground mt-1">Entretiens obtenus</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{inactive.length}</p><p className="text-xs text-muted-foreground mt-1">Signaux d'inactivité</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{myRdvs.length}</p><p className="text-xs text-muted-foreground mt-1">RDV à venir</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        <Card>
          <CardHeader className="flex-row items-baseline justify-between">
            <h3 className="text-base">Candidatures &amp; entretiens par étudiant</h3>
            <p className="font-mono text-sm text-primary font-semibold">{tauxEntretien}% de taux d'entretien</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                  cursor={{ fill: 'var(--secondary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="candidatures" name="Candidatures" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive={false} />
                <Bar dataKey="entretiens" name="Entretiens" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><h3 className="text-base">Signaux d'inactivité</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {inactive.length === 0 && <p className="text-sm text-muted-foreground">Tous tes étudiants sont actifs, aucun signal à afficher.</p>}
            {inactive.map((s) => <InactivityAlert key={s.id} name={s.name} days={s.inactiveDays} />)}
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
