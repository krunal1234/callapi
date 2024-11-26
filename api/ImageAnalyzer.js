import { ApexImageAnalyzer } from 'apexify.js';
import express from 'express'
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.post('/', async (req, res) => {
    const { imagePath, question } = req.body;
    const requestId = uuidv4(); // Unique request identifier for easier tracking

    const startTime = Date.now(); 
    try {
        console.log('ApexImageAnalyzer Request:', { imagePath, question, ApiKey });
        
        const response = await ApexImageAnalyzer({
            imgURL: imagePath,
            ApiKey: ApiKey,
            prompt: question
        });
        
        console.log('ApexImageAnalyzer Response:', response);

        const executionTime = Date.now() - startTime; // Calculate execution time
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
                responseTime: response.responseTime,
                apiVersion: 'v1'
            }
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
