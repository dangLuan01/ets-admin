// Exam model based on API docs
export interface Exam {
  id: number;
  cert_id: number;
  title: string;
  year: number;
  category?: string | null;
  total_time: number;
  total_question: number;
  description?: string | null;
  thumbnail?: string | null;
  audio_full_url?: string | null;
  created_at?: string;
  status: number;
}

// API response for get-all
export interface ExamListResponse {
  data: {
    pagination: {
      page: number;
      limit: number;
      total_records: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    response: Exam[];
  };
  message: string;
  status: 'SUCCESS' | 'ERROR';
}

// API response for detail
export interface ExamDetailResponse {
  data: Exam;
  message: string;
  status: 'SUCCESS' | 'ERROR';
}
