const express = require("express");
const { BeritaController } = require('../controller/beritaController');
const { JwtFilter } = require('../middleware/RequestFilter');

const beritaController = new BeritaController();

const router = express.Router();

const multer = require("multer");
const path = require("path");
const { BadRequest } = require("../helper/ResponseUtil");

let files = []

const storage = multer.diskStorage({
  destination: (req,file,cb)=> {
		cb(null,'photos');
	},
    filename: (req, file, cb) => {
        return cb(null, `${file?.originalname?.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`)
    }
    
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        } else{
          cb(null, true);
        }
        
    },
    limits: { fileSize: 3 * (1024*1024) },
}).array('files', 2);



const singleUpload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4)$/)) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(new Error('Only image files are allowed!'), false);
      } else{
        cb(null, true);
      }
      
  },
  limits: { fileSize: 3 * (1024*1024) },
}).single("files");


router.post("/createOneBerita", JwtFilter, function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else if (err) {
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else {
      next()
    }
    
  })
})

router.put("/updateImage1ById", JwtFilter, function (req, res, next) {
  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else if (err) {
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else {
      next()
    }
    
  })
})

router.put("/updateImage2ById", JwtFilter, function (req, res, next) {
  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else if (err) {
      BadRequest(res, "File anda tidak dalam ketentuan")
    } else {
      next()
    }
    
  })
})

router.delete("/deleteImage1ById", JwtFilter)
router.delete("/deleteImage2ById", JwtFilter)
router.delete("/deleteBeritaById", JwtFilter)
router.get("allBeritaAdmin", JwtFilter)
router.get("beritaByIdAdmin", JwtFilter)

router.put("/edit", JwtFilter)

router.route('/allBerita')
  .get(beritaController.allBerita)
  
router.route('/beritaTerbaru')
  .get(beritaController.beritaTerbaru)

router.route('/beritaById')
  .get(beritaController.beritaById)

router.route('/allBeritaAdmin')
  .get(beritaController.allBeritaAdmin)

router.route('/beritaByIdAdmin')
  .get(beritaController.beritaByIdAdmin)

router.route('/createOneBerita')
  .post(beritaController.createOneBerita)

router.route('/edit')
  .put(beritaController.updateById)

router.route('/updateImage1ById')
  .put(beritaController.updateimage1ById)

router.route('/deleteBeritaById')
  .delete(beritaController.deleteBeritaById)


module.exports = router;