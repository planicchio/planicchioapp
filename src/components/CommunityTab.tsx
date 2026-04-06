import { useState, useEffect, useMemo, useCallback } from 'react';
import { Send, MessageCircle, ChevronDown, ChevronUp, Heart, Flame, Trophy, UserPlus, UserCheck, Repeat2, Settings, Globe, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';

const VIP_URL = 'https://buy.stripe.com/9B614o1gU3dXeHq7UeaMU01';

const countryFlags: Record<string, string> = {
  'Brasil': '🇧🇷', 'USA': '🇺🇸', 'España': '🇪🇸', 'France': '🇫🇷',
  'Deutschland': '🇩🇪', 'Italia': '🇮🇹', 'Japan': '🇯🇵', 'Korea': '🇰🇷',
  'Portugal': '🇵🇹', 'México': '🇲🇽', 'Argentina': '🇦🇷', 'Colombia': '🇨🇴',
  'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺',
};

interface Post {
  id: string;
  user_name: string;
  user_id: string | null;
  text: string;
  likes_count: number;
  reposts_count: number;
  repost_of: string | null;
  created_at: string;
  replies: Reply[];
  liked: boolean;
}

interface Reply {
  id: string;
  user_name: string;
  user_id: string | null;
  text: string;
  likes_count: number;
  created_at: string;
  liked: boolean;
}

interface UserProfile {
  user_name: string;
  bio: string;
  country: string;
  interests: string[];
  avatar_emoji: string;
}

function timeAgo(dateStr: string, tr: (k: string) => string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return tr('now');
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

const CommunityTab = () => {
  const { name, nativeLang, xp, streak } = useApp();
  const tr = useTranslation(nativeLang);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<'feed' | 'ranking' | 'profile'>('feed');
  const [follows, setFollows] = useState<Set<string>>(new Set());
  const [ranking, setRanking] = useState<{ name: string; xp: number; streak: number }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Profile editing
  const [profile, setProfile] = useState<UserProfile>({
    user_name: name, bio: '', country: '', interests: [], avatar_emoji: '🌍'
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>(profile);

  const interestOptions = ['📚 Languages', '🎮 Games', '🎵 Music', '🎬 Movies', '✈️ Travel', '🍕 Food', '⚽ Sports', '💻 Tech', '🎨 Art', '📷 Photography'];

  // Get user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null);
    });
  }, []);

  // Load posts from Supabase
  const loadPosts = useCallback(async () => {
    try {
      const { data: postsData } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(50);
      if (!postsData) { setLoading(false); return; }

      const postIds = postsData.map(p => p.id);
      const { data: repliesData } = await supabase.from('community_replies').select('*').in('post_id', postIds).order('created_at', { ascending: true });
      const { data: likesData } = await supabase.from('community_likes').select('*');

      const userLikedPostIds = new Set(likesData?.filter(l => l.user_id === userId && l.post_id).map(l => l.post_id) || []);
      const userLikedReplyIds = new Set(likesData?.filter(l => l.user_id === userId && l.reply_id).map(l => l.reply_id) || []);

      const mapped: Post[] = postsData.map(p => ({
        id: p.id,
        user_name: p.user_name,
        user_id: p.user_id,
        text: p.text,
        likes_count: p.likes_count,
        reposts_count: (p as any).reposts_count || 0,
        repost_of: (p as any).repost_of || null,
        created_at: p.created_at,
        liked: userLikedPostIds.has(p.id),
        replies: (repliesData || []).filter(r => r.post_id === p.id).map(r => ({
          id: r.id,
          user_name: r.user_name,
          user_id: r.user_id,
          text: r.text,
          likes_count: r.likes_count,
          created_at: r.created_at,
          liked: userLikedReplyIds.has(r.id),
        })),
      }));
      setPosts(mapped);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [userId]);

  // Load follows
  const loadFollows = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('community_follows').select('following_name').eq('follower_id', userId);
    if (data) setFollows(new Set(data.map(f => f.following_name)));
  }, [userId]);

  // Load ranking
  const loadRanking = useCallback(async () => {
    const currentWeek = getCurrentWeek();
    const { data } = await supabase.from('community_ranking').select('*').eq('week', currentWeek).order('xp', { ascending: false }).limit(20);
    if (data && data.length > 0) {
      setRanking(data.map(r => ({ name: r.user_name, xp: r.xp, streak: r.streak })));
    } else {
      setRanking([
        { name: 'Maria 🇧🇷', xp: 850, streak: 15 },
        { name: 'João 🇧🇷', xp: 720, streak: 12 },
        { name: 'Luna 🇪🇸', xp: 520, streak: 7 },
        { name: 'Yuki 🇯🇵', xp: 490, streak: 6 },
        { name: 'Sophie 🇫🇷', xp: 460, streak: 5 },
      ]);
    }
  }, []);

  // Load profile
  const loadProfile = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (data) {
      const p = { user_name: data.user_name, bio: data.bio || '', country: data.country || '', interests: data.interests || [], avatar_emoji: data.avatar_emoji || '🌍' };
      setProfile(p);
      setProfileForm(p);
    }
  }, [userId]);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  useEffect(() => { loadFollows(); }, [loadFollows]);
  useEffect(() => { loadRanking(); }, [loadRanking]);
  useEffect(() => { loadProfile(); }, [loadProfile]);

  // Upsert ranking for current user
  useEffect(() => {
    if (!name) return;
    const currentWeek = getCurrentWeek();
    supabase.from('community_ranking').upsert(
      { user_name: `${name} ⭐`, xp, streak, week: currentWeek },
      { onConflict: 'id' }
    ).then(() => loadRanking());
  }, [xp, streak, name]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase.channel('community-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => loadPosts())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_replies' }, () => loadPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadPosts]);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    await supabase.from('community_posts').insert({
      user_name: `${name} 🌍`, text: newComment, user_id: userId,
    });
    setNewComment('');
    loadPosts();
  };

  const handleReply = async (postId: string) => {
    if (!replyText.trim()) return;
    await supabase.from('community_replies').insert({
      post_id: postId, user_name: `${name} 🌍`, text: replyText, user_id: userId,
    });
    setReplyText('');
    setReplyingTo(null);
    setExpandedReplies(prev => new Set(prev).add(postId));
    loadPosts();
  };

  const handleLikePost = async (postId: string, currentlyLiked: boolean) => {
    if (!userId) return;
    if (currentlyLiked) {
      await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', userId);
    } else {
      await supabase.from('community_likes').insert({ post_id: postId, user_id: userId });
    }
    // Update count
    const { count } = await supabase.from('community_likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
    await supabase.from('community_posts').update({ likes_count: count || 0 }).eq('id', postId);
    loadPosts();
  };

  const handleLikeReply = async (replyId: string, currentlyLiked: boolean) => {
    if (!userId) return;
    if (currentlyLiked) {
      await supabase.from('community_likes').delete().eq('reply_id', replyId).eq('user_id', userId);
    } else {
      await supabase.from('community_likes').insert({ reply_id: replyId, user_id: userId });
    }
    const { count } = await supabase.from('community_likes').select('*', { count: 'exact', head: true }).eq('reply_id', replyId);
    await supabase.from('community_replies').update({ likes_count: count || 0 }).eq('id', replyId);
    loadPosts();
  };

  const handleRepost = async (post: Post) => {
    await supabase.from('community_posts').insert({
      user_name: `${name} 🌍`, text: `🔁 ${post.user_name}: "${post.text}"`,
      user_id: userId, repost_of: post.id,
    });
    loadPosts();
  };

  const toggleFollow = async (userName: string) => {
    if (!userId) return;
    if (follows.has(userName)) {
      await supabase.from('community_follows').delete().eq('follower_id', userId).eq('following_name', userName);
      setFollows(prev => { const n = new Set(prev); n.delete(userName); return n; });
    } else {
      await supabase.from('community_follows').insert({ follower_id: userId, following_name: userName });
      setFollows(prev => new Set(prev).add(userName));
    }
  };

  const saveProfile = async () => {
    if (!userId) return;
    await supabase.from('user_profiles').upsert({
      user_id: userId, ...profileForm,
    }, { onConflict: 'user_id' });
    setProfile(profileForm);
    setEditingProfile(false);
  };

  const toggleReplies = (id: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const combinedRanking = useMemo(() => {
    const userEntry = { name: `${name} ⭐`, xp, streak };
    const filtered = ranking.filter(r => !r.name.includes('⭐'));
    return [...filtered, userEntry].sort((a, b) => b.xp - a.xp).slice(0, 20);
  }, [ranking, name, xp, streak]);

  return (
    <div className="space-y-5 pb-4">
      <div className="text-center mb-2">
        <span className="text-4xl">👥</span>
        <h2 className="text-2xl font-black text-foreground">{tr('community_title')}</h2>
        <p className="text-xs text-muted-foreground">{tr('community_desc')}</p>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2">
        {(['feed', 'ranking', 'profile'] as const).map(section => (
          <button key={section} onClick={() => setActiveSection(section)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
              activeSection === section ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
            {section === 'feed' ? `💬 ${tr('social_feed')}` : section === 'ranking' ? `🏆 ${tr('ranking')}` : `👤 ${tr('profile')}`}
          </button>
        ))}
      </div>

      {/* Global Streak */}
      <div className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" size={20} />
          <span className="font-bold text-sm text-foreground">{tr('your_streak')}</span>
        </div>
        <span className="font-black text-primary text-lg">{streak} 🔥</span>
      </div>

      {activeSection === 'profile' ? (
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-5 border border-border text-center">
            <span className="text-6xl block mb-2">{profile.avatar_emoji}</span>
            <h3 className="text-xl font-black text-foreground">{profile.user_name}</h3>
            {profile.country && <p className="text-sm text-muted-foreground">{countryFlags[profile.country] || '🌍'} {profile.country}</p>}
            {profile.bio && <p className="text-sm text-foreground mt-2 italic">"{profile.bio}"</p>}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {profile.interests.map((i, idx) => (
                  <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{i}</span>
                ))}
              </div>
            )}
            <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{follows.size}</strong> {tr('following') || 'seguindo'}</span>
              <span><strong className="text-foreground">{xp}</strong> XP</span>
              <span><strong className="text-foreground">{streak}</strong> 🔥</span>
            </div>
            <button onClick={() => { setProfileForm(profile); setEditingProfile(!editingProfile); }}
              className="mt-3 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform">
              <Settings size={14} className="inline mr-1" /> {tr('edit_profile') || 'Editar Perfil'}
            </button>
          </div>

          {editingProfile && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-4 border border-border space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground">{tr('change_name')}</label>
                <input value={profileForm.user_name} onChange={e => setProfileForm({...profileForm, user_name: e.target.value})}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Bio</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                  rows={2} maxLength={150} placeholder={tr('bio_placeholder') || 'Conte sobre você...'}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Globe size={12} /> {tr('country') || 'País'}</label>
                <select value={profileForm.country} onChange={e => setProfileForm({...profileForm, country: e.target.value})}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm">
                  <option value="">---</option>
                  {Object.keys(countryFlags).map(c => <option key={c} value={c}>{countryFlags[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><BookOpen size={12} /> {tr('interests') || 'Interesses'}</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {interestOptions.map(i => (
                    <button key={i} onClick={() => {
                      const has = profileForm.interests.includes(i);
                      setProfileForm({...profileForm, interests: has ? profileForm.interests.filter(x => x !== i) : [...profileForm.interests, i]});
                    }}
                      className={`text-xs px-2 py-1 rounded-full font-bold transition-colors ${
                        profileForm.interests.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Avatar</label>
                <div className="flex gap-2 mt-1">
                  {['🌍', '🎓', '🚀', '🌸', '⭐', '🎨', '🎵', '🏆'].map(e => (
                    <button key={e} onClick={() => setProfileForm({...profileForm, avatar_emoji: e})}
                      className={`text-2xl p-1 rounded-lg ${profileForm.avatar_emoji === e ? 'bg-primary/20 ring-2 ring-primary' : ''}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveProfile}
                className="w-full bg-primary text-primary-foreground font-bold py-2.5 rounded-xl active:scale-95 transition-transform">
                {tr('save')}
              </button>
            </motion.div>
          )}
        </div>
      ) : activeSection === 'ranking' ? (
        <div className="space-y-2">
          <h3 className="font-black text-foreground flex items-center gap-2">
            <Trophy size={16} className="text-primary" />
            {tr('weekly_ranking')}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">{tr('ranking_reset')}</p>
          {combinedRanking.map((r, i) => {
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
                <Send size={14} className="inline mr-1" /> {tr('post')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <span className="text-4xl animate-bounce inline-block">🐱</span>
              <p className="text-sm text-muted-foreground mt-2">{tr('loading') || 'Carregando...'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-4xl">💬</span>
                  <p className="text-sm text-muted-foreground mt-2">{tr('no_posts') || 'Seja o primeiro a postar!'}</p>
                </div>
              )}
              {posts.map(c => (
                <div key={c.id} className="bg-card rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{c.user_name}</span>
                      {c.user_id && c.user_id !== userId && (
                        <button onClick={() => toggleFollow(c.user_name)} className="text-muted-foreground hover:text-primary">
                          {follows.has(c.user_name) ? <UserCheck size={12} /> : <UserPlus size={12} />}
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{timeAgo(c.created_at, tr)}</span>
                  </div>
                  <p className="text-sm text-foreground mb-2">{c.text}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleLikePost(c.id, c.liked)}
                      className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition-colors">
                      <Heart size={14} className={c.liked ? 'fill-red-500 text-red-500' : ''} /> {c.likes_count}
                    </button>
                    <button onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                      <MessageCircle size={14} /> {tr('reply')}
                    </button>
                    <button onClick={() => handleRepost(c)}
                      className="text-xs text-muted-foreground hover:text-green-500 flex items-center gap-1 transition-colors">
                      <Repeat2 size={14} /> {c.reposts_count}
                    </button>
                    {c.replies.length > 0 && (
                      <button onClick={() => toggleReplies(c.id)} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                        {expandedReplies.has(c.id) ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {c.replies.length}
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

                  <AnimatePresence>
                    {expandedReplies.has(c.id) && c.replies.length > 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="ml-4 mt-3 space-y-2 border-l-2 border-primary/20 pl-3 overflow-hidden">
                        {c.replies.map(r => (
                          <div key={r.id} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-foreground">{r.user_name}</span>
                              <span className="text-[10px] text-muted-foreground">{timeAgo(r.created_at, tr)}</span>
                            </div>
                            <p className="text-xs text-foreground">{r.text}</p>
                            <button onClick={() => handleLikeReply(r.id, r.liked)}
                              className="text-[10px] text-muted-foreground hover:text-red-500 flex items-center gap-1 mt-1 transition-colors">
                              <Heart size={10} className={r.liked ? 'fill-red-500 text-red-500' : ''} /> {r.likes_count}
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}

export default CommunityTab;
