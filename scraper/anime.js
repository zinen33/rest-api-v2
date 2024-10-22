const fetch = require('node-fetch');
const fs = require('fs');

exports.config = {
    name: 'animesticker',
    author: 'Lance Cochangco', 
    description: 'Fetch a random anime sticker',
    method: 'GET',
    category: 'anime',
    link: ['/animesticker']
};

exports.initialize = async function ({ req, res }) { 
    try {
        const url = encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/animestick.json`);
        
        fetch(url)
            .then(response => response.json())
            .then(async data => {
                let hasil = data[Math.floor(Math.random() * data.length)];
                let buffer = hasil;
                data = await fetch(buffer).then(v => v.buffer());
                await fs.writeFileSync(__dirname + '/tmp/images.jpg', data);
                res.sendFile(__dirname + '/tmp/images.jpg');
            }).catch(e => {
                console.error(e);
                res.status(500).json({ error: "Failed to fetch anime sticker." });
            });
    } catch (error) {
        console.error("Error fetching anime sticker:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
