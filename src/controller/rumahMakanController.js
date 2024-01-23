const { RumahMakan } = require("../model/rumahMakan");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class RumahMakanController {
  #rumahMakan;

  constructor() {
    this.#rumahMakan = new RumahMakan();
  }

    createOneRumahMakan = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const rumahMakan = {
          id: uuid(),
          nama_rumah_makan: req.body.nama_rumah_makan,
          image1: `photos/${req.files[0].filename}`,
          image2: `photos/${req.files[1].filename}`,  
          content: req.body.content,
          alamat: req.body.alamat,
          id_kecamatan: req.body.id_kecamatan,
          created_at: created_at
       
        }
            this.#rumahMakan.createOne(rumahMakan, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_KUDAPAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data rumahMakan gagal ditambahkan karena rumahMakan ${rumahMakan.rumahMakan} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data rumahMakan berhasil dibuat');
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
        return BadRequest(res, messages)
      }

      const rumahMakan = {
        id: req.query.id, 
        nama_rumah_makan: req.body.nama_rumah_makan, 
        content: req.body.content,
        alamat: req.body.alamat,
        id_kecamatan: req.body.id_kecamatan
      }
                            
      this.#rumahMakan.updateById(rumahMakan, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          if (err.kind === 'DUPLICAT_ID_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push("Data gagal ditambahkan karena id telah terdaftar");
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Rumah Makan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }
 
    updateimage1ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
        return BadRequest(res, messages)
      }

      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }
      
      const rumahMakan = {
        id: req.query.id, 
        image1: `photos/${req.file.filename}`
      }
                    
      this.#rumahMakan.updateimage1ById(rumahMakan, (err, data) => {
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
  
        messages.push(`Rumah makan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    updateimage2ById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
        return BadRequest(res, messages)
      }
      
      if (!req?.file?.filename) {
        messages.push("Field 'file' masih kosong");
        return BadRequest(res, messages)
      }

      const rumahMakan = {
        id: req.query.id, 
        image2: `photos/${req.file.filename}`
      }
                    
      this.#rumahMakan.updateimage2ById(rumahMakan, (err, data) => {
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
  
        messages.push(`Rumah makan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    deleteRumahMakanById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const rumahMakan = {
        id: req.query.id, 
      }
                            
      this.#rumahMakan.deleteRumahMakanByID(rumahMakan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Rumah makan dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

}
  module.exports = { RumahMakanController }
