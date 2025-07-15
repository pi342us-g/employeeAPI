// import express
const express = require('express');
const router = express.Router();

// import department schema
const{Department}=require("../models/model");

// import the middleware for authorization
const auth = require("../middleware/auth");

// registering a department
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

// below is the end point to get all departments
router.get("/",async (req,res) => {
    try {
        // create a variable that will hold all the responded to us from mongo
        const departments = await Department.find()

        // show the response
        res.json(departments)
    } catch (error) {
        res.status(500).json({error :err.message})
    }
})

// you can get a single department
router.get("/:id",async (req,res) => {
    try {
        const department = await Department.findById(req.params.id)
        // check whether that department with given id exist
        if(!department){
            return res.status(404).json({message:"Department not found"})
        }
        // if department is there just give details of department
        res.json(department)
    } catch (error) {
        res.status.json({error: err.message})
    }
})

// below is an update for department
router.put("/:id",async (req,res) => {
    try {
        // destructure different details you want to update
        const{name,description,managerId}=req.body;

        const department = await Department.findByIdAndUpdate(
            req.params.id,{name,description,managerId,updateAt:Date.now(),new:true,runValidators:true}
        )
        // check whether the department you are updating are there
        if(!department){
            return res.status(404).json({message:"Department Not Found"})
        }
        // if the department is available for update just return new record
        res.json({message:"Department Updated Successfully",updatedDepartment:department})
    }
    catch (error) {
        res.status(500).json({error:err.message})
    }
});

// delete Department
router.delete("/:id",async (req,res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id)
        // check whether it exists
        if(!department){
            res.status(404).json({message:"Department not found"})

        };
        // if the department id corresponds to one in db proceed with deleting the department
        res.json({message:"Department Deleted successfully"})
    } catch (error) {
        res.status(500).json({error:err.message})
    }
})

// export the router to make it accessible
module.exports = router;