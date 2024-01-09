const mongoose = require("mongoose");

let surveySchema = new mongoose.Schema({
  Value1: { type: String },
  Value2: { type: String },
  Value3: { type: String },
  Value4: { type: String },
  Value5: { type: String },
  Value6: { type: String },
  Value7: { type: String },
  Value8: { type: String },
  Value9: { type: String },
  Value10: { type: String },
  Value11: { type: String },
  Value12: { type: String },
  Value13: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = new mongoose.model("survey", surveySchema);
module.exports = Email;
