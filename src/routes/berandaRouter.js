const express = require("express");
const { BerandaController } = require('../controller/berandaController');
const { JwtFilter } = require('../middleware/RequestFilter');

const berandaController = new BerandaController();

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


router.put("/edit", JwtFilter)

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

router.put("/updateLogo", JwtFilter, function (req, res, next) {
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



router.route('/allBeranda')
  .get(berandaController.allBeranda)

router.route('/edit')
  .put(berandaController.updateBeranda)

router.route('/updateImage1ById')
  .put(berandaController.updateimage1ById)

router.route('/updateImage2ById')
  .put(berandaController.updateimage2ById)

router.route('/updateLogo')
  .put(berandaController.updateLogo)


module.exports = router;