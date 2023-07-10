import { APIKey } from '@/models/Box'
import fetcher from '../fetcher'

export const update = (name: string) => {
  return fetcher('/api/box', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
}

export const iconUpdate = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return fetcher<{ filename: string }>('/api/box/icon', {
    method: 'PUT',
    body: formData,
  }).then((res) => res.filename)
}

export const generateAPIKey = async (name: string): Promise<string> => {
  return fetcher<{ key: string }>('/api/box/security/keys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }).then((res) => res.key)
}

export const getAPIKeys = async (): Promise<APIKey[]> => {
  return fetcher<APIKey[]>('/api/box/security/keys')
}

export const deleteAPIKey = async (id: number): Promise<void> => {
  return fetcher(`/api/box/security/keys/${id}`, {
    method: 'DELETE',
  })
}
