const mongoose = require('mongoose');

const Inventoryschema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fruitId: {
        type: String,
        required: true
    },
    entryTime: {
        type: String,
        required: true 
    },
    quantity: {
        type: Number,
        required: true 
    },
    remainingShelfDays: {
        type: Number,
        required: true 
    }
},{collection:'Inventory'});

module.exports = mongoose.model('Inventory',Inventoryschema)