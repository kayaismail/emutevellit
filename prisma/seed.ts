import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanına başlangıç verileri (seed) ekleniyor...');

  // Admin Kullanıcı Ekle
  const adminUsername = 'admin';
  const adminPassword = 'password123';
  
  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      }
    });
    console.log(`✅ Admin kullanıcısı oluşturuldu: ${adminUsername} / ${adminPassword}`);
  } else {
    console.log(`ℹ️ Admin kullanıcısı zaten mevcut.`);
  }

  // Örnek İçerikler Ekle
  const count = await prisma.post.count();
  if (count === 0) {
    await prisma.post.createMany({
      data: [
         {
            title: 'Kapadokya: Peribacalarının Gölgesinde Bir Masal',
            slug: 'kapadokya-masali',
            category: 'Seyahat',
            excerpt: 'İç Anadolu\'nun kalbinde, doğanın ve tarihin iç içe geçtiği Kapadokya\'da geçirdiğim üç günün unutulmaz anıları.',
            content: 'Kapadokya, kelimelerle anlatılandan çok daha fazlası. Sabahın erken saatlerinde gökyüzüne yükselen onlarca sıcak hava balonu, bir ressamın tablosundan çıkmış gibi hissettiriyor.\n\n### İlk Gün: Göreme Açık Hava Müzesi\n\nSabahın ilk ışıklarıyla birlikte yola çıktık...',
            imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=2070&auto=format&fit=crop',
         },
         {
            title: 'Doğu Ekspresi ile Kış Rüyası',
            slug: 'dogu-ekspresi',
            category: 'rota',
            excerpt: 'Ankara\'dan Kars\'a uzanan, beyazlara bürünmüş Anadolu manzaraları eşliğinde 24 saatlik masalsı tren yolculuğu rehberi.',
            content: 'Kış aylarının vazgeçilmezi haline gelen Doğu Ekspresi, sadece bir ulaşım aracı değil, başlı başına bir deneyim. Bembeyaz örtünün altında uzanan ovalar, donmuş nehirler ve küçük anadolu köyleri pencerenizden bir film şeridi gibi akıp geçiyor.',
            imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop',
         }
      ]
    });
    console.log(`✅ Örnek yazılar oluşturuldu.`);
  } else {
     console.log(`ℹ️ Veritabanında halihazırda ${count} yazı mevcut.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Seed işlemi tamamlandı.');
  });
