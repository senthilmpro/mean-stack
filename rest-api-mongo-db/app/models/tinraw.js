var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// assuming mongoose connection is already made in bears.

var TRawSchema = new Schema({
    name : String,
    info : String,
    bio : String,
    pics :  [Schema.Types.Mixed],
    obj : Schema.Types.Mixed
});

module.exports = mongoose.model('Tinraw', TRawSchema);