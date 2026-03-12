import { useState, useEffect, useMemo } from 'react';
import { Send, Lock, MessageCircle, ChevronDown, ChevronUp, Heart, Flame, Trophy, UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

interface Comment {
  id: number;
  name: string;
  text: string;
  time: string;
  likes: number;
  replies: Comment[];
}

const COMMENTS_KEY = 'planicchio_community_comments';
const FOLLOWS_KEY = 'planicchio_follows';
const RANKING_KEY = 'planicchio_ranking';
const RANKING_WEEK_KEY = 'planicchio_ranking_week';
const VIP_URL = 'https://buy.stripe.com/9B614o1gU3dXeHq7UeaMU01';

const defaultComments: Comment[] = [
  { id: 1, name: 'Maria 🇧🇷', text: 'Alguém mais aprendendo inglês? 🙋‍♀️', time: '2h', likes: 5, replies: [
    { id: 101, name: 'João 🇧🇷', text: '👋 Eu! Estou no nível A2!', time: '1h', likes: 2, replies: [] },
    { id: 102, name: 'Ana 🇧🇷', text: 'Também! Vamos praticar juntos!', time: '45min', likes: 3, replies: [] },
  ]},
  { id: 2, name: 'João 🇧🇷', text: '💡 Planicchio é incrível! Aprendi 50 palavras essa semana!', time: '4h', likes: 12, replies: [] },
  { id: 3, name: 'Ana 🇧🇷', text: '🎉🎉 Cheguei no nível B1! Muito feliz!', time: '6h', likes: 20, replies: [
    { id: 301, name: 'Carlos 🇧🇷', text: 'Parabéns! 🎊', time: '5h', likes: 4, replies: [] },
  ] },
  { id: 4, name: 'Pedro 🇧🇷', text: 'Dica: assistam séries no idioma que estão aprendendo com legenda!', time: '8h', likes: 15, replies: [] },
  { id: 5, name: 'Luna 🇪🇸', text: '¡Hola a todos! Estoy aprendiendo portugués 🇧🇷', time: '10h', likes: 8, replies: [] },
  { id: 6, name: 'Yuki 🇯🇵', text: 'みんな頑張って！I love learning with Planicchio! 🌸', time: '12h', likes: 10, replies: [] },
  { id: 7, name: 'Sophie 🇫🇷', text: "J'adore cette app! Quelqu'un veut pratiquer le français? 🇫🇷", time: '14h', likes: 7, replies: [] },
];

const defaultRanking = [
  { name: 'Maria 🇧🇷', xp: 850, streak: 15 },
  { name: 'João 🇧🇷', xp: 720, streak: 12 },
  { name: 'Ana 🇧🇷', xp: 650, streak: 10 },
  { name: 'Pedro 🇧🇷', xp: 580, streak: 8 },
  { name: 'Luna 🇪🇸', xp: 520, streak: 7 },
  { name: 'Yuki 🇯🇵', xp: 490, streak: 6 },
  { name: 'Sophie 🇫🇷', xp: 460, streak: 5 },
  { name: 'Hans 🇩🇪', xp: 430, streak: 4 },
  { name: 'Marco 🇮🇹', xp: 400, streak: 3 },
  { name: 'MinJi 🇰🇷', xp: 380, streak: 3 },
];

function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

const CommunityTab = () => {
  const { name, nativeLang, xp, streak } = useApp();
  const tr = useTranslation(nativeLang);

  const [comments, setComments] = useState<Comment[]>(() => {
    try { const s = localStorage.getItem(COMMENTS_KEY); if (s) return JSON.parse(s); } catch {} return defaultComments;
  });
  const [follows, setFollows] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem(FOLLOWS_KEY); if (s) return new Set(JSON.parse(s)); } catch {} return new Set();
  });
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set([1, 3]));
  const [activeSection, setActiveSection] = useState<'feed' | 'ranking'>('feed');

  // Persist
  useEffect(() => { localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem(FOLLOWS_KEY, JSON.stringify([...follows])); }, [follows]);

  // Ranking with current user
  const ranking = useMemo(() => {
    const currentWeek = getCurrentWeek();
    let savedWeek = localStorage.getItem(RANKING_WEEK_KEY);
    let saved: typeof defaultRanking;
    try { saved = JSON.parse(localStorage.getItem(RANKING_KEY) || '[]'); } catch { saved = []; }

    // Reset ranking on new week
    if (savedWeek !== currentWeek || saved.length === 0) {
      saved = defaultRanking;
      localStorage.setItem(RANKING_WEEK_KEY, currentWeek);
    }

    // Add/update current user
    const userEntry = { name: `${name} ⭐`, xp, streak };
    const filtered = saved.filter(r => !r.name.includes('⭐'));
    const combined = [...filtered, userEntry].sort((a, b) => b.xp - a.xp).slice(0, 20);
    localStorage.setItem(RANKING_KEY, JSON.stringify(combined));
    return combined;
  }, [name, xp, streak]);

  const handleSend = () => {
    if (!newComment.trim()) return;
    setComments([
      { id: Date.now(), name: `${name} 🌍`, text: newComment, time: tr('now'), likes: 0, replies: [] },
      ...comments,
    ]);
    setNewComment('');
  };

  const handleReply = (commentId: number) => {
    if (!replyText.trim()) return;
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, { id: Date.now(), name: `${name} 🌍`, text: replyText, time: tr('now'), likes: 0, replies: [] }] };
      }
      return c;
    }));
    setReplyText('');
    setReplyingTo(null);
    setExpandedReplies(prev => new Set(prev).add(commentId));
  };

  const handleLike = (commentId: number, isReply?: boolean, parentId?: number) => {
    if (isReply && parentId) {
      setComments(comments.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r) };
        }
        return c;
      }));
    } else {
      setComments(comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    }
  };

  const toggleReplies = (id: number) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFollow = (userName: string) => {
    setFollows(prev => {
      const next = new Set(prev);
      next.has(userName) ? next.delete(userName) : next.add(userName);
      return next;
    });
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">👥</span>
        <h2 className="text-2xl font-black text-foreground">{tr('community_title')}</h2>
        <p className="text-xs text-muted-foreground">{tr('community_desc')}</p>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setActiveSection('feed')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
            activeSection === 'feed' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
          💬 {tr('social_feed') || 'Feed'}
        </button>
        <button onClick={() => setActiveSection('ranking')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
            activeSection === 'ranking' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
          🏆 {tr('ranking') || 'Ranking'}
        </button>
      </div>

      {/* Global Streak */}
      <div className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          <span className="font-bold text-sm text-foreground">{tr('your_streak') || 'Seu streak'}</span>
        </div>
        <span className="font-black text-primary text-lg">{streak} 🔥</span>
      </div>

      {activeSection === 'ranking' ? (
        /* Ranking Section */
        <div className="space-y-2">
          <h3 className="font-black text-foreground flex items-center gap-2">
            <Trophy size={16} className="text-primary" />
            {tr('weekly_ranking') || 'Ranking Semanal'}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{tr('ranking_reset') || 'Reseta todo domingo'}</p>
          {ranking.map((r, i) => {
            const isUser = r.name.includes('⭐');
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
            return (
              <div key={i} className={`bg-card rounded-xl p-3 border flex items-center gap-3 ${
                isUser ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                <span className="text-lg font-black w-8 text-center">{medal}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.xp} XP · {r.streak} 🔥</p>
                </div>
                {!isUser && (
                  <button onClick={() => toggleFollow(r.name)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      follows.has(r.name) ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:text-primary'}`}>
                    {follows.has(r.name) ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Feed Section */
        <>
          {/* Post area */}
          <div className="bg-card rounded-xl p-3 border border-border">
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={tr('share_something')} rows={2}
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none resize-none" />
            <div className="flex justify-end mt-2">
              <button onClick={handleSend} disabled={!newComment.trim()}
                className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40">
                <Send size={14} className="inline mr-1" /> {tr('post') || 'Publicar'}
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            {comments.map(c => (
              <div key={c.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{c.name}</span>
                    {!c.name.includes(name) && (
                      <button onClick={() => toggleFollow(c.name)} className="text-muted-foreground hover:text-primary">
                        {follows.has(c.name) ? <UserCheck size={12} /> : <UserPlus size={12} />}
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-sm text-foreground mb-2">{c.text}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleLike(c.id)} className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Heart size={12} className={c.likes > 0 ? 'fill-red-500 text-red-500' : ''} /> {c.likes}
                  </button>
                  <button onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    <MessageCircle size={12} /> {tr('reply')}
                  </button>
                  {c.replies.length > 0 && (
                    <button onClick={() => toggleReplies(c.id)} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      {expandedReplies.has(c.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {c.replies.length} {tr('reply')}
                    </button>
                  )}
                </div>

                {replyingTo === c.id && (
                  <div className="flex gap-2 mt-3">
                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleReply(c.id)}
                      placeholder={`${tr('reply')}...`}
                      className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus />
                    <button onClick={() => handleReply(c.id)} className="bg-primary text-primary-foreground rounded-lg px-3 hover:opacity-90 active:scale-95 transition-all">
                      <Send size={14} />
                    </button>
                  </div>
                )}

                {expandedReplies.has(c.id) && c.replies.length > 0 && (
                  <div className="ml-4 mt-3 space-y-2 border-l-2 border-primary/20 pl-3">
                    {c.replies.map(r => (
                      <div key={r.id} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-foreground">{r.name}</span>
                          <span className="text-[10px] text-muted-foreground">{r.time}</span>
                        </div>
                        <p className="text-xs text-foreground">{r.text}</p>
                        <button onClick={() => handleLike(r.id, true, c.id)} className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-1 transition-colors">
                          <Heart size={10} className={r.likes > 0 ? 'fill-red-500 text-red-500' : ''} /> {r.likes}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIP Features */}
      <div className="space-y-3">
        {[
          { title: tr('talk_natives'), desc: tr('talk_natives_desc') },
          { title: tr('ai_assistant'), desc: tr('ai_assistant_desc') },
          { title: tr('language_reactor'), desc: tr('language_reactor_desc') },
        ].map((feature, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 border-2 border-dashed border-primary/30 flex items-center gap-3">
            <Lock className="text-primary/50 flex-shrink-0" size={20} />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-foreground">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
            <a href={VIP_URL} target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary/20 transition-colors">VIP</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityTab;
