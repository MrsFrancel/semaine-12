import { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/student/OnboardingScreen';
import { StudentSpace } from './screens/student/StudentSpace';
import { SchoolSpace } from './screens/school/SchoolSpace';
import { SkillVocabularyProvider } from './lib/skill-vocabulary';
import { nameFromEmail, OFFERS as INITIAL_OFFERS, type CvData, type Offer } from './lib/mock-data';

type Space = 'login' | 'student-onboarding' | 'student' | 'admin' | 'coach';

let nextOfferId = 1000;

export default function App() {
  const [space, setSpace] = useState<Space>('login');
  const [abVersion, setAbVersion] = useState<'A' | 'B'>('A');
  const [onboardingCv, setOnboardingCv] = useState<CvData | null>(null);
  const [studentName, setStudentName] = useState('Étudiant(e)');
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [seenOfferIds, setSeenOfferIds] = useState<Set<number>>(() => new Set(INITIAL_OFFERS.map((o) => o.id)));

  const publishOffer = (draft: Omit<Offer, 'id'>) => {
    setOffers((o) => [{ ...draft, id: nextOfferId++ }, ...o]);
  };
  const removeOffer = (id: number) => setOffers((o) => o.filter((x) => x.id !== id));
  const markOffersSeen = () => setSeenOfferIds(new Set(offers.map((o) => o.id)));

  return (
    <SkillVocabularyProvider>
      {space === 'login' ? (
        <LoginScreen onPick={setSpace} abVersion={abVersion} onPickAbVersion={setAbVersion} />
      ) : space === 'student-onboarding' ? (
        <OnboardingScreen onDone={(cv, email) => { setOnboardingCv(cv); setStudentName(nameFromEmail(email)); setSpace('student'); }} />
      ) : space === 'student' ? (
        <StudentSpace
          onExit={() => setSpace('login')}
          initialCv={onboardingCv}
          studentName={studentName}
          offers={offers}
          seenOfferIds={seenOfferIds}
          onMarkOffersSeen={markOffersSeen}
        />
      ) : (
        <SchoolSpace role={space} onExit={() => setSpace('login')} abVersion={abVersion} offers={offers} onPublish={publishOffer} onRemoveOffer={removeOffer} />
      )}
    </SkillVocabularyProvider>
  );
}
