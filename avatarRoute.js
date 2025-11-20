

const router = require('express').Router(); // ✅ correct

const avatarController = require("../controllers/avatarController");

// Add a new avatar
router.post("/", avatarController.avatarController);

// Get all avatars
router.get("/all", avatarController.getAllAvatars);

// Optional: Seed default avatars (uncomment if needed)
// router.post("/seed", avatarController.seedAvatars);

module.exports = router;
