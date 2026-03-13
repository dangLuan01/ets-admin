// Skill model based on API docs
export interface Skill {
  id: number;
  cert_id: number;
  code: string;
  name: string;
  order_index: number;
  status: number;
}

// API response for get-all
export interface SkillListResponse {
  data: {
    pagination: {
      page: number;
      limit: number;
      total_records: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    response: Skill[];
  };
  message: string;
  status: 'SUCCESS' | 'ERROR';
}

// API response for detail
export interface SkillDetailResponse {
  data: Skill;
  message: string;
  status: 'SUCCESS' | 'ERROR';
}
