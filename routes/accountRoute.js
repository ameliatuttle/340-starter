// Needed Recources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")


// Route for when the MyAccount link is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route for when the registration link is clicked
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to register tha account
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;