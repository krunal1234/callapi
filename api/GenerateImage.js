import { ApexImagine } from 'apexify.js';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.post('/', async (req, res) => {
    const { ApiKey, model, prompt } = req.query;
    const requestId = uuidv4(); // Unique request identifier for easier tracking
    const startTime = Date.now();

    const imageOptions = {
    count: 1,                // generates 2 images by default
    nsfw: false,            // Enable or disable NSFW content
    deepCheck : false,      // Enable deep check for nsfw
    nsfwWords : [],         // optional/custom nsfw badwords to check the image content for
    Api_key: ApiKey, // (Optional) Use your own API key
    negative_prompt : "",
    sampler : "DPM++ 2M Karras",
    height : 512,
    width : 512,
    cfg_scale : 9,
    steps : 20,
    seed : -1,
    image_style : "cinematic"
    };
    try {
        const response = await ApexImagine(model, prompt, imageOptions);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Image processed successfully',
            response: response,
            timestamp: new Date().toISOString(),
        });
        const executionTime = Date.now() - startTime; // Calculate execution time
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Image processed successfully',
            response: response,
            requestId: requestId,
            timestamp: new Date().toISOString(),
            executionTime: executionTime, 
        });
    } catch (error) {
        const executionTime = Date.now() - startTime;

        console.error('Error processing ApexImageAnalyzer:', error);

        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'An error occurred while processing the request',
            error: {
                message: error.message,
                stack: error.stack,
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

export default router;
