const { Connection, db } = require("../../src/helper/DBUtil");
const uuid = require("uuid").v4;
/* get one user */
const getUserByUsername = async (username) => {
    let query = `SELECT id, password, username `
    + `FROM user `
    + `WHERE LOWER(username) = LOWER(?) `
    let user = await db.query(query, [username])
    return user[0][0]
}

class User {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }

  async createOne(user, result) {
    const query = 'INSERT INTO user \
                    (id, username, password, created_at) \
                    VALUES (?,?,?,?)'
    this.#connection.query(query,
                [user.id_user, user.username, user.password, user.created_at],
                (err, res) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'user")) {
          return result({kind: 'DUPLICAT_USERNAME_VALUE'}, null);
        }

        return result(err, null);
      }
      return result(null, {id: res.insertId, ...user});
    });
  };

  
}



module.exports = { getUserByUsername, User }