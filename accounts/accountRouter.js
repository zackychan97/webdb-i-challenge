const express = require('express');
const knex = require('../data/dbConfig.js');
const router = express.Router();

// This makes sure the ID being given even exists
function idChecker(req, res, next) {
    knex
    .select('*')
    .from('accounts')
    .where({ id: req.params.id })
    .first()
    .then(account => {
        if (account) {
            req.account = account;
            next();
        } else {
            res.status(404).json({ message: "ID desired doesnt exist " })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Cant retrieve the desired id" })
    })
}

// verifies the post even exists

function postChecker(req, res, next) {
    if (!req.body.name) {
        res.status(400).json({ message: "Please give us accounts name" })
    } else if (!req.body.budget) {
        res.status(400).json({ message: "Please give us accounts budget" })
    } else {
        req.accountData = req.body;
        next();
    }
}

//-- router get /
router.get('/', (req, res) => {
    knex
    .select('*')
    .from('accounts')
    .then(response => {
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Cant get the account info" })
    })
})

//-- router get /:id
router.get('/:id', idChecker, (req, res) => {
    res.send(req.account);
});

//-- router post /
router.post('/', postChecker, (req, res) => {
    const accountData = req.accountData;

    knex('accounts').insert(accountData, 'id')
    .then(ids => {
        const id = ids[0];

        return knex('accounts')
            .select('id', 'name', 'budget')
            .where({ id })
            .first()
            .then(account => {
                res.status(201).json(account);
            })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Cant add new" })
    })


    //-- router delete /:id
    router.delete('/:id', idChecker, (req, res) => {
        const { id } = req.params;

        knex('accounts')
            .where({ id })
            .del()
            .then(response => {
                res.status(200).json({ message: `${response} deleted` })
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ errorMessage: "Coulndt delete the account" })
            })
    });

    //-- router put /:id
    router.put('/:id', idChecker, (req, res) => {
        const { id } = req.params;
        const puts = req.body;

        knex('accounts')
        .where({ id })
        .update(puts)
        .then(response => {
            res.status(200).json({ message: `${response} updated` })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: "Couldnt update account" })
        })
    })


})

module.exports = router;