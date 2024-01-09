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
    console.log("req.body: ", req.body);

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
    console.log(surveys);
    await surveys.save();
    res.status(200).send({ message: "Done", success: true });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    console.log(e);
  }
});

app.get("/deleteAllSubscribeNewsetter", async (req, res) => {
  try {
    let deletes = await newsLetterEmail.deleteMany();
    console.log(deletes);
    res.status(200).send({ message: "Done", success: true });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    console.log(e);
  }
});

app.get("/", async (req, res) => {
  res.send("live");
});
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
