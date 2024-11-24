const { ApexPainter } = require('apexify.js');
const express = require('express');
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.get('/', async (req, res) => {
    const { CUSTOMER_API_KEY } = req.body;
    const painter = new ApexPainter();
    const response = await painter.removeBackground("https://www.befunky.com/images/prismic/82e0e255-17f9-41e0-85f1-210163b0ea34_hero-blur-image-3.jpg?auto=avif,webp&format=jpg&width=896",CUSTOMER_API_KEY);
    // Dummy response for now
    res.status(200).json({
        "message": "Data Successfull",
        "user_id": response,
    });
});

module.exports = router;
