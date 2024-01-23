const { Connection } = require("../helper/DBUtil");
const fs = require('fs')
class Slider {
  #connection = null;
  constructor() {
    this.#setConnetion();
  }

  async #setConnetion() {
    this.#connection = await Connection.getConnection();
  }


  allSlider = (result) => {
    const query = `select id, image, link from slider_beranda order by created_at desc`
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


  createOne = (slider, result) => {
    const query = `insert into slider_beranda (id, image, link, created_at) values (?,?,?,?)`
    this.#connection.query(query, [slider.id, slider.image, slider.link, slider.created_at], (err, res) => {
     
      if (err) {
        try {
          fs.unlinkSync(slider.image)
        } catch (error) {
          console.log(error)
        }
        
        return result(err, null);
      }
      
      return result(null, {id: res.insertId, ...slider});
    });

  };


  deleteSliderByID = (slider, result) => {
    const query = `delete from slider_beranda where id = ? `
    const query1 = `select image from slider_beranda where id = ? `
    this.#connection.query(query1, [slider.id], (err1, res1) => {
      if (err1) {
        return result(err1, null);
      } else if(res1[0] !== undefined) {
        try {
          this.#connection.query(query, [slider.id], (err, res) => {
     
            if (err){
              return result(err, null);
            } else{
              try {
                if(res1[0].image !== null){
                  fs.unlinkSync(res1[0].image)
                }
  
              
              } catch (error) {
                console.log(error)
              }
              
              return result(null, slider);
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

module.exports = { Slider };
