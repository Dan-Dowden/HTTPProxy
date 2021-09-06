const express = require("express");
const https = require("https");
const app = express();
const port = 4000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.all("/*", (req, res) => {
  if (req.method === "GET") {
    var options = {
      hostname: apiUrl,
      path: "/prod" + req.originalUrl,
      method: "GET"
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
