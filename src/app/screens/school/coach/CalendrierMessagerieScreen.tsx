import { Card, CardContent, CardHeader } from '../../../components/ui/card';

const RDVS = [
  { student: 'Léa Bernard', date: 'Jeudi 6 mars, 14h00', subject: 'Préparation entretien TechCorp' },
  { student: 'Jefté Moïse', date: 'Vendredi 7 mars, 10h30', subject: 'Point de suivi mensuel' },
];

const THREADS = [
  { student: 'Ahn Nguyen', last: 'Merci pour la relecture de mon CV !' },
  { student: 'Hugo Martin', last: 'Je peux avoir un créneau cette semaine ?' },
];

export function CalendrierMessagerieScreen() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Calendrier &amp; messagerie</h2>
        <p className="text-muted-foreground text-sm mt-1">Tes disponibilités et tes échanges, au même endroit.</p>
      </div>
      <Card>
        <CardHeader><h3 className="text-base">Prochains rendez-vous</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {RDVS.map((r) => (
            <div key={r.student} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{r.student}</p>
                <p className="text-xs text-muted-foreground">{r.subject}</p>
              </div>
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><h3 className="text-base">Messages récents</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {THREADS.map((t) => (
            <div key={t.student} className="border-b border-border last:border-0 pb-3 last:pb-0">
              <p className="text-sm font-medium">{t.student}</p>
              <p className="text-xs text-muted-foreground">{t.last}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
