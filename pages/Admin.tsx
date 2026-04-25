import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/contentService';
import { Post } from '../types';
import { LogOut, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import Layout from '../components/Layout';
import JoditEditor from 'jodit-react';
import { useMemo, useRef } from 'react';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(postService.isLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const editor = useRef(null);
  
  const config = useMemo(() => ({
    readonly: false, 
    height: 400,
    placeholder: 'Yazınızı buraya yazmaya başlayın...'
  }), []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  const fetchPosts = async () => {
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (err) {
      setError('Yazılar yüklenemedi.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postService.login(username, password);
      setIsLoggedIn(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleLogout = () => {
    postService.logout();
    setIsLoggedIn(false);
    setPosts([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      if (editingPost.id) {
        await postService.update(editingPost.id, editingPost);
      } else {
        await postService.create(editingPost);
      }
      setEditingPost(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.message || 'Kaydedilemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
      try {
        await postService.delete(id);
        fetchPosts();
      } catch (err: any) {
        setError(err.message || 'Silinemedi.');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-md mx-auto py-20 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-serif font-bold mb-6 text-center">Yönetici Girişi</h1>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">İçerik Yönetimi</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setEditingPost({ title: '', slug: '', category: 'gezi', excerpt: '', content: '' })}
              className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl hover:bg-secondary/90 transition-colors"
            >
              <Plus size={20} /> Yeni Yazı
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <LogOut size={20} /> Çıkış
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-500 text-sm">{post.category} • {new Date(post.publishedAt).toLocaleDateString('tr-TR')}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold">
                  {editingPost.id ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                </h2>
                <button onClick={() => setEditingPost(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={editingPost.slug || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-') })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    >
                      <option value="gezi">Gezi</option>
                      <option value="belgesel">Belgesel</option>
                      <option value="rota">Rota</option>
                      <option value="yasam">Yaşam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Görseli</label>
                    <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Görsel URL"
                          value={editingPost.imageUrl || ''}
                          onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                          className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const widget = (window as any).cloudinary.createUploadWidget(
                              {
                                cloudName: 'dllehphzc',
                                uploadPreset: 'emutevellit',
                                folder: 'emutevellit',
                                sources: ['local', 'url', 'camera'],
                                multiple: false,
                                language: 'tr',
                              },
                              (error: any, result: any) => {
                                if (!error && result?.event === 'success') {
                                  setEditingPost({ ...editingPost, imageUrl: result.info.secure_url });
                                }
                              }
                            );
                            widget.open();
                          }}
                          className="flex items-center justify-center px-4 bg-gray-100 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap text-sm font-medium"
                        >
                          Görsel Yükle
                        </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Özet</label>
                  <textarea
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary h-20"
                    required
                  />
                </div>

                <div className="mb-12 pb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                      <JoditEditor
                        ref={editor}
                        value={editingPost.content || ''}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => setEditingPost({ ...editingPost, content: newContent })} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => {}}
                      />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-white px-8 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Save size={20} /> Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
