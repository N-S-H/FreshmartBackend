const express = require('express')
const router = express.Router();
const Fruit = require('../models/Fruit');
const Inventory = require('../models/Inventory');

router.get('/all', async (req,res)=> {
    const enabledFruits = new Array();
      try{
          var fruits = await Fruit.find();
          for(var i=0;i<fruits.length;i++)
          {
              if(fruits[i].enabled===true)
              {
                 enabledFruits.push(fruits[i]);
              }
          }
          res.json(enabledFruits);
      } catch(err){
          console.log(err);
          res.json({message:err});
      }
});

router.delete('/delete/:id', async (req,res)=> {
    
    try{
        const fruitId = req.params.id;
        const inventory = await Inventory.find();
        for(var i=0;i<inventory.length;i++)
        {
            if(inventory[i].fruitId===fruitId) {
                var myquery = { fruitId: fruitId };
                const deletedInventoryItem = await Inventory.deleteOne(myquery);
            }
        }
        const updatedFruit = await Fruit.updateOne({_id:fruitId},
            {$set: {enabled:false}});
        res.json(updatedFruit);
    }catch(err) {
        res.json({message:err}); 
    }
})

router.put('/edit',async(req, res)=> {
    try
    {
        const fruitId = req.body._id;
        const price = req.body.pricePerFruit;
        const updated_fruit = await Fruit.updateOne({_id:fruitId},
            {$set:{pricePerFruit:price}});
        const fruit = await Fruit.findById(fruitId);
        res.json(fruit);    
    }catch(err) {
        res.json({message:err});
    }
})

router.get('/select/:amount/:id',async(req,res)=> {

    try
    {
    const fruitList = await Fruit.find();
    var inventoryList = await Inventory.find();
    var fruitMap = new Map();
    fruitMap = constructFruitMap(fruitList);
    inventoryList.sort(compare);
    var updatedInventoryList = new Array();
    
    var amount = req.params.amount;
    const choice = req.params.id;

    for(var i=0;i<inventoryList.length;i++)
    {
        if(choice === "0")
        {
            updatedInventoryList.push(inventoryList[i]);
        }
        else if(choice === inventoryList[i].fruitId)
        {
            updatedInventoryList.push(inventoryList[i]);
        }
    }

    const inventoryIdsToDelete = new Array();
    const resultantInventoryList = new Array();
    const selectedFruits = new Map();

    for(var i=0;i<updatedInventoryList.length;i++)
    {
        var currentInventory = updatedInventoryList[i];
        var price = fruitMap.get(currentInventory.fruitId).pricePerFruit;
        var quantity = currentInventory.quantity;

        for(var j=0;j<quantity;j++)
        {
            if(amount-price>=0) 
            {
                if(selectedFruits.has(currentInventory.fruitId))
                {
                    var currentQuanity = selectedFruits.get(currentInventory.fruitId);
                    currentQuanity = currentQuanity + 1;
                    selectedFruits.set(currentInventory.fruitId,currentQuanity);

                }
                else 
                {
                    selectedFruits.set(currentInventory.fruitId,1);
                }
                amount = amount - price;
                currentInventory.quantity = currentInventory.quantity-1;
            }
        }

        if(currentInventory.quantity>0)
        {
            resultantInventoryList.push(currentInventory);
        }
        else
        {
           inventoryIdsToDelete.push(currentInventory._id);
        }
    }


    for(var i=0;i<inventoryIdsToDelete.length;i++)
    {
        const status = await Inventory.findByIdAndDelete(inventoryIdsToDelete[i]);
    }


    for(var i=0;i<resultantInventoryList.length;i++)
    {
        const updatedInventory = await Inventory.updateOne({_id:resultantInventoryList[i]._id},
            {$set:{quantity:resultantInventoryList[i].quantity}});
    }

    var userResponse = constructUserResponse(selectedFruits,fruitMap,amount);
    res.json(userResponse);
  }
  catch(err)
  {
      console.log(err);
    res.json({message:err});
  }

})

function compare(a,b)
{
    if(a.remainingShelfDays<b.remainingShelfDays)
    {
    return -1;
    }
    if(a.remainingShelfDays>b.remainingShelfDays)
    {
        return 1;
    }
    return 0;
}

function constructFruitMap(fruitList)
{
    fruitMap = new Map();
    for(var i=0;i<fruitList.length;i++)
    {
        fruitMap.set(fruitList[i]._id,fruitList[i]);
    }
    return fruitMap;
}

function constructUserResponse(selectedFruits,fruitMap,amount)
{
    var userResponseObject = new Object();
    userResponseObject.remainingBalance = amount;
    var fruitAvailabilityList = new Array();

    for(var entry of selectedFruits.entries())
    {
        var key=entry[0],value=entry[1];
        var availabilityObject = new Object();
        availabilityObject.fruitId = key;
        availabilityObject.fruitName = fruitMap.get(key).fruitName;
        availabilityObject.quantity = value;
        fruitAvailabilityList.push(availabilityObject);
    }

    userResponseObject.fruitAvailabilityList = fruitAvailabilityList;

    return userResponseObject;
}

module.exports = router;