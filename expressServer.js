const express = require('express')
const http = require('http')
const path = require('path')

const msgModel = require('./db/dbSchema.js')
const connection = require('./db/dbConnection.js')

const app = express()
app.use(express.static(__dirname+'/css'))

port = process.env.PORT || 2000
chatServer = http.createServer(app)

const start = async () => {
    try {
        await connection("mongodb://localhost:27017/chat")
        console.log('Connected to MongoDB')

        chatServer.listen(port, () => {
            console.log(`Server running on port ${port}`)
        })
    } catch (error) {
        console.log(error);
    }
}

start() // Connect to MongoDB local database

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
        msgModel.create( {userID: socket.id, message: message, userName: users[socket.id]}, (err)=>{
            if(err) throw err
            socket.broadcast.emit( 'receive-msg', {userID: socket.id, message: message, userName: users[socket.id]} )
        })
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})

app.get('/client.js', (req,res)=> {
    res.sendFile((path.join(__dirname,'client.js')))
})

const oldMsgs = []

app.get('/oldMessages.js', (req,res) => {
    res.sendFile((path.join(__dirname,'oldMessages.js')))
})

app.get('/fetchMsg', (req,res)=>{

    msgModel.find({}, (e, docs) => {
        if(e) {
            throw e
        }
        for (var i=0; i<docs.length; i++){
            oldMsgs.push(docs[i])
        }
    }).select({userID:0, _id:0,__v:0})

    res.send(JSON.stringify(oldMsgs))
})

app.get('/oldMessages', (req,res)=>{
    res.sendFile((path.join(__dirname,'oldMsg.html')))
})
