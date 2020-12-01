'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// defining Schema
const urlSchema = Schema({
    url: String,
    short: String
})

// converting schema into a Model in order to use it!
module.exports = mongoose.model('Url',urlSchema);