export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string | null;
  type: string;
  status: number;
  is_filterable: number;
  priority: number;
  children?: Category[];
}

export interface CategoryStructure {
  id: number;
  name: string;
  children: Array<{ id: number; name: string }>;
}
