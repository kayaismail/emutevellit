# E-Mütevellit Projesi - Mimari ve Canlıya Alma (Deploy) Rehberi

Bu doküman, projeyi sunucuya (VPS, Vercel, Render, DigitalOcean vb.) kuracak ve canlıya (production) alacak kişi için teknik bir harita niteliğindedir.

## 🏗️ 1. Proje Mimarisi ve Teknoloji Yığını (Tech Stack)

Bu proje **Monorepo** mantığına benzer bir yapıda, hem Frontend hem de Backend kodlarını aynı dizinde barındıran; ancak çalışırken ayrışan bir Full-Stack uygulamasıdır.

### Frontend (İstemci - Client)
- **Kütüphane / Çatı:** React 19 + TypeScript + Vite
- **Stil / Tasarım:** TailwindCSS + Lucide React (İkonlar)
- **Yönlendirme (Routing):** React Router v7 (SPA yapısı)
- **Zengin Metin Editörü:** Jodit-React (Admin panelindeki makale yazım alanı)
- **Derleme Çıktısı:** `npm run build` komutu ile `dist/` klasörüne statik HTML/JS/CSS olarak çıkar.

### Backend (Sunucu - Server)
- **Çekirdek:** Node.js üzerinde çalışan Express.js (`server.ts`)
- **Veritabanı (DB):** **SQLite**. Veritabanı ile iletişim için **Prisma ORM** (`@prisma/client`) kullanılmaktadır. Tablolar `prisma/schema.prisma` dosyasında tanımlıdır.
- **Kimlik Doğrulama:** JWT (JSON Web Token) ve `bcryptjs` (şifre hashleme). API rotaları `/api/auth/...` üzerinden ilerler.
- **Dosya Yükleme (Uploads):** `multer` paketi ile admin panelinden yüklenen resimler, sunucu dizinindeki `uploads/` klasörüne fiziksel olarak kaydedilir. Bu klasör dışarıya statik olarak (public) açılmıştır.
- **Çalışma Mantığı:** Prodüksiyon (Canlı) ortamda Express sunucusu hem `/api` isteklerini karşılar, hem `uploads/` klasöründeki resimleri sunar, hem de Vite'ın derlediği `dist/` klasöründeki frontend uygulamasını sunar (Tüm yönlendirmeleri `index.html`'e yollayarak React Router'ın çalışmasını sağlar).

---

## 🚀 2. Canlıya Alma (Deployment) Adımları

Uygulamayı sıfırdan bir Ubuntu/Linux sunucusuna (VPS) veya render.com gibi bir platforma kurarken izlenmesi gereken adımlar:

### Adım 1: Depoyu Sunucuya Çekme ve Kurulum
Sunucuda Node.js (v18 veya v20 tavsiye edilir) kurulu olmalıdır.

```bash
# Proje dizinine girin
cd /path/to/e-mutevellit

# Tüm Node modüllerini kurun
npm install
```

### Adım 2: Çevresel Değişkenleri (.env) Ayarlama
Proje ana dizininde bir `.env` dosyası oluşturun ve güvenlik anahtarlarını girin:

```env
# Veritabanı yolu (SQLite için)
DATABASE_URL="file:./dev.db"

# JWT Token imzalamak için gizli anahtar (Güçlü bir şifre belirleyin)
JWT_SECRET="super-gizli-production-anahtari-123!?"

# Express sunucu portu
PORT=3001
```

### Adım 3: Veritabanını Hazırlama
Prisma kullanarak SQLite veritabanı tablolarını oluşturun:

```bash
# Prisma Client'ı oluşturun
npx prisma generate

# Veritabanı tablolarını şemaya göre senkronize edin
npx prisma db push
```
*(Not: `prisma/dev.db` dosyası oluşacaktır. Bu dosya veritabanınızdır, silinmemelidir).*

### Adım 4: Frontend'i Derleme (Build)
React kodlarını tarayıcıların okuyabileceği statik formata çevirin:

```bash
# Vite ile projeyi derler, ana dizinde 'dist' klasörü oluşur.
npm run build
```

### Adım 5: Sunucuyu Ayağa Kaldırma (Production)
Uygulamayı canlıda çalıştırırken `NODE_ENV=production` değişkeni verilmelidir. Böylece Express.js frontend dist klasörünü tanıyıp sunacaktır.

Sürekli çalışma (Arka planda tutma) için `pm2` gibi bir Process Manager (süreç yöneticisi) kullanılması şiddetle tavsiye edilir.

```bash
# PM2 Kurulumu (Eğer yoksa)
npm install -g pm2

# Uygulamayı PM2 ile başlatma
NODE_ENV=production pm2 start "npx tsx server.ts" --name "emutevellit-app"

# Uygulamanın sunucu yeniden başladığında bile açılmasını sağlama
pm2 save
pm2 startup
```

## 🔒 3. Önemli Notlar ve Uyarılar
- **Fotoğraflar (`uploads/`):** Uygulamaya yüklenen tüm kapak fotoğrafları proje dizinindeki `uploads` klasöründe tutulur. Sunucuyu taşırken veya güncellerken bu klasörü ve içindeki veritabanını (`prisma/dev.db`) **asla silmeyin / üzerine yazmayın**, aksi takdirde veriler ve resimler kaybolur.
- **Port Yönlendirme:** Sunucu `3001` (veya .env içinden ayarlandığı) portunda çalışır. Domaininize (örn: `emutevellit.com`) gelen 80/443 (HTTP/HTTPS) isteklerini Nginx kullanarak arka plandaki `localhost:3001` portuna yönlendirmeniz (Reverse Proxy) gerekmektedir. Nginx ayarlarında `/uploads` dizinine gelen uzun boyutlu dosyalar için `client_max_body_size` ayarını (örn: 50MB) büyütmeyi unutmayın.
