import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Twitter, Mail, ArrowUp } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/category/gezi', label: 'Gezi' },
    { path: '/category/belgesel', label: 'Belgesel' },
    { path: '/category/rota', label: 'Rota' },
    { path: '/category/yasam', label: 'Yaşam' },
    { path: '/about', label: 'Hakkımda' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-surface">
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="group relative z-50">
            <span className="text-2xl font-serif font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">
              e-mütevellit<span className="text-secondary text-3xl">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-widest font-medium transition-all duration-300 relative group ${
                  isActive(link.path) 
                    ? 'text-secondary' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative z-50 p-2 text-gray-700 hover:text-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`fixed inset-0 bg-white/95 backdrop-blur-md z-40 transform transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center items-center space-y-8 pt-20 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl font-serif font-bold ${
                  isActive(link.path) ? 'text-secondary' : 'text-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
        </div>
      </header>

      <main className="flex-grow pt-24">
        {children}
      </main>

      <footer className="bg-primary text-gray-300 pt-16 pb-8 md:pt-20 md:pb-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16 border-b border-gray-700 pb-10 md:pb-12">
             <div className="mb-8 md:mb-0">
               <h3 className="text-3xl font-serif font-bold text-white mb-2">e-mütevellit.</h3>
               <p className="text-gray-400 text-sm max-w-sm">
                 Plansız rotalar, samimi hikayeler ve dünyanın renkleri üzerine kişisel bir arşiv.
               </p>
             </div>
             <div className="flex space-x-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-all duration-300"><Instagram size={20} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-all duration-300"><Twitter size={20} /></a>
                <a href="mailto:hello@emutevellit.com" className="p-2 bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-all duration-300"><Mail size={20} /></a>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
             <div>
               <h4 className="text-white font-bold mb-4">Keşfet</h4>
               <ul className="space-y-2 text-sm">
                 <li><Link to="/category/gezi" className="hover:text-secondary transition-colors">Gezi Yazıları</Link></li>
                 <li><Link to="/category/belgesel" className="hover:text-secondary transition-colors">Belgeseller</Link></li>
                 <li><Link to="/category/rota" className="hover:text-secondary transition-colors">Rota Önerileri</Link></li>
                 <li><Link to="/category/yasam" className="hover:text-secondary transition-colors">Yaşam ve Kültür</Link></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-bold mb-4">Kurumsal</h4>
               <ul className="space-y-2 text-sm">
                 <li><Link to="/about" className="hover:text-secondary transition-colors">Hakkımda</Link></li>
                 <li><a href="mailto:hello@emutevellit.com" className="hover:text-secondary transition-colors">İletişim</a></li>
                 <li><Link to="/" className="hover:text-secondary transition-colors">RSS (Çok Yakında)</Link></li>
               </ul>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 pt-8">
            <p>&copy; {new Date().getFullYear()} e-mütevellit. Tüm hakları saklıdır.</p>
            <button onClick={scrollToTop} className="flex items-center space-x-2 hover:text-white transition-colors mt-4 md:mt-0">
              <span>Yukarı Çık</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;