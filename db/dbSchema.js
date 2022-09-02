const mongoose = require('mongoose')

const msgSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    message: String,
    created: {type: Date, default:Date.now}
})

const msgModel = mongoose.model('Message',msgSchema)

module.exports = msgModel