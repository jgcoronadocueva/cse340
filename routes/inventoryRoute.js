// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities");

const invValidate = require('../utilities/inventory-validation')

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildInvManagement));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the vehicle detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailPage));

// Route to get inventory by classification as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Add classification view routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.classificationAdded));

// Add inventory view routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.inventoryAdded));

// Build edit/update inventory view routes
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory));
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Delete vehicle view routes
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));


module.exports = router;