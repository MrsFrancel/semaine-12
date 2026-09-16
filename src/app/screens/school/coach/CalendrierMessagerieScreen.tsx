import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { STUDENTS, RDVS, EVENT_TYPES, CONVERSATIONS, CURRENT_COACH_ID, type Conversation } from '../../../lib/mock-data';

const mine = STUDENTS.filter((s) => s.coachId === CURRENT_COACH_ID);
const myRdvs = RDVS.filter((r) => r.coachId === CURRENT_COACH_ID);

const DAYS = [
  { key: 'lun', label: 'Lundi 10 mars' },
  { key: 'mar', label: 'Mardi 11 mars' },
  { key: 'mer', label: 'Mercredi 12 mars' },
  { key: 'jeu', label: 'Jeudi 13 mars' },
  { key: 'ven', label: 'Vendredi 14 mars' },
];
const TIMES = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

type SlotStatus = 'free' | 'blocked' | 'booked';
interface Slot { status: SlotStatus; studentId?: number; eventTypeId?: number; }

function buildInitialSlots(): Record<string, Slot> {
  const slots: Record<string, Slot> = {};
  DAYS.forEach((d, di) => {
    TIMES.forEach((t, ti) => {
      const key = `${d.key}-${t}`;
      const rdv = myRdvs.find((r) => r.day === d.label && r.time === t);
      if (rdv) slots[key] = { status: 'booked', studentId: rdv.studentId, eventTypeId: rdv.eventTypeId };
      else if ((di + ti) % 4 === 0) slots[key] = { status: 'blocked' };
      else slots[key] = { status: 'free' };
    });
  });
  return slots;
}

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function CalendrierMessagerieScreen({
  initialTab = 'calendrier',
  openStudentId,
  onConsumeOpenStudentId,
}: {
  initialTab?: 'calendrier' | 'messagerie';
  openStudentId?: number | null;
  onConsumeOpenStudentId?: () => void;
}) {
  const [tab, setTab] = useState<'calendrier' | 'messagerie'>(initialTab);
  const [eventTypes, setEventTypes] = useState(EVENT_TYPES);
  const [slots, setSlots] = useState<Record<string, Slot>>(buildInitialSlots);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(new Set());
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (openStudentId == null) return;
    setTab('messagerie');
    setSelectedId(openStudentId);
    setReadIds((prev) => new Set(prev).add(openStudentId));
    onConsumeOpenStudentId?.();
  }, [openStudentId, onConsumeOpenStudentId]);

  const toggleType = (id: number) => setEventTypes((ts) => ts.map((t) => t.id === id ? { ...t, active: !t.active } : t));

  const toggleSlot = (key: string) => {
    setSlots((prev) => {
      const cur = prev[key];
      if (cur.status === 'booked') return prev;
      return { ...prev, [key]: { status: cur.status === 'free' ? 'blocked' : 'free' } };
    });
  };

  const selectThread = (studentId: number) => {
    setSelectedId(studentId);
    setReadIds((prev) => new Set(prev).add(studentId));
  };

  const sendMessage = () => {
    if (!draft.trim() || selectedId == null) return;
    setConversations((cs) => cs.map((c) => c.studentId === selectedId
      ? { ...c, messages: [...c.messages, { from: 'coach' as const, text: draft.trim(), time: "À l'instant" }] }
      : c));
    setDraft('');
  };

  const selectedConversation = conversations.find((c) => c.studentId === selectedId);
  const selectedStudent = mine.find((s) => s.id === selectedId);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-2xl">Calendrier &amp; messagerie</h2>
        <p className="text-muted-foreground text-sm mt-1">Tes disponibilités et tes échanges, au même endroit.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'calendrier' | 'messagerie')}>
        <TabsList>
          <TabsTrigger value="calendrier">Calendrier</TabsTrigger>
          <TabsTrigger value="messagerie">Messagerie</TabsTrigger>
        </TabsList>

        <TabsContent value="calendrier" className="mt-4 flex flex-col gap-5">
          <Card>
            <CardHeader><h3 className="text-base">Mes types de rendez-vous</h3></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventTypes.map((t) => (
                <div key={t.id} className="rounded-lg border border-border p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.duration} min · {t.description}</p>
                  </div>
                  <Switch checked={t.active} onCheckedChange={() => toggleType(t.id)} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-base">Disponibilités de la semaine</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Clique un créneau libre pour le bloquer, ou un créneau bloqué pour le rouvrir.</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[560px] grid grid-cols-[72px_repeat(5,1fr)] gap-1">
                <div />
                {DAYS.map((d) => (
                  <div key={d.key} className="text-center font-mono text-[10px] uppercase tracking-wide text-muted-foreground pb-1">
                    {d.label.split(' ').slice(0, 2).join(' ')}
                  </div>
                ))}
                {TIMES.map((t) => (
                  <div key={t} className="contents">
                    <div className="text-right font-mono text-[11px] text-muted-foreground pr-2 flex items-center justify-end">{t}</div>
                    {DAYS.map((d) => {
                      const key = `${d.key}-${t}`;
                      const slot = slots[key];
                      const student = slot.studentId ? mine.find((s) => s.id === slot.studentId) : undefined;
                      const type = slot.eventTypeId ? eventTypes.find((e) => e.id === slot.eventTypeId) : undefined;
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSlot(key)}
                          disabled={slot.status === 'booked'}
                          className={`h-11 rounded-md text-[10px] leading-tight px-1.5 flex flex-col items-center justify-center text-center transition-colors ${
                            slot.status === 'booked'
                              ? 'bg-primary text-primary-foreground cursor-default'
                              : slot.status === 'blocked'
                              ? 'bg-secondary text-muted-foreground/60 border border-dashed border-border cursor-pointer'
                              : 'border border-border bg-card hover:border-primary/50 cursor-pointer'
                          }`}
                        >
                          {slot.status === 'booked' ? (
                            <>
                              <span className="font-medium truncate w-full">{student?.name.split(' ')[0]}</span>
                              <span className="opacity-80 truncate w-full">{type?.label}</span>
                            </>
                          ) : slot.status === 'blocked' ? 'Bloqué' : 'Libre'}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><h3 className="text-base">Prochains rendez-vous</h3></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {myRdvs.length === 0 && <p className="text-sm text-muted-foreground">Aucun rendez-vous prévu pour l'instant.</p>}
              {myRdvs.map((r) => {
                const student = mine.find((s) => s.id === r.studentId);
                const type = EVENT_TYPES.find((e) => e.id === r.eventTypeId);
                return (
                  <div key={r.id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{student?.name}</p>
                      <p className="text-xs text-muted-foreground">{type?.label} · {type?.duration} min</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{r.day} · {r.time}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messagerie" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <div className="flex h-[520px]">
              <div className={`w-full md:w-64 flex-none border-r border-border flex-col overflow-y-auto ${selectedId != null ? 'hidden md:flex' : 'flex'}`}>
                {conversations.map((c) => {
                  const student = mine.find((s) => s.id === c.studentId);
                  if (!student) return null;
                  const last = c.messages[c.messages.length - 1];
                  const unread = !readIds.has(c.studentId) && last?.from === 'student';
                  return (
                    <button
                      key={c.studentId}
                      onClick={() => selectThread(c.studentId)}
                      className={`flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0 hover:bg-secondary/60 transition-colors ${selectedId === c.studentId ? 'bg-secondary' : ''}`}
                    >
                      <div className="size-8 flex-none rounded-full bg-secondary text-[11px] font-medium flex items-center justify-center">
                        {initials(student.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{last?.text ?? 'Aucun message'}</p>
                      </div>
                      {unread && <span className="size-2 rounded-full bg-primary flex-none" />}
                    </button>
                  );
                })}
              </div>

              <div className={`flex-1 min-w-0 flex-col ${selectedId != null ? 'flex' : 'hidden md:flex'}`}>
                {selectedStudent && selectedConversation ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-none">
                      <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setSelectedId(null)}>←</button>
                      <div className="size-8 flex-none rounded-full bg-secondary text-[11px] font-medium flex items-center justify-center">
                        {initials(selectedStudent.name)}
                      </div>
                      <p className="text-sm font-medium truncate">{selectedStudent.name}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
                      {selectedConversation.messages.map((m, i) => (
                        <div key={i} className={`flex ${m.from === 'coach' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${m.from === 'coach' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            <p>{m.text}</p>
                            <p className={`text-[10px] mt-1 ${m.from === 'coach' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-none">
                      <Input
                        placeholder="Écris un message…"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                      />
                      <Button size="sm" onClick={sendMessage} disabled={!draft.trim()}>Envoyer</Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Sélectionne une conversation</div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
