const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary']
  },
  requirements: {
    type: [String],
    required: true
  },
  location: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Job', JobSchema);