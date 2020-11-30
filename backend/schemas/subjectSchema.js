const mongoose = require('mongoose');
const Topic = require('./topicSchema');
const Flashcard = require('./flashcardSchema');



const subjectSchema = mongoose.Schema({
    subjectName: String,

    topics: [Topic],

    flashcards: [Flashcard],

    lastEdited: {type:Date,default: Date.now },

},{
    collection: 'subjects'
}
);

module.exports = mongoose.model('Subject',subjectSchema);