const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require("../middleware/check-auth");

router.post('/register', UserController.createUser);

router.post('/login', UserController.login);

router.post('/edit-user-details', checkAuth, UserController.editUserDetails);

router.post('/reset', UserController.postReset);

router.post('/change-password', UserController.changePassword);

module.exports = router;
