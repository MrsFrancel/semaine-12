import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { COACHES as INITIAL_COACHES, STUDENTS, type Coach } from '../../../lib/mock-data';

interface PendingInvite {
  id: number;
  email: string;
  sentAt: string;
}

let nextCoachId = 900;
let nextInviteId = 1;

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] || email;
  return local.split('.').filter(Boolean).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || email;
}

export function CoachsScreen() {
  const [coaches, setCoaches] = useState<Coach[]>(INITIAL_COACHES);
  const [pending, setPending] = useState<PendingInvite[]>([]);
  const [invite, setInvite] = useState('');

  const send = () => {
    if (!invite.trim()) return;
    setPending((p) => [...p, { id: nextInviteId++, email: invite.trim(), sentAt: "à l'instant" }]);
    setInvite('');
  };

  const resend = (id: number) => setPending((p) => p.map((x) => x.id === id ? { ...x, sentAt: "à l'instant (renvoyée)" } : x));
  const cancel = (id: number) => setPending((p) => p.filter((x) => x.id !== id));

  const accept = (invite: PendingInvite) => {
    const newCoach: Coach = { id: nextCoachId++, name: nameFromEmail(invite.email), email: invite.email, studentsCount: 0, avgInactive: 0 };
    setCoaches((c) => [...c, newCoach]);
    setPending((p) => p.filter((x) => x.id !== invite.id));
  };

  const remove = (id: number) => setCoaches((c) => c.filter((x) => x.id !== id));

  const [openCoach, setOpenCoach] = useState<Coach | null>(null);
  const assignedStudents = openCoach ? STUDENTS.filter((s) => s.coachId === openCoach.id) : [];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Coachs</h2>
        <p className="text-muted-foreground text-sm mt-1">Stats agrégées et gestion des accès. C'est l'admin qui décide qui devient coach.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Inviter un coach</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input placeholder="prenom.nom@hetic.fr" value={invite} onChange={(e) => setInvite(e.target.value)} />
            <Button onClick={send}>Inviter</Button>
          </div>
        </CardContent>
      </Card>

      {pending.length > 0 && (
        <Card>
          <CardHeader><h3 className="text-base">Invitations en attente ({pending.length})</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pending.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{p.email}</p>
                  <p className="text-xs text-muted-foreground">Envoyée {p.sentAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => resend(p.id)}>Renvoyer</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => cancel(p.id)}>Annuler</Button>
                  <Button variant="outline" size="sm" onClick={() => accept(p)}>Simuler l'acceptation</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><h3 className="text-base">Coachs actifs ({coaches.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {coaches.length === 0 && <p className="text-sm text-muted-foreground">Aucun coach actif pour l'instant. Invite quelqu'un ci-dessus.</p>}
          {coaches.map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.email}</p>
                </div>
                {c.studentsCount === 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-wide bg-accent text-accent-foreground px-2 py-0.5 rounded">Nouveau</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-xs text-muted-foreground">
                  {c.studentsCount === 0 ? (
                    <p>Aucun étudiant assigné pour l'instant</p>
                  ) : (
                    <>
                      <p>{c.studentsCount} étudiants</p>
                      <p>{c.avgInactive}j inactivité moy.</p>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setOpenCoach(c)}>Voir les étudiants</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(c.id)}>Retirer</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!openCoach} onOpenChange={(open) => !open && setOpenCoach(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Étudiants de {openCoach?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 text-sm">
            {assignedStudents.length === 0 && (
              <p className="text-muted-foreground">Aucun étudiant assigné pour l'instant.</p>
            )}
            {assignedStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.candidatures} candidatures, {s.entretiens} entretiens</p>
                </div>
                <span className="text-xs text-muted-foreground">{s.inactiveDays === 0 ? 'Actif' : `${s.inactiveDays}j inactif`}</span>
              </div>
            ))}
            {openCoach && openCoach.studentsCount > assignedStudents.length && (
              <p className="text-xs text-muted-foreground pt-1">
                {openCoach.studentsCount} étudiants au total pour ce coach, dont {assignedStudents.length} affichés ici (échantillon de démonstration).
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
