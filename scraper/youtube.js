const { ytMp3, ytMp4 } = require('./assets/yt2mate'); // Import ytMp3 and ytMp4 functions

// Define loghandler with custom error messages
const loghandler = {
    error: {
        status: false,
        code: 503,
        message: "Service got an error, try again in 10 seconds",
        creator: "Lance Cochangco"
    },
    noturl: {
        status: false,
        code: 503,
        message: "Enter parameter url",
        creator: "Lance Cochangco"
    }
};

exports.config = {
    name: 'youtube',
    author: 'Lance Cochangco', // The creator's name here
    description: 'Download YouTube videos in mp3 and mp4 formats',
    category: 'downloader',
    link: ['/youtube?url=https://youtu.be/XHPOlxyKA3o&si=EHlC91F-GVhoRTXy']
};

exports.initialize = async function ({ req, res }) { 
    try {
        const url = req.query.url;
        if (!url) {
            return res.json(loghandler.noturl); // Return error for missing URL
        }

        const mp3 = await ytMp3(url);
        const mp4 = await ytMp4(url);

        if (!mp4 || !mp3) {
            return res.json(loghandler.error); // Return error if download failed
        }

        res.json({
            status: true,
            code: 200,
            creator: this.config.author,
            result: {
                title: mp4.title,
                desc: mp4.desc,
                thum: mp4.thumb,
                view: mp4.views,
                channel: mp4.channel,
                uploadDate: mp4.uploadDate,
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
        console.error("Error downloading YouTube video:", error);
        res.json(loghandler.error); // Return error when any exception occurs
    }
};
