export interface Guest {
  id: number
  name: string // Maps to 'Nome'
  hasResponded: boolean // Maps to 'Respondeu'
  isAttending: boolean // Maps to 'Confirmado'
  responseDate?: string // Maps to 'Data'
}