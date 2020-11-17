const mongoose = require('mongoose');
var Schema   = mongoose.Schema;





var pitanjeSchema = new Schema({
    'naslov' : String,
    'vsebina' : String,
    'tag' : String,
    'datum' : {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: "Comment is Required"
        }
    ]
});

/*pitanjeSchema.pre('save', function(next) {
    this.answers.sort(sortAnswers);
    next();
});*/



var Pitanje= mongoose.model('Pitanje', pitanjeSchema);
module.exports = Pitanje;
