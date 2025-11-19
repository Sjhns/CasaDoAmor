// Esta interface define a "forma" de um item do histórico
export interface Operation {
  id: number;
  type: string;
  name: string;
  date: string;
  user: string;
  level: string;
  obs: string;
}