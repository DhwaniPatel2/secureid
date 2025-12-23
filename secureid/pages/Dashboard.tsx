
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [isIdVisible, setIsIdVisible] = useState(false);

  // Format membership date
  const membershipDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  /**
   * Masks the first 8 characters of the ID number.
   */
  const formatMaskedId = (id: string) => {
    const cleanId = id.replace(/\s/g, '');
    if (cleanId.length < 12) return id;
    
    const last4 = cleanId.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Identity Management</h1>
          <p className="mt-1 text-slate-500 font-medium">Verified profile status and security clearance.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
             <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
             SYSTEM ONLINE
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        {/* Profile Card - Centered */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-indigo-100">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 h-32 relative">
               <div className="absolute top-4 right-4 text-white/20 text-4xl">
                 <i className="fas fa-shield-halved"></i>
               </div>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="h-28 w-28 bg-white rounded-2xl p-1.5 shadow-xl mx-auto border border-slate-100">
                  <div className="h-full w-full bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-4xl">
                    {user.fullName.charAt(0)}
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{user.fullName}</h2>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Level 1 Access
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Metadata</h3>
                
                {/* Email Row */}
                <div className="group">
                  <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">Authenticated Email</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all group-hover:border-indigo-200 group-hover:bg-white">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <i className="fas fa-envelope text-xs"></i>
                    </div>
                    <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Aadhaar Row with Visibility Toggle */}
                <div className="group">
                  <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">Aadhaar / Identity</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 transition-all group-hover:border-indigo-300 group-hover:bg-white">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                      <i className="fas fa-id-card text-xs"></i>
                    </div>
                    <p className="text-sm font-mono font-bold text-indigo-700 tracking-wider">
                      {isIdVisible ? user.idNumber : formatMaskedId(user.idNumber)}
                    </p>
                    <button 
                      onClick={() => setIsIdVisible(!isIdVisible)}
                      className="ml-auto w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all focus:outline-none"
                      title={isIdVisible ? "Mask ID" : "Show Full ID"}
                    >
                      <i className={`fas ${isIdVisible ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                  </div>
                </div>

                {/* Date Row */}
                <div className="group">
                  <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">Initialization Date</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all group-hover:border-indigo-200 group-hover:bg-white">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <i className="fas fa-calendar-check text-xs"></i>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{membershipDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl text-rose-600 font-black text-xs uppercase tracking-widest border-2 border-rose-50 hover:bg-rose-50 transition-all active:scale-[0.98]"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
