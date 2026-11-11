import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Certificate } from '../types';
import { Award, ShieldCheck, Download, ExternalLink } from 'lucide-react';

interface CertificatesProps {
  setActivePage: (page: string) => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ setActivePage }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'certificates'), where('userId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
        setCertificates(list);
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center">
        <p className="text-cyan-400 font-medium">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('certificates')}</h1>
          <p className="text-gray-400 text-sm">
            Download and verify your earned MED ACADEMY completion certificates.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-20 bg-[#0B132B] rounded-2xl border border-[#1C2541]">
            <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 font-medium">You have not earned any certificates yet.</p>
            <p className="text-xs text-gray-500 mt-1">Complete 100% of a course to earn an accredited certificate.</p>
            <button
              onClick={() => setActivePage('courses')}
              className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-500 text-[#0B132B] font-bold text-sm"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-8 rounded-3xl bg-gradient-to-br from-[#0B132B] to-[#1C2541] border border-cyan-500/30 shadow-2xl space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Award className="w-32 h-32 text-cyan-400" />
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">MED ACADEMY Certificate</h4>
                    <p className="text-xs text-cyan-400 font-mono">Code: {cert.certificateCode}</p>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-y border-[#3A506B]">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Proudly Presented To</p>
                  <p className="text-2xl font-black text-white">{cert.userName}</p>
                  <p className="text-xs text-gray-400 uppercase font-semibold pt-2">For Successfully Completing</p>
                  <p className="text-lg font-bold text-cyan-300">{cert.courseTitle}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                  <span>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => setActivePage('verify-certificate')}
                    className="flex items-center space-x-1 rtl:space-x-reverse text-cyan-400 font-bold hover:underline"
                  >
                    <span>Verify Authenticity</span>
                    <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
