import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Certificate } from '../types';
import { Award, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';

export const VerifyCertificate: React.FC = () => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Certificate | null | 'not_found'>(null);
  const [searching, setSearching] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setSearching(true);
    setResult(null);

    try {
      const q = query(collection(db, 'certificates'), where('certificateCode', '==', code.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const certData = snap.docs[0].data() as Certificate;
        setResult(certData);
      } else {
        setResult('not_found');
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setResult('not_found');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <Award className="w-8 h-8 text-[#0B132B]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('verifyCertificate')}</h1>
          <p className="text-gray-400 text-sm">
            Enter the unique certificate verification code to authenticate any MED ACADEMY certificate.
          </p>
        </div>

        <form onSubmit={handleVerify} className="bg-[#0B132B] p-6 rounded-2xl border border-[#1C2541] shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Certificate Code</label>
            <div className="relative">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 rtl:left-auto rtl:right-4 top-3.5" />
              <input
                type="text"
                placeholder="e.g. MED-CERT-983214"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#1C2541] text-white rounded-xl pl-12 pr-4 py-3.5 text-sm uppercase font-mono tracking-wider placeholder-gray-500 border border-[#3A506B] focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-[#0B132B] font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            {searching ? 'Verifying...' : t('verify')}
          </button>
        </form>

        {result === 'not_found' && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center space-x-4 rtl:space-x-reverse text-red-400">
            <XCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white">Invalid Certificate</h4>
              <p className="text-xs text-red-300 mt-1">{t('certificateInvalid')}</p>
            </div>
          </div>
        )}

        {result && result !== 'not_found' && (
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0B132B] to-[#1C2541] border border-cyan-500/50 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-cyan-400">
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg text-white">Verified Authentic</h4>
                <p className="text-xs text-cyan-300">{t('certificateVerified')}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#070D1D] border border-[#3A506B] space-y-4">
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Recipient Name</span>
                <span className="text-xl font-bold text-white">{result.userName}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400 uppercase font-semibold">Course Title</span>
                <span className="text-lg font-bold text-cyan-300">{result.courseTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-semibold">Issue Date</span>
                  <span className="text-sm font-medium text-gray-200">{new Date(result.issuedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 uppercase font-semibold">Verification Code</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">{result.certificateCode}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
