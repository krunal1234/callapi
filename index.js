const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const getUser = require('./api/getUser.js');
const chat = require('./api/chat.js');
const imageAnalyser = require('./api/imageAnalyser.js');
const FileReader = require('./api/FileReader.js');
const SpeechToText = require('./api/SpeechToText.js');
const ImageReader = require('./api/ImageReader.js');
const TextToSpeech = require('./api/TextToSpeech.js');
const BackgroundRemover = require('./api/BackgroundRemover.js');
const cluster = require('cluster');
const os = require('os');
const swaggerUICss = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const totalCPUs = os.cpus().length;

// Serve the swagger.json file statically
app.use('/swagger.json', express.static(path.join(__dirname, 'swagger.json')));

// Set up Swagger UI
const swaggerDocument = require('./public/swagger.json');
const { redirect } = require('express/lib/response.js');
app.use('/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
        customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
        customCssUrl: swaggerUICss
    }))

const API_KEY = 'test';
function verifyApiKey(req, res, next) {
    const apiKey = req.headers['api-key']; // Look for 'api-key' in the request headers

    if (apiKey && apiKey === API_KEY) {
        return next(); // If the key matches, allow the request to continue
    }

    // If the API key is missing or incorrect, respond with an error
    res.status(403).json({ message: 'Forbidden: Invalid API Key' });
}

app.use('/api', verifyApiKey);

app.use('/api/getUser', getUser);
app.use('/api/chat', chat);
app.use('/api/imageAnalyser', imageAnalyser);
app.use('/api/FileReader', FileReader);
app.use('/api/SpeechToText', SpeechToText);
app.use('/api/ImageReader', ImageReader);
app.use('/api/TextToSpeech', TextToSpeech);
app.use('/api/BackgroundRemover', BackgroundRemover);

// Root route (Fixes "Cannot GET /" error)
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

if (cluster.isPrimary) {
    const workerPIDs = [];
    for (let i = 0; i < totalCPUs; i++) {
        const worker = cluster.fork();
        workerPIDs.push(worker.process.pid);
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
    console.log('Worker PIDs:', workerPIDs);
} else {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} with PID: ${process.pid}`);
    });
}

// Export the app for testing or other purposes
export default app;
