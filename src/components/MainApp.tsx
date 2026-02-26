import { useState } from 'react';
import { User } from 'lucide-react';
import { useApp, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import BottomNav from './BottomNav';
import CatPet from './CatPet';
import HomeTab from './HomeTab';
import CuriositiesTab from './CuriositiesTab';
import DictionaryTab from './DictionaryTab';
import CommunityTab from './CommunityTab';
import ExercisesTab from './ExercisesTab';
import ProfileSheet from './ProfileSheet';

const tabComponents: Record<string, React.FC> = {
  home: HomeTab,
  curiosities: CuriositiesTab,
  dictionary: DictionaryTab,
  community: CommunityTab,
  exercises: ExercisesTab,
};

const MainApp = () => {
  const { activeTab, course, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [profileOpen, setProfileOpen] = useState(false);
  const TabContent = tabComponents[activeTab] || HomeTab;
  const courseName = COURSES.find(c => c.id === course)?.flag || '🌍';

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐱</span>
          <h1 className="text-xl font-black text-primary">Planicchio</h1>
          <span className="text-lg">{courseName}</span>
        </div>
        <button
          onClick={() => setProfileOpen(true)}
          className="bg-card border border-border rounded-full p-2 hover:bg-muted transition-colors"
        >
          <User size={20} className="text-foreground" />
        </button>
      </header>

      <main className="px-4 pt-4 max-w-lg mx-auto">
        <TabContent />
      </main>

      <CatPet />
      <BottomNav />
      <ProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default MainApp;
