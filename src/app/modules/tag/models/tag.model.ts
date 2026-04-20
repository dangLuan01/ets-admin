export interface Tag {
  id?: number;
  name: string;
  slug: string;
  status: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TagApiResponse {
  pagination: Pagination;
  response: Tag[];
}
