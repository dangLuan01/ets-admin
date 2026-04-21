export interface Post {
  id: number;
  name: string;
  slug: string;
  content: string;
  summary: string;
  thumbnail_url: string;
  tags: number[];
  status: number;
}
