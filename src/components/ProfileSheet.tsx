import { useState } from 'react';
import { X, Moon, Sun, Bell, BookOpen, RefreshCw, User, Heart, ChevronRight, Download, Upload, Palette, Plus, BellRing } from 'lucide-react';
import { useApp, PETS, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DIARY_COLORS = [
  { id: 'default', bg: 'bg-muted', label: '⬜' },
  { id: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: '🟡' },
  { id: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/30', label: '🔵' },
  { id: 'green', bg: 'bg-green-100 dark:bg-green-900/30', label: '🟢' },
  { id: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/30', label: '🩷' },
  { id: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/30', label: '🟣' },
];

const STORAGE_KEY = 'planicchio_state';

const ProfileSheet = ({ open, onClose }: Props) => {
  const {
    name, setName, pet, setPet, darkMode, setDarkMode,
    diary, setDiary, course, nativeLang, setStage, level, xp, getTitle, getPetEmoji, resetProgress
  } = useApp();
  const tr = useTranslation(nativeLang);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [showDiary, setShowDiary] = useState(false);
  const [showPets, setShowPets] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [diaryColor, setDiaryColor] = useState(() => {
    try { return localStorage.getItem('planicchio_diary_color') || 'default'; } catch { return 'default'; }
  });
  const [learnedWord, setLearnedWord] = useState('');
  const [learnedWords, setLearnedWords] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('planicchio_learned_words') || '[]');
    } catch { return []; }
  });
  const [notifEnabled, setNotifEnabled] = useState(() => {
    return localStorage.getItem('planicchio_notif') === 'true';
  });
  const title = getTitle();

  const saveLearnedWords = (words: string[]) => {
    setLearnedWords(words);
    localStorage.setItem('planicchio_learned_words', JSON.stringify(words));
  };

  const addLearnedWord = () => {
    if (learnedWord.trim() && !learnedWords.includes(learnedWord.trim())) {
      saveLearnedWords([...learnedWords, learnedWord.trim()]);
      setLearnedWord('');
    }
  };

  const removeLearnedWord = (word: string) => {
    saveLearnedWords(learnedWords.filter(w => w !== word));
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('planicchio_notif', 'true');
        new Notification('Planicchio 🐱', {
          body: tr('notif_enabled_msg') || 'Notificações ativadas! Vamos estudar juntos! 📚',
          icon: '/favicon.ico',
        });
        // Schedule daily reminder
        if ('serviceWorker' in navigator) {
          // Simple interval-based reminder
          setInterval(() => {
            if (document.hidden) {
              new Notification('Planicchio 🐱', {
                body: tr('notif_reminder') || 'Hora de estudar! Não perca seu streak! 🔥',
                icon: '/favicon.ico',
              });
            }
          }, 4 * 60 * 60 * 1000); // Every 4 hours
        }
      }
    }
  };

  const handleDisableNotifications = () => {
    setNotifEnabled(false);
    localStorage.setItem('planicchio_notif', 'false');
  };

  const handleBackupDownload = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const words = localStorage.getItem('planicchio_learned_words');
    const backup = {
      state: data ? JSON.parse(data) : {},
      learnedWords: words ? JSON.parse(words) : [],
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planicchio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const backup = JSON.parse(ev.target?.result as string);
          if (backup.state) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.state));
          }
          if (backup.learnedWords) {
            localStorage.setItem('planicchio_learned_words', JSON.stringify(backup.learnedWords));
          }
          window.location.reload();
        } catch {
          alert(tr('backup_error') || 'Erro ao restaurar backup');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (!open) return null;

  const getDiaryBg = () => DIARY_COLORS.find(c => c.id === diaryColor)?.bg || 'bg-muted';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-background h-full overflow-y-auto shadow-2xl"
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
            {/* Change Name */}
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

            {/* Change Pet */}
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

            {/* Dark Mode */}
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

            {/* Notifications */}
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('notifications')}</span>
              </div>
              <span className={`text-xs font-bold ${notifEnabled ? 'text-green-500' : 'text-muted-foreground'}`}>
                {notifEnabled ? '✅ ON' : 'OFF'}
              </span>
            </button>
            {showNotif && (
              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                <p className="text-sm text-muted-foreground">
                  {tr('notif_desc') || 'Receba lembretes para estudar e manter seu streak!'}
                </p>
                {!notifEnabled ? (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <BellRing size={16} /> {tr('enable_notif') || 'Ativar Notificações'}
                  </button>
                ) : (
                  <button
                    onClick={handleDisableNotifications}
                    className="w-full bg-muted text-foreground font-bold py-2 rounded-lg text-sm"
                  >
                    {tr('disable_notif') || 'Desativar Notificações'}
                  </button>
                )}
              </div>
            )}

            {/* Study Diary */}
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
              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                {/* Color picker */}
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-muted-foreground" />
                  <div className="flex gap-1">
                    {DIARY_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setDiaryColor(c.id)}
                        className={`text-lg p-1 rounded-lg transition-all ${diaryColor === c.id ? 'ring-2 ring-primary scale-110' : ''}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={diary}
                  onChange={e => setDiary(e.target.value)}
                  placeholder={tr('diary_placeholder')}
                  rows={4}
                  className={`w-full ${getDiaryBg()} rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
                />
                {/* Learned words */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">
                    📝 {tr('learned_words') || 'Palavras aprendidas'}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={learnedWord}
                      onChange={e => setLearnedWord(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLearnedWord()}
                      placeholder={tr('add_word') || 'Adicionar palavra...'}
                      className="flex-1 bg-muted rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={addLearnedWord} className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {learnedWords.map((w, i) => (
                      <span
                        key={i}
                        onClick={() => removeLearnedWord(w)}
                        className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        {w} ✕
                      </span>
                    ))}
                    {learnedWords.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">
                        {tr('no_words_yet') || 'Nenhuma palavra ainda...'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Change Course */}
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

            {/* Backup */}
            <button
              onClick={() => setShowBackup(!showBackup)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={18} className="text-primary" />
                <span className="font-bold text-foreground">{tr('backup')}</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            {showBackup && (
              <div className="bg-card rounded-xl p-4 border border-border space-y-2">
                <button
                  onClick={handleBackupDownload}
                  className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} /> {tr('download_backup') || 'Baixar Backup'}
                </button>
                <button
                  onClick={handleBackupUpload}
                  className="w-full bg-muted text-foreground font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> {tr('restore_backup') || 'Restaurar Backup'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSheet;
