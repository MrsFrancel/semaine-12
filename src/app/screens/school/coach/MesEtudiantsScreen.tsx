import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { STUDENTS, type Student } from '../../../lib/mock-data';

export function MesEtudiantsScreen() {
  const [open, setOpen] = useState<Student | null>(null);

  if (open) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <button onClick={() => setOpen(null)} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour à mes étudiants</button>
        <div>
          <h2 className="text-2xl">{open.name}</h2>
          <p className="text-muted-foreground text-sm mt-1">{open.promo}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.candidatures}</p><p className="text-xs text-muted-foreground mt-1">Candidatures</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.entretiens}</p><p className="text-xs text-muted-foreground mt-1">Entretiens</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.lastActivity}</p><p className="text-xs text-muted-foreground mt-1">Dernière activité</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><h3 className="text-base">Messagerie</h3></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" size="sm">Envoyer un message</Button>
            <Button variant="ghost" size="sm">Proposer un rendez-vous</Button>
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
        <CardContent className="pt-6 flex flex-col gap-3">
          {STUDENTS.map((s) => (
            <button key={s.id} onClick={() => setOpen(s)} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0 text-left hover:opacity-80">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.candidatures} candidatures · {s.entretiens} entretiens</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.inactiveDays === 0 ? 'Actif' : `${s.inactiveDays}j inactif`}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
