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