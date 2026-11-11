import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Article } from '../types';
import { FileText, Calendar, User, ArrowRight } from 'lucide-react';

interface ArticlesProps {
  setActivePage: (page: string) => void;
  setSelectedArticleId: (id: string) => void;
}

export const Articles: React.FC<ArticlesProps> = ({ setActivePage, setSelectedArticleId }) => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const snap = await getDocs(collection(db, 'articles'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        setArticles(list);
      } catch (err) {
        console.error('Error fetching articles:', err);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{t('articles')}</h1>
          <p className="text-gray-400 text-sm">
            Expert educational insights, research articles, and pedagogical updates published by administrators.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 bg-[#0B132B] rounded-2xl border border-[#1C2541]">
            <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-300 font-medium">No articles published yet.</p>
            <p className="text-xs text-gray-500 mt-1">Super Admin can publish articles from the Admin Dashboard CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  setSelectedArticleId(article.id);
                  setActivePage('article-details');
                }}
                className="group rounded-2xl bg-[#0B132B] border border-[#1C2541] hover:border-cyan-500/50 transition overflow-hidden cursor-pointer shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-gradient-to-tr from-[#1C2541] to-[#2A3B63] relative overflow-hidden">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-cyan-400/40" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1 rounded-full bg-[#0B132B]/80 backdrop-blur-md text-[11px] font-bold text-cyan-400 border border-cyan-500/30">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-400">
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{article.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <span className="text-xs text-cyan-400 font-bold group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform inline-flex items-center space-x-1 rtl:space-x-reverse">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
