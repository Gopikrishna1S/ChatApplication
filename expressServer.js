const express = require('express')
const http = require('http')
const path = require('path')
const mongoose = require('mongoose')

const msgModel = require('./db/dbSchema.js')
const connection = require('./db/dbConnection.js')

const app = express()
app.use(express.static(__dirname+'/css'))
chatServer = http.createServer(app)

connection()    // Connect to MongoDB local database

const io = require('socket.io')(chatServer, { 
    cors: {
    origin: "http://localhost:2000"
    }
})

const users = {};


io.on('connection', socket => {

    msgModel.find({}, (e, docs) => {
        if(e) throw e
        socket.emit('load-msg',docs)
    })

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
port = process.env.PORT || 2000

chatServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})