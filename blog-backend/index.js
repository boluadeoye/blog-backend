// v1.1: Forcing redeploy with correct ENV variables
// Blog Backend v1.0
// Using cors and modern serverless setup

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
// 1. Enable CORS for all requests
app.use(cors());
// 2. Enable JSON body parsing
app.use(express.json());

// --- Database Pool ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// --- Health Check Route ---
// This route confirms the server is live and can connect to the DB.
app.get('/api/health', async (req, res) => {
  try {
    const time = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'success',
      message: 'Blog backend is healthy',
      database_time: time.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error!', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// --- TODO: Add API routes for posts, admin, etc. ---

// --- Vercel Serverless Export ---
// This is the *only* export Vercel needs.
module.exports = app;