const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv')
const cors = require('cors')
const auth = require('./Handelar/auth')
const menuHandelar = require('./Handelar/menuHandlar')
const subMenuHandlar = require('./Handelar/subMenuHandle')
const childMenuHandelar = require('./Handelar/childMenuHandelar')
const photo = require('./Handelar/photo')
const search = require('./Handelar/search')
const items = require('./Handelar/items')

// MIDDLEWARE USES

app.use(express.json());
app.use(cors())
dotenv.config()

app.use(auth)
app.use(menuHandelar)
app.use(subMenuHandlar)
app.use(childMenuHandelar)
app.use(photo)
app.use(search)
app.use(items)

app.use('/uploads', express.static(__dirname +'/uploads'));




// CONNECTING MONGO DATABASE
mongoose
  .connect("mongodb+srv://sureshop:184719827@cluster0.9ro8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
  })
  .then(() => console.log("connect succsesfully"))
  .catch((err) => console.log(err));
 
// CUSTOM ERROR HANDELING 
app.use((err, req, res, next) => {
  if (err) { 
    if (err instanceof multer.MulterError) {
      res.send("there are upload error");
    } else {
      res.send(err.message);
    }
  } else { 
    res.send("success");
  }
});

const errorHandelar = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandelar);

// LISTENNIG PORT

app.listen(process.env.PORT || 5000, () => {
  console.log("listening port 3000");
});
 