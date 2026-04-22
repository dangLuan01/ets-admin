export interface Post {
  id: number;
  name: string;
  slug: string;
  content: string;
  summary: string;
  thumbnail_url: string;
  priority: number;
  tags: number[];
  status: number;
}
