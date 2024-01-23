const express = require("express");
const { SliderController } = require('../controller/sliderController');
const { JwtFilter } = require('../middleware/RequestFilter');

const sliderController = new SliderController();

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


router.post("/createOneSlider", JwtFilter, function (req, res, next) {
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



router.delete("/deleteSliderById", JwtFilter)

router.route('/allSlider')
  .get(sliderController.allSlider)

router.route('/createOneSlider')
  .post(sliderController.createOneSlider)

router.route('/deleteSliderById')
  .delete(sliderController.deleteSliderById)


module.exports = router;