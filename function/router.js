const router = require("express").Router();
const { readdirSync } = require('fs-extra');
const path = require('path');
const { green, blue, cyan } = require('kleur');

try {
  let n = 0;
  const srcPath = path.join(__dirname, "/scraper/");
  const apiFiles = readdirSync(srcPath).filter(file => file.endsWith(".js"));

  for (const file of apiFiles) {
    const filePath = path.join(srcPath, file);
    const api = require(filePath); // Change 'script' to 'api'
    if (api.config && api.initialize) {
      const routePath = '/api/' + api.config.name;
      router.get(routePath, (req, res) => api.initialize({ req, res }));
      global.api.set(api.config.name, api); // Register API to global.api map
      n++;
      console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${file}`)}`);
    }
  }

  console.log(`${green('[ Ajiro ]')} ${cyan('→')} ${blue(`Successfully loaded ${n} API files`)}`);
} catch (error) {
  console.log(error);
}

module.exports = router;
