const express = require('express');
const db = require('../db');

const router = express.Router();

// POST /api/email/send - Sends email + saves contact submission
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    console.log('--- Email Request ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log('---------------------');

    // Extract contact info from body and save as submission
    const entity = db.getEntity('contact_submissions');
    const name = (body.match(/Name: (.+)/)?.[1] || 'Unknown').trim();
    const doc = await entity.create({
      name,
      company: (body.match(/Company: (.+)/)?.[1] || '').trim(),
      email: (body.match(/Email: (.+)/)?.[1] || '').trim(),
      phone: (body.match(/Phone: (.+)/)?.[1] || '').trim(),
      country: (body.match(/Country: (.+)/)?.[1] || '').trim(),
      industry: (body.match(/Industry: (.+)/)?.[1] || '').trim(),
      employees_needed: (body.match(/Employees Needed: (.+)/)?.[1] || '').trim(),
      start_date: (body.match(/Preferred Start Date: (.+)/)?.[1] || '').trim(),
      message: (body.match(/Message: (.+)/)?.[1] || '').trim(),
      status: 'new',
    });

    // Include file URL if present
    const attachmentMatch = body.match(/Attachment: (.+)/);
    if (attachmentMatch) {
      doc.file_url = attachmentMatch[1].trim();
    }

    res.json({ success: true, id: doc.id });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
