const express = require("express");
const path = require("path");
const log = require("./function/log")
const config = require("./config.json");

global.config = config;
global.api = new Map(); // Ensure global.api is initialized here
const router = require("./function/router");
const app = express();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'web', 'public')));

app.use(router);

// Add this route to your Express server (e.g., in index.js)
app.get("/config", (req, res) => {
  res.json(global.config);
});

// Endpoint to serve the API list
app.get("/api-list", (req, res) => {
  const apiList = Array.from(global.api.values()).map(api => api.config);
  res.json(apiList);
});

// Serve the documentation page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web/index.html"));
});

// Serve the 404 page for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web/404.html"));
});

const PORT = process.env.PORT || global.config.port || 3000;

app.listen(PORT, () => {
  log.main(`Server is running on port ${PORT}`);
});
