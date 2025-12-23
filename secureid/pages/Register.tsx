
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/userService';
import { loginUser, getKnownEmails } from '../services/authService';

interface RegisterProps {
  onAuthSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    idNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    
    if (!formData.email || !formData.password || !formData.fullName || !formData.idNumber) {
      setError("All fields are mandatory.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.idNumber.length < 12) {
      setError("Aadhaar Number must be at least 12 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await register(
      formData.email,
      formData.password,
      formData.fullName,
      formData.idNumber
    );

    if (res.success && res.data) {
      // Trigger native credential manager storage prompt
      if ('PasswordCredential' in window) {
        try {
          const cred = new (window as any).PasswordCredential({
            id: formData.email,
            password: formData.password,
            name: formData.fullName
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
      setError(res.error || "Registration failed.");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;
  const isConfirmTouched = formData.confirmPassword.length > 0;
  
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(formData.email.toLowerCase()) && s.toLowerCase() !== formData.email.toLowerCase()
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="w-full max-w-lg space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100 relative">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h2 className="mt-8 text-3xl font-extrabold text-slate-900">Create Identity</h2>
          <p className="mt-2 text-sm text-slate-500">Secure AES-256 Vault Registration</p>
        </div>
        
        <form className="mt-10 space-y-5" onSubmit={handleSubmit} autoComplete="on">
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg animate-in slide-in-from-right-4">
              <p className="text-sm text-rose-800 font-bold">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name <span className="text-rose-500">*</span></label>
              <div className="relative group">
                <input name="fullName" type="text" required autoComplete="name" className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-violet-600 sm:text-sm transition-all bg-slate-50/30 focus:bg-white" placeholder="Jane Doe" value={formData.fullName} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1.5 relative" ref={suggestionRef}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address <span className="text-rose-500">*</span></label>
              <input 
                name="email" 
                type="email" 
                required 
                autoComplete="username email" 
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-violet-600 sm:text-sm transition-all bg-slate-50/30 focus:bg-white" 
                placeholder="jane@example.com" 
                value={formData.email} 
                onChange={(e) => {
                  handleChange(e);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {filteredSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-violet-50 transition-colors flex items-center gap-3"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, email: s }));
                        setShowSuggestions(false);
                      }}
                    >
                      <i className="fas fa-history text-slate-300"></i>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required autoComplete="new-password" className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-violet-600 sm:text-sm transition-all bg-slate-50/30 focus:bg-white" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-violet-600">
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Confirm <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input name="confirmPassword" type={showPassword ? "text" : "password"} required autoComplete="new-password" className={`block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset transition-all sm:text-sm bg-slate-50/30 focus:bg-white focus:ring-2 ${passwordsMatch ? 'ring-emerald-500 focus:ring-emerald-600' : isConfirmTouched ? 'ring-rose-400 focus:ring-rose-500' : 'ring-slate-200 focus:ring-violet-600'}`} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                {passwordsMatch && (
                  <div className="absolute -top-7 right-0 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded shadow-lg animate-bounce font-black tracking-widest uppercase">
                    Matched
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 ml-1">
              <i className="fas fa-fingerprint"></i> Aadhaar / ID Number <span className="text-rose-500">*</span>
            </label>
            <input name="idNumber" type="text" required minLength={12} className="block w-full rounded-xl border-2 border-indigo-50 py-3 px-4 text-slate-900 focus:border-indigo-600 focus:ring-0 sm:text-sm transition-all bg-indigo-50/30 font-mono tracking-widest" placeholder="1234 5678 9012" value={formData.idNumber} onChange={handleChange} />
            <div className="flex items-center gap-1.5 px-1">
               <i className="fas fa-shield-halved text-[10px] text-emerald-500"></i>
               <p className="text-[10px] text-slate-400 font-medium">Automatic AES-256 GCM Encryption Enabled</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 mt-6 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50">
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
            Signup
          </button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-slate-500 hover:text-indigo-600 font-bold transition-colors">Existing user? Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
