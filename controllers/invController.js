const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build specific inventory item detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inventoryId = req.params.inventoryId;
    const vehicleData = await invModel.getVehicleById(inventoryId);
    if (!vehicleData) {
      return res.status(404).send("Vehicle not found");
    }

    const vehicleHTML = utilities.buildVehicleDetailHTML(vehicleData);
    let nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: `${vehicleData.make} ${vehicleData.model}`,
      nav,
      content: vehicleHTML,
    });
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    next(error);
  }
};

module.exports = invCont