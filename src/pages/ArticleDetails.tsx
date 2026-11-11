import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Article } from '../types';
import { ArrowLeft, User, Calendar, FileText } from 'lucide-react';

interface ArticleDetailsProps {
  articleId: string;
  setActivePage: (page: string) => void;
}

export const ArticleDetails: React.FC<ArticleDetailsProps> = ({ articleId, setActivePage }) => {
  const { t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', articleId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setArticle({ id: snap.id, ...snap.data() } as Article);
        }
      } catch (err) {
        console.error('Error fetching article details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex items-center justify-center">
        <p className="text-cyan-400 font-medium">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#070D1D] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold">Article not found.</p>
        <button 
          onClick={() => setActivePage('articles')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 text-[#0B132B] font-bold text-sm"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070D1D] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => setActivePage('articles')}
          className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Articles</span>
        </button>

        <article className="rounded-3xl bg-[#0B132B] border border-[#1C2541] overflow-hidden shadow-2xl p-8 sm:p-12 space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{article.title}</h1>
            <div className="flex items-center space-x-6 rtl:space-x-reverse text-xs text-gray-400 pt-2">
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <User className="w-4 h-4 text-cyan-400" />
                <span>{article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {article.coverImage && (
            <div className="h-72 sm:h-96 rounded-2xl overflow-hidden border border-[#1C2541]">
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
            {article.content}
          </div>
        </article>
      </div>
    </div>
  );
};
