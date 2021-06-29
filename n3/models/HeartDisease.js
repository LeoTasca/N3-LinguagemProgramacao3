var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var heartDiseaseSchema = new Schema({
  age: {
    type: Number,
    Required: "Age is mandatory",
  },
  sex: {
    type: Number,
    Required: "Sex is mandatory",
  },
  cp: {
    type: Number,
    Required: "Cp is mandatory",
  },
  trestbps: { type: Number, Required: "Trestbps is mandatory" },
});

var heartDisease = mongoose.model("HeartDisease", heartDiseaseSchema);

module.exports = heartDisease;
