const express = require("express");
const { KomentarController } = require('../controller/komentarController');
const { JwtFilter } = require('../middleware/RequestFilter');

const komentarController = new KomentarController();

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




router.delete("/deleteKomentarById", JwtFilter)
router.get("allKomentar", JwtFilter)


router.route('/allKomentar')
  .get(komentarController.allKomentar)

router.route('/komentarByIdMakanan')
  .get(komentarController.komentarByIdMakanan)

router.route('/averageKomentarByIdMakanan')
  .get(komentarController.averageKomentarByIdMakanan)

router.route('/createOneKomentar')
  .post(komentarController.createOneKomentar)

router.route('/deleteKomentarById')
  .delete(komentarController.deleteKomentarById)


module.exports = router;