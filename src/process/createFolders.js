let router = require("express").Router();
let fs = require("fs");
let path = require("path");
const genid = require("uuid");

let createWriteStream = require("fs").createWriteStream;

let promise = req =>
  new Promise(function(resolve, reject) {
    fs.mkdir(`${req.dir}/images/icons`, { recursive: true }, err => {
      if (err) console.log(err);

      req.stream
        .pipe(createWriteStream(path.join(req.dir, req.filename)))
        .on("close", rename);

      function rename() {
        fs.rename(
          `${req.dir}/${req.filename}`,
          `${req.dir}/upload.png`,
          err => {
            resolve();
          }
        );
      }
    });
  });
module.exports = promise;
