const invModel = require("../models/order-model")
const utilities = require("../utilities/")

//Renders the order form page.
const renderOrderForm = async (req, res, next) => {
    try {
        let nav = await utilities.getNav();
        let inventoryList = await utilities.buildInventoryList();
        res.render("orders/create-order", {
            title: "Create Order Request",
            nav,
            inventoryList,
            message: null,
        });
    } catch (error) {
        next(error);
    }
};

//Handles the form submission to create a new order.
const submitOrder = async (req, res) => {
    try {
        const { order_firstname, order_lastname, order_email, inventory_id } = req.body;

        // Validate required fields
        if (!order_firstname || !order_lastname || !order_email || !inventory_id) {
            req.flash("notice", "All fields are required.");
            return res.redirect("/order/create-order");
        }

        // Call the model function to save the order
        const result = await invModel.createOrder(order_firstname, order_lastname, order_email, inventory_id);

        if (result) {
            req.flash("notice", "Order successfully created.");
        } else {
            req.flash("notice", "Failed to create the order. Please try again.");
        }

        // Redirect back to the form (or a success page)
        res.redirect("/order/create-order");
    } catch (error) {
        console.error("Error submitting order:", error);
        req.flash("notice", "Error creating the order. Please try again.");
        res.redirect("/order/create-order");
    }
};

module.exports = {
  renderOrderForm,
  submitOrder,
};
