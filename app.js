const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
var multer = require("multer");
var cors = require("cors");
app.use(cors());

const { exec } = require("child_process");
const { resolve } = require("path");
const { rejects } = require("assert");
let i = 0;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage }).array("file");

app.get("/test", (req, res) =>{
  res.send("Hello")
})
app.use('/', express.static("./public"));
app.post("/upfile", function (req, res) {
  const distance = req.query.distance;
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    // return res.status(200).send(req.file);
    // console.log(req.files)
    try {
      const arr = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const command = `python3 backend.py ${file.path} ${distance}`;
            console.log(command);
            exec(command, async (error, stdout, stderr) => {
              if (error || stderr) {
                console.log("error");
                reject("error execute command");
              }
              const data = stdout.split("\n");
              console.log(file.mimetype)
              fs.readFile(`${data[0]}`, (err, res) => {
                if (err) reject("read file error");
                console.log(res);
                fs.unlink(data[0], (err) => {
                  if (err) {
                    return;
                  }
                });
		  resolve({
                  filename: data[0],
                  file: res,
                  info: data,
                  type: file.mimetype,
                });
              });
            });
          });
        })
      );
      const noErrorArr = arr.filter((e) => e.info[2] == "0");
      const errorArr = arr.filter((e) => e.info[2] == "1");
      res.send({ noErrorArr, errorArr });
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});
