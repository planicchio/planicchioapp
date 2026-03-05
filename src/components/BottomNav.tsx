import { Home, Lightbulb, BookOpen, Users, PenTool, type LucideIcon } from 'lucide-react';
import { useApp, type TabId } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const tabKeys: { id: TabId; labelKey: string; icon: LucideIcon }[] = [
  { id: 'home', labelKey: 'tab_home', icon: Home },
  { id: 'curiosities', labelKey: 'tab_tips', icon: Lightbulb },
  { id: 'exercises', labelKey: 'tab_exercises', icon: PenTool },
  { id: 'dictionary', labelKey: 'tab_dictionary', icon: BookOpen },
  { id: 'community', labelKey: 'tab_social', icon: Users },
];

const BottomNav = () => {
  const { activeTab, setActiveTab, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabKeys.map(({ id, labelKey, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={22} className={active ? 'drop-shadow-sm' : ''} />
              <span className={`text-[10px] font-bold ${active ? '' : 'font-semibold'}`}>{tr(labelKey)}</span>
              {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
