// Needed Resources 
const express = require("express")
const router = new express.Router()

const contactController = require("../controllers/contactController")
const utilities = require('../utilities/')
const contactValidate = require('../utilities/contact-validation')

// Route to build account view
router.get("/", utilities.handleErrors(contactController.buildContactUs))

// Process the submission of the contact form
router.post(
    "/",
    contactValidate.contactFormRules(),
    contactValidate.checkContactFormData,
    utilities.handleErrors(contactController.submitContactForm)
)

module.exports = router;
