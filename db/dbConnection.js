const mongoose = require('mongoose')

const connectionURI = 'mongodb://localhost:27017/chat'

const connection = async () => {
    await mongoose.connect(connectionURI, (e)=> {
        if(e)
            console.error(e)
        else {
            console.log("Connection Successful!");
        }
    })
}

module.exports = connection

