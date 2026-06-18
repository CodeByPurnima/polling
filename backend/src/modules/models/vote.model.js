import mongoose from 'mongoose'

const voteSchema = new mongoose.Schema({
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: true
    },
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    option: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Vote = mongoose.model("Vote", voteSchema)
export default Vote