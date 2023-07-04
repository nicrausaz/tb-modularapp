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
