// Needed Resources 
const express = require("express")
const router = new express.Router()

const accountController = require("../controllers/accountController")
const utilities = require('../utilities/')
const regValidate = require('../utilities/account-validation')


// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Process the registration data
router.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

module.exports = router;