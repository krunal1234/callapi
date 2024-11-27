import express from 'express';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath utility
import fs from 'fs'; // Import fs module to read the Swagger file
import GetUser from './api/GetUser.js';
import Chat from './api/Chat.js';
import ImageAnalyzer from './api/ImageAnalyzer.js';
import FileReader from './api/FileReader.js';
import SpeechToText from './api/SpeechToText.js';
import ImageReader from './api/ImageReader.js';
import TextToSpeech from './api/TextToSpeech.js';
import BackgroundRemover from './api/BackgroundRemover.js';
import cluster from 'cluster';
import os from 'os';
import cors from 'cors';
import { createClient } from './api/supabase/client.js';

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Get the directory name
const wasmPath = path.resolve(__dirname, 'node_modules/tesseract.js-core/tesseract-core-simd.wasm');
const totalCPUs = os.cpus().length;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
const wasmPath = path.resolve(__dirname, 'node_modules/tesseract.js-core/tesseract-core-simd.wasm');

// Serve the swagger.json file statically
app.use('/swagger.json', express.static(path.join(__dirname, '/public/swagger.json')));

// Read the swagger.json file using fs
const swaggerJsonPath = path.join(__dirname, '/public/swagger.json');
let swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, 'utf8')); // Synchronously read and parse JSON

// Set up Swagger UI with the loaded Swagger document
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function increaseValueByOne(userId) {
    // Call the increment function via RPC
    const supabase = createClient();

    const { data, error } = await supabase
        .rpc('increment_api_call_count', { p_user_id: userId });  // Pass user_id as p_user_id to the RPC function

    if (error) {
        console.error("Error updating apiCallCount:", error);
    } else {
        console.log("apiCallCount incremented successfully:", data); // The response might be null, but the increment happens on the server
    }
}

async function verifyApiKey(req, res, next) {
    const supabase = createClient();
    
    const apiKey = req.headers['api-key']; // Look for 'api-key' in the request headers

    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required' });
    }
    
    // Query Supabase for the API key
    const { data, error } = await supabase
        .from('api_keys')
        .select('api_key, user_id')
        .eq('api_key', apiKey)  // Compare with the provided apiKey
        .single(); // Single because api_key should be unique

    if (error || !data) {
        console.error('Error fetching API key from Supabase:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }else{
        increaseValueByOne(data.user_id);
    }

    // Attach the user_id from the api_key to the request for further use if needed
    req.userId = data.user_id;
    next(); // Continue to the next middleware
}

// API routes
app.use('/api', verifyApiKey);
app.use('/api/GetUser', GetUser);
app.use('/api/Chat', Chat);
app.use('/api/ImageAnalyzer', ImageAnalyzer);
app.use('/api/FileReader', FileReader);
app.use('/api/SpeechToText', SpeechToText);
app.use('/api/ImageReader', ImageReader);
app.use('/api/TextToSpeech', TextToSpeech);
app.use('/api/BackgroundRemover', BackgroundRemover);

// Root route (Fixes "Cannot GET /" error)
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Cluster setup for multi-core usage
if (cluster.isPrimary) {
    // Master process - only listen for connections
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
    // Worker processes
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} with PID: ${process.pid}`);
    });
}

export default app;
