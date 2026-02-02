export interface Ticket {
  id: string;
  number: number;
  createdAt: Date;
  handleAtDest?: string;
  handleAt?: Date;
  done: boolean;
}