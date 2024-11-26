import { ApexFileReader } from 'apexify.js';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.post('/', async (req, res) => {
    const { filePath } = req.body; // Expecting `filePath` in the request body
    const requestId = uuidv4(); // Unique request identifier for easier tracking

    // Default PDF URL if none provided
    const fileURL = filePath || 'https://pdfobject.com/pdf/sample.pdf';
    
    const startTime = Date.now(); // Track start time for execution time calculation

    try {
        // Call the ApexFileReader function with the file URL
        const response = await ApexFileReader(fileURL);

        const executionTime = Date.now() - startTime; // Calculate execution time

        // Send the response back to the client
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'File reading processed successfully',
            response: response,
            requestId: requestId,
            timestamp: new Date().toISOString(),
            executionTime: executionTime,
            meta: {
                fileUrl: fileURL,
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
                    fileURL: fileURL
                }
            }
        });
    }
});

export default router;
