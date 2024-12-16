const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const flashMessage = req.flash("notice")[0] || ''; 
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      flashMessage: flashMessage,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        );
        // Redirect to login page to show the flash message
        res.status(201).redirect("/account/login"); 
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    console.log('Login Route Hit');
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    
    // Check the request body
    console.log('Request Body:', req.body);

    const accountData = await accountModel.getAccountByEmail(account_email);

    // Check if account is found
    console.log('Account Data:', accountData);

    const flashMessage = req.flash("notice")[0];

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            flashMessage: flashMessage,
        });
        return;
    }

    try {
        const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
        // Check password comparison result
        console.log('Password Valid:', isPasswordValid);

        if (isPasswordValid) {
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });

            // Log token creation
            console.log('Generated Token:', accessToken);

            // Log cookie setting
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }

            req.flash("notice", "You are successfully logged in.");
            console.log('Flash Message:', req.flash("notice"));
            return res.redirect("account/account-management");
        } else {
            req.flash("notice", "Please check your credentials and try again.");
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
                flashMessage: flashMessage,
            });
        }
    } catch (error) {
        console.log('Error:', error);  // Log any error encountered
        throw new Error('Access Forbidden');
    }
}



/* ****************************************
 *  Account Management View after Login
 * *************************************** */
async function accountManagement(req, res, next) {
    try {
        let nav = await utilities.getNav();
        const flashMessage = req.flash("notice")[0];
        console.log("Signed in");
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            flashMessage: flashMessage,
            messages: req.flash("notice"),
        });
    } catch (error) {
        console.error("Error in accountManagement:", error);
        next(error); // Pass the error to an error-handling middleware
    }
}
  
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountManagement }