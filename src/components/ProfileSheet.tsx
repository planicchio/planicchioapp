import { useState } from 'react';
import { X, Moon, Sun, Bell, BookOpen, RefreshCw, User, Heart, ChevronRight } from 'lucide-react';
import { useApp, PETS, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProfileSheet = ({ open, onClose }: Props) => {
  const {
    name, setName, pet, setPet, darkMode, setDarkMode,
    diary, setDiary, course, nativeLang, setStage, level, xp, getTitle, getPetEmoji
  } = useApp();
  const tr = useTranslation(nativeLang);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [showDiary, setShowDiary] = useState(false);
  const [showPets, setShowPets] = useState(false);
  const title = getTitle();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-background h-full overflow-y-auto shadow-2xl animate-[slideInRight_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'slide-in-right 0.3s ease-out' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">{tr('profile')}</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{getPetEmoji()}</div>
            <h3 className="font-black text-foreground text-xl">{name}</h3>
            <p className="text-sm text-muted-foreground">{title.emoji} {tr(title.titleKey)} · {xp} XP · {tr('level')} {level}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => { setEditingName(true); setTempName(name); }}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('change_name')}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {editingName && (
              <div className="bg-card rounded-xl p-4 border border-border space-y-2">
                <input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <button onClick={() => { setName(tempName); setEditingName(false); }} className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-sm flex-1">{tr('save')}</button>
                  <button onClick={() => setEditingName(false)} className="bg-muted text-foreground font-bold px-4 py-2 rounded-lg text-sm">{tr('cancel')}</button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPets(!showPets)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('change_pet')}</span>
              </div>
              <span className="text-xl">{getPetEmoji()}</span>
            </button>
            {showPets && (
              <div className="bg-card rounded-xl p-4 border border-border flex gap-3 justify-center">
                {PETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPet(p.id); setShowPets(false); }}
                    className={`text-3xl p-2 rounded-xl transition-all ${pet === p.id ? 'bg-primary/20 scale-110' : 'hover:bg-muted'}`}
                  >
                    {p.emoji}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                <span className="font-bold text-foreground">{tr('dark_mode')}</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${darkMode ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-5 h-5 rounded-full bg-card shadow transition-transform ${darkMode ? 'translate-x-5' : ''}`} />
              </div>
            </button>

            <div className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('notifications')}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tr('coming_soon')}</span>
            </div>

            <button
              onClick={() => setShowDiary(!showDiary)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('study_diary')}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {showDiary && (
              <div className="bg-card rounded-xl p-4 border border-border">
                <textarea
                  value={diary}
                  onChange={e => setDiary(e.target.value)}
                  placeholder={tr('diary_placeholder')}
                  rows={5}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            )}

            <button
              onClick={() => { setStage('course'); onClose(); }}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('change_course')}</span>
              </div>
              <span className="text-sm text-muted-foreground">{COURSES.find(c => c.id === course)?.flag}</span>
            </button>

            <button className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('backup')}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tr('coming_soon')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSheet;
