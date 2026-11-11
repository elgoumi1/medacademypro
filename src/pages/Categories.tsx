import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Stethoscope, Atom, Cpu, Code, Briefcase, Scale, 
  Palette, Camera, Heart, BookOpen, Globe, Wrench, ArrowRight 
} from 'lucide-react';

interface CategoriesProps {
  setActivePage: (page: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ setActivePage }) => {
  const { t } = useLanguage();

  const disciplines = [
    { name: 'Medicine & Health Education', icon: Stethoscope, desc: 'Clinical sciences, public health, nursing, and medical technologies.' },
    { name: 'Science & Mathematics', icon: Atom, desc: 'Physics, chemistry, biology, calculus, and advanced mathematics.' },
    { name: 'Information Technology', icon: Globe, desc: 'Network administration, cybersecurity, cloud computing, and databases.' },
    { name: 'Artificial Intelligence', icon: Cpu, desc: 'Machine learning, neural networks, computer vision, and NLP.' },
    { name: 'Programming & Software Development', icon: Code, desc: 'Full-stack web development, mobile apps, and systems engineering.' },
    { name: 'Business & Management', icon: Briefcase, desc: 'Strategic management, corporate leadership, and global economics.' },
    { name: 'Law & Legal Studies', icon: Scale, desc: 'International law, corporate compliance, and jurisprudence.' },
    { name: 'Arts & Design', icon: Palette, desc: 'UI/UX design, digital illustration, typography, and visual arts.' },
    { name: 'Photography & Media', icon: Camera, desc: 'Cinematography, photo editing, and multimedia production.' },
    { name: 'Personal Development', icon: Heart, desc: 'Leadership, emotional intelligence, and effective communication.' },
    { name: 'Vocational & Technical Skills', icon: Wrench, desc: 'Practical trades, equipment maintenance, and applied techniques.' },
    { name: 'Other Disciplines', icon: BookOpen, desc: 'Interdisciplinary studies, history, geography, and philosophy.' },
  ];

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('categories')}</h1>
          <p className="text-gray-400 text-sm">
            Explore all educational disciplines covered across MED ACADEMY.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((disc, i) => {
            const Icon = disc.icon;
            return (
              <div
                key={i}
                onClick={() => setActivePage('courses')}
                className="group p-8 rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition cursor-pointer shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-[#0B132B] font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">{disc.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{disc.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#1C2541] flex items-center justify-between text-xs text-cyan-400 font-bold">
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
