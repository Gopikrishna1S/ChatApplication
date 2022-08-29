const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const app = express()
app.use(express.static(__dirname+'/css'))
chatServer = http.createServer(app)

const connectionURI = 'mongodb+srv://infinit:test123456@chatappln.lcs16rw.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(connectionURI, (e)=> {
    if(e){
        console.error(e)
    } else {
        console.log('Connected to Atlas')
    }
})

const msgSchema = new Schema({
    userID: String,
    chatName: String,
    message: String,
    created: {type: Date, default:Date.now}
})

const msgModel = mongoose.model('Message',msgSchema)

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
        const newMsg = new msgModel({userID: socket.id, message: message})
        
        newMsg.save((err)=>{
            if(err) throw err
            socket.broadcast.emit( 'receive-msg', {userID: users[socket.id], message: message} )
        })
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