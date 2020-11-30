const mongoose = require('mongoose');


const topicSchema = mongoose.Schema({
    topicName: String,
    fContent: '',
    lastEdited: {type:Date, default: Date.now}
})

module.exports = topicSchema;
