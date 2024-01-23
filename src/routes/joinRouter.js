const express = require("express");
const { JoinController } = require('../controller/joinController');
 const { JwtFilter } = require('../middleware/RequestFilter');

const joinController = new JoinController();

const router = express.Router();

const multer = require("multer");
const path = require("path");
const { BadRequest } = require("../helper/ResponseUtil");

router.route('/allMakanan')
  .get(joinController.allMakanan)

router.route('/allMakananTerbaru')
  .get(joinController.allMakananTerbaru)

router.route('/allKudapanByKecamatan')
  .get(joinController.allKudapanByKecamatan)

router.route('/allKudapan')
  .get(joinController.allKudapan)

router.route('/allRumahMakanByKecamatan')
.get(joinController.allRumahMakanByKecamatan)

router.route('/allMenuByIdRumahMakan')
.get(joinController.allMenuByIdRumahMakan)

router.route('/makananById')
.get(joinController.detailMakanan)

router.route('/rumahMakanById')
.get(joinController.detailRumahMakan)

module.exports = router;