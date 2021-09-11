const express = require("express");
var cors = require("cors");
const https = require("https");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const port = 4000;
const apiUrl = process.env.API_URL;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.options("*", cors());

app.all("/*", (req, res) => {
  var options = {
    hostname: apiUrl,
    path: "/prod" + req.originalUrl,
    method: req.method,
    headers: {
      Authorization: req.headers.authorization,
    },
  };

  var apiReq = https.request(options, function (apiRes) {
    apiRes.on("data", (d) => {
      res.send(JSON.parse(d));
    });
  });

  if (req.method === "POST") {
    console.log("posting");
    const data = new TextEncoder().encode(JSON.stringify(req.body));
    apiReq.write(data);
  }

  apiReq.end();

  apiReq.on("error", function (e) {
    console.error(e);
  });
});

app.listen(port, () => {
  console.log(`Proxy listening at http://localhost:${port}`);
});
