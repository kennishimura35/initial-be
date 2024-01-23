const { Berita } = require("../model/berita");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class BeritaController {
  #berita;

  constructor() {
    this.#berita = new Berita();
  }


  convertInputFilter(req) {
    let berita_name = !req.query.berita_name ? "" : req.query.berita_name.toLowerCase();
    
    
    return { berita_name };
  }

  isNumber(val) {
    return !isNaN(val);
  }

  validateInputPagination(req) {
    const messages = [];

    let page = !req.query.page ? 1 : req.query.page;
    let perPage = !req.query.perPage ? 10 : req.query.perPage;
    let orderBy = !req.query.orderBy ? "berita_name" : req.query.orderBy.toString();
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
      !["created_at", "berita_name"].includes(orderBy)
    ) {
      messages.push(
        "Nilai field 'orderBy' harus diantara created_at, berita_name"
      );
    } else {
      orderBy = orderBy === "created_at" ? "created_at" : orderBy;
      orderBy = orderBy === "berita_name" ? "berita_name" : orderBy;
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

  allBerita = (req, res) => {
  let messages = []
  
    this.#berita.allBerita(
      (err, data) => {
        if (err) {
          if (err.kind === "NOT_FOUND") {
            messages.push("Data berita tidak ditemukan");
            return NotFound(res, messages);
          }

          messages.push("Internal error // Pagination error");
          messages.push(err.message);
          return InternalServerErr(res, messages);
        }

        messages.push("Data berita berhasil ditemukan");
        const beritas = [];
        data.data.forEach((berita) => {
            beritas.push({
              id: berita.id,
              tanggal_berita: berita.tanggal_berita,
              image1: berita.image1,
              penulis: berita.penulis,
              content: berita.content,
              judul: berita.judul,
              status: berita.status
          });
        });

        data.data = beritas;
        return Ok(res, messages, beritas);
    
      }
    );
  };


  beritaTerbaru = (req, res) => {
    let messages = []
    
      this.#berita.beritaTerbaru(
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data berita tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data berita berhasil ditemukan");
          const beritas = [];
          data.data.forEach((berita) => {
              beritas.push({
                id: berita.id,
                tanggal_berita: berita.tanggal_berita,
                image1: berita.image1,
                penulis: berita.penulis,
                content: berita.content,
                judul: berita.judul,
                status: berita.status
            });
          });
  
          data.data = beritas;
          return Ok(res, messages, beritas);
      
        }
      );
    };

  allBeritaAdmin = (req, res) => {
    let messages = []
    
      this.#berita.allBeritaAdmin(
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data berita tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data berita berhasil ditemukan");
          const beritas = [];
          data.data.forEach((berita) => {
              beritas.push({
                id: berita.id,
                tanggal_berita: berita.tanggal_berita,
                image1: berita.image1,
                penulis: berita.penulis,
                content: berita.content,
                status: berita.status,
                judul: berita.judul
            });
          });
  
          data.data = beritas;
          return Ok(res, messages, beritas);
      
        }
      );
    };

    beritaByIdAdmin = (req, res) => {
      let messages = []
      if(!req.query.id){
        messages = 'Id Berita belum dimasukkan!!'
        return BadRequest(res, messages)
      }
   
      const id = req.query.id
        this.#berita.beritaByIdAdmin(id,
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data berita tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data berita berhasil ditemukan");
            const beritas = [];
            data.data.forEach((berita) => {
                beritas.push({
                  id: berita.id,
                  tanggal_berita: berita.tanggal_berita,
                  image1: berita.image1,
                  penulis: berita.penulis,
                  content: berita.content,
                  judul: berita.judul,
                  status: berita.status
              });
            });
    
            data.data = beritas;
            return Ok(res, messages, beritas);
        
          }
        );
      };

  beritaById = (req, res) => {
    let messages = []
    if(!req.query.id){
      messages = 'Id Berita belum dimasukkan!!'
      return BadRequest(res, messages)
    }
 
    const id = req.query.id
      this.#berita.beritaById(id,
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data berita tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data berita berhasil ditemukan");
          const beritas = [];
          data.data.forEach((berita) => {
              beritas.push({
                id: berita.id,
                tanggal_berita: berita.tanggal_berita,
                image1: berita.image1,
                penulis: berita.penulis,
                content: berita.content,
                judul: berita.judul
            });
          });
  
          data.data = beritas;
          return Ok(res, messages, beritas);
      
        }
      );
    };

    createOneBerita = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const berita = {
          id: uuid(),
          tanggal_berita: req.body.tanggal_berita,
          image1: `photos/${req.files[0].filename}`,
          penulis: req?.body?.penulis,
          content: req.body.content,
          created_at: created_at,
          status: req?.body?.status,
          judul: req?.body?.judul
       
        }
            this.#berita.createOne(berita, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_BERITA_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data berita gagal ditambahkan karena berita ${berita.berita} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data berita berhasil dibuat');
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
  
      const berita = {
        id: req.query.id, 
        tanggal_berita: req.body.tanggal_berita, 
        content: req.body.content,
        penulis: req.body.penulis,
        status: req.body.status,
        judul: req.body.judul
      }
                            
      this.#berita.updateById(berita, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          if (err.kind === 'DUPLICATE_BERITA_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push(`Data gagal ditambahkan karena ${berita.berita} telah terdaftar`);
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Berita dengan id = ${req.query.id} berhasil diubah`);
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

      const berita = {
        id: req.query.id, 
        image1: `photos/${req.file.filename}`
      }
                    
      this.#berita.updateimage1ById(berita, (err, data) => {
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
  
        messages.push(`Berita dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    

    deleteBeritaById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const berita = {
        id: req.query.id, 
      }
                            
      this.#berita.deleteBeritaByID(berita, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Berita dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

}
  module.exports = { BeritaController }
