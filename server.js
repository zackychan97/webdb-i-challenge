const express = require('express');

// const db = require('./data/dbConfig.js');
const AccountRouter = require('./accounts/accountRouter.js')
const server = express();

server.use(express.json());
server.use('/api/accounts', AccountRouter);

server.get('/', (req, res) => {
    res.send('<h2>Api running</h2>')
})
module.exports = server;