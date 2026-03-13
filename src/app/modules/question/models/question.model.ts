// SubQuestion model for group
export interface SubQuestion {
  part: number;
  question_text?: string;
  image_url?: string;
  correct_answer: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  sub_order: number;
}

// QuestionGroup model for group create
export interface QuestionGroup {
  exam_id: number;
  entity_type: 'GROUP';
  part_id: number;
  image_url?: string;
  audio_start_ms?: number;
  audio_end_ms?: number;
  sub_questions: SubQuestion[];
}
// Question model based on API docs
export interface Question {
  exam_id: number;
  entity_type: string;
  part_id: number;
  part: number;
  question_text: string;
  image_url?: string;
  correct_answer: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  audio_start_ms?: number;
  audio_end_ms?: number;
  sub_order?: number;
}

export interface QuestionCreateResponse {
  message: string;
  status: 'SUCCESS' | 'ERROR';
}
