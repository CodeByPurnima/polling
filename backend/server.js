import http from 'http'
import 'dotenv/config'
import {createApp} from './src/modules/app.js'
import connectDB from './src/common/config/db.js'
import { initSocket } from './src/common/config/socket.js'

async function main() {
    try{
        await connectDB()
        const app = createApp()
        const server = http.createServer(app)
        initSocket(server)
        const PORT = process.env.PORT ?? 4000
        server.listen(PORT, (req, res) => {
            console.log(`Server is running on port: http://localhost:${PORT}`)
        })
    }
    catch(err){
        console.log(`Error Starting server: ${err}`)
    }
}

main()
   