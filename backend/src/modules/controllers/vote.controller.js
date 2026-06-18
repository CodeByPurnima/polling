import Vote from "../models/vote.model.js"
import Poll from "../models/poll.model.js";
import ApiError from "../../common/utils/api-error.js"
import ApiResponse from "../../common/utils/api-response.js"
import mongoose from 'mongoose'
import { getIO } from '../../common/config/socket.js'

const votePoll = async (req, res) => {
    const { option } = req.body
    const { id } = req.params

    const poll = await Poll.findById(id)
    if (!poll) {
        throw ApiError.notfound("Polls not found")
    }

    if (poll.endsAt <= new Date()) {
        throw ApiError.badRequest("Poll is closed");
    }

    if (!option) {
        throw ApiError.badRequest("Please select an option");
    }

    const optionExists = poll.options.some(
        (opt) => opt._id.toString() === option
    );
    if (!optionExists) {
        throw ApiError.badRequest("Invalid option");
    }

    const vote = await Vote.create({
        pollId: poll._id,
        votedBy: req.user.id,
        option
    });

    await Poll.updateOne(
        {
            _id: poll._id,
            "options._id": option
        },
        {
            $inc: {
                "options.$.votes": 1
            }
        }
    );

    const updatedPoll = await Poll.findById(poll._id)
    const io = getIO()
    io.to(`poll:${poll._id}`).emit('vote-updated', {
        pollId: poll._id,
        options: updatedPoll.options,
        totalResponses: updatedPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
    })

    ApiResponse.created(res, "Voted successfully", vote)
}

const getAllVotes = async (req, res) => {
    const { id } = req.params

    if(!id){
        throw ApiError.badRequest("Id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Invalid id")
    }

    const poll = await Poll.findById(id)

    if(!poll){
        throw ApiError.notfound("Poll not found")
    }

    if(poll.createdBy.toString() !== req.user.id.toString()){
        throw ApiError.forbidden("You are not authorized to see votes")
    }
    
    const votes = await Vote.find( { pollId: id})

    if(votes.length === 0){
        throw ApiError.notfound("No votes to show")
    }

    ApiResponse.ok(res, "Votes fetched", votes)

}

const updateVote = async(req, res) => {
    const { option } = req.body
    const { id } = req.params

    const poll = await Poll.findById(id)
    if (!poll) {
        throw ApiError.notfound("Polls not found")
    }

    if (poll.endsAt <= new Date()) {
        throw ApiError.badRequest("Poll is closed");
    }

    if (!option) {
        throw ApiError.badRequest("Please select an option");
    }

    const optionExists = poll.options.some(
        (opt) => opt._id.toString() === option
    );
    if (!optionExists) {
        throw ApiError.badRequest("Invalid option");
    }

    const vote = await Vote.findByIdAndUpdate({
        pollId: poll._id,
        votedBy: req.user.id,
        option
    })

    await Poll.updateOne(
        {
            _id: poll._id,
            "options._id": option
        },
        {
            $inc: {
                "options.$.votes": 1
            }
        }
    );

    const updatedPoll = await Poll.findById(poll._id)
    const io = getIO()
    io.to(`poll:${poll._id}`).emit('vote-updated', {
        pollId: poll._id,
        options: updatedPoll.options,
        totalResponses: updatedPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
    })

    ApiResponse.ok(res, "Vote updated successfully", vote)
}

export {
    votePoll,
    getAllVotes,
    updateVote
}