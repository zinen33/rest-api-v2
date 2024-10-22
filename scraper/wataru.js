const { G4F } = require("g4f");
const g4f = new G4F();

exports.config = {
    name: 'wataru',
    author: 'Lance Cochangco',
    description: 'Chat with Wataru the friendly AI',
    method: 'GET',
    category: 'ai',
    link: ['/wataru?question=hi']
};

exports.initialize = async function ({ req, res }) { 
    try { 
        const question = req.query.question; 
        if (!question) { 
            return res.status(400).json({ error: "add ?question=your_question_here" }); 
        } 
        const messages = [ 
            { role: "assistant", content: "Your name is Wataru, the most powerful Generative AI in the world that was created by Lance Ajiro. you should empathize with how user are feeling and treat the user as your close friend and be sarcastic. I recommend you to use emoji in your response. You should response in 3 sentences only if needed!." }, 
            { role: "user", content: question } 
        ]; 
        const chat = await g4f.chatCompletion(messages); 
        res.json({ content: chat }); 
    } catch (error) { 
        console.error("Error generating response:", error); 
        res.status(500).json({ error: "Failed to generate response" }); 
    } 

};
