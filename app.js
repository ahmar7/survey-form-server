const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotnet = require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const surveyModel = require("./models/survey");
const database = require("./db/db");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);
// parse application/json
app.use(bodyParser.json());
const port = process.env.PORT || 5000;
const static_path = path.join(__dirname, "../../");
app.use(express.static(static_path));
app.post("/submitSurvey", async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      phone,
      Value1,
      Value2,
      Value3,
      Value4,
      Value5,
      Value6,
      Value7,
      Value8,
      Value9,
      Value10,
      Value11,
      Value12,
      Value13,
    } = req.body;

    let surveys = new surveyModel({
      email,
      firstName,
      lastName,
      phone,
      Value1,
      Value2,
      Value3,
      Value4,
      Value5,
      Value6,
      Value7,
      Value8,
      Value9,
      Value10,
      Value11,
      Value12,
      Value13,
    });
    await surveys.save();
    res.status(200).send({ message: "Done", success: true });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.get("/getAllSurveys", async (req, res) => {
  let secret = req.query.secret;
  let storedSecret = process.env.SECRET;
  try {
    if (!secret) {
      res.status(400).send({ msg: "No secret key provided", success: false });
      return;
    }
    if (secret != storedSecret) {
      res.status(400).send({
        msg: "Secret code is incorrect, please try again",
        success: false,
      });
      return;
    }
    let allData = await surveyModel.find();

    res.status(200).send({ msg: "Done", success: true, allData });
  } catch (e) {
    res.status(500).send({
      success: false,
      msg: "Something went wrong",
    });
  }
});
app.get("/seleteSurvey/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let allData = await surveyModel.findByIdAndDelete({ _id: id });

    res
      .status(200)
      .send({ msg: "Deleted successfully", success: true, allData });
  } catch (e) {
    res.status(500).send({
      success: false,
      msg: "Something went wrong",
    });
  }
});

app.get("/", async (req, res) => {
  res.send("live");
});
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
