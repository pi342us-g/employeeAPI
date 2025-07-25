const express = require('express')
const router =express.Router()
const{Employee,Department}=require("../models/model");


// import the middleware for authorization
const auth = require("../middleware/auth");

// create new employee
router.post("/",auth,async (req,res) => {
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


// Below route is for viewing all employees available
// Get all employee
router.get("/",auth,async (req,res) => {
    try{
        // find all employees and put them in a variable
        const employees =await Employee.find().populate('userId','email name photo').populate('departmentId','name');
        res.json(employees);
    }
    catch(error){
        res.status(500).json({message:"Failed to fetch all employees",Error:err.message})
    }
    
})

// fetch a single employee based on the Id of the employee
router.get("/:id",auth,async(req,res)=>{
    try {
        // test whether id exists exists on a database
        const employee = await Employee.findById(req.params.id)
        if(!employee){
            return res.status(404).json({message:"User not found"})
        }
        //if employee exists show details
        res.json(employee)
    } catch (error) {
        res.status(500).json({error:err.message})
    }
});
// update given deatils of an employee
router.put("/:id",auth, async(req, res)=>{
    try{
        // pick the details passed on insomia/postman
        const {userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status} = req.body;

        // console.log(userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status)

        // validate department based on the departmentId passed/entered
        if(departmentId){
            const department = await Department.findById(departmentId);
            if(!department){
                return res.status(400).json({error : "Invalid Department ID"})
            }
        }
        // proceed if the department id is valid
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {userId, firstName, lastName, email, departmentId, jobTitle, hireDate, salary, status, updatedAt : Date.now()},
            {new : true, runValidators : true}
        );

        if(!employee){
            return res.status(404).json({message : "Employee not found"})
        };

        // if the details are successfully updated, return a response with the new employees' details
        res.json(employee);

    }
    catch(err){
        res.status(400).json({Error : err.message})
    }
});

// delete employee
router.delete("/:id",auth,async(req,res)=>{
    try{
        // fetch the particular employee id
        const employee = await Employee.findByIdAndDelete(req.params.id)
        // check whether there is an employee with the given id
        if(!employee){
            return res.status(404).json({message:"Employee not found"})
        }
        // if the id is correct we should proceed by deleting the employee
        res.json({message:"Employee deleted successfully"})
    }
    catch(error){
        res.status(400).json({error:err.message})
    }
})

module.exports = router;