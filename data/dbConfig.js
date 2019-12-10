const knex = require('knex');

const configOptions = require('../knexfile').development;

// This makes sure the ID being given even exists
function idChecker(req, res, next) {
    knex.select('*')
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


module.exports = knex(configOptions);