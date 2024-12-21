const contactModel = require("../models/contact-model")
const utilities = require("../utilities")

const contactController = {}

/* ****************************************
*  Deliver "Contact Us" view
* *************************************** */
async function buildContactUs(req, res, next) {
    let nav = await utilities.getNav()
    res.render("contact/contactUs", {
        title: "Contact CSE Motors",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process "Contact Us" Data Submission
* *************************************** */
async function submitContactForm(req, res) {
    let nav = await utilities.getNav()
    const { user_firstname, user_lastname, user_email, user_phone, message_subject, message_content } = req.body;

    const submitResult = await contactModel.saveContactMessage(
        user_firstname,
        user_lastname,
        user_email,
        user_phone,
        message_subject,
        message_content
    )

    if (submitResult) {
        req.flash(
            "success-message",
            "Thank you. Your request has been sent. Someone from our dealership will be reviewing your information and contacting you soon."
        )
        res.status(201).render("contact/contactUs", {
            title: "Contact CSE Motors",
            nav,
            errors: null
        })
    } else {
        req.flash("failure-message", "Sorry, your request has not been sent. Please try again")
        res.status(501).render("contact/contactUs", {
            title: "Contact CSE Motors",
            nav,
            errors: null
        })
    }
}

//  Export modules
module.exports = { buildContactUs, submitContactForm }