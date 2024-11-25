const { ApexImageAnalyzer } = require('apexify.js');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.get('/', async (req, res) => {
    let { imagePath, question } = req.body;
    const ApiKey = "";  // Ideally, should come from a secure environment variable or config.
    imagePath = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Split_Aloe.jpg/800px-Split_Aloe.jpg';
    question = 'Who is this?';

    const requestId = uuidv4(); // Unique request identifier for easier tracking.

    const startTime = Date.now(); 
    try {
        // Call the ApexImageAnalyzer function with the extracted parameters
        const response = await ApexImageAnalyzer({
            imgURL: imagePath,
            ApiKey: ApiKey,
            prompt: question
        });

        const executionTime = Date.now() - startTime; // Calculate execution time
        // Send the response back to the client
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Image Analyser processed successfully',
            response: response,
            requestId: requestId,
            timestamp: new Date().toISOString(),
            executionTime: executionTime, 
            meta: {
                imageUrl: imagePath,
                questionAsked: question,
                responseTime: response.responseTime, // Assuming `responseTime` is a part of the response data
                apiVersion: 'v1'
            }
        });
    } catch (error) {
        const executionTime = Date.now() - startTime; // Time until error occurred
        // Send a detailed error response for easier troubleshooting
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'An error occurred while processing the request',
            error: {
                message: error.message,
                stack: error.stack, // Stack trace for debugging
                requestId: requestId,
            },
            timestamp: new Date().toISOString(),
            executionTime: executionTime, 
            debug: {
                originalRequest: {
                    imgURL: imagePath,
                    prompt: question
                }
            }
        });
    }
});

module.exports = router;
