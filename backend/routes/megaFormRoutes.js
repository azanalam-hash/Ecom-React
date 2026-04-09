const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * POST /api/mega-form
 * Accept multi-part form data
 * fields: text fields
 * files: profileImage (1), documents (multiple)
 */
const cpUpload = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]);

router.post('/', cpUpload, async (req, res) => {
  try {
    const database = db.getDb();
    const megaFormsCollection = database.collection('megaForms');

    const formData = req.body;

    // Parse array/json strings if they were stringified from FormData
    if (formData.hobbies) {
        try { formData.hobbies = JSON.parse(formData.hobbies); } catch(e) {}
    }
    if (formData.skills) {
        try { formData.skills = JSON.parse(formData.skills); } catch(e) {}
    }

    const payload = {
      ...formData,
      createdAt: new Date(),
    };

    // Store file paths
    if (req.files) {
      if (req.files['profileImage'] && req.files['profileImage'].length > 0) {
        payload.profileImage = `/uploads/${req.files['profileImage'][0].filename}`;
      }
      
      if (req.files['documents']) {
        payload.documents = req.files['documents'].map(file => `/uploads/${file.filename}`);
      }
    }

    const result = await megaFormsCollection.insertOne(payload);
    res.status(201).json({ message: "Form submitted successfully!", id: result.insertedId });

  } catch (error) {
    console.error("MegaForm upload error:", error);
    res.status(500).json({ message: "Server error during submission.", error: error.message });
  }
});

module.exports = router;
