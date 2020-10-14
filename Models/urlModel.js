"use strict";

const mongoose = require('mongoose');
const urlSchema = require('./schemas/urlSchema');

module.exports = mongoose.model('ParsedUrls', urlSchema);