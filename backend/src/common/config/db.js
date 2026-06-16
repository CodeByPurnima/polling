import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to MongoDB`)
    }
    catch(err){
        console.log(err)
    } 
}

export default connectDB