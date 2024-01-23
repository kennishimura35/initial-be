const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Kudapan {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }

  createOne = (kudapan, result) => {
    const query = `insert into makanan (id, nama_makanan, tipe_makanan, image1, image2, 
      filosopi, alamat, id_kecamatan,  created_at) values (?,?,?,?,?,?,?,?,?)`
    this.#connection.query(query, [kudapan.id, kudapan.nama_makanan, kudapan.tipe_makanan,
      kudapan.image1, kudapan.image2, kudapan.filosopi, kudapan.alamat, kudapan.id_kecamatan, kudapan.created_at], (err, res) => {
     
      if (err) {
        fs.unlinkSync(kudapan.image1)
        fs.unlinkSync(kudapan.image2)

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...kudapan});

      
    });

  };

  createOneMenu = (kudapan, result) => {
    const query = `insert into makanan (id, nama_makanan, tipe_makanan, image1, image2, 
      filosopi, id_rumah_makan, created_at) values (?,?,?,?,?,?,?,?)`
    this.#connection.query(query, [kudapan.id, kudapan.nama_makanan, kudapan.tipe_makanan,
      kudapan.image1, kudapan.image2, kudapan.filosopi, kudapan.id_rumah_makan, kudapan.created_at], (err, res) => {
     
      if (err) {
        fs.unlinkSync(kudapan.image1)
        fs.unlinkSync(kudapan.image2)

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...kudapan});

      
    });

  };

  updateimage1ById = (kudapan, result) => {
    const query1 = `select image1 from makanan where id = ?`
    const query2 = `update makanan set image1 = null where id = ? `
    this.#connection.query(query1, [kudapan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image1 !== null) {
          try {
            fs.unlinkSync(res1[0].image1)
          } catch (error) {
            fs.unlinkSync(kudapan.image1)
            this.#connection.query(query2, [kudapan.id])
            return result(error, null)
          }
          
        }
        const query = `update makanan set image1 = ? where id = ? `
        this.#connection.query(query, [kudapan.image1, kudapan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, kudapan);
        });
      } else{
        fs.unlinkSync(kudapan.image1)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  updateimage2ById = (kudapan, result) => {
    const query1 = `select image2 from makanan where id = ?`
    const query2 = `update makanan set image2 = null where id = ? `
    this.#connection.query(query1, [kudapan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image2 !== null) {
          try {
            fs.unlinkSync(res1[0].image2)
          } catch (error) {
            fs.unlinkSync(kudapan.image2)
            this.#connection.query(query2, [kudapan.id])
            return result(error, null)
          }
          
        }
        const query = `update makanan set image2 = ? where id = ? `
        this.#connection.query(query, [kudapan.image2, kudapan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, kudapan);
        });
      } else{
        fs.unlinkSync(kudapan.image2)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  deleteMakananByID = (kudapan, result) => {
    const query = `delete from makanan where id = ? `
    const query1 = `select image1, image2 from makanan where id = ? `
    this.#connection.query(query1, [kudapan.id], (err1, res1) => {
      if (err1) {
        return result(err1, null);
      } else if(res1[0] !== undefined) {
        try {
          this.#connection.query(query, [kudapan.id], (err, res) => {
     
            if (err){
              return result(err, null);
            } else{
              try {
                if(res1[0].image1 !== null){
                  fs.unlinkSync(res1[0].image1)
                }
  
                if (res1[0].image2 !== null) {
                  fs.unlinkSync(res1[0].image2)
                }
              } catch (error) {
                console.log(error)
              }
              
              return result(null, kudapan);
            }
            
            
          });
        } catch (error) {
          return result(error, null)
        }
      } else{
        return result({kind: 'UNKNOWN_ID'}, null)
      }
    })
  };

  updateKudapanById = (kudapan, result) => {
    const query = `update makanan set nama_makanan = ?, filosopi = ?, alamat = ?, id_kecamatan = ? where id = ? `
    this.#connection.query(query, [kudapan.nama_makanan, kudapan.filosopi, 
      kudapan.alamat, kudapan.id_kecamatan, kudapan.id], (err, res) => {
     
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'makanan_un'")) {
          return result({kind: 'DUPLICATE_MAKANAN_VALUE'}, null);
        }

        return result(err, null);
      }
      
      if(res.changedRows === 0){
        return result({kind: 'NO_CHANGED'}, null);
      }
      
      return result(null, kudapan);
    });

  };

  updateMenuById = (kudapan, result) => {
    const query = `update makanan set nama_makanan = ?, filosopi = ?, id_rumah_makan = ? where id = ? `
    this.#connection.query(query, [kudapan.nama_makanan, kudapan.filosopi, 
      kudapan.id_rumah_makan, kudapan.id], (err, res) => {
     
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'makanan_un'")) {
          return result({kind: 'DUPLICATE_MAKANAN_VALUE'}, null);
        }

        return result(err, null);
      }
      
      if(res.changedRows === 0){
        return result({kind: 'NO_CHANGED'}, null);
      }
      
      return result(null, kudapan);
    });

  };
  
}

module.exports = { Kudapan };
