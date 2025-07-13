// import express
const express = require('express');
const router = express.Router();

// import department schema
const{Department}=require("../models/model");


router.post("/",async(req,res)=>{
    try {
        // 
        const{name,description,managerId}=req.body;
        // save to db
        const department = new Department({name,description,managerId})
        await department.save()
        res.status(200).json({message: "Department added successfully",addedDepartment:department})

    } catch (error) {
        res.status(400).json.message({error : error.message})
    }

})

// export the router to make it accessible
module.exports = router;