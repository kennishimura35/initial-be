const { Beranda } = require("../model/beranda");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class BerandaController {
  #beranda;

  constructor() {
    this.#beranda = new Beranda();
  }


  convertInputFilter(req) {
    let beranda_name = !req.query.beranda_name ? "" : req.query.beranda_name.toLowerCase();
    
    
    return { beranda_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "beranda_name" : req.query.orderBy.toString();
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
      !["created_at", "beranda_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, beranda_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "beranda_name" ? "beranda_name" : orderBy;
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

  allBeranda = (req, res) => {
    let messages = []
    
      this.#beranda.allBeranda(
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data Beranda tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data beranda berhasil ditemukan");
          const berandas = [];
          data.data.forEach((beranda) => {
              berandas.push({
                id: beranda.id,
                judul: beranda.judul,
                sub_judul: beranda.sub_judul,
                content: beranda.content,
                instagram: beranda.instagram,
                email: beranda.email,
                image1: beranda.image1,
                logo: beranda.logo,
                rightContent: beranda.rightContent,
                rumahMakan: beranda.rumahMakan,
                umkm: beranda.umkm,
                resort: beranda.resort,
                hotel: beranda.hotel,
                kabupatenkota: beranda.kabupatenkota,
                leftAbout: beranda.leftAbout,
                image2: beranda.image2
            });
          });
  
          data.data = berandas;
          return Ok(res, messages, berandas);
      
        }
      );
    };

    updateBeranda = (req, res) => {
      let messages = [];
      // if (!req.query.id) {
      //   messages.push("Field 'id' masih kosong");
      // }
  
      const beranda = {
        id: '1', 
        judul: req.body.judul,
        sub_judul: req.body.sub_judul, 
        content: req.body.content,
        instagram: req.body.instagram,
        email: req.body.email,
        rightContent: req.body.rightContent,
        rumahMakan: req.body.rumahMakan,
        umkm: req.body.umkm,
        resort: req.body.resort,
        hotel: req.body.hotel,
        kabupatenkota: req.body.kabupatenkota,
        leftAbout: req.body.leftAbout
      }
                            
      this.#beranda.updateBeranda(beranda, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Beranda berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    updateimage1ById = (req, res) => {
      let messages = [];
      // if (!req.query.id) {
      //   messages.push("Field 'id' masih kosong");
      // }
      
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const beranda = {
        id: '1', 
        image1: `photos/${req.file.filename}`
      }
                    
      this.#beranda.updateimage1ById(beranda, (err, data) => {
        if (err) {
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Beranda berhasil diubah`);
        return DataUpdated(res, messages);
      });
    }


    updateimage2ById = (req, res) => {
      let messages = [];
      // if (!req.query.id) {
      //   messages.push("Field 'id' masih kosong");
      // }
      
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const beranda = {
        id: '1', 
        image2: `photos/${req.file.filename}`
      }
                    
      this.#beranda.updateimage2ById(beranda, (err, data) => {
        if (err) {
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Beranda berhasil diubah`);
        return DataUpdated(res, messages);
      });
    }

    updateLogo = (req, res) => {
      let messages = [];
      // if (!req.query.id) {
      //   messages.push("Field 'id' masih kosong");
      // }
      
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const beranda = {
        id: '1', 
        logo: `photos/${req.file.filename}`
      }
                    
      this.#beranda.updateLogo(beranda, (err, data) => {
        if (err) {
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Beranda berhasil diubah`);
        return DataUpdated(res, messages);
      });
    }

}
  module.exports = { BerandaController }
