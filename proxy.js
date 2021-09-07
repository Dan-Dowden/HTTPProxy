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

app.options("*", cors());

app.all("/*", (req, res) => {
  if (req.method === "GET") {
    var options = {
      hostname: apiUrl,
      path: "/prod" + req.originalUrl,
      method: "GET",
      headers: {
        Authorization: req.headers.authorization,
      },
    };

    var apiReq = https.request(options, function (apiRes) {
      apiRes.on("data", (d) => {
        res.send(JSON.parse(d));
      });
    });
    apiReq.end();

    apiReq.on("error", function (e) {
      console.error(e);
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy listening at http://localhost:${port}`);
});
