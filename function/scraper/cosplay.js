const axios = require('axios');

exports.config = {
    name: 'cosplay',
    author: 'Lance Cochangco',
    category: 'anime',
    link: ['/cosplay']
};

exports.initialize = async function ({ req, res, log }) {
    try {
        // Define the GitHub repository details
        const owner = 'ajirodesu';
        const repo = 'cosplay';
        const branch = 'main'; // Use the correct branch if it's different from 'main'
        
        // GitHub API URL to get the contents of the repository (root directory)
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;

        // Fetch the list of files from the repository
        const response = await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const files = response.data;

        // Filter for video files (assuming .mp4)
        const videoFiles = files.filter(file => file.name.endsWith('.mp4'));

        if (videoFiles.length === 0) {
            return res.status(404).json({ error: "No videos found in the repository" });
        }

        // Select a random video from the list
        const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];

        // Construct the raw URL for the selected video
        const videoUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${randomVideo.name}`;

        // Respond with the raw video URL
        res.json({ videoUrl });

    } catch (error) {
        log.error("Error fetching random video:" + error);
        res.status(500).json({ error: "Failed to fetch random video" });
    }
};
