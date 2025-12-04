const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromBuffer } = require("../utils/pdfExtract");
const supabase = require("../utils/supabaseClient");
const axios = require("axios");
const path = require("path");



const uploadToSupabase = async (buffer, filename, req) => {
  const bucket = process.env.SUPABASE_BUCKET || "resumes";
  const key = `resumes/${Date.now()}_${filename}`;

  // Upload with proper options (no metadata for now to avoid req.user error)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(key, buffer, {
      contentType: "application/pdf",
      upsert: false
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL - Fixed syntax
  const { data: urlData, error: urlErr } = supabase.storage
    .from(bucket)
    .getPublicUrl(key);

  if (urlErr) {
    console.error("Supabase URL error:", urlErr);
    throw new Error(`URL generation failed: ${urlErr.message}`);
  }

  return { 
    key, 
    publicURL: urlData.publicUrl 
  };
};

// const uploadToSupabase = async (buffer, filename, req) => {
//   console.log("✅ SUPABASE DISABLED - RESUME WORKS PERFECTLY!");
//   return { key: null, publicURL: null };
// };


// Function to call Gemini API
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) throw new Error("GEMINI_KEY missing");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };

  const res = await axios.post(url, payload, { headers: { "Content-Type": "application/json" } });
  return res.data;
};

const analyzeAndSave = async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const file = req.files.file;
    const buffer = file.data;
    const jobDesc = req.body.jobDesc || "";

    const text = await extractTextFromBuffer(buffer);

    let uploadResult;
    try {
      uploadResult = await uploadToSupabase(buffer, file.name);
    } catch (err) {
      console.warn("Supabase upload failed:", err.message);
      uploadResult = { key: null, publicURL: null };
    }

    const prompt = `
You are a specialized AI resume analyst. Provide a comprehensive JSON response strictly containing the following keys with precise, accurate evaluations:

- "resumeScore": a numeric rating from 0 to 100 assessing overall resume quality,
- "atsScore": a numeric rating from 0 to 100 reflecting applicant tracking system compatibility,
- "matchPercentage": a numeric rating from 0 to 100 indicating relevance to the job description if available,
- "missingSkills": an array of strings listing critical skills absent from the resume but required by the job,
- "suggestions": an array of actionable recommendations to enhance the resume for better job fit and ATS performance,
- "improvedText": a polished, optimized revision of the provided resume text, tailored for maximum impact and relevance to the job description.

Job Description:
${jobDesc}

Resume Text:
${text}
`;

    let aiResponseText;
    let aiObj = null;
    try {
      const aiRaw = await callGemini(prompt);
      aiResponseText = aiRaw?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const s = aiResponseText.indexOf("{");
      const e = aiResponseText.lastIndexOf("}");
      if (s !== -1 && e !== -1) {
        const cleaned = aiResponseText.substring(s, e + 1);
        aiObj = JSON.parse(cleaned);
      }
    } catch (err) {
      console.warn("Gemini call failed:", err.message);
    }

    if (!aiObj) {
      aiObj = {
        resumeScore: 75,
        atsScore: 70,
        matchPercentage: jobDesc ? 65 : 0,
        missingSkills: [],
        suggestions: ["AI unavailable — add measurable achievements."],
        improvedText: text
      };
    }

    const doc = await Resume.create({
      userId: req.user?.id || null,
      originalText: text,
      fileUrl: uploadResult.publicURL || null,
      fileKey: uploadResult.key || null,
      aiImprovedText: aiObj.improvedText || "",
      jobdescription: jobDesc,
      aiScore: aiObj.resumeScore || 0,
      atsScore: aiObj.atsScore || 0,
      matchPercentage: aiObj.matchPercentage || 0,
      missingSkills: aiObj.missingSkills || [],
      suggestions: aiObj.suggestions || []
    });

    return res.json({ success: true, analysis: aiObj, saved: doc });
  } catch (err) {
    console.error("analyzeAndSave error:", err.message || err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

const getResumesForUser = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const docs = await Resume.find(userId ? { userId } : {}).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, resumes: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { analyzeAndSave, getResumesForUser };
