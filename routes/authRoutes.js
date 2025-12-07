const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/auth"); // ✅ IMPORT KARO!

// Register & Login (Public)
router.post("/register", register);
router.post("/login/", login);

// ✅ VERIFY TOKEN ENDPOINT (Protected)
router.get('/me', auth, (req, res) => {
    res.json({ 
        success: true, 
        user: req.user 
    });
});

module.exports = router;
