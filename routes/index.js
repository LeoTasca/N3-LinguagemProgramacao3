const express = require("express");
const fastcsv = require("fast-csv");
const csvexpress = require("csv-express");
const router = express.Router();
const fs = require("fs");
const mongoose = require("mongoose");
const BeerConsumptionSaoPaulo = require("../models/BeerConsumptionSaoPaulo");

const csvfile = __dirname + "/../public/files/beer-consumption-sao-paulo.csv";
const stream = fs.createReadStream(csvfile);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Importando arquivo CSV usando NodeJS." });
});

router.get("/import", function (req, res, next) {
  const csvStream = fastcsv
    .parse()
    .on("data", function (data) {
      const item = new BeerConsumptionSaoPaulo({
        average_temperature: data[0],
        precipitation: data[1],
        weekend: data[2],
        beer_consumption: data[3],
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
  BeerConsumptionSaoPaulo.find({}, function (err, data) {
    console.log(data);
    if (!err) {
      res.render("fetchdata", {
        title: "Listing the consumption of beer in Sao Paulo",
        data,
      });
    } else {
      throw err;
    }
  });
});

router.get("/export", function (req, res, next) {
  const filename = "exported_file.csv";
  BeerConsumptionSaoPaulo.find()
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
  BeerConsumptionSaoPaulo.find({}, function (err, data) {
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
  const data = new BeerConsumptionSaoPaulo({
    average_temperature: req.body.average_temperature,
    precipitation: req.body.precipitation,
    weekend: req.body.weekend,
    beer_consumption: req.body.beer_consumption,
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
  BeerConsumptionSaoPaulo.find({ _id: req.params.id }, function (err, data) {
    if (!err) {
      res.render("edit", {
        title: "Edit",
        _id: data[0]._id,
        average_temperature: data[0].average_temperature,
        precipitation: data[0].precipitation,
        weekend: data[0].weekend,
        beer_consumption: data[0].beer_consumption,
      });
    } else {
      throw err;
    }
  });
});

router.post("/edition/:id", function (req, res, next) {
  const filter = { _id: req.params.id };
  const update = {
    average_temperature: req.body.average_temperature,
    precipitation: req.body.precipitation,
    weekend: req.body.weekend,
    beer_consumption: req.body.beer_consumption,
  };

  BeerConsumptionSaoPaulo.updateOne(filter, update).then(() => {
    res.redirect("/fetchdata");
  });
});

router.get("/delete/:id", function (req, res, next) {
  const id = { _id: req.params.id };
  BeerConsumptionSaoPaulo.deleteOne(id).then(() => {
    res.redirect("/fetchdata");
  });
});

module.exports = router;
