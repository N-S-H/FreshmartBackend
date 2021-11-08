const express = require('express')
const router = express.Router();
const Admin = require('../models/Admin');
const Inventory = require('../models/Inventory');
const Fruit = require('../models/Fruit');
const utility = require('../utils/DateUtil');

router.get('/login/:userName/:password', async (req,res)=> {
     const userName = req.params.userName;
     const password = req.params.password;
     try{
     const admins = await Admin.find();
     for(var i=0;i<admins.length;i++)
     {
         if(admins[i].userName === userName && admins[i].password === password)
         {
             res.json(true);
         }
     }
    }catch(err) {
        res.json({message:err});
    }
    res.json(false);
});

router.get('/', async (req,res)=> {

    try
    {
    const inventory = await Inventory.find();
    var updatedInventoryList = new Array();
    var inventoryIdsToDelete = new Array();

    for(var i=0;i<inventory.length;i++) {
        var currentInventory = inventory[i];
        const currentFruit = await Fruit.findById(currentInventory.fruitId); 
        const remainingShelfDays = utility.getDifferenceInDays(currentInventory,currentFruit);
        currentInventory.remainingShelfDays = remainingShelfDays;

        if(remainingShelfDays>0) {
           updatedInventoryList.push(currentInventory);
        }
        else {
            inventoryIdsToDelete.push(currentInventory._id);
        }
    }

    for(var i=0;i<updatedInventoryList.length;i++) {
        const status = await Inventory.updateOne({_id:updatedInventoryList[i]._id},
            {$set:{remainingShelfDays:updatedInventoryList[i].remainingShelfDays}});
    }

    for(var i=0;i<inventoryIdsToDelete.length;i++) {
        const deletedStatus = await Inventory.findByIdAndDelete(inventoryIdsToDelete[i]._id);
    }
    res.json("database refreshed")
    
    }catch(err) {
        res.json({message:err});
    }
});


module.exports = router;


