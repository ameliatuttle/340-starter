const invModel = require("../models/inventory-model");
const Util = {};
const pool = require('../database');

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * Build the vehicle detail HTML
 **************************************** */
Util.buildVehicleDetailHTML = function (vehicle) {
  let detail = {};

  if (vehicle) {
    detail.title = `${vehicle.inv_make} ${vehicle.inv_model}`;

    let html = '<div id="vehicle-detail">';
    html += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`;
    html += "<div class='vehicle-info'>";
    html += `<p><strong>Make:</strong> ${vehicle.inv_make}</p>`;
    html += `<p><strong>Model:</strong> ${vehicle.inv_model}</p>`;
    html += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
    html += `<p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>`;
    html += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>`;
    html += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
    html += "</div>";
    html += "</div>";

    detail.html = html;
  } else {
    detail.title = "Vehicle Details Not Found";
    detail.html = '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }

  return detail;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ***************************
 *  Build Classification Dropdown List
 * *************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications(); // Fetch classifications
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });

  classificationList += "</select>";
  return classificationList;
};

/* ***************************
 *  Build Inventory Dropdown List
 * *************************** */
Util.buildInventoryList = async function () {
  try {
    // Set up the inventory dropdown
    let inventoryList = '<select name="inventory_id" id="inventoryList" required>';
    
    // Query to get all inventory items
    const data = await pool.query('SELECT * FROM inventory'); 
    
    // Check if any inventory exists
    if (data.rows.length === 0) {
      inventoryList += "<option value=''>None available</option>";
    } else {
      // populate the dropdown
      data.rows.forEach((row) => {
        inventoryList += `<option value="${row.inv_id}">${row.inv_make} ${row.inv_model} ${row.inv_year} - $${row.inv_price}</option>`;
      });
    }

    inventoryList += "</select>";
    return inventoryList;

  } catch (error) {
    console.error("Error fetching inventory:", error);
    return "<select name='inventory_id' id='inventoryList' required><option value=''>Error fetching inventory</option></select>";
  }
};

module.exports = Util;
