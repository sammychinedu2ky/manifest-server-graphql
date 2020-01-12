let router = require("express").Router();
let fs = require("fs");
let archiver = require("archiver");

let promise = req =>
  new Promise(function(resolve, reject) {
    let zipFile = fs.createWriteStream(`${req.dir}.zip`);
    let archive = archiver("zip", {
      zlib: { level: 1 }
    });
    archive.pipe(zipFile);
    archive.on("error", function(err) {
      throw err;
    });
    archive.directory(`${req.dir}/`, false);

    zipFile.on("close", () => {
      req.fileString = fs.readFileSync(`./${req.dir}.zip`).toString("base64");

      resolve();
    });

    archive.finalize();
  });

module.exports = promise;
