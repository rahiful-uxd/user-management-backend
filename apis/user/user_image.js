const multer = require('multer');

// const UPLOADS_FOLDER = "../uploads/";
// console.log("Enter the multer files----->")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("Destination requesst are:", req)
    // console.log("Destinaton files are:", file)
    cb(null, "uploads");
  },

  filename: (req, file, cb) => {
    cb(null, (Math.random() * 999999) + '_' + Date.now().toString() + '_' + file.originalname);
  },

});

// console.log("storage are:", storage)

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    req.error_for_file = false;
    cb(null, file)
  } else {
    req.error_for_file = true;
    cb(null, false)
  }
};

// console.log("filefilter are:", fileFilter)

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 1024 * 1024 * 5,
  },

  fileFilter: fileFilter
})

module.exports = upload;


// console.log("Uploads are:", this.upload)