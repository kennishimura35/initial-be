const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Komentar {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }


  allKomentar = (result) => {
    const query = `select k.id, k.komentar, k.nama, k.rating, k.id_makanan, k.created_at, m.nama_makanan from komentar k 
    left join makanan m on k.id_makanan = m.id order by k.created_at desc`
    this.#connection.query(query, (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  komentarByIdMakanan = (id_makanan, result) => {
    const query = `select id, id_makanan, nama, komentar, rating, created_at from komentar k where id_makanan = ? order by created_at desc`
    this.#connection.query(query, [id_makanan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };

  averageKomentarByIdMakanan = (id_makanan, result) => {
    const query = `select AVG(rating) as average from komentar k where id_makanan = ? `
    this.#connection.query(query, [id_makanan], (err, res) => {
      if (err) {
        return result(err, null);
      }

      // Jika data tidak ada
      if (!res.length) {
        return result({kind: 'NOT_FOUND'}, null);
      }

      const data = {
        data: res
      } 

      return result(err, data);
    });

  };
  

  createOne = (komentar, result) => {
    const query = `insert into komentar (id, komentar, nama, rating, id_makanan, created_at) values (?,?,?,?,?,?)`
    this.#connection.query(query, [komentar.id, komentar.komentar, komentar.nama, komentar.rating, komentar.id_makanan, komentar.created_at], (err, res) => {
     
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'komentar_un'")) {
          return result({kind: 'DUPLICAT_KECAMATAN_VALUE'}, null);
        }

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...komentar});
    });

  };
  
  deleteKomentarByID = (komentar, result) => {
    const query = `delete from komentar where id = ? `
    try {
      this.#connection.query(query, [komentar.id], (err, res) => {
        if (err){
          return result(err, null);
        } else{
          return result(null, komentar);
        }
      });
    } catch (error) {
      return result(error, null)
    }
  };

}

module.exports = { Komentar };
