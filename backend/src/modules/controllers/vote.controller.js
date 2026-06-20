import Vote from "../models/vote.model.js"
import Poll from "../models/poll.model.js";
import ApiError from "../../common/utils/api-error.js"
import ApiResponse from "../../common/utils/api-response.js"
import mongoose from 'mongoose'
import { getIO } from '../../common/config/socket.js'

const votePoll = async (req, res) => {
    const { option, isAnonymous } = req.body
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

    const existingVote = await Vote.findOne({
        pollId: poll._id,
        votedby: req.user.id
    })
    
    if(existingVote){
        throw ApiError.conflict("You have already voted on this poll")
    }

    const vote = await Vote.create({
        pollId: poll._id,
        votedBy: req.user.id,
        option,
        isAnonymous
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

const getVotesData = async (req, res) => {
    const { id, optionId } = req.params

    if(!id || !optionId){
        throw ApiError.badRequest("Id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(optionId)){
        throw ApiError.badRequest("Invalid id")
    }

    const poll = await Poll.findById(id)

    if(!poll){
        throw ApiError.notfound("Poll not found")
    }
    
    const votes = await Vote.find( { pollId: id, option: optionId}).populate("votedBy", "username")

    if(votes.length === 0){
        throw ApiError.notfound("No votes to show")
    }

    const finalVoteResult = votes.map((vote) => {
        if (vote.isAnonymous) {
            return {
                username: "Anonymous"
            };
        }

        return {
            username: votes.votedBy.username
        };
    });

    ApiResponse.ok(res, "Votes fetched", finalVoteResult)
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

    const existingVote = await Vote.findOne({
        pollId: poll._id,
        votedBy: req.user.id
    })

    if(!existingVote){
        throw ApiError.notfound("You haven't voted on this poll yet")
    }

    const oldOption = existingVote.option

    existingVote.option = option
    await existingVote.save()

    await Poll.updateOne(
        {_id: poll._id, "options._id": oldOption},
        {$inc: {"options.$.votes": -1}}
    );

    await Poll.updateOne(
        {_id: poll._id, "options._id": option},
        {$inc: {"options.$.votes": 1}}
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
    getVotesData,
    updateVote
}