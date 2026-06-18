import mongoose from 'mongoose'

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    options: [{
        text:{
            type: String,
            required: true,
            trim: true
        },
        votes: {
            type: Number,
            default:0
        }
    }],
    allowMultipleVotes: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    endsAt: {
        type: Date,
        required: true
    }
}, {timestamps: true})

export const Poll = mongoose.model("Poll", pollSchema)
export default Poll