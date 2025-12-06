// Global types for the application

export interface NoteData {
  note: string; // e.g., "C4", "F#5"
  color?: string; // Optional custom color
}

export interface MusicTheoryResponse {
  name: string;
  description: string;
  notes: string[];
  intervals?: string[];
}

export enum AppMode {
  VISUALIZER = 'VISUALIZER',
  CHAT = 'CHAT',
  IMAGE = 'IMAGE'
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}
