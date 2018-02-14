import { model } from 'mongoose';

const mongoose = require('mongoose')

// Task schema

const TashSchema = mongoose.Schema = {
  name: String,
  urgency: String
}

module.exports = mongoose.model('Task', TaskSchema)