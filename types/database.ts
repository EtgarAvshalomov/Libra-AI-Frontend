export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}

export interface Chat {
  id: string
  userId: number
  createdAt: string | null
  lastUpdated: string | null
  name: string
  isDeleted: boolean
}

export type SenderRole = 'user' | 'assistant'

export interface Message {
  id: number
  role: SenderRole
  content: string
  createdAt: string | null
  model_id: number
  chatId: string | null
}

export interface Model {
  id: number
  name: string
  value: string
}