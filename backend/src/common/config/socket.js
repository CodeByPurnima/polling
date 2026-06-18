import { Server } from 'socket.io'

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`)

        socket.on('join-poll', (pollId) => {
            socket.join(`poll:${pollId}`)
            console.log(`Socket ${socket.id} joined room poll:${pollId}`)
        })

        socket.on('leave-poll', (pollId) => {
            socket.leave(`poll:${pollId}`)
            console.log(`Socket ${socket.id} left room poll:${pollId}`)
        })

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`)
        })
    })

    return io
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized. Call initSocket() first.')
    }
    return io
}
