const { ApexImageReader } = require('apexify.js');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.get('/', async (req, res) => {
    const { imagePath } = req.body; // You can expect `imagePath` to be part of the request body
    const requestId = uuidv4(); // Unique request identifier for easier tracking

    // Set a default image URL in case the body does not include it
    const imageURL = imagePath || 'https://www.investopedia.com/thmb/RPWROSmYFssYV0VJAD3TEavQ-K4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Marketing-recirc-blue-77cc4c488cf14d4686691e82219f80cf.jpg';
  
    const startTime = Date.now(); // Start time for performance tracking

    try {
        // Call the ApexImageReader function with the image URL
        const response = await ApexImageReader(imageURL);

        const executionTime = Date.now() - startTime; // Calculate execution time

        // Send the response back to the client
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Image reading processed successfully',
            response: response,
            requestId: requestId,
            timestamp: new Date().toISOString(),
            executionTime: executionTime,
            meta: {
                imageUrl: imageURL,
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
                    imgURL: imageURL
                }
            }
        });
    }
});

module.exports = router;
