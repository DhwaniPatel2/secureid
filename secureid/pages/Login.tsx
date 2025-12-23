
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/userService';
import { loginUser, getKnownEmails } from '../services/authService';

interface LoginProps {
  onAuthSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    setSuggestions(getKnownEmails());

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are mandatory.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(email, password);
    if (res.success && res.data) {
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Explicitly tell the browser/Google Password Manager to store credentials
      if ('PasswordCredential' in window) {
        try {
          const cred = new (window as any).PasswordCredential({
            id: email,
            password: password,
            name: res.data.user.fullName
          });
          navigator.credentials.store(cred);
        } catch (err) {
          console.debug('Credential storage skip:', err);
        }
      }
      
      loginUser(res.data.user, res.data.token);
      onAuthSuccess();
      navigate('/dashboard');
    } else {
      setError(res.error || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(email.toLowerCase()) && s.toLowerCase() !== email.toLowerCase()
  );

  const isKnownUser = email !== '' && suggestions.includes(email);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 relative transition-all duration-300">
        {isKnownUser && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] tracking-widest font-bold px-4 py-1.5 rounded-full shadow-lg z-10 animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
            SECURE ACCOUNT DETECTED
          </div>
        )}

        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <i className="fas fa-fingerprint text-white text-2xl"></i>
          </div>
          <h2 className="mt-8 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Secure Login
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enter your credentials to access your profile.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit} autoComplete="on">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg animate-in slide-in-from-right-4">
              <div className="flex">
                <i className="fas fa-exclamation-triangle text-rose-500 mt-0.5"></i>
                <div className="ml-3">
                  <p className="text-sm text-rose-800 font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-5">
            <div className="relative" ref={suggestionRef}>
              <label htmlFor="email-address" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  autoComplete="username email"
                  className="block w-full rounded-xl border-0 py-3 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all bg-slate-50/30 focus:bg-white"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
              
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent logins</span>
                  </div>
                  {filteredSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setEmail(s);
                        setShowSuggestions(false);
                      }}
                    >
                      <i className="fas fa-user-circle text-slate-300"></i>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i className="fas fa-key text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all bg-slate-50/30 focus:bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-colors cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-600 font-medium cursor-pointer">
                Remember me
              </label>
            </div>
            <Link to="/register" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Create Account
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-sign-in-alt mr-2 opacity-70"></i>
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
