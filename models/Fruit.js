const mongoose = require('mongoose');

const Fruitschema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    fruitName: {
        type: String,
        required: true
    },
    pricePerFruit: {
        type: Number,
        required: true 
    },
    calorificValuePerFruit: {
        type: Number,
        required: true 
    },
    shelfLifeDays: {
        type: Number,
        required: true 
    },
    enabled: {
        type: Boolean,
        required: true
    }
},{collection: 'Fruit'});

module.exports = mongoose.model('Fruit',Fruitschema)