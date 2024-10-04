const router = require("express").Router();
const { readdirSync } = require('fs-extra');
const path = require('path');
const { green, blue, cyan } = require('kleur');
const compression = require('compression');
const srcPath = path.join(__dirname, "/scraper/");

// Use compression middleware
router.use(compression());

// Cache API modules
const apiCache = new Map();

// Preload API modules
const apiFiles = readdirSync(srcPath).filter(file => file.endsWith(".js"));
apiFiles.forEach(file => {
  const filePath = path.join(srcPath, file);
  const api = require(filePath);
  if (api.config && api.initialize) {
    apiCache.set(api.config.name, api);
  }
});

// Set up routes
let n = 0;
apiCache.forEach((api, name) => {
  const routePath = `/api/${name}`;
  router.get(routePath, async (req, res) => {
    try {
      await api.initialize({ req, res });
    } catch (error) {
      res.status(500).send("Error occurred");
    }
  });
  global.api.set(name, api);
  n++;
  console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${name}`)}`);
});

console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${n} API`)}`);

module.exports = router;