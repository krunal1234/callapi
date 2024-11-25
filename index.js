const express = require('express');
const app = express();

// Start server in cluster mode
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
