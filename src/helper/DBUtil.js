const db = require('mysql-promise')()
const mysql = require('mysql');
require('dotenv').config();

const opt = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
}

db.configure(opt)

class Connection {
  static #instance = null;

  static async getConnection() {
    if (!Connection.#instance) {
      try {
        Connection.#instance = mysql.createPool({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          timezone: process.env.DB_TIMEZONE,
        });

        return Connection.#instance;

      } catch (err) {
        if (Connection.#instance) {
          try {
            Connection.#instance.close(); 
          } catch (err) {
            throw new Error(`Database error - Close connection // ${err.message}`);
          }
        }
        throw new Error(`Database error - Get connection ${err.message}`);
      }
      
    } else {
      return Connection.#instance;
    }

  }
}

module.exports = { db, Connection }