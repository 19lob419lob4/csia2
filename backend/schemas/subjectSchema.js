const mongoose = require('mongoose');
const Topic = require('./topicSchema');



const subjectSchema = mongoose.Schema({
    subjectName: String,

    topics: [Topic],

    lastEdited: {type:Date,default: Date.now },

},{
    collection: 'subjects'
}
);

module.exports = mongoose.model('Subject',subjectSchema);