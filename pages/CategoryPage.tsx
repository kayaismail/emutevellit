import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, Category, CATEGORY_LABELS } from '../types';
import { postService } from '../services/contentService';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import SkeletonCard from '../components/SkeletonCard';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Validate category
  const category = id as Category;
  const isValidCategory = Object.keys(CATEGORY_LABELS).includes(category);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      if (isValidCategory) {
        try {
          const data = await postService.getByCategory(category);
          setPosts(data);
        } catch (err) {
          setError('İçerikler yüklenemedi.');
        }
      }
      setLoading(false);
    };
    fetchPosts();
  }, [category, isValidCategory]);

  if (!isValidCategory) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Kategori Bulunamadı</h1>
          <p>Aradığınız kategori mevcut değil.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-16 mb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
            {CATEGORY_LABELS[category]}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {category === 'gezi' && 'Yeni yerler, kültürler ve deneyimler üzerine yazılar.'}
            {category === 'belgesel' && 'Görsel hikayeler ve video içerikleri.'}
            {category === 'rota' && 'Yola çıkmadan önce bilmeniz gereken pratik bilgiler ve haritalar.'}
            {category === 'yasam' && 'Hayata, kültüre ve insana dair düşünceler, deneyimler.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pb-20">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[1, 2, 3].map((n) => (
               <SkeletonCard key={n} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
             <p className="inline-block text-red-500 font-medium bg-red-50 p-6 rounded-2xl">{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Bu kategoride henüz içerik bulunmuyor.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;