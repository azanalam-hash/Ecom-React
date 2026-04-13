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

// File validation filters
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profileImage') {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      return cb(new Error('Profile image must be a JPG, JPEG, or PNG file.'));
    }
  } else if (file.fieldname === 'documents') {
    if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
      return cb(new Error('Documents must be PDF or DOC/DOCX files.'));
    }
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for any file
  }
});

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

    // --- MANUAL VALIDATIONS ---
    const errors = [];
    if (!formData.fullName || formData.fullName.trim() === '') {
      errors.push('Full name is required.');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('A valid email address is required.');
    }

    if (formData.salary) {
      const salaryNum = parseFloat(formData.salary);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        errors.push('Salary must be a positive number.');
      }
    }

    if (formData.taxPercentage) {
      const taxNum = parseFloat(formData.taxPercentage);
      if (isNaN(taxNum) || taxNum < 0 || taxNum > 100) {
        errors.push('Tax percentage must be between 0 and 100.');
      }
    }

    if (errors.length > 0) {
      // Return 400 Bad Request immediately if validation fails
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    // --------------------------

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
