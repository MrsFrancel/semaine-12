import { useState } from 'react';
import { Shell, type NavItem } from '../../components/product/Shell';
import { StudentDashboardScreen } from './StudentDashboardScreen';
import { CatalogueScreen } from './CatalogueScreen';
import { CandidatureScreen } from './CandidatureScreen';
import { MonCvScreen } from './MonCvScreen';
import { MonSuiviScreen } from './MonSuiviScreen';
import {
  STUDENTS, CURRENT_STUDENT_ID, defaultCvFor, type Offer, type CvData, type CvHistoryEntry,
  type Conversation, CONVERSATIONS as INITIAL_CONVERSATIONS,
  type Candidature, type CandidatureStatus, CANDIDATURES,
} from '../../lib/mock-data';

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'offres', label: 'Offres', sub: 'École + externes' },
  { id: 'cv', label: 'Mon CV' },
  { id: 'suivi', label: 'Mon suivi' },
];

const CURRENT_STUDENT = STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID)!;

let nextHistoryId = 2;

export function StudentSpace({
  onExit,
  initialCv,
  studentName,
  offers,
  seenOfferIds,
  onMarkOffersSeen,
}: {
  onExit: () => void;
  initialCv: CvData | null;
  studentName: string;
  offers: Offer[];
  seenOfferIds: Set<number>;
  onMarkOffersSeen: () => void;
}) {
  const [active, setActive] = useState('dashboard');
  const [offresTab, setOffresTab] = useState<'ecole' | 'externes'>('ecole');
  const [suiviTab, setSuiviTab] = useState<'rdv' | 'messagerie'>('rdv');
  const [openOffer, setOpenOffer] = useState<Offer | null>(null);
  const [profileCv, setProfileCv] = useState<CvData>(() => initialCv ?? defaultCvFor(CURRENT_STUDENT));
  const [cvHistory, setCvHistory] = useState<CvHistoryEntry[]>(() => [
    { id: 1, date: "Aujourd'hui", label: "CV initial (onboarding)", cv: initialCv ?? defaultCvFor(CURRENT_STUDENT) },
  ]);
  const [externalOffers, setExternalOffers] = useState<Offer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [myCandidatures, setMyCandidatures] = useState<Candidature[]>(() =>
    CANDIDATURES.filter((c) => c.studentId === CURRENT_STUDENT_ID)
  );

  const select = (id: string) => {
    setOpenOffer(null);
    setActive(id);
    if (id === 'offres') onMarkOffersSeen();
  };

  const updateProfileCv = (cv: CvData, label: string) => {
    setProfileCv(cv);
    setCvHistory((h) => [{ id: nextHistoryId++, date: "à l'instant", label, cv }, ...h]);
  };

  const addExternalOffer = (offer: Offer) => {
    setExternalOffers((o) => [offer, ...o]);
    setActive('offres');
    setOffresTab('externes');
    setOpenOffer(offer);
  };

  const updateCandidatureStatus = (offerId: number, status: CandidatureStatus) => {
    setMyCandidatures((cs) => {
      const exists = cs.some((c) => c.offerId === offerId);
      if (exists) return cs.map((c) => (c.offerId === offerId ? { ...c, status, updatedAt: "à l'instant" } : c));
      return [...cs, { studentId: CURRENT_STUDENT_ID, offerId, status, updatedAt: "à l'instant" }];
    });
  };

  const openMessagerie = () => { setActive('suivi'); setSuiviTab('messagerie'); };

  const newOffers = offers.filter((o) => !seenOfferIds.has(o.id));
  const openOffresEcole = () => {
    setActive('offres');
    setOffresTab('ecole');
    onMarkOffersSeen();
  };

  return (
    <Shell spaceLabel="Espace Étudiant" roleLabel={studentName} navItems={NAV} activeId={active} onSelect={select} onExit={onExit}>
      {openOffer ? (
        <CandidatureScreen
          offer={openOffer}
          profileCv={profileCv}
          studentName={studentName}
          onPushProfileCv={updateProfileCv}
          onBack={() => setOpenOffer(null)}
          initialStatus={myCandidatures.find((c) => c.offerId === openOffer.id)?.status ?? 'a-preparer'}
          onStatusChange={(status) => updateCandidatureStatus(openOffer.id, status)}
        />
      ) : active === 'dashboard' ? (
        <StudentDashboardScreen
          onAddExternalOffer={addExternalOffer}
          conversations={conversations}
          onOpenMessagerie={openMessagerie}
          myCandidatures={myCandidatures}
          externalOffers={externalOffers}
          onOpenOffer={setOpenOffer}
          offers={offers}
          newOffers={newOffers}
          onOpenOffresEcole={openOffresEcole}
        />
      ) : active === 'offres' ? (
        <CatalogueScreen offers={offers} externalOffers={externalOffers} onAddExternalOffer={addExternalOffer} onOpenOffer={setOpenOffer} tab={offresTab} onTabChange={setOffresTab} />
      ) : active === 'cv' ? (
        <MonCvScreen cv={profileCv} history={cvHistory} onUpdateCv={updateProfileCv} studentName={studentName} />
      ) : (
        <MonSuiviScreen conversations={conversations} onConversationsChange={setConversations} tab={suiviTab} onTabChange={setSuiviTab} />
      )}
    </Shell>
  );
}
