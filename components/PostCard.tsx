import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { Post, CATEGORY_LABELS } from '../types';
import { formatDate } from '../utils/formatters';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000'; // Generic fallback image
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  if (featured) {
    return (
      <article className="group relative grid md:grid-cols-12 gap-0 overflow-hidden rounded-2xl bg-white shadow-xl mb-16 animate-fade-in hover:shadow-2xl transition-shadow duration-500">
        <div className="md:col-span-7 h-64 md:h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              onError={handleImageError}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          )}
          {post.youtubeUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
               <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/50">
                 <PlayCircle className="text-white w-12 h-12" />
               </div>
            </div>
          )}
        </div>
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
          <div className="mb-6 flex items-center space-x-3 text-sm">
            <span className="text-secondary font-bold uppercase tracking-wider">{CATEGORY_LABELS[post.category] || post.category}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
          </div>
          
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight group-hover:text-secondary transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-sm">
               <Clock size={16} className="mr-2" />
               5 dk okuma
            </div>
            <Link 
              to={`/post/${post.slug}`} 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 text-gray-600 group-hover:bg-secondary group-hover:border-secondary group-hover:text-white transition-all duration-300"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden aspect-[4/3]">
        {post.imageUrl ? (
          <img 
            src={post.imageUrl} 
            alt={post.title}
            onError={handleImageError}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            Görsel Yok
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1 rounded shadow-sm uppercase tracking-widest border border-gray-100">
            {CATEGORY_LABELS[post.category] || post.category}
          </span>
        </div>
        {post.youtubeUrl && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
             <PlayCircle className="text-white w-10 h-10 drop-shadow-md" />
           </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center text-gray-400 text-xs mb-3 space-x-2 font-medium">
          <Calendar size={14} />
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <Clock size={14} />
          <span>5 dk okuma</span>
        </div>

        <Link to={`/post/${post.slug}`} className="block mb-3">
          <h2 className="font-serif font-bold text-xl text-gray-900 leading-snug group-hover:text-secondary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-gray-50 mt-auto">
          <Link 
            to={`/post/${post.slug}`} 
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-900 group-hover:text-secondary transition-colors"
          >
            Devamını Oku <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;