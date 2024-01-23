const mongoose = require('mongoose');
const mongoPath = require('../../config').mongoPath;

mongoose.conn = mongoose.createConnection(mongoPath, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

module.exports = mongoose;