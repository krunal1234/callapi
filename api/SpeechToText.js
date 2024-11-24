const { ApexListener } = require('apexify/dist/ai/ApexModules');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.post('/', async (req, res) => {
    const { filepath, apiKey, lang, prompt } = req.body;

    // Generate a unique requestId for tracking
    const requestId = uuidv4();

    // Start time to measure execution duration
    const startTime = Date.now();

    // Validate required parameters
    if (!filepath || !apiKey || !lang || !prompt) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: 'Missing required parameters: filepath, apiKey, lang, or prompt',
            requestId: requestId,
            timestamp: new Date().toISOString(),
        });
    }

    try {
        // Call the ApexListener function with the extracted parameters
        const response = await ApexListener({
            filepath: filepath,
            apiKey: apiKey,
            lang: lang,
            prompt: prompt,
        });

        // Calculate the execution time
        const executionTime = Date.now() - startTime;

        // Send the successful response with all necessary data
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Audio processed successfully',
            response: response,
            requestId: requestId,
            timestamp: new Date().toISOString(),
            executionTime: executionTime,
            meta: {
                filepath: filepath,
                lang: lang,
                prompt: prompt,
                apiVersion: 'v1',
            },
        });
    } catch (error) {
        const executionTime = Date.now() - startTime; // Measure the time up until the error

        // Send the error response with helpful debugging information
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'An error occurred while processing the request',
            error: {
                message: error.message,
                stack: error.stack, // Optionally include stack trace for debugging
                requestId: requestId,
            },
            timestamp: new Date().toISOString(),
            executionTime: executionTime,
            debug: {
                originalRequest: {
                    filepath: filepath,
                    lang: lang,
                    prompt: prompt,
                },
            },
        });
    }
});

module.exports = router;
