import ApiError from '../../common/utils/api-error.js'
import ApiResponse from '../../common/utils/api-response.js'
import Poll from '../models/poll.model.js'
import mongoose from 'mongoose'

const createPoll = async(req, res) => {
    const{question, description, options, endsAt, allowMultipleVotes} = req.body
    if(!question || !options || !endsAt){
        throw ApiError.badRequest("Incomplete poll request")
    }
    const poll = await Poll.create({
        question,
        description,
        options,
        createdBy: req.user.id,
        allowMultipleVotes,
        endsAt: new Date(endsAt)
    })
    ApiResponse.created(res, "Poll created successfully", poll)
}

const getMyPolls = async (req, res) => {
    const polls = await Poll.find({
        createdBy: req.user.id
    }).sort({ createdAt: -1 });

    if(!polls){
        throw ApiError.notfound("No polls found")
    }

    ApiResponse.ok(res, "My polls fetched", polls);
}

const getAllPolls = async(req, res) => {
    const { filter } = req.query

    let query = {}
    if(filter !== "active" && filter !== "closed"){
        throw ApiError.badRequest("Invalid filter")
    }
    if(filter === "active"){
        query.endsAt = { $gt: new Date() }
    }
    if(filter === "closed"){
        query.endsAt = { $lte: new Date()}
    }

    const polls = await Poll.find(query).sort({ createdAt: -1 })
    if(polls.lenght === 0){
        throw ApiError.notfound("No polls found")
    }

    ApiResponse.ok(res, "Polls fetched", polls)
}

const getPollById = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Invalid id")
    }
    
    const poll = await Poll.findById(id);

    const pollData = {
        ...poll.toObject(),
        status: poll.endsAt > new Date() ? "live" : "closed"
    };

    if(!poll){
        throw ApiError.notfound("No polls found")
    }

    ApiResponse.ok(res, "Poll fetched", pollData);
};

const deletePollById = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Invalid id")
    }

    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notfound("No polls found")
    }

    if (poll.createdBy.toString() !== req.user.id.toString()) {
        throw ApiError.forbidden("You are not allowed to delete this poll")
    }

    await Poll.findByIdAndDelete(id)

    ApiResponse.ok(res, "Poll deleted successfully");
}

export{
    createPoll,
    getMyPolls,
    getAllPolls,
    getPollById,
    deletePollById
}