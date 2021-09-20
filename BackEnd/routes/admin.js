const express = require('express');

const { body } = require("express-validator/check");

const adminControllers = require("../controllers/authAdmin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

//================================================== POST ==============================================================

router.post('/login',adminControllers.login);

module.exports = router;