import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const { t } = useLanguage();

  const faqs = [
    { q: 'Is MED ACADEMY completely free?', a: 'Yes! All courses, articles, and certificate generation are 100% free with no hidden subscription fees.' },
    { q: 'How do I earn a certificate?', a: 'You must enroll in a course, complete 100% of the lessons, and your certificate is automatically issued with a unique verification code.' },
    { q: 'Who can publish courses and articles?', a: 'Only the platform super administrator (mohamedelgoumi60@gmail.com) has publishing privileges to ensure high curriculum quality.' },
    { q: 'What languages are supported?', a: 'MED ACADEMY supports English, French, Arabic (with full RTL layout), Chinese, and German.' },
  ];

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto" />
          <h1 className="text-3xl font-black tracking-tight">{t('faq')}</h1>
          <p className="text-gray-400 text-sm">Frequently asked questions about MED ACADEMY.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0B132B] border border-[#1C2541] space-y-2 shadow-xl">
              <h3 className="font-bold text-lg text-white">{faq.q}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
