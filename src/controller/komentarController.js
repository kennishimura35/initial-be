const { Komentar } = require("../model/komentar");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class KomentarController {
  #komentar;

  constructor() {
    this.#komentar = new Komentar();
  }


  convertInputFilter(req) {
    let komentar_name = !req.query.komentar_name ? "" : req.query.komentar_name.toLowerCase();
    
    
    return { komentar_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "komentar_name" : req.query.orderBy.toString();
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
      !["created_at", "komentar_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, komentar_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "komentar_name" ? "komentar_name" : orderBy;
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

  allKomentar = (req, res) => {
  let messages = []
  
    this.#komentar.allKomentar(
      (err, data) => {
        if (err) {
          if (err.kind === "NOT_FOUND") {
            messages.push("Data komentar tidak ditemukan");
            return NotFound(res, messages);
          }

          messages.push("Internal error // Pagination error");
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }

        messages.push("Data komentar berhasil ditemukan");
        const komentars = [];
        data.data.forEach((komentar) => {
            komentars.push({
              id: komentar.id,
              komentar: komentar.komentar,
              nama: komentar.nama,
              rating: komentar.rating,
              id_makanan: komentar.id_makanan,
              created_at: komentar.created_at,
              nama_makanan: komentar.nama_makanan
          });
        });

        data.data = komentars;
        return Ok(res, messages, komentars);
    
      }
    );
  };

  komentarByIdMakanan = (req, res) => {
    let messages = []
    if(!req.query.id){
      messages = 'Nama Komentar belum dimasukkan!!'
      return BadRequest(res, messages)
    }
 
    const id = req.query.id
      this.#komentar.komentarByIdMakanan(id,
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data komentar tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data komentar berhasil ditemukan");
          const komentars = [];
          data.data.forEach((komentar) => {
              komentars.push({
                id: komentar.id,
                komentar: komentar.komentar,
                nama: komentar.nama,
                rating: komentar.rating,
                id_makanan: komentar.id_makanan,
                created_at: komentar.created_at,
                nama_makanan: komentar.nama_makanan
            });
          });
  
          data.data = komentars;
          return Ok(res, messages, komentars);
      
        }
      );
    };

    averageKomentarByIdMakanan = (req, res) => {
      let messages = []
      if(!req.query.id){
        messages = 'Nama Komentar belum dimasukkan!!'
        return BadRequest(res, messages)
      }
   
      const id = req.query.id
        this.#komentar.averageKomentarByIdMakanan(id,
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data komentar tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data komentar berhasil ditemukan");
            const komentars = [];
            data.data.forEach((komentar) => {
                komentars.push({
                  average: komentar.average
              });
            });
    
            data.data = komentars;
            return Ok(res, messages, komentars);
        
          }
        );
      };

    createOneKomentar = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const komentar = {
          id: uuid(),
          komentar: req.body.komentar,
          nama: req?.body?.nama,
          rating: req?.body?.rating,
          id_makanan: req.body.id_makanan,
          created_at: created_at
       
        }
            this.#komentar.createOne(komentar, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_KOMENTAR_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data komentar gagal ditambahkan karena komentar ${komentar.komentar} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data komentar berhasil dibuat');
              return DataCreated(res, messages);
            });
        
      } catch (e) {
          return res.status(500).json({
              "statusCode": 500,
              "messages": ["Internal Server Error"]
          });
      }
    };
 

    deleteKomentarById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const komentar = {
        id: req.query.id, 
      }
                            
      this.#komentar.deleteKomentarByID(komentar, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Komentar dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

}
  module.exports = { KomentarController }
