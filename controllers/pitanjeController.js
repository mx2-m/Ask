var pitanjeModel = require('../models/pitanjeModel.js');
const Comment = require('../models/commentModel.js');


module.exports = {

    list: function (req, res) {
        pitanjeModel.find(function (err, pitanja) {
            if (err) {
                return res.status(500).json({
                    message: 'Error',
                    error: err
                });
            }
            return res.render('pitanje/list', pitanja);
        }).sort({datum: "desc"});
    },

    odgovori: (req, res) => {
        var idQ = req.params.id;
        const odgovori = pitanjeModel.aggregate([{$lookup: {from: 'answers', localField: '_id', foreignField: 'question', as: 'odgovor'}},{ $sort: { votes: 1 }}]);
        res.render('pitanje/pitanje', odgovori.sort({votes: 1}));
    },



    show1: function (req, res) {
        var id = req.params.id;
        pitanjeModel.findOne({_id: id}, function (err, pitanje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error',
                    error: err
                });
            }
            if (!pitanje) {
                return res.status(404).json({
                    message: 'No such'
                });
            }
            return res.render('pitanje/pitanje', pitanje);
        }).populate(

            {path: "comments", select: "content",
            options: { sort: '-votes' }}
        );



        //res.send(pitanje);
    },

    /**
     * questionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        pitanjeModel.findOne({_id: id}, function (err, question) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting question.',
                    error: err
                });
            }
            if (!question) {
                return res.status(404).json({
                    message: 'No such question'
                });
            }
            //return res.json(question);
            return res.render('pitanje/pitanje', question);
        }).sort({votes:1});
    },


    dodaj: (req, res) => {
        res.render('pitanje/dodaj');
    },

    create: function (req, res) {
        var pitanje = new pitanjeModel({
            naslov : req.body.naslov,
            vsebina : req.body.vsebina,
            tag : req.body.tag,

        });

        pitanje.save(function (err, pitanje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating question',
                    error: err
                });
            }
            return res.status(201).json(pitanje);

        });
    },
    /**
     * questionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        pitanjeModel.findByIdAndRemove(id, function (err, pitanje) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the question.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    remove1:  async (req, res) => {
        await Comment.findByIdAndRemove(req.params.id);
        res.send({ message: "Comment Successfully Deleted" });
    },


// Create a Comment
    comment: async (req, res) => {
        //Find a POst
        const pitanje = await pitanjeModel.findOne({ _id: req.params.id });

        //Create a Comment
        const comment = new Comment();
        comment.content = req.body.content;
        comment.pitanje= pitanje._id;
        await comment.save();

        // Associate Post with comment
        pitanje.comments.push(comment._id);
        await pitanje.save()

        res.send(comment);
        //return res.redirect ('answer/'+req.params.id);

    },

//Read a Comment
    beri: async (req, res) => {
        const pitanje = await pitanjeModel.findOne({ _id: req.params.id }).populate(
            "comments"
        );
        res.send(pitanje);
    },


    vote: async (req, res) => {
        //Find a POst
        const comment = await Comment.findOne({ _id: req.params.id });
        //Create a Comment
        comment.votes +=1;
        await comment.save();

        res.send(comment);

    },

    showA: function (req, res) {
        var id = req.params.id;
        Comment.findOne({_id: id}, function (err, answer) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting answer.',
                    error: err
                });
            }
            if (!answer) {
                return res.status(404).json({
                    message: 'No such answer'
                });
            }
           // return res.json(answer);
            return res.render('pitanje/odgovor', answer);
        });
    },




};
