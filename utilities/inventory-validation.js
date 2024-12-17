const utilities = require("../utilities");

const { body, validationResult } = require("express-validator");
const validate = {};

const invModel = require("../models/inventory-model");

/* **********************************
 *  Inventory Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification name is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlphanumeric()
            .withMessage("Please provide a valid classification name.")
            .isLength({ min: 1 })
            .withMessage("Please provide a valid classification name.")
    ];
};

/* ******************************
 * Check data and return errors with the classification name
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/addClassification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        });
        return;
    }
    next();
};

/* **********************************
 *  Vehicle Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        // Required fields that must be a string
        body("classification_id")
            .notEmpty()
            .withMessage("Please choose a classification."),

        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a make/brand."),

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a model."),

        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid year is required."),

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide an image."),

        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail."),

        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid price is required."),

        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .withMessage("A valid miles amount is required."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a color.")
    ];
};

/* ******************************
 * Check vehicle data and return errors
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        const {
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body;
        let classifications = await utilities.buildClassificationList(
            classification_id
        );
        let nav = await utilities.getNav();
        res.render("inventory/addInventory", {
            errors,
            title: "Add Inventory",
            nav,
            classifications,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};




/* ******************************
 * Check vehicle data to be updated
 * Return errors or continue to update
 * Errors will redirect to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        const {
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        } = req.body;
        let classifications = await utilities.buildClassificationList(
            classification_id
        );
        let nav = await utilities.getNav();
        res.render("inventory/editInventory", {
            errors,
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            classifications,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};

module.exports = validate