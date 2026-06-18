import ApiError from "../../common/utils/api-error.js"
import { verifyAccessToken } from "../../common/utils/token.js";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            throw ApiError.unauthorized("User not authenticated")
        }
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.id)
        if (!user) {
            throw ApiError.unauthorized("User not found")
        }
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        next()
    } catch (error) {
        next(error)
    }
}

export {
    authenticate
}