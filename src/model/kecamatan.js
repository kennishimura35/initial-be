const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Kecamatan {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }


  allKecamatan = (result) => {
    const query = `select id, kecamatan, image1, image2, content from kecamatan k order by kecamatan asc`
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

  kecamatanByName = (kecamatan_name, result) => {
    const query = `select id, kecamatan, image1, image2, content from kecamatan k where kecamatan = ? `
    this.#connection.query(query, [kecamatan_name], (err, res) => {
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
  

  createOne = (kecamatan, result) => {
    const query = `insert into kecamatan (id, kecamatan, image1, image2, content, created_at) values (?,?,?,?,?,?)`
    this.#connection.query(query, [kecamatan.id, kecamatan.kecamatan, kecamatan.image1, kecamatan.image2, kecamatan.content, kecamatan.created_at], (err, res) => {
     
      if (err) {
        try {
          fs.unlinkSync(kecamatan.image1)
          fs.unlinkSync(kecamatan.image2)
        } catch (error) {
          console.log(error)
        }
        
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'kecamatan_un'")) {
          return result({kind: 'DUPLICAT_KECAMATAN_VALUE'}, null);
        }

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...kecamatan});
    });

  };

  updateById = (kecamatan, result) => {
    const query = `update  kecamatan set kecamatan = ?, content = ? where id = ? `
    this.#connection.query(query, [kecamatan.kecamatan, kecamatan.content, kecamatan.id], (err, res) => {
     
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'kecamatan_un'")) {
          return result({kind: 'DUPLICATE_KECAMATAN_VALUE'}, null);
        }

        return result(err, null);
      }
      
      if(res.changedRows === 0){
        return result({kind: 'NO_CHANGED'}, null);
      }
      
      return result(null, kecamatan);
    });

  };

  updateimage1ById = (kecamatan, result) => {
    const query1 = `select image1 from kecamatan where id = ?`
    const query2 = `update kecamatan set image1 = null where id = ? `
    this.#connection.query(query1, [kecamatan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image1 !== null) {
          try {
            fs.unlinkSync(res1[0].image1)
          } catch (error) {
            fs.unlinkSync(kecamatan.image1)
            this.#connection.query(query2, [kecamatan.id])
            return result(error, null)
          }
          
        }
        const query = `update kecamatan set image1 = ? where id = ? `
        this.#connection.query(query, [kecamatan.image1, kecamatan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, kecamatan);
        });
      } else{
        fs.unlinkSync(kecamatan.image1)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  updateimage2ById = (kecamatan, result) => {
    const query1 = `select image2 from kecamatan where id = ?`
    const query2 = `update kecamatan set image2 = null where id = ? `
    this.#connection.query(query1, [kecamatan.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image2 !== null) {
          try {
            fs.unlinkSync(res1[0].image2)
          } catch (error) {
            fs.unlinkSync(kecamatan.image2)
            this.#connection.query(query2, [kecamatan.id])
            return result(error, null)
          }
          
        }
        const query = `update kecamatan set image2 = ? where id = ? `
        this.#connection.query(query, [kecamatan.image2, kecamatan.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, kecamatan);
        });
      } else{
        fs.unlinkSync(kecamatan.image2)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  deleteimage1ById = (kecamatan, result) => {
    const query = `update kecamatan set image1 = null where id = ? `
    this.#connection.query(query, [kecamatan.id], (err, res) => {
     
      if (err) {
        return result(err, null);
      }
      
      if(res.changedRows === 0){
        return result({kind: 'UNKNOWN_ID'}, null)
      }

      return result(null, kecamatan);
    });

  };

  deleteimage2ById = (kecamatan, result) => {
    const query = `update kecamatan set image2 = null where id = ? `
    this.#connection.query(query, [kecamatan.id], (err, res) => {
     
      if (err) {
        return result(err, null);
      }

      if(res.changedRows === 0){
        return result({kind: 'UNKNOWN_ID'}, null)
      }
      
      return result(null, kecamatan);
    });

  };
  
  deleteKecamatanByID = (kecamatan, result) => {
    const query = `delete from kecamatan where id = ? `
    const query1 = `select image1, image2 from kecamatan where id = ? `
    this.#connection.query(query1, [kecamatan.id], (err1, res1) => {
      if (err1) {
        return result(err1, null);
      } else if(res1[0] !== undefined) {
        try {
          this.#connection.query(query, [kecamatan.id], (err, res) => {
     
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
              
              return result(null, kecamatan);
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

module.exports = { Kecamatan };
