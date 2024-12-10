const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get specific vehicle by inventory_id
 * ************************** */
async function getVehicleById(vehicleId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.inv_id = $1`,
      [vehicleId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
  }
}

/* ***************************
 *  Create a new Classification and add it into the database
 * ************************** */
const createClassification = async function (classificationName) {
  try {
    // Assuming you're using an ORM or direct database calls
    const result = await pool.query(
      "INSERT INTO classification (classification_name) VALUES ($1)",
      [classificationName]
    );
    return result;
  } catch (error) {
    console.error("Error inserting classification: ", error);
    throw error; // Propagate the error for the controller to handle
  }
};

/* ***************************
 *  Add a new vehicle to the inventory
 * ************************** */
async function addInventory(
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
) {
  try {
    const query = `
      INSERT INTO inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const values = [
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
    ];
    const result = await pool.query(query, values);
    return result.rowCount; // Indicates success if 1 or more rows were inserted
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    throw error;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, createClassification, addInventory };