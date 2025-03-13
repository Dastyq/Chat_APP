export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface OllamaResponse {
  model: string
  created_at: string
  message: {
    role: string
    content: string
  }
  done: boolean
} 