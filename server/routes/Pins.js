const router = require('express').Router();
const Pin = require('../models/Pins')

router.post("/",async (req,res)=>{
    const NewPin = new Pin(req.body);
   
    try{
        const savedPin = await NewPin.save();
        res.status(200).send(savedPin);
    }catch(error){
        res.status(500).json(error).send(error);
    }
})

router.get("/",async (req,res)=>{
    try {
        const pins = await Pin.find();
        res.status(200).send(pins);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
