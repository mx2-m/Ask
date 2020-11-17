var express = require('express');
var router = express.Router();
var pitanjeController = require('../controllers/pitanjeController.js');

function requiresLogin(req, res, next) {
    console.log("auth!");
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}


router.get('/', pitanjeController.list);
router.get('/dodaj', requiresLogin, pitanjeController.dodaj);
router.get('/:id',pitanjeController.show1);

router.get('/:id/answer/:id', pitanjeController.showA);
router.post('/', requiresLogin, pitanjeController.create);
router.post('/:id/answer', pitanjeController.comment);
router.get('/:id', pitanjeController.odgovori);
//router.get('/:id/odgovori', pitanjeController.show1);
router.post('/:id/answer/:id/sprejmi', pitanjeController.vote);
router.post(
    '/:id/answers/:id/vote-:dir',
    (req, res, next) => {
        if (req.params.dir.search(/^(up|down)$/) === -1) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            req.vote = req.params.dir;
            next();
        }
    },
    (req, res, next) => {
        req.comments.vote(req.vote, (err, question) => {
            if (err) return next(err);
            res.json(question);
        });
    }
);





router.delete('/:id', pitanjeController.remove);

router.delete("/:id/answer/:id",pitanjeController.remove1);


module.exports = router;