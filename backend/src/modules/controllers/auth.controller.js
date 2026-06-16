import { signupValidateSchema, loginValidateSchema } from "../dto/auth.dto.js"
import ApiError from "../../common/utils/api-error.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import ApiResponse from "../../common/utils/api-response.js"
import { generateAccessToken } from "../../common/utils/token.js"


const signup = async (req, res) => {
    const validatedData = await signupValidateSchema.safeParseAsync(req.body)
    if (validatedData.error) {
        throw ApiError.badRequest("Invalid data")
    }

    const { username, email, password } = validatedData.data
    if (!username || !email || !password) {
        throw ApiError.badRequest("All fields are required")
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw ApiError.conflict("User with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    ApiResponse.created(res, "User signed up", user)
}


const login = async (req, res) => {
    const validatedData = await loginValidateSchema.safeParseAsync(req.body)
    if (validatedData.error) {
        throw ApiError.badRequest("Invalid data")
    }

    const { email, password } = validatedData.data
    if (!email || !password) {
        throw ApiError.badRequest("All fields are required")
    }

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
        throw ApiError.notfound("User with this email does not exist")
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
        throw ApiError.unauthorized("Incorrect password")
    }

    const token = generateAccessToken({ id: existingUser._id })
    console.log(token)

    ApiResponse.ok(res, "User logged in", token)
}

const getMe = async(req, res) => {
    const data = req.user
    ApiResponse.ok(res, "Profile fetched", data)
}


export {
    signup,
    login,
    getMe
}