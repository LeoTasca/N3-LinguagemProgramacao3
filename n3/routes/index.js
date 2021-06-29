const express = require("express");
const fastcsv = require("fast-csv");
const csvexpress = require("csv-express");
const router = express.Router();
const fs = require("fs");
const mongoose = require("mongoose");
const HeartDisease = require("../models/HeartDisease");

const csvfile = __dirname + "/../public/files/heartdisease.csv";
const stream = fs.createReadStream(csvfile);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Importando arquivo CSV usando NodeJS." });
});

router.get("/import", function (req, res, next) {
  const csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      const item = new HeartDisease({
        age: data[0],
        sex: data[1],
        cp: data[2],
        trestbps: data[3],
      });
      item.save(function (error) {
        console.log(item);
        if (error) {
          throw error;
        }
      });
    })
    .on("end", function () {
      console.log("Fim do arquivo de importação.");
    });
  stream.pipe(csvStream);
  res.json({ success: "Os dados foram importados com sucesso.", status: 200 });
});

router.get("/fetchdata", function (req, res, next) {
  HeartDisease.find({}, function (err, data) {
    console.log(data);
    if (!err) {
      res.render("fetchdata", {
        title: "Listing of people with heart disease",
        data,
      });
    } else {
      throw err;
    }
  });
});

router.get("/export", function (req, res, next) {
  const filename = "exported_file.csv";
  HeartDisease.find()
    .lean()
    .exec({}, function (err, data) {
      if (err) res.send(err);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=" + filename);
      res.csv(data, true);
      console.log(data);
      console.log("Os dados foram exportados com sucesso.");
    });
});

router.get("/create-form", function (req, res, next) {
  HeartDisease.find({}, function (err, data) {
    if (!err) {
      res.render("create", {
        title: "Create a new record",
      });
    } else {
      throw err;
    }
  });
});

router.post("/create", function (req, res, next) {
  const data = new HeartDisease({
    age: req.body.age,
    sex: req.body.sex,
    cp: req.body.cp,
    trestbps: req.body.trestbps,
  });

  data.save(function (error) {
    console.log(data);
    if (error) {
      throw error;
    }
  });

  res.redirect("/fetchdata");
});

router.get("/edit/:id", function (req, res, next) {
  HeartDisease.find({ _id: req.params.id }, function (err, data) {
    if (!err) {
      res.render("edit", {
        title: "Edit",
        _id: data[0]._id,
        age: data[0].age,
        sex: data[0].sex,
        cp: data[0].cp,
        trestbps: data[0].trestbps,
      });
    } else {
      throw err;
    }
  });
});

router.post("/edition/:id", function (req, res, next) {
  const filter = { _id: req.params.id };
  const update = {
    age: req.body.age,
    sex: req.body.sex,
    cp: req.body.cp,
    trestbps: req.body.trestbps,
  };

  HeartDisease.updateOne(filter, update).then(() => {
    res.redirect("/fetchdata");
  });
});

router.get("/delete/:id", function (req, res, next) {
  const id = { _id: req.params.id };
  HeartDisease.deleteOne(id).then(() => {
    res.redirect("/fetchdata");
  });
});

module.exports = router;
