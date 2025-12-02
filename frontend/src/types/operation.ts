export interface Operation {
  id: string;
  type: string;
  name: string;
  date: string;
  user: string;
  level: string;
  obs: string;
  recipient?: string;
}