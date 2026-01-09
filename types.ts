export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface UsageItem {
  id: string;
  content: string;
  count: number;
  comments: Comment[];
  createdAt: number;
}

export enum FilterType {
  ALL = 'ALL',
  CONFIRMED = 'CONFIRMED',
  UNCONFIRMED = 'UNCONFIRMED'
}