const express = require('express')
// routers
const router= express.Router();
const {User}= require("../models/model")
const bcrypt = require('bcryptjs');
const path = require('path')
const fs = require('fs')

// import the multer module for files
const multer = require('multer');

// configure the storage folder where image shall be saved
const upload = multer({dest :"uploads/"})

// below is an api end point for registering a user
// register
router.post("/register",upload.single('photo'),async(req,res)=>{
    try{
        // get the different data passed by the user during registration
        // destructuring
         const{name,email,password}=req.body;
        // console.log("The entered name "+ name)
        // console.log("The entered email "+ email)
        // console.log("The entered password " + password);


        // check whether the user already exists
        const existingUser = await User.findOne({email})

        // hash the password so that it does not get saved as plain text inside database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);
        // console.log("salt",salt)
        // console.log("this is hashed password", hashedpassword)
        if(existingUser){
            return res.status(404).json({message:"user already registered"})
        };

        // declare variable for photo
        let photo =null;
        // check whether there is a file passed on the request
        if(req.file){
            // extract the extension of the file 
            const ext = path.extname(req.file.originalname);
            // assign a new name to file
            const newFileName = Date.now() + ext

            // specify the new path
            const newPath = path.join("uploads",newFileName)
            
            fs.renameSync(req.file.path, newPath)

            photo = newPath.replace(/\\/g,'/')
        }

        const user = new User({name,email,password:hashedPassword,password})
        const saved = await user.save();
        res.status(201).json({message:"user registered successfuly",user:saved})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
});


 

// export the router
module.exports = router;