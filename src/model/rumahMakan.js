const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class RumahMakan {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }

  createOne = (rumahMakan, result) => {
    const query = `insert into rumah_makan (id, nama_rumah_makan, image1, image2, 
      content, alamat, id_kecamatan,  created_at) values (?,?,?,?,?,?,?,?)`
    this.#connection.query(query, [rumahMakan.id, rumahMakan.nama_rumah_makan, 
      rumahMakan.image1, rumahMakan.image2, rumahMakan.content, 
      rumahMakan.alamat, rumahMakan.id_kecamatan, rumahMakan.created_at], (err, res) => {
     
      if (err) {
        fs.unlinkSync(rumahMakan.image1)
        fs.unlinkSync(rumahMakan.image2)

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...rumahMakan});

      
    });

  };

  updateById = (rumahMakan, result) => {
    const query = `update rumah_makan set nama_rumah_makan = ?, content = ?, alamat = ?, id_kecamatan = ? where id = ? `
    this.#connection.query(query, [rumahMakan.nama_rumah_makan, rumahMakan.content, rumahMakan.alamat, rumahMakan.id_kecamatan, rumahMakan.id], (err, res) => {
     
      if (err) {
        // if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'kecamatan_un'")) {
        //   return result({kind: 'DUPLICAT_KECAMATAN_VALUE'}, null);
        // }

        return result(err, null);
      }

      if(res.changedRows === 0){
        return result({kind: 'NO_CHANGED'}, null);
      }
      
      return result(null, rumahMakan);
    });

  };

  updateimage1ById = (rumahMakan, result) => {
    const query1 = `select image1 from rumah_makan where id = ?`
    const query2 = `update rumah_makan set image1 = null where id = ? `
    this.#connection.query(query1, [rumahMakan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image1 !== null) {
          try {
            fs.unlinkSync(res1[0].image1)
          } catch (error) {
            fs.unlinkSync(rumahMakan.image1)
            this.#connection.query(query2, [rumahMakan.id])
            return result(error, null)
          }
          
        }
        const query = `update rumah_makan set image1 = ? where id = ? `
        this.#connection.query(query, [rumahMakan.image1, rumahMakan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, rumahMakan);
        });
      } else{
        fs.unlinkSync(rumahMakan.image1)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  updateimage2ById = (rumahMakan, result) => {
    const query1 = `select image2 from rumah_makan where id = ?`
    const query2 = `update rumah_makan set image2 = null where id = ? `
    this.#connection.query(query1, [rumahMakan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image2 !== null) {
          try {
            fs.unlinkSync(res1[0].image2)
          } catch (error) {
            fs.unlinkSync(rumahMakan.image2)
            this.#connection.query(query2, [rumahMakan.id])
            return result(error, null)
          }
          
        }
        const query = `update rumah_makan set image2 = ? where id = ? `
        this.#connection.query(query, [rumahMakan.image2, rumahMakan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, rumahMakan);
        });
      } else{
        fs.unlinkSync(rumahMakan.image2)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  deleteRumahMakanByID = (rumahMakan, result) => {
    const query = `delete from rumah_makan where id = ? `
    const query1 = `select image1, image2 from rumah_makan where id = ? `
    this.#connection.query(query1, [rumahMakan.id], (err1, res1) => {
      if (err1) {
        return result(err1, null);
      } else if(res1[0] !== undefined) {
        try {
          this.#connection.query(query, [rumahMakan.id], (err, res) => {
     
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
              
              return result(null, rumahMakan);
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

}

module.exports = { RumahMakan };
