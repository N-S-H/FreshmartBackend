const express = require('express')
const router = express.Router();
const Inventory = require('../models/Inventory');
const Fruit = require('../models/Fruit');
const utility = require('../utils/DateUtil');
const { ObjectID } = require('mongodb');

router.get('/all', async (req,res)=> {
      try{
          var inventory = await Inventory.find();
          res.json(inventory);
      } catch(err){
          res.json({message:err});
      }
});

router.delete('/delete/:id', async (req,res)=> {
    try{
        const inventoryId = req.params.id;
        const deletedInventory = await Inventory.findByIdAndDelete(inventoryId);
        res.json(deletedInventory);
    }catch(err) {
        res.json({message:err});
    }
});

router.post('/add', async (req,res)=> {
    try {
       const fruit = req.body.fruitId;
       const quantity = req.body.quantity;
       const currentTime = utility.obtainCurrentDate();
       var shelfTime = 0;
       const fruits = await Fruit.find();
       for(var i=0;i<fruits.length;i++) {
           if(fruits[i]._id===fruit)
           {
               shelfTime = fruits[i].shelfLifeDays;
           }
       }
       const objectId = new ObjectID();
       const inventory = new Inventory({
            _id: objectId,
            fruitId: fruit,
            entryTime: currentTime,
            quantity: quantity,
            remainingShelfDays: shelfTime
       });

       const savedInventory = await inventory.save();
       res.json(savedInventory);

    }catch(err) {
        res.json({message: err});
    }
});


router.get('/viewAvailability', async (req,res)=> {
    try{
          var furitAvailabilityList = new Array();
          var fruitAvailabilityMap = new Map();
          const fruits = await Fruit.find();
          const inventory = await Inventory.find();
          var fruitNameMap = new Map();

          for(var i=0;i<fruits.length;i++)
          {
              if(fruits[i].enabled===true)
              {
                  fruitAvailabilityMap.set(fruits[i]._id,0);
              }
              fruitNameMap.set(fruits[i]._id,fruits[i].fruitName);
          }

          for(var i=0;i<inventory.length;i++)
          {
              if(fruitAvailabilityMap.has(inventory[i].fruitId))
              {
              var currentQuantity = fruitAvailabilityMap.get(inventory[i].fruitId);
              currentQuantity = currentQuantity + inventory[i].quantity;
              fruitAvailabilityMap.set(inventory[i].fruitId,currentQuantity);
              }
          }

          for(var entry of fruitAvailabilityMap.entries())
          {
              var key=entry[0], value=entry[1];
              if(value>0)
              {
                  var availabilityObject = new Object();
                  availabilityObject.fruitId = key;
                  availabilityObject.fruitName = fruitNameMap.get(key);
                  availabilityObject.quantity = value;
                  furitAvailabilityList.push(availabilityObject);
              }
          }

        res.json(furitAvailabilityList);
    }
    catch(err) {
        res.json({message:err});
    }
})

module.exports = router;