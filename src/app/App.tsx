import { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/student/OnboardingScreen';
import { StudentSpace } from './screens/student/StudentSpace';
import { SchoolSpace } from './screens/school/SchoolSpace';
import { SkillVocabularyProvider } from './lib/skill-vocabulary';
import type { CvData } from './lib/mock-data';

type Space = 'login' | 'student-onboarding' | 'student' | 'admin' | 'coach';

export default function App() {
  const [space, setSpace] = useState<Space>('login');
  const [abVersion, setAbVersion] = useState<'A' | 'B'>('A');
  const [onboardingCv, setOnboardingCv] = useState<CvData | null>(null);
  const [onboardingCvRawText, setOnboardingCvRawText] = useState('');

  return (
    <SkillVocabularyProvider>
      {space === 'login' ? (
        <LoginScreen onPick={setSpace} abVersion={abVersion} onPickAbVersion={setAbVersion} />
      ) : space === 'student-onboarding' ? (
        <OnboardingScreen onDone={(cv, rawText) => { setOnboardingCv(cv); setOnboardingCvRawText(rawText); setSpace('student'); }} />
      ) : space === 'student' ? (
        <StudentSpace onExit={() => setSpace('login')} initialCv={onboardingCv} initialCvRawText={onboardingCvRawText} />
      ) : (
        <SchoolSpace role={space} onExit={() => setSpace('login')} abVersion={abVersion} />
      )}
    </SkillVocabularyProvider>
  );
}
