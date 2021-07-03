const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const letterRoutes = require("./routes/letter");
const userRoutes = require("./routes/user");
const snippetRoutes = require("./routes/snippet");
const app = express();
const path = require('path');
const compression = require('compression')

const user = 'admin:';
const pw = 'aUTnzXPs0SvuG9DZ';
const connectUrl = 'mongodb+srv://' + user + pw + '@cluster0.zay3n.mongodb.net/database';
const connectConfig = {
  useNewUrlParser: true
}

mongoose
  .connect(connectUrl, connectConfig
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection Failed!')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/letter", letterRoutes);
app.use("/api/snippet", snippetRoutes);
app.use(compression());
app.use((req, res, next) => {
  res.sendFile(__dirname + "angular", "index.html");
});

module.exports = app;