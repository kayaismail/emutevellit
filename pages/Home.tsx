import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { postService } from '../services/contentService';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API call for subscribing
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSubscribed(true);
        setEmail('');
    }, 1200);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAll();
        setPosts(data);
      } catch (err) {
        setError('Yazılar yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 lg:px-12 py-12">
            <section className="mb-20">
                <SkeletonCard featured={true} />
            </section>
            <section>
                <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-200">
                  <div>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </section>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh] text-center px-4">
          <p className="text-red-500 font-medium text-lg bg-red-50 p-6 rounded-2xl">{error}</p>
        </div>
      </Layout>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <Layout>
      <div className="container mx-auto px-6 lg:px-12 py-12">
        {featuredPost && (
          <section className="mb-20">
            <PostCard post={featuredPost} featured={true} />
          </section>
        )}

        <section className="animate-slide-up">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-200">
            <div>
              <span className="block text-secondary font-bold text-xs uppercase tracking-widest mb-2">Keşfet</span>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Son Yazılar</h2>
            </div>
            <Link to="/category/gezi" className="hidden md:flex items-center text-sm font-medium text-gray-500 hover:text-secondary transition-colors group">
                Tümünü Gör
                <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {recentPosts.map((post, index) => (
              <div key={post.slug} className="h-full" style={{ animationDelay: `${index * 100}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mt-24 mb-12 bg-primary rounded-2xl overflow-hidden relative">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <div className="relative z-10 py-16 px-6 md:px-20 text-center">
             {isSubscribed ? (
                <div className="animate-fade-in flex flex-col items-center">
                    <CheckCircle className="text-secondary w-16 h-16 mb-4" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Aramıza Hoş Geldin!</h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-lg leading-relaxed">
                        E-posta adresini başarıyla kaydettik. En ilgi çekici rotalar ve hikayelerle dolu ilk bültenimiz çok yakında kutunda olacak.
                    </p>
                </div>
             ) : (
                <div className="animate-fade-in flex flex-col items-center">
                    <Mail className="mx-auto text-secondary w-12 h-12 mb-6" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Seyahat Günlüğüne Katıl</h2>
                    <p className="text-gray-300 max-w-xl mx-auto mb-8 text-lg">
                    Yeni rotalar, gizli kalmış mekanlar ve seyahat ipuçları her hafta e-posta kutunda.
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col flex-1 w-full sm:flex-row max-w-md mx-auto gap-4">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="E-posta adresiniz" 
                        className="flex-grow px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white/20 transition-all"
                    />
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-4 w-full sm:w-auto min-w-[140px] flex items-center justify-center bg-secondary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                           <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : 'Abone Ol'}
                    </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-4">Spam yok, sadece güzel hikayeler.</p>
                </div>
             )}
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;