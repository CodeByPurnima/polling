import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 4,
        trim: true,
        required: true
    },
    email: {
        type: String,
        minLength: 6,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User
