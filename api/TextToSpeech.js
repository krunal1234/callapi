import { ApexFileReader } from 'apexify.js';
import express from 'express';
const router = express.Router();
router.use(express.json());
// Define the POST route to handle requests
router.get('/', async (req, res) => {
    const textFile = "https://example-files.online-convert.com/document/txt/example.txt"; // Replace with the URL of your PDF
    const file = await ApexFileReader(textFile,"text");
    var f = new File([textFile], file, {type: "text/plain"});
    try {
        const message = {
            content: 'Hello, this is a test message.',
            author: {
              bot: false, // Indicate this is not a bot message
            },
            guild: { id: '1234567890' }, // Your guild id
            reply: function (text) {
              console.log("Replying with text:", text); // Mock reply method for testing
            },
            attachments: new Map(), // Create a new Collection for attachments
          };
          // Call aiVoice with the mocked message
          var response = await aiVoice(message);
          
        // Return the generated response in JSON
        res.status(200).json({
            message: "Data Successfully Processed",
            response: response,  // Response from the AI processing, could be a link to the audio
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "An error occurred while processing your request.",
            error: error.message,
        });
    }
});

export default router;
