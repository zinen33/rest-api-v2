const ai = require('unlimited-ai');

// List of available models
const models = [
  'gpt-4o-mini-free',
  'gpt-4o-mini',
  'gpt-4o-free',
  'gpt-4-turbo-2024-04-09',
  'gpt-4o-2024-08-06',
  'grok-2',
  'grok-2-mini',
  'claude-3-opus-20240229',
  'claude-3-opus-20240229-gcp',
  'claude-3-sonnet-20240229',
  'claude-3-5-sonnet-20240620',
  'claude-3-haiku-20240307',
  'claude-2.1',
  'gemini-1.5-flash-exp-0827',
  'gemini-1.5-pro-exp-0827'
];

exports.config = {
    name: 'ai',
    author: 'Lance Cochangco',
    description: 'Advanced API for dynamic text generation using various AI models',
    category: 'ai',
    link: ['/ai']
};

exports.initialize = async function ({ req, res }) {
    try {
        const { model, system, question } = req.query;

        if (!model || !system || !question) {
            return res.status(400).json({
                error: "Missing required parameters",
                message: "Please provide all required query parameters: 'model', 'system', and 'question'.",
                availableModels: models,
                exampleUsage: "/ai?model=gpt-4-turbo-2024-04-09&system=You%20are%20a%20helpful%20assistant&question=Hello"
            });
        }

        if (!models.includes(model)) {
            return res.status(400).json({
                error: "Invalid model selection",
                message: `The model '${model}' is not supported. Please select from the available models below.`,
                availableModels: models
            });
        }

        const messages = [
            { role: 'system', content: system },
            { role: 'user', content: question }
        ];

        const chat = await ai.generate(model, messages);

        res.status(200).json({
            success: true,
            model,
            system,
            question,
            response: chat
        });
    } catch (error) {
        console.error("Error in AI response generation:", error);

        res.status(500).json({
            error: "Internal Server Error",
            message: "An unexpected error occurred during AI response generation. Please try again later or contact our support team.",
            errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};