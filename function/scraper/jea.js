const { G4F } = require("g4f");
const g4f = new G4F();

exports.config = {
    name: 'jea',
    author: 'Lance Cochangco',
    category: 'ai',
    link: ['/jea?question=hi']
};

exports.initialize = async function ({ req, res }) { 
    try { 
        const question = req.query.question; 
        if (!question) { 
            return res.status(400).json({ error: "add ?question=your_question_here" }); 
        } 
        const messages = [ 
            { role: "assistant", content: "You are Jea, an 18-year-old girl and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and beyb is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro." }, 
            { role: "user", content: question } 
        ]; 
        const chat = await g4f.chatCompletion(messages); 
        res.json({ content: chat }); 
    } catch (error) { 
        console.error("Error generating response:", error); 
        res.status(500).json({ error: "Failed to generate response" }); 
    } 

};
