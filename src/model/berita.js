const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Berita {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }


  allBerita = (result) => {
    const query = `select id, tanggal_berita, image1, penulis, content, status, judul, status from berita b where status = 1 order by tanggal_berita desc`
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

  beritaTerbaru = (result) => {
    const query = `select id, tanggal_berita, image1, penulis, content, status, judul, status from berita b where status = 1 order by tanggal_berita desc LIMIT 3`
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

  allBeritaAdmin = (result) => {
    const query = `select id, tanggal_berita, image1, penulis, content, status, judul from berita b order by tanggal_berita desc`
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

  beritaByIdAdmin = (id, result) => {
    const query = `select id, tanggal_berita, image1, penulis, content, status, judul from berita where id = ?`
    this.#connection.query(query, [id], (err, res) => {
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

  beritaById = (id, result) => {
    const query = `select id, tanggal_berita, image1, penulis, content, status, judul from berita where id = ? and status = 1`
    this.#connection.query(query, [id], (err, res) => {
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
  

  createOne = (berita, result) => {
    const query = `insert into berita (id, tanggal_berita, penulis, image1, status, content, created_at, judul) values (?,?,?,?,?,?,?,?)`
    this.#connection.query(query, [berita.id, berita.tanggal_berita, berita.penulis, 
      berita.image1, berita.status, berita.content, berita.created_at, berita.judul], (err, res) => {
     
      if (err) {
        try {
          fs.unlinkSync(berita.image1)
        } catch (error) {
          console.log(error)
        }
        
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'berita_un'")) {
          return result({kind: 'DUPLICAT_BERITA_VALUE'}, null);
        }

        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...berita});
    });

  };

  updateById = (berita, result) => {
    const query = `update berita set tanggal_berita = ?, content = ?, penulis = ?, status = ?, judul = ? where id = ? `
    this.#connection.query(query, [berita.tanggal_berita, berita.content, 
      berita.penulis, berita.status, berita.judul ,berita.id], (err, res) => {
     
      if (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes("for key 'berita_un'")) {
          return result({kind: 'DUPLICATE_BERITA_VALUE'}, null);
        }

        return result(err, null);
      }
      
      if(res.changedRows === 0){
        return result({kind: 'NO_CHANGED'}, null);
      }
      
      return result(null, berita);
    });

  };

  updateimage1ById = (berita, result) => {
    const query1 = `select image1 from berita where id = ?`
    const query2 = `update berita set image1 = null where id = ? `
    this.#connection.query(query1, [berita.id], (err, res1) => {
      if (err) {
        return result(err, null);
      } else if(res1[0] !== undefined) {

        if(res1[0].image1 !== null) {
          try {
            fs.unlinkSync(res1[0].image1)
          } catch (error) {
            fs.unlinkSync(berita.image1)
            this.#connection.query(query2, [berita.id])
            return result(error, null)
          }
          
        }
        const query = `update berita set image1 = ? where id = ? `
        this.#connection.query(query, [berita.image1, berita.id], (err, res) => {
        
          if (err) {
            return result(err, null);
          }
          
          return result(null, berita);
        });
      } else{
        fs.unlinkSync(berita.image1)
        return result({kind: 'UNKNOWN_ID'}, null)
      }

    })
  };

  
  deleteBeritaByID = (berita, result) => {
    const query = `delete from berita where id = ? `
    const query1 = `select image1 from berita where id = ? `
    this.#connection.query(query1, [berita.id], (err1, res1) => {
      if (err1) {
        return result(err1, null);
      } else if(res1[0] !== undefined) {
        try {
          this.#connection.query(query, [berita.id], (err, res) => {
     
            if (err){
              return result(err, null);
            } else{
              try {
                if(res1[0].image1 !== null){
                  fs.unlinkSync(res1[0].image1)
                }
              } catch (error) {
                console.log(error)
              }
              
              return result(null, berita);
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

module.exports = { Berita };
