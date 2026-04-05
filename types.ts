export type Category = 'gezi' | 'belgesel' | 'rota' | 'yasam';

export interface Post {
  id: string;
  slug: string;
  title: string;
  publishedAt: string; // ISO format
  category: string;
  imageUrl?: string;
  youtubeUrl?: string;
  excerpt: string;
  content: string; // Markdown content
}

export const CATEGORY_LABELS: Record<string, string> = {
  gezi: 'Gezi Yazıları',
  belgesel: 'Belgeseller',
  rota: 'Rota Tavsiyeleri',
  yasam: 'Yaşam ve Kültür',
};
