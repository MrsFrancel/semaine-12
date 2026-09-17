import { useState } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { OnboardingScreen } from './screens/student/OnboardingScreen';
import { StudentSpace } from './screens/student/StudentSpace';
import { SchoolSpace } from './screens/school/SchoolSpace';
import { SkillVocabularyProvider } from './lib/skill-vocabulary';

type Space = 'login' | 'student-onboarding' | 'student' | 'admin' | 'coach';

export default function App() {
  const [space, setSpace] = useState<Space>('login');
  const [abVersion, setAbVersion] = useState<'A' | 'B'>('A');

  return (
    <SkillVocabularyProvider>
      {space === 'login' ? (
        <LoginScreen onPick={setSpace} abVersion={abVersion} onPickAbVersion={setAbVersion} />
      ) : space === 'student-onboarding' ? (
        <OnboardingScreen onDone={() => setSpace('student')} />
      ) : space === 'student' ? (
        <StudentSpace onExit={() => setSpace('login')} />
      ) : (
        <SchoolSpace role={space} onExit={() => setSpace('login')} abVersion={abVersion} />
      )}
    </SkillVocabularyProvider>
  );
}
