const mongoose = require('mongoose');

const Adminschema =  mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    userName: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    }
},{collection: 'Admin'});

module.exports = mongoose.model('Admin',Adminschema)