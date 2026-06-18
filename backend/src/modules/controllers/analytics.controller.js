import mongoose from "mongoose"
import ApiError from "../../common/utils/api-error.js"
import Poll from "../models/poll.model.js"
import ApiResponse from "../../common/utils/api-response.js"

const getAnalytics = async (req, res) => {
    //if not id throw error
    //if id check valid or not
    //check poll exists or not 
    //if exists check poll creater and req.user are same or not
    //if not same throw error
    //if same find analytics from db
    //send apiresponse
    const { id } = req.params

    if(!id){
        throw ApiError.badRequest("Id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        throw ApiError.badRequest("Given id is not valid")
    }

    const poll = await Poll.findById(id)
    if(!poll){
        throw ApiError.notfound("Poll not found")
    }

    if(poll.createdBy.toString() !== req.user.id.toString()){
        throw ApiError.forbidden("You are not authorized to see analytics")
    }

    const analytics = {
        status: poll.endsAt > new Date() ? "live" : "closed",
        totalResponse: poll.options.reduce((total, option) => total + option.votes,0)
    }

    ApiResponse.ok(res, "Analytics fetched", analytics)
}

export{
    getAnalytics
}