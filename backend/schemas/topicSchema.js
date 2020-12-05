const mongoose = require('mongoose');
const ContentObj= require('./contentObjSchema');

const topicSchema = mongoose.Schema({
    topicName: String,
    content: [ContentObj],
    lastEdited: {type:Date, default: Date.now}
})

module.exports = topicSchema;
