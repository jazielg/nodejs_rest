const Mongoose = require('mongoose')

const dadosSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = Mongoose.model('dados', dadosSchema)