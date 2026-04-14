export interface Menu {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string | null;
  type: string;
  status: number;
  priority: number;
  children?: Menu[];
}

export interface MenuStructure {
  id: number;
  name: string;
  children?: MenuStructure[];
}
