class ApiError extends Error {
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
    static badRequest(message = "Bad Request"){
        return new ApiError(400, message)
    }
    static unauthorized(message = "Unauthorized"){
        return new ApiError(401, message)
    }
    static forbidden(message = "Forbidden"){
        return new ApiError(403, message)
    }
    static notfound(message = "Page not found"){
        return new ApiError(404, message)
    }
    static conflict(message = "Conflict"){
        return new ApiError(409, message)
    }
}

export default ApiError