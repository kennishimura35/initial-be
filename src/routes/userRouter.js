const { UserController } = require('../controller/UserController');
const { JwtFilter, PermissionFilter } = require('../middleware/RequestFilter');

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const userController = new UserController();
const router = express.Router();

router.route('/')
  .post(userController.createOne)


module.exports = router;