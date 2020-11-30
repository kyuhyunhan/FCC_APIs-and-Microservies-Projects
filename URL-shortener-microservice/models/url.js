'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = Schema({
    url: String,
    short: {type: String, default: shortid.generate}
})

module.exports = mongoose.model('Url',urlSchema);