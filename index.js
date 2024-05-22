require("./config/config");

const { initialConnect } = require("./models/db");
const mongoose = require("mongoose");

const express = require("express");

const http = require("http");

const app = express();
const server = http.createServer(app);

const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(require("./routes/index"));
const ObjectId = mongoose.Types.ObjectId;
(async () => {
  setTimeout(async () => {
    /*
    const notion = new Client({
      auth: "secret_Kf85yAoyLPtDIo7sNkBBeKbk6KfmQJkHvTGTE41ZCUy",
    });

    const databaseId = "0e90d53d4f804a54b2af5cfee336abf5";

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const { results } = response;

    results.forEach((page) => {
      const { id, properties } = page;
      console.log(properties.activo.select.name);
      console.log(properties.fecha.date.start);
      //      console.log(properties.usaurio.date.start);
    });
    */
  }, 5000);

//  await initialConnect();

  server.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
  });
})();
