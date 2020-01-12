let router = require("express").Router();
let fs = require("fs");

let promise = req =>
  new Promise(function(resolve, reject) {
    try {
      let files = fs.readdirSync(`${req.dir}/images/icons`);
      for (let file of files) {
        fs.unlinkSync(`${req.dir}/images/icons/${file}`);
      }
      fs.unlinkSync(`${req.dir}.zip`);
      fs.rmdirSync(`${req.dir}/images`, { recursive: true });
      fs.unlinkSync(`${req.dir}/manifest.json`);
      fs.rmdirSync(`${req.dir}`, { recursive: true });
      resolve();
    } catch (err) {
        
      console.log(err);
    }
  });

module.exports = promise;
