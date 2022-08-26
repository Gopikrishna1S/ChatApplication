const io = require('socket.io')(3000, { 
    cors: {
    origin: "http://localhost:2000"
    }
})
console.log("Socket server on")
const users = {};

io.on('connection', socket => {

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    })

    socket.on('send-msg', message => {
        socket.broadcast.emit('receive-msg', {message: message, name: users[socket.id]})
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})