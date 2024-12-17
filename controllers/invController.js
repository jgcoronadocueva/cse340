const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetailPage = async function (req, res, next) {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getVehicleByInventoryId(inventory_id); // Clean code
    const listing = await utilities.buildItemListing(data[0]);
    let nav = await utilities.getNav();
    const itemName = `${data[0].inv_make} ${data[0].inv_model}`;

    res.render("inventory/vehicleDetails", {
        title: itemName,
        nav,
        listing,
    });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInvManagement = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/invManagement", {
        title: "Inventory Management",
        errors: null,
        nav,
        classificationSelect,
    });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();

    res.render("inventory/addClassification", {
        title: "Add New Classification",
        nav,
        errors: null,
    });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.classificationAdded = async function (req, res, next) {
    const { classification_name } = req.body;

    const response = await invModel.addClassification(classification_name); // ...to a function within the inventory model...

    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    if (response) {
        req.flash(
            "success-message",
            `The "${classification_name}" classification was successfully added.`
        );

        res.render("inventory/invManagement", {
            title: "Inventory Management",
            errors: null,
            nav,
            classificationSelect
        });
    } else {
        req.flash("failure-message", `Failed to add ${classification_name} to the classification list`);
        res.render("inventory/addClassification", {
            title: "Add New Classification",
            errors: null,
            nav,
            classificationSelect
        });
    }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav();

    let classifications = await utilities.buildClassificationList();

    res.render("inventory/addInventory", {
        title: "Add Vehicle",
        errors: null,
        nav,
        classifications,
    });
};

/* ***************************
 *  Build inventory added view
 * ************************** */
invCont.inventoryAdded = async function (req, res, next) {
    const nav = await utilities.getNav();

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

    const response = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (response) {
        req.flash(
            "success-message",
            `The ${inv_year} ${inv_make} ${inv_model} successfully added.`
        );
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        res.render("inventory/invManagement", {
            title: "Inventory Management",
            nav,
            classificationSelect,
            errors: null,
        });
    } else {
        // This seems to never get called. Is this just for DB errors?
        req.flash("failure-message", "There was a problem.");
        res.render("inventory/addInventory", {
            title: "Add Vehicle",
            nav,
            errors: null,
        });
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav();

    const vehicleData = (await invModel.getVehicleByInventoryId(inventory_id))[0]
    const name = `${vehicleData.inv_make} ${vehicleData.inv_model}`

    const classifications = await utilities.buildClassificationList(vehicleData.classification_id)

    res.render("inventory/editInventory", {
        title: "Edit " + name,
        nav,
        classifications,
        errors: null,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_description: vehicleData.inv_description,
        inv_image: vehicleData.inv_image,
        inv_thumbnail: vehicleData.inv_thumbnail,
        inv_price: vehicleData.inv_price,
        inv_miles: vehicleData.inv_miles,
        inv_color: vehicleData.inv_color,
        classification_id: vehicleData.classification_id,
    });
};

/* ***************************
 *  Build update inventory view
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    const nav = await utilities.getNav();

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

    const response = await invModel.updateInventory(
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
        classification_id
    );

    if (response) {
        const itemName = response.inv_make + " " + response.inv_model;
        req.flash("success-message", `The ${itemName} was successfully updated.`);
        res.redirect("/inv/");
    } else {
        const classifications = await utilities.buildClassificationList(
            classification_id
        );
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("failure-message", "Sorry, the update failed.");
        res.status(501).render("inventory/editInventory", {
            title: "Edit " + itemName,
            nav,
            errors: null,
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
            classification_id,
        });
    }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId);
    const nav = await utilities.getNav();

    const vehicleData = (await invModel.getVehicleByInventoryId(inventory_id))[0]
    const name = `${vehicleData.inv_make} ${vehicleData.inv_model}`;

    res.render("inventory/deleteConfirm", {
        title: "Delete " + name,
        errors: null,
        nav,
        inv_id: vehicleData.inv_id,
        inv_make: vehicleData.inv_make,
        inv_model: vehicleData.inv_model,
        inv_year: vehicleData.inv_year,
        inv_price: vehicleData.inv_price,
    });
};

/* ***************************
 *  Carry the deletion process
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.body.inv_id);
    const nav = await utilities.getNav();

    const {
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
    } = req.body;

    const response = await invModel.deleteInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_price,
    );

    if (response) {
        const itemName = response.inv_make + " " + response.inv_model;
        req.flash("success-message", `The ${itemName} has been deleted.`);
        res.redirect("/inv/");
    } else {
        const classifications = await utilities.buildClassificationList(
            classification_id
        );
        const itemName = `${inv_make} ${inv_model}`;
        req.flash("failure-message", "Sorry, the vehicle was not deleted.");
        res.status(501).render("inventory/deleteInventory", {
            title: "Edit " + itemName,
            nav,
            errors: null,
            classifications,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_price,
        });
    }
};

module.exports = invCont;