const express = require('express')
const http = require('http')

const app = express()
app.use(express.static(__dirname+'/css'))

chatServer = http.createServer(app)

app.get('/js/client.js', (req,res) => {
    res.sendFile('/Users/gopikrishna1.s/Desktop/Chat App/js/client.js')
})

const io = require('socket.io')(chatServer, { 
    cors: {
    origin: "http://localhost:2000"
    }
})

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


port = process.env.PORT || 2000
chatServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})