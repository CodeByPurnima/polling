import ApiError from '../../common/utils/api-error.js'
import ApiResponse from '../../common/utils/api-response.js'
import Poll from '../models/poll.model.js'
import mongoose from 'mongoose'

const createPoll = async(req, res) => {
    const{question, description, options, endsAt} = req.body
    if(!question || !options || !endsAt){
        throw ApiError.badRequest("Incomplete poll request")
    }
    const poll = await Poll.create({
        question,
        description,
        options,
        createdBy: req.user.id,
        endsAt: new Date(endsAt)
    })
    ApiResponse.created(res, "Poll created successfully", poll)
}

const getAllPolls = async(req, res) => {
    const polls = await Poll.find().sort({ createdAt: -1 })
    ApiResponse.ok(res, "Polls fetched", polls)

    if(!polls){
        throw ApiError.notfound("No polls found")
    }
}

const getPollById = async (req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Invalid id")
    }

    const poll = await Poll.findById(id);
    if(!poll){
        throw ApiError.notfound("No polls found")
    }

    ApiResponse.ok(res, "Poll fetched", poll);
};

const deletePollById = async(req, res) => {
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Invalid id")
    }

    const poll = await Poll.findByIdAndDelete(id)
    if(!poll){
        throw ApiError.notfound("No polls found")
    }

    ApiResponse.ok(res, "Poll deleted successfully");
}

export{
    createPoll,
    getAllPolls,
    getPollById,
    deletePollById
}