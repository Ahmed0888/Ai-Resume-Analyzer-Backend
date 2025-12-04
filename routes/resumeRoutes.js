const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const auth = require("../middleware/auth");
const { analyzeAndSave, getResumesForUser } = require("../controllers/resumeController");

router.post("/analyze", auth, analyzeAndSave);
router.get("/", auth, getResumesForUser);

module.exports = router;
