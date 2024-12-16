const pool = require("../database/");

// Insert an order into the "order" table
async function createOrder(order_firstname, order_lastname, order_email, inventory_id) {
    try {
        const sql = `
            INSERT INTO "order" (order_firstname, order_lastname, order_email, inventory_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        return await pool.query(sql, [order_firstname, order_lastname, order_email, inventory_id]);
    } catch (error) {
        return error.message;
    }
}

module.exports = { createOrder };