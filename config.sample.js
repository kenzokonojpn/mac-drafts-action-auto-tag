// Configuration Template for Drafts Auto-Tagging Script
// Copy this file and rename to config.js, then fill in your API key

// ========================================
// API Configuration
// ========================================

// Your Anthropic API Key (required)
// Get one from: https://console.anthropic.com/
const API_KEY = "sk-ant-api03-your-api-key-here";

// ========================================
// Processing Configuration
// ========================================

// Maximum number of drafts to process in one run
// Recommended values:
// - For testing: 5-10
// - For regular use: 50-100  
// - For bulk processing: 1000-3000
const MAX_DRAFTS = 100;

// Number of drafts processed per batch
// Higher values = faster processing but more API load
// Recommended: 10 (tested and stable)
const BATCH_SIZE = 10;

// ========================================
// Advanced Settings
// ========================================

// AI Model to use (do not change unless you know what you're doing)
const MODEL = "claude-3-haiku-20240307";

// Maximum tokens for AI response (affects cost)
const MAX_TOKENS = 250;

// API delay between requests (milliseconds)
const API_DELAY = 150;

// Delay between batches (milliseconds) 
const BATCH_DELAY = 800;

// ========================================
// Export Configuration (for modular setup)
// ========================================

// Uncomment if using as a module
// module.exports = {
//     API_KEY,
//     MAX_DRAFTS,
//     BATCH_SIZE,
//     MODEL,
//     MAX_TOKENS,
//     API_DELAY,
//     BATCH_DELAY
// };