const Users = require('../models/Users');
const router = require('express').Router();
const bcrypt = require('bcrypt');

router.post("/register",async (req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password , salt);
    const NewUser = new Users({
        name : req.body.username,
        email : req.body.email,
        Password : hashedPassword
    });
   
    try{
        const savedUser = await NewUser.save();
        res.status(200).json(savedUser).send('User is Saved');
    }catch{
        res.status(500).json(error).send('Something Went Wrong');
    }
})

router.post("/login/username",async (req,res)=>{
    try {
        const User = await Users.findOne({name:req.body.username});
        if(!User) res.status(400).send('Username or Password Incorrect');

        const IsValid = await bcrypt.compare(req.body.Password,User.Password);
        if(!IsValid) res.status(400).send('Username or Password Incorrect');

    res.status(200).send({_id:User._id,username:User.name,email:User.email});

    } catch (error) {
        res.status(500).json(error).send('Something Went Wrong');
    }
})
router.post("/login/email",async (req,res)=>{
    try {
        const User = await Users.findOne({email:req.body.email});
        if(!User) res.status(400).send('Username or Password Incorrect');

        const IsValid = await bcrypt.compare(req.body.password,User.Password);
        if(!IsValid) res.status(400).send('Username or Password Incorrect');

        res.status(200).send({_id:User._id,username:User.name,email:User.email});

    } catch (error) {
        res.status(500).json(error).send('Something Went Wrong');
    }
})

module.exports = router;