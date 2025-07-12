// import the express module
const express = require("express");
// create a router
const router = express.Router();
// import user schema
const { User } = require("../models/model");
const bcrypt = require("bcryptjs");

// import the middleware for authorization
const auth = require("../middleware/auth");

// Below is a route to fetch all users from db
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch a user based on a given ID
router.get("/:id",auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // check whether the user exists or not based on id passed
    if (!user) return res.status(404).json({ message: "User Not Found" });
    // if the id passed is correct, we shall just show the records of that give user
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// below is the update route for user
router.put("/:id", async (req, res) => {
  try {
    // destructure the details you want to update for user
    const { name, email, age, password } = req.body;
    // console.log(name,email,age,password)
    const user = await User.findById(req.params.id);

    // step1 check whether the user exist by the use of passed ID
    if (!user) res.status(404).json({ message: "User Not Found" });

    // step 2 Prepare the data to update
    let updateData = { name, email, age };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    // console.log("The updated data is",updateData)

    // step 3  update the user with the new datails
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // step 4 Give a response
    res.json({ message: "User successfully updated", user: updateUser });
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
});

// Below is the delete route for the user
router.delete("/:id", async (req, res) => {
  try {
    // Attempt to find and delete the user by their ID from url
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    // if no user is found to be deleted, give a response back
    if (!deletedUser) res.status(404).json({ message: "User Not Found" });

    // if the deletion has happenned notify the user with a success message
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.stauts(500).json({ message: err.message });
  }
});

// export the router
module.exports = router;
