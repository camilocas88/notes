const mongoose = require('mongoose')
const { Schema }=mongoose


//Como se van a ver mis datos de la base de datos---> Mongo DB
const NodeSchema = new Schema({
    title: {type: String, required: true},
    description: { type: String, required:true},
    date: {type:Date, default: Date.now },
    user: { type:String}
})

module.exports = mongoose.model('Note', NodeSchema)