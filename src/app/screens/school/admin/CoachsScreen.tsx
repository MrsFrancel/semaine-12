import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { COACHES as INITIAL_COACHES } from '../../../lib/mock-data';

export function CoachsScreen() {
  const [coaches, setCoaches] = useState(INITIAL_COACHES);
  const [invite, setInvite] = useState('');
  const [invited, setInvited] = useState<string[]>([]);

  const send = () => {
    if (!invite.trim()) return;
    setInvited((l) => [...l, invite.trim()]);
    setInvite('');
  };

  const remove = (id: number) => setCoaches((c) => c.filter((x) => x.id !== id));

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl">Coachs</h2>
        <p className="text-muted-foreground text-sm mt-1">Stats agrégées et gestion des accès — l'admin décide qui devient coach.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Inviter un coach</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input placeholder="prenom.nom@hetic.fr" value={invite} onChange={(e) => setInvite(e.target.value)} />
            <Button onClick={send}>Inviter</Button>
          </div>
          {invited.length > 0 && <p className="text-xs text-muted-foreground">Invitation{invited.length > 1 ? 's' : ''} envoyée{invited.length > 1 ? 's' : ''} : {invited.join(', ')}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Coachs actifs ({coaches.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {coaches.length === 0 && <p className="text-sm text-muted-foreground">Aucun coach actif — invite quelqu'un ci-dessus.</p>}
          {coaches.map((c) => (
            <div key={c.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-xs text-muted-foreground">
                  <p>{c.studentsCount} étudiants</p>
                  <p>{c.avgInactive}j inactivité moy.</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => remove(c.id)}>Retirer</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
