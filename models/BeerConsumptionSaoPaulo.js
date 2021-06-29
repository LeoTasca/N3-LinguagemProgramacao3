var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var beerconsumptionsaopauloSchema = new Schema({
  average_temperature: {
    type: Number,
    Required: "Average Temperature is mandatory",
  },
  precipitation: {
    type: Number,
    Required: "Precipitation is mandatory",
  },
  weekend: {
    type: Number,
    Required: "Weekend is mandatory",
  },
  beer_consumption: { type: Number, Required: "Beer Consumption is mandatory" },
});

var beerconsumptionsaopaulo = mongoose.model("beerconsumptionsaopaulo", beerconsumptionsaopauloSchema);

module.exports = beerconsumptionsaopaulo;
