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
      let response = d;

      const contentType = apiRes.headers["content-type"];
      if (contentType === "application/json") {
        try {
          response = JSON.parse(d);
        } catch (e) {
          console.log("error parsing json");
        }
      }

      res.status(apiRes.statusCode).send(d);
    });

    apiRes.on("end", () => {
      res.status(apiRes.statusCode).send();
    });
  });

  if (req.method === "POST") {
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
