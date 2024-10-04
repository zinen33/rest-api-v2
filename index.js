const express = require("express");
const path = require("path");
const config = require("./config.json");

global.config = config;
global.api = new Map(); // Ensure global.api is initialized here
const router = require("./function/router");
const app = express();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'web', 'public')));

app.use(router);

// Endpoint to serve the API list
app.get("/api-list", (req, res) => {
  const apiList = Array.from(global.api.values()).map(api => api.config);
  res.json(apiList);
});

// Serve the documentation page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web/docs.html"));
});

// Serve the 404 page for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "web/404.html"));
});

const PORT = process.env.PORT || global.config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
