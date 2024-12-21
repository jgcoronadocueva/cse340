const utilities = require(".")

const { body, validationResult } = require("express-validator")
const validate = {}

const accountModel = require("../models/contact-model")

/*  **********************************
  *  Contact Us Form Data Validation Rules
  * ********************************* */
validate.contactFormRules = () => {
    return [
        body("user_firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a first name.") // on error this message is sent.
            .isLength({ min: 1 }),


        // lastname is required and must be string
        body("user_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // valid email is required and cannot already exist in the DB
        body("user_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("Please enter a valid email."),

        body("user_phone")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10, max: 10 })
            .withMessage("Please enter a valid U.S. phone number."), // Only accepts U.S. phone numbers

        body("message_subject")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1, max: 30 })
            .withMessage("Please provide a subject for the message"),

        body("message_content")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1, max: 150 })
            .withMessage("Please write your message"),
    ]
}

/* ******************************
 * Check data and return errors or continue to form submission
 * ***************************** */
validate.checkContactFormData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        const {
            user_firstname,
            user_lastname,
            user_email,
            user_phone,
            message_subject,
            message_content
        } = req.body;

        let nav = await utilities.getNav()
        res.render("contact/contactUs", {
            errors,
            title: "Contact CSE Motors",
            nav,
            user_firstname,
            user_lastname,
            user_email,
            user_phone,
            message_subject,
            message_content
        })
        return
    }
    next()
}

module.exports = validate