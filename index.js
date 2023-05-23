const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homefile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273).toFixed(2)
  );
  temperature = temperature.replace("{%temploc%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  console.log(orgVal.weather[0].main);
  //console.log(temperature);
  return temperature;
};

const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      " https://api.openweathermap.org/data/2.5/weather?q=karnataka&appid=1baf2a4ed44627842c62a9cff07b6bec"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData[0].main.temp);
        //console.log(chunk);
        const realTimeData = arrData
          .map((val) => replaceVal(homefile, val))
          .join("");
        //.join("") is array converted into shring
        //console.log(arrData);
        //console.log(realTimeData);
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        //console.log("end");
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
