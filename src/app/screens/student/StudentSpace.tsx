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
  initialCvRawText,
}: {
  onExit: () => void;
  initialCv: CvData | null;
  initialCvRawText: string;
}) {
  const [active, setActive] = useState('dashboard');
  const [offresTab, setOffresTab] = useState<'ecole' | 'externes'>('ecole');
  const [openOffer, setOpenOffer] = useState<Offer | null>(null);
  const [profileCv, setProfileCv] = useState<CvData>(() => initialCv ?? defaultCvFor(CURRENT_STUDENT));
  const [cvRawText] = useState(initialCvRawText);
  const [cvHistory, setCvHistory] = useState<CvHistoryEntry[]>(() => [
    { id: 1, date: "Aujourd'hui", label: "CV initial (onboarding)", cv: initialCv ?? defaultCvFor(CURRENT_STUDENT) },
  ]);
  const [externalOffers, setExternalOffers] = useState<Offer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  const select = (id: string) => { setOpenOffer(null); setActive(id); };

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

  const openMessagerie = () => setActive('suivi');

  return (
    <Shell spaceLabel="Espace Étudiant" roleLabel="Léa Bernard" navItems={NAV} activeId={active} onSelect={select} onExit={onExit}>
      {openOffer ? (
        <CandidatureScreen offer={openOffer} profileCv={profileCv} cvRawText={cvRawText} onPushProfileCv={updateProfileCv} onBack={() => setOpenOffer(null)} />
      ) : active === 'dashboard' ? (
        <StudentDashboardScreen onAddExternalOffer={addExternalOffer} conversations={conversations} onOpenMessagerie={openMessagerie} />
      ) : active === 'offres' ? (
        <CatalogueScreen externalOffers={externalOffers} onAddExternalOffer={addExternalOffer} onOpenOffer={setOpenOffer} tab={offresTab} onTabChange={setOffresTab} />
      ) : active === 'cv' ? (
        <MonCvScreen cv={profileCv} history={cvHistory} onUpdateCv={updateProfileCv} />
      ) : (
        <MonSuiviScreen conversations={conversations} onConversationsChange={setConversations} />
      )}
    </Shell>
  );
}
