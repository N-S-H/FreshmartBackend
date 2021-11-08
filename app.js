const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const FruitRoute = require('./routes/FruitRoute');
const InventoryRoute = require('./routes/InventoryRoute');
const AdditionalRoute = require('./routes/AdditionalRoute');

app.use(bodyParser.json());
app.use(cors());


app.use('/fruit',FruitRoute);
app.use('/inventory',InventoryRoute);
app.use('/',AdditionalRoute);

//Connect to database
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true },
()=> console.log("Connected to the database!")
);

app.listen(8090);