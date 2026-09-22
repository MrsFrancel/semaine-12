import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { StatusPill } from '../../../components/product/StatusPill';
import { useCvPreview, CvPreviewDialogs } from '../../../components/product/CvPreview';
import { STUDENTS, CURRENT_COACH_ID, CANDIDATURES, EXTERNAL_OFFERS, type Offer, type Student } from '../../../lib/mock-data';

const mine = STUDENTS.filter((s) => s.coachId === CURRENT_COACH_ID);

export function MesEtudiantsScreen({
  offers,
  onMessageStudent,
  onProposeRdv,
}: {
  offers: Offer[];
  onMessageStudent: (studentId: number) => void;
  onProposeRdv: () => void;
}) {
  const [open, setOpen] = useState<Student | null>(null);
  const cvPreview = useCvPreview();
  const allOffers = [...offers, ...EXTERNAL_OFFERS];

  if (open) {
    const candidatures = CANDIDATURES
      .filter((c) => c.studentId === open.id)
      .map((c) => ({ c, offer: allOffers.find((o) => o.id === c.offerId)! }))
      .filter((r) => r.offer);
    const entretiensCount = candidatures.filter(({ c }) => c.status === 'entretien' || c.status === 'reponse').length;
    const bonsMatchs = allOffers.filter((o) => o.score >= 75).length;

    return (
      <div className="flex flex-col gap-6 max-w-2xl">
        <button onClick={() => setOpen(null)} className="text-sm text-muted-foreground hover:text-foreground w-fit">← Retour à mes étudiants</button>
        <div>
          <h2 className="text-2xl">{open.name}</h2>
          <p className="text-muted-foreground text-sm mt-1">{open.promo}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{candidatures.length}</p><p className="text-xs text-muted-foreground mt-1">Candidatures</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{entretiensCount}</p><p className="text-xs text-muted-foreground mt-1">Entretiens</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{bonsMatchs}</p><p className="text-xs text-muted-foreground mt-1">Bons matchs au catalogue</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="font-mono text-2xl font-semibold">{open.lastActivity}</p><p className="text-xs text-muted-foreground mt-1">Dernière activité</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><h3 className="text-base">Candidatures</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {candidatures.length === 0 && <p className="text-sm text-muted-foreground">Aucune candidature enregistrée pour l'instant.</p>}
            {candidatures.map(({ c, offer }) => (
              <div key={offer.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{offer.title}</p>
                  <p className="text-xs text-muted-foreground">{offer.company}, mise à jour le {c.updatedAt}</p>
                </div>
                <StatusPill status={c.status} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className="text-base">Messagerie</h3></CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => onMessageStudent(open.id)}>Envoyer un message</Button>
            <Button variant="ghost" size="sm" onClick={onProposeRdv}>Proposer un rendez-vous</Button>
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
        <CardHeader><h3 className="text-base">Tes étudiants ({mine.length})</h3></CardHeader>
        <CardContent className="flex flex-col gap-1 overflow-x-auto">
          <div className="min-w-[520px] flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_90px_90px_70px] gap-3 px-1 pb-2 border-b border-border font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              <span>Étudiant</span>
              <span className="text-right">Activité</span>
              <span className="text-right">Fiche</span>
              <span className="text-right">CV</span>
            </div>
            {mine.map((s) => {
              const studentCandidatures = CANDIDATURES.filter((c) => c.studentId === s.id);
              const studentEntretiens = studentCandidatures.filter((c) => c.status === 'entretien' || c.status === 'reponse').length;
              return (
                <div key={s.id} className="grid grid-cols-[1fr_90px_90px_70px] gap-3 items-center border-b border-border last:border-0 py-3">
                  <button onClick={() => setOpen(s)} className="text-left hover:opacity-80 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{studentCandidatures.length} candidatures, {studentEntretiens} entretiens</p>
                  </button>
                  <span className="text-xs text-muted-foreground text-right">{s.inactiveDays === 0 ? 'Actif' : `${s.inactiveDays}j inactif`}</span>
                  <Button variant="ghost" size="sm" className="justify-self-end" onClick={() => setOpen(s)}>Fiche</Button>
                  <Button variant="ghost" size="sm" className="justify-self-end" onClick={() => cvPreview.setPreviewStudent(s)}>Voir</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CvPreviewDialogs {...cvPreview} />
    </div>
  );
}
