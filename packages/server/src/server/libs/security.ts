import argon2 from 'argon2'

/**
 * Hash a string using argon2
 * @param value the value to hash
 * @returns the hashed value
 */
const hashString = async (value: string): Promise<string> => {
  return await argon2.hash(value)
}

/**
 * Verify a string against a hash
 * @param hash the hash to verify against
 * @param value the value to verify
 * @returns true if the value matches the hash, false otherwise
 */
const verifyString = async (hash: string, value: string): Promise<boolean> => {
  return await argon2.verify(hash, value)
}

// const generateApiKey = async(length = 32): Promise<{key: string, hash: string}> => {

// }

export { hashString, verifyString }
