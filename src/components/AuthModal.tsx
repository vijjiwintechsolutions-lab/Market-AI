import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  auth,
  googleProvider,
  githubProvider,
  appleProvider,
  microsoftProvider,
  twitterProvider,
  signInWithPopup,
  firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  userCredits?: number;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userCredits = 100,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthSignIn = async (providerName: string, providerObj: any) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoadingProvider(providerName);

    try {
      const result = await signInWithPopup(auth, providerObj);
      const user = result.user;
      setSuccessMsg(`Welcome, ${user.displayName || user.email || 'User'}! Successfully signed in with ${providerName}.`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(`Error during ${providerName} sign in:`, err);
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        setErrorMsg(
          `${providerName} sign-in is not yet enabled in the Firebase Console. Please enable ${providerName} under Firebase Authentication > Sign-in method.`
        );
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in window was closed before completion.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg('An account already exists with the same email address using a different sign-in method.');
      } else {
        setErrorMsg(err.message || `Failed to sign in with ${providerName}.`);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoadingProvider('email');

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        setSuccessMsg(`Account created successfully! Welcome ${displayName || email}.`);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg(`Signed in as ${userCredential.user.displayName || userCredential.user.email}.`);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('Email/Password sign-in is not enabled in Firebase Console. You can sign in using Google directly!');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please check your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Try signing in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters long.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleSignOut = async () => {
    setLoadingProvider('logout');
    try {
      await firebaseSignOut(auth);
      setSuccessMsg('Successfully signed out.');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign out.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0F0F14] border border-white/15 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-[#13131A] to-indigo-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Shield className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                {currentUser ? 'User Account & Profile' : 'Sign In / Register'}
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {currentUser ? 'Managed via Firebase Auth' : 'Connect with your favorite account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="p-6 space-y-6">
            <div className="bg-[#151520] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User Avatar'}
                  className="w-14 h-14 rounded-full border-2 border-indigo-500/50 object-cover shadow"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-indigo-600/30 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-300 font-bold text-xl shadow">
                  {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-1 overflow-hidden">
                <h3 className="text-sm font-bold text-white truncate">
                  {currentUser.displayName || 'AI Studio Member'}
                </h3>
                <p className="text-xs font-mono text-slate-400 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authenticated
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {userCredits} Credits
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0E] border border-white/5 rounded-xl p-4 space-y-2 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">User ID:</span>
                <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
                  {currentUser.uid}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sign-in Provider:</span>
                <span className="text-indigo-400 font-bold capitalize">
                  {currentUser.providerData[0]?.providerId.replace('.com', '') || 'Firebase'}
                </span>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              onClick={handleSignOut}
              disabled={loadingProvider === 'logout'}
              className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{loadingProvider === 'logout' ? 'Signing Out...' : 'Sign Out of Account'}</span>
            </button>
          </div>
        ) : (
          /* NOT LOGGED IN - LOGIN & SIGNUP UI */
          <div className="p-5 space-y-5">
            {/* MESSAGES */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 font-sans leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-rose-300">Authentication Note:</span>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MAJOR PLATFORM OAUTH BUTTONS */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
                Sign in with Major Platforms
              </span>

              {/* GOOGLE (Primary) */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('Google', googleProvider)}
                disabled={!!loadingProvider}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-all shadow cursor-pointer border border-white/20 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {loadingProvider === 'Google' ? 'Connecting to Google...' : 'Continue with Google'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* GITHUB */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('GitHub', githubProvider)}
                  disabled={!!loadingProvider}
                  className="py-2 px-3 bg-[#181822] hover:bg-[#222230] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                {/* APPLE */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('Apple', appleProvider)}
                  disabled={!!loadingProvider}
                  className="py-2 px-3 bg-[#181822] hover:bg-[#222230] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.01c.67-.82 1.12-1.97.99-3.11-.97.04-2.14.65-2.83 1.46-.62.72-1.16 1.89-1.01 3.01 1.08.08 2.18-.54 2.85-1.36z" />
                  </svg>
                  <span>Apple ID</span>
                </button>

                {/* MICROSOFT */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('Microsoft', microsoftProvider)}
                  disabled={!!loadingProvider}
                  className="py-2 px-3 bg-[#181822] hover:bg-[#222230] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>

                {/* TWITTER / X */}
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('Twitter', twitterProvider)}
                  disabled={!!loadingProvider}
                  className="py-2 px-3 bg-[#181822] hover:bg-[#222230] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </button>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0F0F14] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
                Or with Email
              </span>
            </div>

            {/* MODE SWITCHER */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'signin' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* EMAIL / PASSWORD FORM */}
            <form onSubmit={handleEmailAuth} className="space-y-3 font-sans">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-9 pr-3 py-2 bg-[#15151A] text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#15151A] text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#15151A] text-white placeholder-slate-500 text-xs rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!!loadingProvider}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-[0.99] mt-2"
              >
                <span>{loadingProvider === 'email' ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* FOOTER */}
        <div className="p-4 bg-[#0A0A0D] border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Secured by Firebase Authentication</span>
          <a
            href="https://firebase.google.com/docs/auth"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline flex items-center gap-1"
          >
            Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
