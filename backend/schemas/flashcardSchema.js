const mongoose = require('mongoose');


const flashcardSchema = mongoose.Schema({
    topicName: String,
    fCards:[],
    lastEdited: {type:Date, default: Date.now}
})

module.exports = flashcardSchema;
