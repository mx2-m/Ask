const mongoose = require("mongoose");

const comment_schema = new mongoose.Schema({
    content: {
        type: String,
        required: "Content is Required"
    },
    pitanje: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pitanjeModel",
        required: "Post is Required Field"
    },
    'datum' : {
        type: Date,
        default: Date.now
    },
    votes: { type: Number, default: 0 }

});

const sortAnswers = (a, b) => {
    if (a.votes === b.votes) {
        return b.datum - a.datum;
    }
    return b.votes - a.votes;
};

comment_schema.method('vote', function(vote, callback) {
    if (vote === 'up') {
        this.votes += 1;
    } else {
        this.votes -= 1;
    }
    this.parent().save(callback);
});

module.exports = mongoose.model("Comment", comment_schema);