/**
 * Portfolio Backend — single-file version
 * Node.js + Express + MongoDB (Mongoose) + Nodemailer
 *
 * Setup:
 *   1. npm install express cors dotenv mongoose express-rate-limit nodemailer
 *   2. Create a .env file (see variables used below via process.env)
 *   3. node server.js
 *
 * .env variables:
 *   PORT=5000
 *   CLIENT_ORIGIN=http://localhost:3000
 *   MONGODB_URI=mongodb://127.0.0.1:27017/portfolio
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465
 *   SMTP_SECURE=true
 *   SMTP_USER=jangilisandhya11@gmail.com
 *   SMTP_PASS=your-app-password
 *   NOTIFY_EMAIL=jangilisandhya11@gmail.com
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   1. MongoDB Model — Contact Message
   ========================================================= */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: 10,
      maxlength: 5000
    },
    ipAddress: { type: String, default: null },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

/* =========================================================
   2. Middleware
   ========================================================= */
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

// Rate limit the contact form to prevent spam/abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/contact', contactLimiter);

/* =========================================================
   3. Email transporter (lazy init)
   ========================================================= */
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // email not configured — skip sending, still save to DB
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* =========================================================
   4. Routes
   ========================================================= */
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// POST /api/contact — receive a contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are all required.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Message should be at least 10 characters long.' });
    }

    // Save to MongoDB
    const saved = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ipAddress: req.ip
    });

    // Try to send an email notification (non-blocking failure)
    const mailer = getTransporter();
    if (mailer) {
      const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

      mailer
        .sendMail({
          from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
          to: notifyEmail,
          replyTo: saved.email,
          subject: `New portfolio message from ${saved.name}`,
          text: `Name: ${saved.name}\nEmail: ${saved.email}\n\nMessage:\n${saved.message}`,
          html: `
            <h2>New Contact Form Message</h2>
            <p><strong>Name:</strong> ${escapeHtml(saved.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(saved.email)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(saved.message).replace(/\n/g, '<br>')}</p>
          `
        })
        .catch((err) => console.error('Email notification failed:', err.message));
    }

    return res.status(201).json({
      success: true,
      message: 'Thanks for reaching out! Your message has been received.'
    });
  } catch (err) {
    console.error('Contact form error:', err);

    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid input.';
      return res.status(400).json({ error: firstError });
    }

    return res.status(500).json({ error: 'Something went wrong on our end. Please try again later.' });
  }
});

// GET /api/contact — list saved messages (basic admin view; add auth before production)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    return res.json({ count: messages.length, messages });
  } catch (err) {
    console.error('Fetch messages error:', err);
    return res.status(500).json({ error: 'Could not fetch messages.' });
  }
});

/* =========================================================
   5. 404 + error handling
   ========================================================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/* =========================================================
   6. Connect to MongoDB, then start server
   ========================================================= */
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB not connected)`));
  });