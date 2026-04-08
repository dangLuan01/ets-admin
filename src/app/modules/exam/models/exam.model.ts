// Exam model based on API docs
export interface Exam {
  id: number;
  cert_id: number;
  title: string;
  year: number;
  category_ids: number[] | null;
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

// From GET /exams/{exam_id}/structure
export interface ExamStructure {
  exam_id: number;
  exam_name: string;
  cert_code: string;
  blueprint: SkillBlueprint[];
}

export interface SkillBlueprint {
  skill_id: number;
  skill_code: string;
  skill_name: string;
  parts: Part[];
}

export interface Part {
  part_id: number;
  part_name: string;
  part_number: number;
}

export interface ExamStructureResponse {
  data: ExamStructure;
  message: string;
  status: 'SUCCESS' | 'ERROR';
}

// From GET /exams/{exam_id}/parts/{part_id}
export interface QuestionsByPart {
    exam_id: number;
    part_id: number;
    items: QuestionItem[];
    direction?: Direction;
}

export interface QuestionItem {
    entity_type: 'SINGLE' | 'GROUP';
    entity_id: number;
    order_index: number;
    question_data?: QuestionData; // For SINGLE
    group_data?: GroupData;      // For GROUP
}

export interface GroupData {
    passage_text: string | null;
    image_url: string | null;
    audio_start_ms: number | null;
    audio_end_ms: number | null;
    transcript: string | null;
    explanation: string | null;
    sub_questions: QuestionData[];
}

export interface QuestionData {
    question_id: number;
    question_text: string | null;
    image_url: string | null;
    audio_start_ms: number | null;
    audio_end_ms: number | null;
    correct_answer: string;
    display_number: number;
    sub_order: number;
    explanation: string | null;
    transcript: string | null;
    options: { [key: string]: string | null };
}

export interface QuestionsByPartResponse {
    data: QuestionsByPart;
    message: string;
    status: 'SUCCESS' | 'ERROR';
}

// Payloads for updating questions
export interface UpdateSingleQuestionPayload {
  exam_id: number;
  part_id: number;
  question_text: string | null;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer: string;
  explanation: string | null;
  image_url: string | null;
  audio_start_ms: number | null;
  audio_end_ms: number | null;
  sub_order: number;
  transcript: string | null;
  tags?: string;
}

export interface UpdateQuestionGroupPayload {
  exam_id: number;
  part_id: number;
  passage_text: string | null;
  image_url: string | null;
  audio_start_ms: number | null;
  audio_end_ms: number | null;
  transcript: string | null;
  explanation: string | null;
  sub_questions: SubQuestionPayload[];
}

export interface SubQuestionPayload {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string;
  sub_order: number;
  correct_answer: string;
  explanation: string | null;
}

// From GET /exams/{exam_id}/parts/{part_id} -> direction property
export interface DirectionExample {
  explanation: string;
  image_url: string;
  correct_option: string;
  audio_start_ms: number;
  audio_end_ms: number;
}

export interface Direction {
  text: string;
  audio_start_ms: number;
  audio_end_ms: number;
  example?: DirectionExample;
}

// Payload for PUT /api/v1/exams/part-direction/update
export interface PartDirectionUpdatePayload {
  exam_id: number;
  part_id: number;
  direction_text?: string;
  audio_start_ms?: number;
  audio_end_ms?: number;
  example_data?: {
    image_url?: string;
    explanation?: string;
    audio_end_ms?: number;
    audio_start_ms?: number;
    correct_option?: string;
  } | null;
}

// From GET /api/v1/exams/filter-structure
export interface FilterStructureNode {
  id: number;
  name: string;
  type: string;
  children?: FilterStructureNode[];
  // For nz-tree-select
  key: string;
  value: number;
  title: string;
  isLeaf: boolean;
}

export interface FilterStructureResponse {
  data: FilterStructureNode[];
  message: string;
  status: 'SUCCESS' | 'ERROR';
}