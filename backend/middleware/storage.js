const multer = require('multer');
const { Book } = require("../models/Book");
const express = require("express");
const { checkToken } = require("../middleware/auth");

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
	const id = req.params.id;
	callback(null, "image");
	callback(null, "image/livre");
	callback(null, "image/livre/modifier");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = { storage };
