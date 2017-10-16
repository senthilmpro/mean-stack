
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

mongoose.connect('mongodb://localhost/dp');

var BearSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Bear', BearSchema);