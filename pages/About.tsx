import React from 'react';
import Layout from '../components/Layout';
import { Camera, Map, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 lg:px-8 py-20 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-secondary/10 translate-x-4 translate-y-4 rounded-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1500" 
              alt="Yazar" 
              className="relative rounded-3xl shadow-xl w-full h-[500px] object-cover"
            />
          </div>

          <div className="order-1 md:order-2">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Hakkımda</span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Dünyanın Sınırlarında <br/>Bir Hikaye Arayışı.
            </h1>
            
            <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none mb-8">
                <p>
                  Merhaba, <strong>e-mütevellit</strong>'e hoş geldiniz.
                </p>
                <p>
                  Burası plansız yola çıkılan sabahların, haritada kaybolmanın keyfinin ve yeni kültürlerle tanışmanın heyecanının paylaşıldığı dijital bir arşiv. Ben profesyonel bir rehber değilim; sadece gördüklerimi, duyduklarımı ve hissettiklerimi en samimi haliyle aktarmaya çalışan bir yolcuyum.
                </p>
                <p>
                  Gezi yazılarımdan belgesel tadındaki videolara kadar her içerik, kendi penceremden dünyaya attığım bir bakış. Bazen bir köy kahvesinde, bazen de bir okyanus kıyısında.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                    <Map className="text-secondary mb-2" size={28} />
                    <span className="font-bold text-gray-900">40+</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Ülke</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                    <Camera className="text-secondary mb-2" size={28} />
                    <span className="font-bold text-gray-900">10k+</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Fotoğraf</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                    <Heart className="text-secondary mb-2" size={28} />
                    <span className="font-bold text-gray-900">Sınırsız</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Tutku</span>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                <div className="text-gray-500 text-sm">Benimle yola çıkmak ister misin?</div>
                <a href="mailto:hello@emutevellit.com" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition-colors shadow-lg">
                  İletişime Geç
                </a>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default About;