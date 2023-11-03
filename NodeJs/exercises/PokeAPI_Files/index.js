
const express = require("express");
const morgan = require("morgan");

const app = express();
let port = 3000;
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded
//app.use(bodyParser.json());// for parsing application/json

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.use("/api/pokemon", require("./routes/pokemon"));

app.listen(3000, () => {
    console.log(`Server is listening on port ${port}`);
});
