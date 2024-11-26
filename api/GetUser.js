import express from 'express'
const router = express.Router();
// Middleware to parse JSON bodies
router.use(express.json());

// Define the POST route to handle requests
router.post('/', async (req, res) => {
    const { user_id } = req.body;

    // Check if required fields are present
    if (!user_id) {
        return res.status(400).json({
            "error": "Missing required fields: question or user_id"
        });
    }

    // Dummy response for now
    res.status(200).json({
        "message": "User information fetched successfully",
        "user_id": user_id,
    });
});

export default router;
