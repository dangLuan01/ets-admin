export interface Certificate {
  id?: number;
  code: string;
  name: string;
  description: string;
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

export interface CertificateApiResponse {
  pagination: Pagination;
  response: Certificate[];
}
