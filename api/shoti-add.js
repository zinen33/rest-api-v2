const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "assets", "shoti.json");

// Helper function to get or initialize the shoti.json file
const getShotiData = () => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
};

// Helper function to save data to the shoti.json file
const saveShotiData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.config = {
  name: "shoti-add",
  author: "AjiroDesu",
  description: "Add TikTok URL to the list",
  method: "get",
  category: "utility",
  link: ["/shoti-add?url=<url>&senderID=<id>"]
};

exports.initialize = async function ({ req, res }) {
  const { query } = req;
  const { url, senderID } = query;

  const authorizedUsers = global.config.tgOwner;
  if (!authorizedUsers.includes(senderID)) {
    return res.json({ message: "You are not authorized", status: 403 });
  }

  if (!url) {
    return res.json({ message: "Missing URL", status: 400 });
  }

  if (!url.includes("https://vt.tiktok.com/")) {
    return res.json({ message: "Invalid URL", status: 400 });
  }

  try {
    let data = getShotiData();

    if (data.includes(url)) {
      return res.json({ message: "URL already exists in the list", url, status: 400 });
    }

    data.push(url);
    saveShotiData(data);

    res.json({ message: "URL added successfully", url, status: 200 });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ message: "Error saving URL", status: 500 });
  }
};
