import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, CATEGORY_LABELS } from '../types';
import { postService } from '../services/contentService';
import { formatDate, getYoutubeId } from '../utils/formatters';
import Layout from '../components/Layout';
import { Calendar, Tag, ArrowLeft, Clock, Share2 } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      if (slug) {
        try {
          const data = await postService.getBySlug(slug);
          setPost(data || null);
        } catch (err) {
          setError('Yazı yüklenemedi.');
        }
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000'; // Generic fallback image
    e.currentTarget.onerror = null;
  };

  if (loading) {
    return (
        <Layout>
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        </Layout>
      );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-20 text-center px-4">
          <p className="inline-block text-red-500 font-medium bg-red-50 p-6 rounded-2xl">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="inline-block text-gray-500 bg-gray-50 p-6 rounded-2xl">Yazı bulunamadı veya silinmiş.</p>
        </div>
      </Layout>
    );
  }

  const youtubeId = post.youtubeUrl ? getYoutubeId(post.youtubeUrl) : null;

  return (
    <Layout>
      <article className="pb-20 animate-fade-in">
        {/* Modern Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
            {post.imageUrl && (
                <>
                <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
                </>
            )}
            
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center space-x-3 mb-6 animate-slide-up">
                        <span className="bg-secondary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                            {CATEGORY_LABELS[post.category] || post.category}
                        </span>
                        <span className="text-white/80 text-sm font-medium flex items-center">
                            <Clock size={14} className="mr-1" /> 5 dk okuma
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg animate-slide-up" style={{animationDelay: '100ms'}}>
                        {post.title}
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base animate-slide-up" style={{animationDelay: '200ms'}}>
                        <img 
                            src="https://api.dicebear.com/7.x/initials/svg?seed=E&backgroundColor=e67e22" 
                            alt="Author" 
                            className="w-10 h-10 rounded-full border-2 border-white mr-3"
                        />
                        <div className="flex flex-col md:flex-row md:items-center">
                            <span className="font-bold mr-2">e-mütevellit</span>
                            <span className="hidden md:inline mx-2 opacity-50">•</span>
                            <span>{formatDate(post.publishedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto pt-12">
                
                {/* Sidebar (Share & Back) */}
                <div className="lg:w-48 lg:flex-shrink-0 flex lg:flex-col justify-between lg:justify-start lg:sticky lg:top-32 h-fit gap-4 border-b lg:border-b-0 border-gray-200 pb-6 lg:pb-0">
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-secondary text-sm font-medium transition-colors group">
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Geri Dön
                    </Link>
                    
                    <div className="hidden lg:block mt-8">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-bold">Paylaş</p>
                        <div className="flex lg:flex-col gap-4">
                            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-secondary hover:text-white transition-all">
                                <Share2 size={18} />
                            </button>
                            {/* Mock social buttons */}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow max-w-3xl">
                    {/* YouTube Embed */}
                    {youtubeId && (
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                            <div className="relative pb-[56.25%] h-0">
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    className="absolute top-0 left-0 w-full h-full"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    {/* HTML Content */}
                    <div 
                        className="prose prose-lg prose-slate max-w-none 
                        prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                        prose-p:text-gray-600 prose-p:leading-8 prose-p:mb-6
                        prose-a:text-secondary prose-a:font-semibold prose-a:no-underline hover:prose-a:text-orange-700
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
                        prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:bg-gray-50 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700
                        prose-li:text-gray-600 prose-li:marker:text-secondary
                        first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Author Signature */}
                    <div className="mt-16 p-8 bg-surface-dark rounded-2xl flex items-center gap-6 border border-gray-100">
                        <div className="w-20 h-20 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-white font-serif font-bold text-3xl shadow-md">
                            E
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">e-mütevellit</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Seyahat etmeyi, yeni hikayeler biriktirmeyi ve bunları paylaşmayı seven bir gezgin. Yolun kendisi varılacak yerden daha güzeldir.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </article>
    </Layout>
  );
};

export default PostDetail;