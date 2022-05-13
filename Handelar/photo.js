const express = require("express");
var multer = require("multer");
const router = express.Router();
const {Storage} = require("@google-cloud/storage");

const UPLOADS_FOLDER = "./uploads/";

const storages = new Storage({
  apiKey: "AIzaSyCvdfiYfXqVUwDl7ZAO4EBQFTvr_08C3lw",
  projectId: "shop-11ca7",
});

// const storages = googleStorage({
  
// });

const bucket = storages.bucket("shop-11ca7.appspot.com");

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

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(
        `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
      );
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

router.post("/photo", upload.single("file"), (req, res) => {
  console.log(req.file);

  let file = req.file;
  if (file) {
    uploadImageToStorage(file)
      .then((success) => {
        res.status(200).send({
          status: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // const url = req.protocol + "://" + req.get("host");
  // const reqFiles = url + "/uploads/" + req.file.filename;
  // try {
  //   res.send(reqFiles);
  // } catch (error) {
  //   console.log(error);
  // }
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
