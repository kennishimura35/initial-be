const { User } = require("../model/User");
const md5 = require("md5");
const uuid = require("uuid").v4;
const moment = require("moment");
const {
  Ok,
  BadRequest,
  InternalServerErr,
  DataUpdated,
  DataDeleted,
  SearchOk,
  NotFound,
  DataCreated,
  Unauthorized,
} = require("../helper/ResponseUtil");

require("dotenv").config();

class UserController {
  #user;

  constructor() {
    this.#user = new User();
  }

  validateInputNull(req, isInsert) {
    const messages = [];


    if (!req.body.username) {
      messages.push("Field 'username' masih kosong");
    }

    if (isInsert) {
      if (!req.body.password) {
        messages.push("Field 'password' masih kosong");
      }
    }


    return messages;
  }

  validateInputType(req, isInsert) {
    const messages = [];

    req.body.username = req.body.username.toString().toLowerCase();

    if (isInsert) {
      req.body.password = req.body.password.toString();
    }

    if (req.body.username.length < 5 || req.body.username.length > 24) {
      messages.push(
        "Field 'username' diharuskan memiliki panjang 5 - 24 karakter"
      );
    }
    const validUsernameRegexp = /^[a-z0-9_]+$/; // a-z U 0-9 U _
    if (
      !messages.includes(
        "Field 'username' diharuskan memiliki panjang 5 - 24 karakter"
      )
    ) {
      if (req.body.username.search(validUsernameRegexp)) {
        // return -1 jika tidak sesuai regex
        messages.push(
          "Field 'username' tidak boleh berisikan karakter selain huruf, angka, atau undescore"
        );
      }
    }

    if (isInsert) {
      if (req.body.password.length < 6 || req.body.password.length > 64) {
        messages.push(
          "Field 'password' diharuskan memiliki panjang 6 - 64 karakter"
        );
      }
    }


    if (isInsert) {
      req.body.password = md5(req.body.password.toString());// encript password (harus setelah validasi)
    }

    return messages;
  }

  createOne = (req, res) => {
    if(req?.headers?.create_password !== "mugitrash"){
      return Unauthorized(res, ['Wrong Authentication']);
    }
 
    const messages =
      this.validateInputNull(req, true).length > 0
        ? this.validateInputNull(req, true)
        : this.validateInputType(req, true);

    if (messages.length > 0) {
      return BadRequest(res, messages);
    }

    const user = {
      id_user: uuid(),
      username: req.body.username,
      password: req.body.password,
      created_at: new Date(),
    };

    this.#user.createOne(user, (err, data) => {
      if (err) {
        if (err.kind === "DUPLICAT_USERNAME_VALUE") {
          // Default error jika terjadi duplikat value di di column yang unique
          messages.push(
            "Data user gagal ditambahkan karena username telah terdaftar"
          );
          return BadRequest(res, messages);
        }

        if (err.kind === "DUPLICAT_EMAIL_VALUE") {
          messages.push(
            "Data user gagal ditambahkan karena email telah terdaftar"
          );
          return BadRequest(res, messages);
        }

        if (err.kind === "UNKNOWN_GROUP_ID") {
          messages.push(
            "Data user gagal diubah karena group id tidak ditemukan"
          );
          return BadRequest(res, messages);
        }

        messages.push("Internal error // Insert error");
        messages.push(err.message);
        return InternalServerErr(res, messages);
      }

      messages.push("Data user berhasil dibuat");
      return DataCreated(res, messages);
    });
  };



}

module.exports = { UserController };
