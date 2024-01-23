const express = require("express");
const { RumahMakanController } = require('../controller/rumahMakanController');
const { JwtFilter } = require('../middleware/RequestFilter');

const rumahMakanController = new RumahMakanController();

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
        files.push(file)
        return cb(null, `${file?.originalname?.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`)
    }
    
});

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

router.post("/createOneRumahMakan", JwtFilter, function (req, res, next) {
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

router.put("/edit", JwtFilter)
router.delete("/deleteRumahMakanById", JwtFilter)

router.route('/createOneRumahMakan')
  .post(rumahMakanController.createOneRumahMakan)

router.route('/edit')
  .put(rumahMakanController.updateById)

router.route('/updateImage1ById')
  .put(rumahMakanController.updateimage1ById)
  
router.route('/updateImage2ById')
.put(rumahMakanController.updateimage2ById)
  
router.route('/deleteRumahMakanById')
.delete(rumahMakanController.deleteRumahMakanById)

module.exports = router;