export type SeatStatus = 'available' | 'reserved' | 'vip';

export interface SeatNode {
  id: string;
  row: number;
  column: number;
  status: SeatStatus;
  x: number;
  y: number;
}
