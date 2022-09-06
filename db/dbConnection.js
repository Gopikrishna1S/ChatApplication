const mongoose = require('mongoose')
const { db } = require('./dbSchema')

const connectDB = (URL) => {
    return mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB