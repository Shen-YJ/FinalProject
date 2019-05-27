const multer = require('multer')

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

var md5 = crypto.createHash('md5');
var MD5result = md5.update("source").digest('hex');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload');    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, file.originalname);
  }
});

// var upload = multer({ storage: storage });
var upload = multer({ storage: storage }).single('file')

// const md5File = (req,res,next) => {

// }


module.exports = (app) => {
  app.post('/upload', function (req, res, next) {

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
      } else if (err) {
        return res.status(500).json(err)
      }
      return res.status(200).send(req.file)

    })

  });

  app.get('/download/:id', function (req, res) {
    console.log(req.params.id);

    var file = `./upload/${req.params.id}`;
    res.download(file); // Set disposition and send it.
  });
}