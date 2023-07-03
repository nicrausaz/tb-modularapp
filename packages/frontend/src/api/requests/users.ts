/**
 * API calls related to users
 */

import fetcher from '@/api/fetcher'

import { UserCreate, UserUpdate } from '@/models/User'

/**
 * Create a new user
 * @param user The user to create
 */
export const create = async (user: UserCreate) => {
  return fetcher('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
}

/**
 * Update an existing user
 * @param user The user to update
 */
export const update = async (user: UserUpdate) => {
  return fetcher(`/api/users/${user.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
}

/**
 * Update the avatar of a user
 * @param userId The id of the user
 * @param avatar The avatar to upload
 */
export const updateAvatar = async (userId: number, avatar: File) => {
  const formData = new FormData()
  formData.append('file', avatar)

  return await fetcher(`/api/users/${userId}/avatar`, {
    method: 'PUT',
    body: formData,
  })
}

/**
 * Delete a user
 * @param userId The id of the user
 */
export const remove = async (userId: number) => {
  return await fetcher(`/api/users/${userId}`, {
    method: 'DELETE',
  })
}
