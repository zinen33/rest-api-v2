const express = require("express");
const secure = require('ssl-express-www');
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const log = require("./includes/log");
const config = require("./config.json");

global.config = config;
global.api = new Map();
const router = require("./includes/router");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'includes', 'public')));
app.use(express.static(path.join(__dirname, 'includes', 'web')));

app.use(router);
app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to serve the API list
app.get("/api-list", (req, res) => {
  const apiList = Array.from(global.api.values()).map(api => ({
    name: api.config.name,
    description: api.config.description,
    endpoint: `api${api.config.link}`,
    category: api.config.category
  }));
  res.json(apiList);
});

// Serve the documentation page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "includes", "public", "index.html"));
});

// Serve the 404 page for unknown routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "includes", "public", "404.html"));
});

const PORT = process.env.PORT || global.config.port || 3000;

app.listen(PORT, () => {
  log.main(`Server is running on port ${PORT}`);
});
