// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");
const { body } = require("express-validator"); // Add validation utilities

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to deliver a specific inventory item's detail view
router.get("/detail/:inventoryId", invController.getVehicleDetail);

// Route to build the management view
router.get("/", invController.buildManagementView);

// Route to display the Add Classification form
router.get("/add-classification", invController.showAddClassificationForm);

// POST route to handle classification creation
router.post("/add-classification", invController.createClassification);

// Route to display the Add Inventory form
router.get('/add-inventory', invController.addInventoryForm);

// Route to handle the Add Inventory form submission
router.post('/add-inventory', invController.addInventory);

module.exports = router;