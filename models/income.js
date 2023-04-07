const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  //   subcategory: {
  //     type: String,
  //     required: true
  //   },
  value: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    get: (date) => date.toLocaleDateString("pl-PL"),
  },
  comment: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Income", incomeSchema);
