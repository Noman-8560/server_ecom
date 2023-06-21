const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const products = require('../routes/products');
const path = require('path');

module.exports = function (app) {
    app.use(express.json());
    app.use('/storage',express.static(path.join(__dirname, '../storage')));
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/products', products);
}
