const { Kecamatan } = require("../model/kecamatan");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class KecamatanController {
  #kecamatan;

  constructor() {
    this.#kecamatan = new Kecamatan();
  }


  convertInputFilter(req) {
    let kecamatan_name = !req.query.kecamatan_name ? "" : req.query.kecamatan_name.toLowerCase();
    
    
    return { kecamatan_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "kecamatan_name" : req.query.orderBy.toString();
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
      !["created_at", "kecamatan_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, kecamatan_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "kecamatan_name" ? "kecamatan_name" : orderBy;
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

  allKecamatan = (req, res) => {
  let messages = []
  
    this.#kecamatan.allKecamatan(
      (err, data) => {
        if (err) {
          if (err.kind === "NOT_FOUND") {
            messages.push("Data kecamatan tidak ditemukan");
            return NotFound(res, messages);
          }

          messages.push("Internal error // Pagination error");
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }

        messages.push("Data kecamatan berhasil ditemukan");
        const kecamatans = [];
        data.data.forEach((kecamatan) => {
            kecamatans.push({
              id: kecamatan.id,
              kecamatan: kecamatan.kecamatan,
              image1: kecamatan.image1,
              image2: kecamatan.image2,
              content: kecamatan.content
          });
        });

        data.data = kecamatans;
        return Ok(res, messages, kecamatans);
    
      }
    );
  };

  kecamatanByName = (req, res) => {
    let messages = []
    if(!req.query.kecamatan_name){
      messages = 'Nama Kecamatan belum dimasukkan!!'
      return BadRequest(res, messages)
    }
 
    const kecamatan_name = req.query.kecamatan_name
      this.#kecamatan.kecamatanByName(kecamatan_name,
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data kecamatan tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data kecamatan berhasil ditemukan");
          const kecamatans = [];
          data.data.forEach((kecamatan) => {
              kecamatans.push({
                id: kecamatan.id,
                kecamatan: kecamatan.kecamatan,
                image1: kecamatan.image1,
                image2: kecamatan.image2,
                content: kecamatan.content
            });
          });
  
          data.data = kecamatans;
          return Ok(res, messages, kecamatans);
      
        }
      );
    };

    createOneKecamatan = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const kecamatan = {
          id: uuid(),
          kecamatan: req.body.kecamatan,
          image1: `photos/${req.files[0].filename}`,
          image2: `photos/${req.files[1].filename}`,
          content: req.body.content,
          created_at: created_at
       
        }
            this.#kecamatan.createOne(kecamatan, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_KECAMATAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data kecamatan gagal ditambahkan karena kecamatan ${kecamatan.kecamatan} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data kecamatan berhasil dibuat');
              return DataCreated(res, messages);
            });
        
      } catch (e) {
          return res.status(500).json({
              "statusCode": 500,
              "messages": ["Internal Server Error"]
          });
      }
    };
 

    updateById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kecamatan = {
        id: req.query.id, 
        kecamatan: req.body.kecamatan, 
        content: req.body.content
      }
                            
      this.#kecamatan.updateById(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          if (err.kind === 'DUPLICATE_KECAMATAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push(`Data gagal ditambahkan karena ${kecamatan.kecamatan} telah terdaftar`);
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Kecamatan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    updateimage1ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
      
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const kecamatan = {
        id: req.query.id, 
        image1: `photos/${req.file.filename}`
      }
                    
      this.#kecamatan.updateimage1ById(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal diubah karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
          if (err.kind === 'DUPLICAT_ID_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push("Data gagal ditambahkan karena id telah terdaftar");
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Kecamatan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    updateimage2ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const kecamatan = {
        id: req.query.id, 
        image2: `photos/${req.file.filename}`
      }
                            
      this.#kecamatan.updateimage2ById(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal diubah karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
          if (err.kind === 'DUPLICAT_ID_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push("Data gagal ditambahkan karena id telah terdaftar");
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Kecamatan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    deleteimage1ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kecamatan = {
        id: req.query.id, 
      }
                            
      this.#kecamatan.deleteimage1ById(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal diubah karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`image1 kecamatan dengan id = ${req.query.id} berhasil dihapus`);
        return DataUpdated(res, messages);
      });
  
    }

    deleteimage2ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kecamatan = {
        id: req.query.id, 
      }
                            
      this.#kecamatan.deleteimage2ById(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal diubah karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`image1 kecamatan dengan id = ${req.query.id} berhasil dihapus`);
        return DataUpdated(res, messages);
      });
  
    }

    deleteKecamatanById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kecamatan = {
        id: req.query.id, 
      }
                            
      this.#kecamatan.deleteKecamatanByID(kecamatan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Kecamatan dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

}
  module.exports = { KecamatanController }
