import argon2 from 'argon2'
import { randomBytes } from 'crypto'

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

/**
 * Generate a new API key: a random string of <lenght> characters (default: 32)
 * and its hash for storage (using argon2)
 * @param length
 * @returns
 */
const generateApiKey = async (length = 32): Promise<{ key: string; hash: string }> => {
  const key = randomBytes(length).toString('hex')
  const hash = await hashString(key)
  return { key, hash }
}

export { hashString, verifyString, generateApiKey }
