const { Slider } = require("../model/slider");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class SliderController {
  #slider;

  constructor() {
    this.#slider = new Slider();
  }


  convertInputFilter(req) {
    let slider_name = !req.query.slider_name ? "" : req.query.slider_name.toLowerCase();
    
    
    return { slider_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "slider_name" : req.query.orderBy.toString();
    let orderValue = !req.query.orderValue
      ? "ASC"
      : req.query.orderValue.toString().toUpperCase();
     
      

    if (!this.isNumber(page)) {
      messages.push(
        "Nilai field 'page' tidak sesuai ketentuan, contoh: 1, 2, ..."
      );
    }
    
    if (page <= 0) {
      messages.push("Nilai field 'page' harus lebih besar dari nol");
    }
    


    if (!this.isNumber(perPage)) {
      messages.push(
        "Nilai field 'perPage' tidak sesuai ketentuan, contoh: 5, 10, ..."
      );
    } else if (perPage <= 0) {
      messages.push("Nilai field 'perPage' harus lebih besar dari nol");
    }

    
    if (
      !["created_at", "slider_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, slider_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "slider_name" ? "slider_name" : orderBy;
    }

    if (!["ASC", "DESC"].includes(orderValue)) {
      messages.push(
        "Nilai field 'orderValue' harus diantara 'ASC' atau 'DESC'"
      );
    }

    return {
      messages,
      page: parseInt(page),
      perPage: parseInt(perPage),
      orderBy,
      orderValue,
    };
  }

  allSlider = (req, res) => {
  let messages = []
  
    this.#slider.allSlider(
      (err, data) => {
        if (err) {
          if (err.kind === "NOT_FOUND") {
            messages.push("Data slider tidak ditemukan");
            return NotFound(res, messages);
          }

          messages.push("Internal error // Pagination error");
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }

        messages.push("Data slider berhasil ditemukan");
        const sliders = [];
        data.data.forEach((slider) => {
            sliders.push({
              id: slider.id,
              image: slider.image,
              link: slider.link,
          });
        });

        data.data = sliders;
        return Ok(res, messages, sliders);
    
      }
    );
  };

    createOneSlider = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const slider = {
          id: uuid(),
          image: req.files[0].filename,
          link: `photos/${req.files[0].filename}`,
          created_at: created_at
       
        }
            this.#slider.createOne(slider, (err, data) => {
              if (err) {
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data slider berhasil dibuat');
              return DataCreated(res, messages);
            });
        
      } catch (e) {
          return res.status(500).json({
              "statusCode": 500,
              "messages": ["Internal Server Error"]
          });
      }
    };
 
    deleteSliderById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const slider = {
        id: req.query.id, 
      }
                            
      this.#slider.deleteSliderByID(slider, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Slider dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

}
  module.exports = { SliderController }
