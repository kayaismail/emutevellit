import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

// Multer - memory storage (Cloudinary'e yükleyeceğiz)
const upload = multer({ storage: multer.memoryStorage() });

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Yetkisiz erişim' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

// --- POST ROUTES ---

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ error: 'Yazılar getirilemedi.' });
  }
});

// Get post by slug
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.post.findUnique({ where: { slug } });
    
    if (!post) {
      return res.status(404).json({ error: 'Yazı bulunamadı.' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Fetch post error:', error);
    res.status(500).json({ error: 'Yazı getirilemedi.' });
  }
});

// Create new post (Protected)
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { title, slug, category, excerpt, content, imageUrl, youtubeUrl } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Başlık, slug ve içerik zorunludur.' });
    }

    const newPost = await prisma.post.create({
      data: { title, slug, category, excerpt, content, imageUrl, youtubeUrl },
    });
    
    res.status(201).json(newPost);
  } catch (error: any) {
    console.error('Create post error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Bu slug zaten kullanılıyor.' });
    }
    res.status(500).json({ error: 'Yazı oluşturulamadı.' });
  }
});

// Update post (Protected)
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, excerpt, content, imageUrl, youtubeUrl } = req.body;
    
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, slug, category, excerpt, content, imageUrl, youtubeUrl },
    });
    
    res.json(updatedPost);
  } catch (error: any) {
    console.error('Update post error:', error);
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Güncellenecek yazı bulunamadı.' });
    }
    res.status(500).json({ error: 'Yazı güncellenemedi.' });
  }
});

// Delete post (Protected)
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete post error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Silinecek yazı bulunamadı.' });
    }
    res.status(500).json({ error: 'Yazı silinemedi.' });
  }
});

// --- UPLOAD ROUTE ---
app.post('/api/upload', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Görsel yüklenemedi.' });
    }

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'emutevellit' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file!.buffer);
    });

    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Görsel yüklenirken sunucu hatası oluştu.' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Setup server to only listen if not imported (useful for testing or if invoked directly)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Express API server running on http://localhost:${PORT}`);
    });
}

export default app;
