const { Kudapan } = require("../model/kudapan");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class KudapanController {
  #kudapan;

  constructor() {
    this.#kudapan = new Kudapan();
  }

    createOneKudapan = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const kudapan = {
          id: uuid(),
          nama_makanan: req.body.nama_makanan,
          tipe_makanan: "kudapan",
          image1: `photos/${req.files[0].filename}`,
          image2: `photos/${req.files[1].filename}`,  
          filosopi: req.body.content,
          alamat: req.body.alamat,
          id_kecamatan: req.body.id_kecamatan,
          created_at: created_at
       
        }
            this.#kudapan.createOne(kudapan, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_KUDAPAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data kudapan gagal ditambahkan karena kudapan ${kudapan.kudapan} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data kudapan berhasil dibuat');
              return DataCreated(res, messages);
            });
        
      } catch (e) {
          return res.status(500).json({
              "statusCode": 500,
              "messages": ["Internal Server Error"]
          });
      }
    };
 
    createOneMenu = async(req, res) => {
      try {
        let messages = []
        var utcMoment = new Date()
        let created_at = moment(utcMoment).utcOffset('+0700').format('YYYY-MM-DD HH:mm:ss')
        
        const kudapan = {
          id: uuid(),
          nama_makanan: req.body.nama_makanan,
          tipe_makanan: "menu",
          image1: `photos/${req.files[0].filename}`,
          image2: `photos/${req.files[1].filename}`,  
          filosopi: req.body.content,
          id_rumah_makan: req.body.id_rumah_makan,
          created_at: created_at
       
        }
            this.#kudapan.createOneMenu(kudapan, (err, data) => {
              if (err) {
                if (err.kind === 'DUPLICAT_MENU_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
                  messages.push(`Data menu gagal ditambahkan karena kudapan ${kudapan.kudapan} telah terdaftar`);
                  return BadRequest(res, messages);
                }
        
                messages.push('Internal error // Insert error');
                messages.push(err.message);
                return InternalServerErr(res, messages);
              } 
        
              messages.push('Data menu berhasil dibuat');
              return DataCreated(res, messages);
            });
        
      } catch (e) {
          return res.status(500).json({
              "statusCode": 500,
              "messages": ["Internal Server Error"]
          });
      }
    };

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

      const kudapan = {
        id: req.query.id, 
        image1: `photos/${req.file.filename}`
      }
                    
      this.#kudapan.updateimage1ById(kudapan, (err, data) => {
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
  
        messages.push(`Makanan dengan id = ${req.query.id} berhasil diubah`);
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

      const kudapan = {
        id: req.query.id, 
        image2: `photos/${req.file.filename}`
      }
                    
      this.#kudapan.updateimage2ById(kudapan, (err, data) => {
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
  
        messages.push(`Makanan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    deleteMakananById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kudapan = {
        id: req.query.id, 
      }
                            
      this.#kudapan.deleteMakananByID(kudapan, (err, data) => {
        if (err) {
  
          if (err.kind === 'UNKNOWN_ID') {
            messages.push(`Data gagal dihapus karena id = ${req.query.id} tidak ditemukan`);
            return BadRequest(res, messages);
          }
  
  
          messages.push('Internal error // Delete by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Makananan dengan id = ${req.query.id} berhasil dihapus`);
        return DataDeleted(res, messages);
      });
  
    }

    updateKudapanById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kudapan = {
        id: req.query.id, 
        nama_makanan: req.body.nama_makanan, 
        filosopi: req.body.content,
        alamat: req.body.alamat,
        id_kecamatan: req.body.id_kecamatan,
      }
                            
      this.#kudapan.updateKudapanById(kudapan, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          if (err.kind === 'DUPLICATE_MAKANAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push(`Data gagal ditambahkan karena ${kudapan.id} telah terdaftar`);
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Makanan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }

    updateMenuById = (req, res) => {
      let messages = [];
      if (!req.query.id) {
        messages.push("Field 'id' masih kosong");
      }
  
      const kudapan = {
        id: req.query.id, 
        nama_makanan: req.body.nama_makanan, 
        filosopi: req.body.content,
        id_rumah_makan: req.body.id_rumah_makan,
      }
                            
      this.#kudapan.updateMenuById(kudapan, (err, data) => {
        if (err) {
  
          if (err.kind === 'NO_CHANGED') {
            messages.push(`Tidak ada data yang terubah`);
            return DataUpdated(res, messages);
          }
  
          if (err.kind === 'DUPLICATE_MAKANAN_VALUE') { // Default error jika terjadi duplikat value di di column yang unique
            messages.push(`Data gagal ditambahkan karena ${kudapan.id} telah terdaftar`);
            return BadRequest(res, messages);
          }
  
          messages.push('Internal error // Update by id error');
          messages.push(err.message);
          return InternalServerErr(res, messages);
      }
  
        messages.push(`Makanan dengan id = ${req.query.id} berhasil diubah`);
        return DataUpdated(res, messages);
      });
  
    }
  


}
  module.exports = { KudapanController }
