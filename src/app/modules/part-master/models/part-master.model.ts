// PartMaster model based on API docs
export interface PartMaster {
  id: number;
  skill_id: number;
  part_number: number;
  name: string;
  status: number;
}

// API response for get-all
export interface PartMasterListResponse {
  data: {
    pagination: {
      page: number;
      limit: number;
      total_records: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    response: PartMaster[];
  };
  message: string;
  status: 'SUCCESS' | 'ERROR';
}

// API response for detail
export interface PartMasterDetailResponse {
  data: PartMaster;
  message: string;
  status: 'SUCCESS' | 'ERROR';
}
