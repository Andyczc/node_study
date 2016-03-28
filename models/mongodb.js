// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://study:123456@localhost:38017/nodejs');
exports.mongoose = mongoose;