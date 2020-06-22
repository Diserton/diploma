const mongoose = require('mongoose')
const Schema = mongoose.Schema


const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    // add quantity
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('positions', positionSchema)