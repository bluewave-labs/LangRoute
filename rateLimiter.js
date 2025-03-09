/**
 * @fileoverview Rate limiter module for LangRoute.
 * 
 * This module provides rate limiting functionality for both API requests and token usage.
 * It uses an in-memory store to track usage within a sliding window of one minute,
 * with configurable limits per user.
 * 
 * Features:
 * - Per-user request rate limiting
 * - Per-user token usage limiting
 * - Sliding window implementation
 * - Automatic counter reset after window expiration
 * - Database-backed user limits
 * 
 * @module rateLimiter
 * @requires ./database
 */

const db = require('./database');

/** @type {Object.<number, {count: number, lastReset: number}>} In-memory store for request counts */
const userRequests = {};

/** @type {Object.<number, {count: number, lastReset: number}>} In-memory store for token counts */
const userTokens = {};

/**
 * Checks if a user has exceeded their request rate limit.
 * @param {object} user - The user object containing rate limit information.
 * @returns {boolean} True if the rate limit is not exceeded, false otherwise.
 */
/**
 * Checks if a user has exceeded their request rate limit.
 * Uses a sliding window of one minute to track request counts.
 * 
 * @async
 * @param {Object} user - The user object from the database
 * @param {number} user.id - User's unique identifier
 * @param {number} user.requestsPerMinute - Maximum requests allowed per minute
 * @returns {Promise<boolean>} True if the rate limit is not exceeded, false otherwise
 */
async function checkRateLimit(user) {
    const now = Date.now();
    const minute = 60 * 1000;
    const userId = user.id;

    if (!userRequests[userId]) {
        userRequests[userId] = { count: 0, lastReset: now };
        userTokens[userId] = { count: 0, lastReset: now };
    }

    // Reset counts if a minute has passed
    if (now - userRequests[userId].lastReset > minute) {
      userRequests[userId] = { count: 0, lastReset: now };
      userTokens[userId] = { count: 0, lastReset: now};

    }
    if (userRequests[userId].count >= user.requestsPerMinute) {
        return false; // Rate limit exceeded (requests)
    }

    return true; // Rate limit not exceeded
}

/**
 * Updates the request count for a user.
 * @param {object} user - The user object to update.
 */
/**
 * Updates the request count for a user in the in-memory store.
 * Should be called after a successful request validation.
 * 
 * @async
 * @param {Object} user - The user object from the database
 * @param {number} user.id - User's unique identifier
 */
async function updateRequestCount(user) {
    const userId = user.id;
    if (userRequests[userId]) { //Although it's checked previously, it's good to check it again.
        userRequests[userId].count++;
    }
}

/**
 * Checks if a user has exceeded their token rate limit.
 * @param {object} user - The user object containing rate limit information.
 * @param {number} tokens - The number of tokens to check against the limit.
 * @returns {boolean} True if the token limit is not exceeded, false otherwise.
 */
/**
 * Checks if a user has exceeded their token usage limit.
 * Uses a sliding window of one minute to track token counts.
 * 
 * @async
 * @param {Object} user - The user object from the database
 * @param {number} user.id - User's unique identifier
 * @param {number} user.tokensPerMinute - Maximum tokens allowed per minute
 * @param {number} tokens - Number of tokens in the current request
 * @returns {Promise<boolean>} True if the token limit is not exceeded, false otherwise
 */
async function checkTokenLimit(user, tokens) {
  const now = Date.now();
  const minute = 60 * 1000;
  const userId = user.id;
  if(!userTokens[userId]) {
    userTokens[userId] = { count: 0, lastReset: now };
  }

    // Reset counts if a minute has passed
    if (now - userTokens[userId].lastReset > minute) {
      userTokens[userId] = { count: 0, lastReset: now};
    }

  if (userTokens[userId].count + tokens >= user.tokensPerMinute) {
    return false; // Rate limit exceeded (tokens)
  }
  return true;
}

/**
 * Updates the token count for a user.
 * @param {object} user - The user object to update.
 * @param {number} tokens - The number of tokens to add to the user's count.
 */
/**
 * Updates the token count for a user in the in-memory store.
 * Should be called after a successful token limit validation.
 * 
 * @async
 * @param {Object} user - The user object from the database
 * @param {number} user.id - User's unique identifier
 * @param {number} tokens - Number of tokens to add to the user's count
 */
async function updateTokenCount(user, tokens) {
  const userId = user.id;
  if(userTokens[userId]) { // Double check for safety
    userTokens[userId].count += tokens;
  }
}

/**
 * Updates the total cost for a user.
 * @param {object} user - The user object to update.
 * @param {number} cost - The cost to add to the user's total cost.
 */
/**
 * Updates the total accumulated cost for a user in the database.
 * This is a persistent update that maintains the user's spending history.
 * 
 * @async
 * @param {Object} user - The user object from the database
 * @param {number} user.totalCost - User's current total cost
 * @param {number} cost - Additional cost to add to the user's total
 * @returns {Promise<void>}
 */
async function updateUserCost(user, cost) {
    user.totalCost += cost;
    await user.save();
}


module.exports = { checkRateLimit, updateRequestCount, checkTokenLimit, updateTokenCount, updateUserCost };
