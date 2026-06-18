import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import pollRoutes from './routes/poll.routes.js'
import voteRoutes from './routes/vote.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

export function createApp() {
    const app = express()

    app.use(express.json())
    app.use(cors())
    app.use('/api', authRoutes)
    app.use('/api', pollRoutes)
    app.use('/api', voteRoutes)
    app.use('/api', analyticsRoutes)

    app.get('/', (req, res) => {
        res.send("hey")
    })

    return app
}

