import jwt from 'jsonwebtoken'

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" })
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

export {
    generateAccessToken,
    verifyAccessToken
}