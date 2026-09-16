import { useState } from 'react';
import { Shell, type NavItem } from '../../components/product/Shell';
import { CatalogueScreen } from './CatalogueScreen';
import { CandidatureScreen } from './CandidatureScreen';
import { MonCvScreen } from './MonCvScreen';
import { MonSuiviScreen } from './MonSuiviScreen';
import { STUDENTS, CURRENT_STUDENT_ID, defaultCvFor, EXTERNAL_OFFERS, type Offer, type CvData, type CvHistoryEntry } from '../../lib/mock-data';

const NAV: NavItem[] = [
  { id: 'offres', label: 'Offres', sub: 'École + externes' },
  { id: 'cv', label: 'Mon CV' },
  { id: 'suivi', label: 'Mon suivi' },
];

const CURRENT_STUDENT = STUDENTS.find((s) => s.id === CURRENT_STUDENT_ID)!;

let nextHistoryId = 2;

export function StudentSpace({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState('offres');
  const [openOffer, setOpenOffer] = useState<Offer | null>(null);
  const [profileCv, setProfileCv] = useState<CvData>(() => defaultCvFor(CURRENT_STUDENT));
  const [cvHistory, setCvHistory] = useState<CvHistoryEntry[]>(() => [
    { id: 1, date: "Aujourd'hui", label: "CV initial (onboarding)", cv: defaultCvFor(CURRENT_STUDENT) },
  ]);
  const [externalOffers, setExternalOffers] = useState<Offer[]>(EXTERNAL_OFFERS);

  const select = (id: string) => { setOpenOffer(null); setActive(id); };

  const updateProfileCv = (cv: CvData, label: string) => {
    setProfileCv(cv);
    setCvHistory((h) => [{ id: nextHistoryId++, date: "à l'instant", label, cv }, ...h]);
  };

  const addExternalOffer = (offer: Offer) => {
    setExternalOffers((o) => [offer, ...o]);
    setOpenOffer(offer);
  };

  return (
    <Shell spaceLabel="Espace Étudiant" roleLabel="Léa Bernard" navItems={NAV} activeId={active} onSelect={select} onExit={onExit}>
      {openOffer ? (
        <CandidatureScreen offer={openOffer} profileCv={profileCv} onPushProfileCv={updateProfileCv} onBack={() => setOpenOffer(null)} />
      ) : active === 'offres' ? (
        <CatalogueScreen externalOffers={externalOffers} onAddExternalOffer={addExternalOffer} onOpenOffer={setOpenOffer} />
      ) : active === 'cv' ? (
        <MonCvScreen cv={profileCv} history={cvHistory} onUpdateCv={updateProfileCv} />
      ) : (
        <MonSuiviScreen />
      )}
    </Shell>
  );
}
