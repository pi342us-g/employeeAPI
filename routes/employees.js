const express = require('express')
const router =express.Router()
const{Employee,Department}=require("../models/model");



// create new employee
router.post("/",async (req,res) => {
    try {
        // pick the details passed from the insomnia
        const{email,departmentId}=req.body;
        // console.log(email,department)
        // check whether the email address is already registered with another employee
        const existingEmail = await Employee.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"Email Already taken"})
        }

        // check whether the departmentId exists and whether its part of the department
        const department = await Department.findById(departmentId);
        if(!department){
            return res.status(400).json({message:"Invalid Department Id"})
        }
        // if validation happens proceed to save employees
        const employee = new Employee(req.body);
        await employee.save();

        // if save functionality is successfull return a response
        res.status(201).json({message:"Employee Registered successfully","Employee":employee})

    } catch (error) {
        res.status(400).json({message:err.message})
    }
})




module.exports = router;