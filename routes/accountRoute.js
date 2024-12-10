// Needed Recources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Route for when the MyAccount link is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route for when the registration link is clicked
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to register tha account
//router.post('/register', utilities.handleErrors(accountController.registerAccount))
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;