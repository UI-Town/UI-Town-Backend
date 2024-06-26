const express = require('express');
const router = express.Router();

const cssController = require('../db/controllers/css');

/**
 * @param {string | string[] | undefined} req.query.id
 */
router.get('/', (req, res) => {
    if (req.query.id === undefined) {
        res.status(400).json({error: "provide at least 1 id"});
        return;
    }
    console.log(req.query.id)
    const ids = Array.isArray(req.query.id) ? req.query.id.map(x => parseInt(x)) : [parseInt(req.query.id)];
    console.log(ids);
    for (let each of ids) {
        if (isNaN(each)) {
            res.status(400).json({error: "ids should be numbers"});
            return;
        }
    }

    cssController.getCSSs(ids, (err, rows) => {
        if (err) {
            res.status(400).json({error: err.message});
        } else {
            res.json(rows);
        }
    });
});


router.post('/', (req, res) => {
    /**
     * @type {Object}
     * @property {number} userID
     * @property {string} password_hashed
     * @property {string} name
     * @property {string} html
     * @property {string} css
     * @property {string} category
     */
    const body = req.body;
    if (typeof (body) !== 'object' || typeof (body.userID) !== 'number' || typeof (body.password_hashed) !== 'string' || typeof (body.name) !== 'string' || typeof (body.html) !== 'string' || typeof (body.css) !== 'string' || typeof (body.category) !== 'string') {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    cssController.createCSS(body.userID, body.password_hashed, body.name, body.html, body.css, body.category, (err, id) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({ id });
    });
});

module.exports = router;