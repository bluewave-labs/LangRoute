const crypto = require('crypto');

const key = crypto.randomBytes(32); // Generate 32 *bytes* - keep as Buffer
const iv = crypto.randomBytes(16);  // Generate 16 *bytes* - keep as Buffer
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // Pass Buffers directly

console.log("Cipher created successfully.");

