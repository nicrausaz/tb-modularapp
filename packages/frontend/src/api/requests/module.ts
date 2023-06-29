import { Module } from '@/models/Module'
import fetcher from '../fetcher'

export const enable = async (moduleId: string) => {
  return fetcher(`/api/modules/${moduleId}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enabled: true,
    }),
  })
}

export const disable = async (moduleId: string) => {
  return fetcher(`/api/modules/${moduleId}/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      enabled: false,
    }),
  })
}

export const save = async (module: Module) => {
  return fetcher(`/api/modules/${module.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nickname: module.nickname,
    }),
  })
}
