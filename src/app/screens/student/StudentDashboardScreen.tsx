import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { StatusPill } from '../../components/product/StatusPill';
import {
  CANDIDATURES, OFFERS, EXTERNAL_OFFERS, STUDENTS, COACHES,
  CURRENT_STUDENT_ID, type Offer, type Conversation,
} from '../../lib/mock-data';
import { useSkillVocabulary } from '../../lib/skill-vocabulary';
import { analyzeOfferText } from '../../lib/text-analysis';
import { extractPdfText } from '../../lib/pdf-extract';
import { buildExternalOffer } from './CatalogueScreen';

const ALL_OFFERS = [...OFFERS, ...EXTERNAL_OFFERS];
const CURRENT_STUDENT = STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID)!;
const MY_COACH = COACHES.find((c) => c.id === CURRENT_STUDENT.coachId)!;

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function StudentDashboardScreen({
  onAddExternalOffer,
  conversations,
  onOpenMessagerie,
}: {
  onAddExternalOffer: (offer: Offer) => void;
  conversations: Conversation[];
  onOpenMessagerie: () => void;
}) {
  const myCandidatures = CANDIDATURES.filter((c) => c.studentId === CURRENT_STUDENT_ID);
  const rows = myCandidatures.map((c) => ({ c, offer: ALL_OFFERS.find((o) => o.id === c.offerId)! })).filter((r) => r.offer);

  const myConversation = conversations.find((c) => c.studentId === CURRENT_STUDENT_ID);
  const lastMessage = myConversation?.messages[myConversation.messages.length - 1];

  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [checking, setChecking] = useState(false);
  const { vocabulary } = useSkillVocabulary();
  const canCheck = text.trim().length > 0 || !!file;

  const check = async () => {
    if (!canCheck) return;
    setChecking(true);
    try {
      const content = file ? await extractPdfText(file) : text;
      const analysis = analyzeOfferText(content, vocabulary);
      setChecking(false);
      setText('');
      setFile(null);
      onAddExternalOffer(buildExternalOffer(analysis));
    } catch {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Ton activité de recherche, sans jamais te noter.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{myCandidatures.length}</p><p className="text-xs text-muted-foreground mt-1">Candidatures ce mois-ci</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{myCandidatures.filter(c => c.status === 'entretien' || c.status === 'reponse').length}</p><p className="text-xs text-muted-foreground mt-1">Entretiens obtenus</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="font-mono text-3xl font-semibold">{OFFERS.filter(o => o.score >= 75).length}</p><p className="text-xs text-muted-foreground mt-1">Bons matchs au catalogue</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base">Vérifier une offre externe</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Colle un texte ou dépose un PDF, sans changer d'écran.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Tabs defaultValue="texte">
            <TabsList>
              <TabsTrigger value="texte">Texte</TabsTrigger>
              <TabsTrigger value="pdf">Fichier PDF</TabsTrigger>
            </TabsList>
            <TabsContent value="texte" className="mt-3">
              <Textarea
                placeholder="Colle le texte de l'offre (mail, description...)"
                value={text}
                onChange={(e) => { setText(e.target.value); setFile(null); }}
              />
            </TabsContent>
            <TabsContent value="pdf" className="mt-3">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  id="dashboard-offre-externe-pdf"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setText(''); } }}
                />
                <Button type="button" variant="outline" onClick={() => fileInput.current?.click()}>Choisir un PDF</Button>
                <span className="text-sm text-muted-foreground truncate">{file?.name || 'Aucun fichier sélectionné'}</span>
              </div>
            </TabsContent>
          </Tabs>
          <Button onClick={check} disabled={checking || !canCheck} className="w-fit">{checking ? 'Analyse…' : 'Vérifier'}</Button>
          <p className="text-xs text-muted-foreground">Usage privé : ces offres ne rejoignent jamais le catalogue de l'école. Retrouve-les aussi dans l'onglet "Offres externes".</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-base">Mes candidatures</h3></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">Aucune candidature pour l'instant.</p>}
          {rows.map(({ c, offer }) => (
            <div key={offer.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">{offer.title}</p>
                <p className="text-xs text-muted-foreground">{offer.company} · mise à jour le {c.updatedAt}</p>
              </div>
              <StatusPill status={c.status} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <h3 className="text-base">Messages</h3>
          <Button variant="ghost" size="sm" onClick={onOpenMessagerie}>Ouvrir la messagerie</Button>
        </CardHeader>
        <CardContent>
          {!lastMessage ? (
            <p className="text-sm text-muted-foreground">Aucun message pour l'instant.</p>
          ) : (
            <button onClick={onOpenMessagerie} className="flex items-center gap-3 w-full text-left hover:opacity-80">
              <div className="size-8 flex-none rounded-full bg-secondary text-[11px] font-medium flex items-center justify-center">
                {initials(MY_COACH.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{MY_COACH.name}</p>
                <p className="text-xs text-muted-foreground truncate">{lastMessage.text}</p>
              </div>
              <div className="flex-none flex items-center gap-2">
                {lastMessage.from === 'coach' && <span className="size-2 rounded-full bg-primary" />}
                <span className="text-xs text-muted-foreground">{lastMessage.time}</span>
              </div>
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
