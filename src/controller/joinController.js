const { Join } = require("../model/join");
const moment = require('moment');
const md5 = require("md5");
const uuid = require("uuid").v4;
const { Ok, BadRequest, InternalServerErr, DataUpdated, DataDeleted, SearchOk, NotFound, DataCreated, Unauthorized } = require("../helper/ResponseUtil");
require('dotenv').config();
const fs = require('fs');
const e = require("express");

class JoinController {
  #join;

  constructor() {
    this.#join = new Join();
  }
 
  allMakanan = (req, res) => {
    let messages = []
    const makanans = []
    if(!req.query.nama_makanan){
      makanans.push({nama_makanan: ''})
    } else{
      makanans.push({nama_makanan: req.query.nama_makanan})
    }
    
      this.#join.allMakanan(makanans,
        (err, data) => {
          if (err) {
            if (err.kind === "NOT_FOUND") {
              messages.push("Data makanan tidak ditemukan");
              return NotFound(res, messages);
            }
  
            messages.push("Internal error // Pagination error");
            messages.push(err.message);
            return InternalServerErr(res, messages);
          }
  
          messages.push("Data makanan berhasil ditemukan");
          const makanans = [];
          data.data.forEach((makanan) => {
              makanans.push({
                id_makanan: makanan.id_makanan,
                id_rumah_makan: makanan.id_rumah_makan,
                nama_makanan: makanan.nama_makanan,
                tipe_makanan: makanan.tipe_makanan,
                image1: makanan.image1,
                image2: makanan.image2,
                nama_rumah_makan: makanan.nama_rumah_makan,
                alamat_rumah_makan: makanan.alamat_rumah_makan,
                alamat_makanan: makanan.alamat_makanan,
                kecamatan_rm: makanan.kecamatan_rm,
                kecamatan: makanan.kecamatan,
                created_at: makanan.created_at
            });
          });
  
          data.data = makanans;
          return Ok(res, messages, makanans);
      
        }
      );
    };

    allMakananTerbaru = (req, res) => {
      let messages = []
      const makanans = []
      if(!req.query.nama_makanan){
        makanans.push({nama_makanan: ''})
      } else{
        makanans.push({nama_makanan: req.query.nama_makanan})
      }
      
        this.#join.allMakananTerbaru(makanans,
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data makanan tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data makanan berhasil ditemukan");
            const makanans = [];
            data.data.forEach((makanan) => {
                makanans.push({
                  id_makanan: makanan.id_makanan,
                  id_rumah_makan: makanan.id_rumah_makan,
                  nama_makanan: makanan.nama_makanan,
                  tipe_makanan: makanan.tipe_makanan,
                  image1: makanan.image1,
                  image2: makanan.image2,
                  nama_rumah_makan: makanan.nama_rumah_makan,
                  alamat_rumah_makan: makanan.alamat_rumah_makan,
                  alamat_makanan: makanan.alamat_makanan,
                  kecamatan_rm: makanan.kecamatan_rm,
                  kecamatan: makanan.kecamatan,
                  created_at: makanan.created_at
              });
            });
    
            data.data = makanans;
            return Ok(res, messages, makanans);
        
          }
        );
      };

    allKudapanByKecamatan = (req, res) => {
      let messages = []
      
      if(!req.query.kecamatan){
        messages.push("Mohon masukkan nama kecamatan!!")
        return BadRequest(res, messages)
      }

      const kecamatan = req.query.kecamatan

        this.#join.allKudapanByKecamatan(
          kecamatan, 
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data makanan tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data makanan berhasil ditemukan");
            const makanans = [];
            data.data.forEach((makanan) => {
                makanans.push({
                  id: makanan.id,
                  nama_makanan: makanan.nama_makanan,
                  tipe_makanan: makanan.tipe_makanan,
                  image1: makanan.image1,
                  image2: makanan.image2,
                  filosopi: makanan.filosopi,
                  kecamatan: makanan.kecamatan
              });
            });
    
            data.data = makanans;
            return Ok(res, messages, makanans);
        
          }
        );
      };

    allKudapanByKecamatan = (req, res) => {
      let messages = []
      
      if(!req.query.kecamatan){
        messages.push("Mohon masukkan nama kecamatan!!")
        return BadRequest(res, messages)
      }

      const kecamatan = req.query.kecamatan

        this.#join.allKudapanByKecamatan(
          kecamatan, 
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data makanan tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data makanan berhasil ditemukan");
            const makanans = [];
            data.data.forEach((makanan) => {
                makanans.push({
                  id: makanan.id,
                  nama_makanan: makanan.nama_makanan,
                  tipe_makanan: makanan.tipe_makanan,
                  image1: makanan.image1,
                  image2: makanan.image2,
                  filosopi: makanan.filosopi,
                  kecamatan: makanan.kecamatan
              });
            });
    
            data.data = makanans;
            return Ok(res, messages, makanans);
        
          }
        );
      };

      allKudapan = (req, res) => {
        let messages = []
          this.#join.allKudapan(
            (err, data) => {
              if (err) {
                if (err.kind === "NOT_FOUND") {
                  messages.push("Data makanan tidak ditemukan");
                  return NotFound(res, messages);
                }
      
                messages.push("Internal error // Pagination error");
                messages.push(err.message);
                return InternalServerErr(res, messages);
              }
      
              messages.push("Data makanan berhasil ditemukan");
              const makanans = [];
              data.data.forEach((makanan) => {
                  makanans.push({
                    id: makanan.id,
                    nama_makanan: makanan.nama_makanan,
                    tipe_makanan: makanan.tipe_makanan,
                    image1: makanan.image1,
                    image2: makanan.image2,
                    filosopi: makanan.filosopi,
                    kecamatan: makanan.kecamatan
                });
              });
      
              data.data = makanans;
              return Ok(res, messages, makanans);
          
            }
          );
        };

    allRumahMakanByKecamatan = (req, res) => {
      let messages = []
      
      if(!req.query.kecamatan){
        messages.push("Mohon masukkan nama kecamatan!!")
        return BadRequest(res, messages)
      }

      const kecamatan = req.query.kecamatan

        this.#join.allRumahMakanByKecamatan(
          kecamatan, 
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data rumah makan tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data rumah makan berhasil ditemukan");
            const makanans = [];
            data.data.forEach((makanan) => {
                makanans.push({
                  id_rumah_makan: makanan.id_rumah_makan,
                  nama_rumah_makan: makanan.nama_rumah_makan,
                  id_kecamatan: makanan.id_kecamatan,
                  image1: makanan.image1,
                  image2: makanan.image2,
                  content: makanan.content,
                  alamat: makanan.alamat,
                  kecamatan: makanan.kecamatan
              });
            });
    
            data.data = makanans;
            return Ok(res, messages, makanans);
        
          }
        );
      };

    allMenuByIdRumahMakan = (req, res) => {
      let messages = []
      
      if(!req.query.id_rumah_makan){
        messages.push("Mohon masukkan id rumah makan!!")
        return BadRequest(res, messages)
      }

      const id_rumah_makan = req.query.id_rumah_makan

        this.#join.allMenuByIdRumahMakan(
          id_rumah_makan, 
          (err, data) => {
            if (err) {
              if (err.kind === "NOT_FOUND") {
                messages.push("Data menu tidak ditemukan");
                return NotFound(res, messages);
              }
    
              messages.push("Internal error // Pagination error");
              messages.push(err.message);
              return InternalServerErr(res, messages);
            }
    
            messages.push("Data menu berhasil ditemukan");
            const makanans = [];
            data.data.forEach((makanan) => {
                makanans.push({
                  id_makanan: makanan.id_makanan,
                  id_rumah_makan: makanan.id_rumah_makan,
                  nama_makanan: makanan.nama_makanan,
                  tipe_makanan: makanan.tipe_makanan,
                  filosopi: makanan.filosopi,
                  nama_rumah_makan: makanan.nama_rumah_makan,
                  alamat: makanan.alamat,
                  kecamatan_rm: makanan.kecamatan_rm,
                  kecamatan: makanan.kecamatan,
                  image1: makanan.image1,
                  image2: makanan.image2,
                  alamat: makanan.alamat,
                  
              });
            });
    
            data.data = makanans;
            return Ok(res, messages, makanans);
        
          }
        );
      };

      detailMakanan = (req, res) => {
        let messages = []
        
        if(!req.query.id_makanan){
          messages.push("Mohon masukkan id makanan!!")
          return BadRequest(res, messages)
        }
  
        const id_makanan = req.query.id_makanan
  
          this.#join.detailMakanan(
            id_makanan, 
            (err, data) => {
              if (err) {
                if (err.kind === "NOT_FOUND") {
                  messages.push("Data makanan tidak ditemukan");
                  return NotFound(res, messages);
                }
      
                messages.push("Internal error // Pagination error");
                messages.push(err.message);
                return InternalServerErr(res, messages);
              }
      
              messages.push("Data makanan berhasil ditemukan");
              const makanans = [];
              data.data.forEach((makanan) => {
                  makanans.push({
                    id_makanan: makanan.id_makanan,
                    id_rumah_makan: makanan.id_rumah_makan,
                    id_kecamatan: makanan.id_kecamatan,
                    content: makanan.filosopi,
                    nama_makanan: makanan.nama_makanan,
                    tipe_makanan: makanan.tipe_makanan,
                    image1: makanan.image1,
                    image2: makanan.image2,
                    nama_rumah_makan: makanan.nama_rumah_makan,
                    alamat_rumah_makan: makanan.alamat_rumah_makan,
                    alamat_makanan: makanan.alamat_makanan,
                    kecamatan_rm: makanan.kecamatan_rm,
                    kecamatan: makanan.kecamatan
                });
              });
      
              data.data = makanans;
              return Ok(res, messages, makanans);
          
            }
          );
        };
        
      detailRumahMakan = (req, res) => {
        let messages = []
        
        if(!req.query.id_rumah_makan){
          messages.push("Mohon masukkan id rumah makan!!")
          return BadRequest(res, messages)
        }
  
        const id_rumah_makan = req.query.id_rumah_makan
  
          this.#join.detailRumahMakan(
            id_rumah_makan, 
            (err, data) => {
              if (err) {
                if (err.kind === "NOT_FOUND") {
                  messages.push("Data rumah makan tidak ditemukan");
                  return NotFound(res, messages);
                }
      
                messages.push("Internal error // Pagination error");
                messages.push(err.message);
                return InternalServerErr(res, messages);
              }
      
              messages.push("Data rumah makan berhasil ditemukan");
              const makanans = [];
              data.data.forEach((makanan) => {
                  makanans.push({
                    id_rumah_makan: makanan.id_rumah_makan,
                    nama_rumah_makan: makanan.nama_rumah_makan,
                    id_kecamatan: makanan.id_kecamatan,
                    image1: makanan.image1,
                    image2: makanan.image2,
                    content: makanan.content,
                    alamat: makanan.alamat,
                    kecamatan: makanan.kecamatan
                });
              });
      
              data.data = makanans;
              return Ok(res, messages, makanans);
          
            }
          );
        };

}
  module.exports = { JoinController }
