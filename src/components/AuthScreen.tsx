import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const AuthScreen = ({ onClose }: Props) => {
  const { nativeLang } = useApp();
  const tr = useTranslation(nativeLang);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const labels: Record<string, Record<string, string>> = {
    pt: { login: 'Entrar', signup: 'Criar conta', forgot: 'Esqueci a senha', email: 'E-mail', password: 'Senha', no_account: 'Não tem conta?', has_account: 'Já tem conta?', send_reset: 'Enviar link', back: 'Voltar', success_signup: 'Verifique seu e-mail para confirmar!', success_reset: 'Link enviado! Verifique seu e-mail.', error_fill: 'Preencha todos os campos', error_password: 'Senha deve ter pelo menos 6 caracteres' },
    en: { login: 'Log in', signup: 'Sign up', forgot: 'Forgot password', email: 'Email', password: 'Password', no_account: "Don't have an account?", has_account: 'Already have an account?', send_reset: 'Send reset link', back: 'Back', success_signup: 'Check your email to confirm!', success_reset: 'Link sent! Check your email.', error_fill: 'Fill in all fields', error_password: 'Password must be at least 6 characters' },
    es: { login: 'Iniciar sesión', signup: 'Crear cuenta', forgot: 'Olvidé mi contraseña', email: 'Correo', password: 'Contraseña', no_account: '¿No tienes cuenta?', has_account: '¿Ya tienes cuenta?', send_reset: 'Enviar enlace', back: 'Volver', success_signup: '¡Revisa tu correo para confirmar!', success_reset: '¡Enlace enviado!', error_fill: 'Rellena todos los campos', error_password: 'La contraseña debe tener al menos 6 caracteres' },
    fr: { login: 'Se connecter', signup: "S'inscrire", forgot: 'Mot de passe oublié', email: 'E-mail', password: 'Mot de passe', no_account: "Pas de compte ?", has_account: 'Déjà un compte ?', send_reset: 'Envoyer le lien', back: 'Retour', success_signup: 'Vérifiez votre e-mail !', success_reset: 'Lien envoyé !', error_fill: 'Remplissez tous les champs', error_password: 'Le mot de passe doit comporter au moins 6 caractères' },
    de: { login: 'Anmelden', signup: 'Registrieren', forgot: 'Passwort vergessen', email: 'E-Mail', password: 'Passwort', no_account: 'Kein Konto?', has_account: 'Schon ein Konto?', send_reset: 'Link senden', back: 'Zurück', success_signup: 'Überprüfe deine E-Mail!', success_reset: 'Link gesendet!', error_fill: 'Alle Felder ausfüllen', error_password: 'Passwort muss mindestens 6 Zeichen lang sein' },
    it: { login: 'Accedi', signup: 'Registrati', forgot: 'Password dimenticata', email: 'E-mail', password: 'Password', no_account: 'Non hai un account?', has_account: 'Hai già un account?', send_reset: 'Invia link', back: 'Indietro', success_signup: 'Controlla la tua email!', success_reset: 'Link inviato!', error_fill: 'Compila tutti i campi', error_password: 'La password deve avere almeno 6 caratteri' },
    ja: { login: 'ログイン', signup: 'アカウント作成', forgot: 'パスワードを忘れた', email: 'メール', password: 'パスワード', no_account: 'アカウントがない？', has_account: 'アカウントをお持ちですか？', send_reset: 'リンクを送信', back: '戻る', success_signup: 'メールを確認してください！', success_reset: 'リンクが送信されました！', error_fill: 'すべてのフィールドに入力してください', error_password: 'パスワードは6文字以上必要です' },
    ko: { login: '로그인', signup: '회원가입', forgot: '비밀번호 찾기', email: '이메일', password: '비밀번호', no_account: '계정이 없으신가요?', has_account: '이미 계정이 있으신가요?', send_reset: '링크 보내기', back: '뒤로', success_signup: '이메일을 확인하세요!', success_reset: '링크가 전송되었습니다!', error_fill: '모든 필드를 입력하세요', error_password: '비밀번호는 6자 이상이어야 합니다' },
  };

  const l = labels[nativeLang] || labels.en;

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) { setError(l.error_fill); return; }
    if (mode !== 'forgot' && password.length < 6) { setError(l.error_password); return; }
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); } else { onClose(); }
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) { setError(error.message); } else { setMessage(l.success_signup); }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) { setError(error.message); } else { setMessage(l.success_reset); }
      }
    } catch (e: any) {
      setError(e.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></button>
          <h2 className="text-xl font-black text-foreground">
            {mode === 'login' ? l.login : mode === 'signup' ? l.signup : l.forgot}
          </h2>
          <div className="w-5" />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={l.email}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={l.password}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-card border border-border rounded-xl pl-10 pr-10 py-3 text-foreground placeholder:text-muted-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          {message && <p className="text-green-500 text-sm font-bold text-center">{message}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-primary text-primary-foreground font-black py-3 rounded-xl text-lg active:scale-95 transition-transform disabled:opacity-50">
            {loading ? '...' : mode === 'login' ? l.login : mode === 'signup' ? l.signup : l.send_reset}
          </button>

          <div className="text-center space-y-2">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('forgot')} className="text-xs text-muted-foreground hover:text-primary">{l.forgot}</button>
                <p className="text-sm text-muted-foreground">{l.no_account}{' '}
                  <button onClick={() => setMode('signup')} className="text-primary font-bold">{l.signup}</button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-muted-foreground">{l.has_account}{' '}
                <button onClick={() => setMode('login')} className="text-primary font-bold">{l.login}</button>
              </p>
            )}
            {mode === 'forgot' && (
              <button onClick={() => setMode('login')} className="text-sm text-primary font-bold">{l.back}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
