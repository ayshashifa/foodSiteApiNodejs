const mongoose = require('mongoose');
const tableSchema = mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
module.exports = tableSchema;
