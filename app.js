const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotnet = require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const twilio = require("twilio/lib/rest/Twilio");
const surveyModel = require("./models/survey");
const surveySharedModel = require("./models/surveyShared");
const database = require("./db/db");
app.use(bodyParser.urlencoded({ extended: false }));
const fs = require("fs");
// app.use(
//   cors({
//     origin: process.env.CORS,
//     credentials: true,
//   })
// );
let ALLOWED_ORIGINS = [
  "https://astonishing-mooncake-f200b2.netlify.app",
  "https://survey-form-ebon-rho.vercel.app",
  "http://127.0.0.1:5555",
];
app.use((req, res, next) => {
  let origin = req.headers.origin;
  let theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.header("Access-Control-Allow-Credentials", true);

  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH,DELETE, OPTIONS"
  );
  next();
});
// SMs ##############################################################################
// Replace with your messaging library

// SMs ##############################################################################
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
  let storedSecret = process.env.SECRET_SHARED;
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
// Shared Api
app.get("/getAllSurveysShared", async (req, res) => {
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
    let allData = await surveySharedModel.find();

    res.status(200).send({ msg: "Done", success: true, allData });
  } catch (e) {
    res.status(500).send({
      success: false,
      msg: "Something went wrong",
    });
  }
});
app.get("/seleteSurveyShared/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let allData = await surveySharedModel.findByIdAndDelete({ _id: id });

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
// Shared Api
app.post("/submitSharedSurvey/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let allData = await surveyModel.findByIdAndUpdate(
      { _id: id },
      { $set: { share: true } },
      { new: true }
    );

    let surveysShared = new surveySharedModel({ ...allData._doc, share: true });

    await surveysShared.save();

    res.status(200).send({ message: "Done", success: true });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
});
app.get("/", async (req, res) => {
  res.send("live");
});
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
