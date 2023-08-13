const multer = require('multer');
const { Book } = require("../models/Book");


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination:  (req, file, callback) => {
	const id = req.params.id;
	callback(null, "image");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 4194304) 
      callback(new Error("La taille du fichier est supérieure à la limite autorisée"), false);
   else if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/webp")
    callback(new Error("Veuillez sélectionner un fichier dont l'extension est autorisée"), false);
    else
      callback(null, name + Date.now() + '.' + extension);

  }

});



module.exports = { storage };



