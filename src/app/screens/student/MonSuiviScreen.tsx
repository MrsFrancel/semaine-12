import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import {
  STUDENTS, COACHES, EVENT_TYPES, WEEK_DAYS, WEEK_TIMES,
  CURRENT_STUDENT_ID, type Conversation, type Rdv,
  RDVS as INITIAL_RDVS,
} from '../../lib/mock-data';

const CURRENT_STUDENT = STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID)!;
const MY_COACH = COACHES.find((c) => c.id === CURRENT_STUDENT.coachId)!;

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

let nextRdvId = 1000;

export function MonSuiviScreen({
  conversations,
  onConversationsChange,
}: {
  conversations: Conversation[];
  onConversationsChange: (cs: Conversation[]) => void;
}) {
  const [rdvs, setRdvs] = useState<Rdv[]>(INITIAL_RDVS);
  const myRdvs = rdvs.filter((r) => r.studentId === CURRENT_STUDENT_ID);
  const coachRdvs = rdvs.filter((r) => r.coachId === MY_COACH.id);
  const activeEventTypes = EVENT_TYPES.filter((e) => e.active);
  const [selectedType, setSelectedType] = useState<number>(activeEventTypes[0]?.id ?? EVENT_TYPES[0].id);

  const bookSlot = (day: string, time: string) => {
    setRdvs((r) => [...r, { id: nextRdvId++, coachId: MY_COACH.id, studentId: CURRENT_STUDENT_ID, eventTypeId: selectedType, day, time }]);
  };
  const cancelRdv = (id: number) => setRdvs((r) => r.filter((x) => x.id !== id));

  const myConversation = conversations.find((c) => c.studentId === CURRENT_STUDENT_ID);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg = { from: 'student' as const, text: draft.trim(), time: "À l'instant" };
    const exists = conversations.some((c) => c.studentId === CURRENT_STUDENT_ID);
    const next = exists
      ? conversations.map((c) => c.studentId === CURRENT_STUDENT_ID ? { ...c, messages: [...c.messages, newMsg] } : c)
      : [...conversations, { studentId: CURRENT_STUDENT_ID, messages: [newMsg] }];
    onConversationsChange(next);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Mon suivi</h2>
        <p className="text-muted-foreground text-sm mt-1">Messagerie avec ton coach et prise de rendez-vous.</p>
      </div>

      <Card>
        <CardHeader><h3 className="text-base">Messagerie &amp; rendez-vous</h3></CardHeader>
        <CardContent>
          <Tabs defaultValue="rdv">
            <TabsList>
              <TabsTrigger value="rdv">Rendez-vous</TabsTrigger>
              <TabsTrigger value="messagerie">Messagerie</TabsTrigger>
            </TabsList>

            <TabsContent value="rdv" className="mt-4 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground">Type de rendez-vous</label>
                <div className="flex flex-wrap gap-2">
                  {activeEventTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`text-left rounded-lg border px-3 py-2 text-sm transition-colors ${selectedType === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                    >
                      <p className="font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.duration} min</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[560px] grid grid-cols-[72px_repeat(5,1fr)] gap-1">
                  <div />
                  {WEEK_DAYS.map((d) => (
                    <div key={d.key} className="text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground pb-1">
                      {d.label.split(' ').slice(0, 2).join(' ')}
                    </div>
                  ))}
                  {WEEK_TIMES.map((time, ti) => (
                    <div key={time} className="contents">
                      <div className="text-right font-mono text-[11px] text-muted-foreground pr-2 flex items-center justify-end">{time}</div>
                      {WEEK_DAYS.map((d, di) => {
                        const mine = myRdvs.find((r) => r.day === d.label && r.time === time);
                        const takenByOther = !mine && coachRdvs.some((r) => r.day === d.label && r.time === time);
                        const blocked = !mine && !takenByOther && (di + ti) % 4 === 0;
                        const eventType = mine ? EVENT_TYPES.find((e) => e.id === mine.eventTypeId) : undefined;
                        const unavailable = takenByOther || blocked;

                        return (
                          <button
                            key={d.key + time}
                            disabled={!!mine || unavailable}
                            onClick={() => !mine && !unavailable && bookSlot(d.label, time)}
                            className={`h-11 rounded-md text-[10px] leading-tight px-1.5 flex flex-col items-center justify-center text-center transition-colors ${
                              mine
                                ? 'bg-primary text-primary-foreground cursor-default'
                                : unavailable
                                ? 'bg-secondary text-muted-foreground/60 cursor-default'
                                : 'border border-border bg-card hover:border-primary/50 cursor-pointer'
                            }`}
                          >
                            {mine ? (
                              <>
                                <span className="font-medium truncate w-full">Toi</span>
                                <span className="opacity-80 truncate w-full">{eventType?.label}</span>
                              </>
                            ) : unavailable ? 'Indispo.' : 'Libre'}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono">Mes prochains rendez-vous</p>
                {myRdvs.length === 0 && <p className="text-sm text-muted-foreground">Aucun rendez-vous prévu, réserve un créneau ci-dessus.</p>}
                {myRdvs.map((r) => {
                  const type = EVENT_TYPES.find((e) => e.id === r.eventTypeId);
                  return (
                    <div key={r.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{type?.label}</p>
                        <p className="text-xs text-muted-foreground">{r.day} · {r.time} · {type?.duration} min avec {MY_COACH.name}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => cancelRdv(r.id)}>Annuler</Button>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="messagerie" className="mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="size-8 flex-none rounded-full bg-secondary text-[11px] font-medium flex items-center justify-center">{initials(MY_COACH.name)}</div>
                  <div>
                    <p className="text-sm font-medium">{MY_COACH.name}</p>
                    <p className="text-xs text-muted-foreground">Ton coach</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto py-2">
                  {!myConversation?.messages.length && <p className="text-sm text-muted-foreground">Aucun message pour l'instant.</p>}
                  {myConversation?.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'student' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${m.from === 'student' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.from === 'student' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Écris un message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  />
                  <Button size="sm" onClick={sendMessage} disabled={!draft.trim()}>Envoyer</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
