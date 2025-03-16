export interface Class {
    id: number
    className: string,
    description: string
    icon?: any
}

export interface Student {
  id: number
  studentName: string,
  imageURL: string,
  embedding?: any
  embeddingURL?: any
}

export interface RecognitionResult {
  face: string;
  best_match?: {
      name: string;
      similarity: number;
  };
}