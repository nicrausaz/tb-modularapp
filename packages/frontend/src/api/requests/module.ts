import { Module } from '@/models/Module'
import fetcher from '../fetcher'
import { Configuration } from '@/models/Configuration'

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

export const remove = async (moduleId: string) => {
  return fetcher(`/api/modules/${moduleId}`, {
    method: 'DELETE',
  })
}

export const upload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return fetcher<{ moduleId: string }>('/api/modules', {
    method: 'POST',
    body: formData,
  })
}

export const configuration = async (moduleId: string) => {
  return await fetcher<Configuration>(`/api/modules/${moduleId}/configuration`, {
    method: 'GET',
  })
}

export const resetConfiguration = async (moduleId: string) => {
  return fetcher(`/api/modules/${moduleId}/configuration/default`, {
    method: 'POST',
  })
}

export const saveConfiguration = async (moduleId: string, configuration: Configuration) => {
  return fetcher(`/api/modules/${moduleId}/configuration`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: configuration,
    }),
  })
}
