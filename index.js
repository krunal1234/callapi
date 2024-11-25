const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Serve Swagger JSON
app.use('/swagger.json', express.static(path.join(__dirname, 'public', 'swagger.json')));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./public/swagger.json')));

// API routes for local testing
app.use('/api/getUser', require('./api/getUser'));
app.use('/api/chat', require('./api/chat'));
app.use('/api/imageAnalyser', require('./api/imageAnalyser'));
app.use('/api/FileReader', require('./api/FileReader'));
app.use('/api/SpeechToText', require('./api/SpeechToText'));
app.use('/api/ImageReader', require('./api/ImageReader'));
app.use('/api/TextToSpeech', require('./api/TextToSpeech'));
app.use('/api/BackgroundRemover', require('./api/BackgroundRemover'));

// Root route
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
});