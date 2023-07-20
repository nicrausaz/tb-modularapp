import jwt from 'jsonwebtoken'

/**
 * Generate a JWT token containing the specified payload
 * @param payload
 * @returns The generated JWT token
 */
const generateToken = (payload: object) => {
  const SECRET = process.env.JWT_SECRET ?? ''
  return jwt.sign(payload, SECRET, {
    expiresIn: '4h',
  })
}

/**
 * Verifies the token and returns the decoded payload
 * @param token The token to verify
 * @returns The decoded payload
 */
const verifyAndDecodeToken = async (token: string) => {
  const SECRET = process.env.JWT_SECRET ?? ''

  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

export { generateToken, verifyAndDecodeToken }
