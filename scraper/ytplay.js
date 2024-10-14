const yts = require("yt-search");
const { ytMp3, ytMp4 } = require('./assets/yt2mate'); // Import ytMp3 and ytMp4 functions

exports.config = {
    name: 'ytplay',
    author: 'Lance Cochangco',
    description: 'Search and convert YouTube videos to mp3 and mp4',
    category: 'search',
    link: ['/ytplay?text=nobela']
};

exports.initialize = async function ({ req, res }) { 
    try {
        const text1 = req.query.text;
        if (!text1) {
            return res.json({ status: false, creator: this.config.author, message: "[!] masukan parameter text" });
        }

        const search = await yts(text1);
        const url = search.all[Math.floor(Math.random() * search.all.length)];
        const mp3 = await ytMp3(url.url);
        const mp4 = await ytMp4(url.url);

        if (!mp4 || !mp3) {
            return res.json(loghandler.noturl);
        }

        res.json({
            status: true,
            creator: this.config.author,
            result: {
                title: mp4.title,
                desc: mp4.desc,
                thum: mp4.thumb,
                view: mp4.views,
                channel: mp4.channel,
                ago: url.ago,
                timestamp: url.timestamp,
                uploadDate: mp4.uploadDate,
                author: url.author,
                mp4: {
                    result: mp4.result,
                    size: mp4.size,
                    quality: mp4.quality
                },
                mp3: {
                    result: mp3.result,
                    size: mp3.size
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving YouTube video:", error);
        res.status(500).json({ error: "Failed to search YouTube or retrieve media." });
    }
};
