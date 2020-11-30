'use strict';
import { nanoid } from 'nanoid';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// defining Schema
const urlSchema = Schema({
    url: String,
    short: {type: String, default: nanoid(5)}
})

// converting schema into a Model in order to use it!
module.exports = mongoose.model('Url',urlSchema);