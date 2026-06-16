import { success } from "zod"

class ApiResponse {
    
    static ok(res, message, data = null){
        return res.status(200).json({
            success: true,
            message,
            data
        })
    }
    static created(res, message, data = null){
        return res.status(201).json({
            success: true,
            message,
            data
        })
    }
    static noContent(res, message){
        return res.status(204).json({
            success: true,
            message
        })
    }
}

export default ApiResponse