require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

//  JSON ERROR HANDLER (FIRST!)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON" });
  }
  next(err);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 } }));

//  Static Files
app.use(express.static(path.join(__dirname, "../public")));

// Database
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  connectDB(MONGO_URI).catch((err) =>
    console.error("DB connection failed", err)
  );
}

//  ROUTES (NO DUPLICATES!)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/jobs", require("./routes/jobs")); // ✅ SINGLE FILE

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () =>
//   console.log(`Server running on port http://localhost:${PORT}`)
// );

//  IMPORTANT: Express app export karo
// vercel ya kisi aur serverless platform ke liye
module.exports = app;
