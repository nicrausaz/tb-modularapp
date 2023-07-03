import fetcher from '../fetcher'

export const update = () => {
  // TODO
}

export const iconUpdate = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return fetcher<{ filename: string }>('/api/box/icon', {
    method: 'PUT',
    body: formData,
  }).then((res) => res.filename)
}
