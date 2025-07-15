// import express
const express = require("express");

// import the mongoose module that will help you connect with database
const mongoose = require("mongoose");

// import the dotenv module
require("dotenv").config();

// create an express application
const app = express();
// specify the data format you expect to receive the data in
app.use(express.json());

// import the auth routers
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// import the user routes
const userRoutes = require("./routes/users");
app.use("/api/user", userRoutes);

// import the department routes
const departmentRoutes=require("./routes/department");
app.use("/api/department",departmentRoutes)

// import employee route
const employeeRoutes =require("./routes/employees")
app.use("/api/employees",employeeRoutes)

// connect to the database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection succesfull"))
  .catch((err) => console.error("Error connecting to the MongoDb", err));

// specify the port the application will  be running
const PORT = process.env.PORT || 3000;

// listen to the port
app.listen(PORT, () => {
  console.log("The server is running on port " + PORT);
});

// setup project of your own with atleast 3 schema and connect to online and local db
