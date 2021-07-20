const express = require("express");
var multer = require("multer");
const router = express.Router();

const UPLOADS_FOLDER = "./uploads/";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("only jpg png jpeg file accept "));
    }
  },
});

// var upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1000000000, // 1MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === "avatar") {
//       if (
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg"
//       ) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
//       }
//     } else if (file.fieldname === "doc") {
//       if (file.mimetype === "application/pdf") {
//         cb(null, true);
//       } else {
//         cb(new Error("Only .pdf format allowed!"));
//       }
//     } else {
//       cb(new Error("There was an unknown error!"));
//     }
//   },
// });

router.post("/photo", upload.single("file"), (req, res) => {
  console.log('work');
  const url = req.protocol + "://" + req.get("host");
  const reqFiles = url + "/uploads/" + req.file.filename;
  try {
    res.send(reqFiles);
  } catch (error) {
    console.log(error);
  }
});


// for multiple
router.post("/photos", upload.array("file", 2), (req, res) => {
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/uploads/" + req.files[i].filename);
  }
  try {
    res.send(reqFiles);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
