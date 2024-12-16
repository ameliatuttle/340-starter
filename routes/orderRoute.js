// Needed Recources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const orderController = require("../controllers/orderController")

// Route to display the order form
router.get("/create-order", orderController.renderOrderForm);

// Route to handle form submission
router.post("/create-order", orderController.submitOrder);

module.exports = router;