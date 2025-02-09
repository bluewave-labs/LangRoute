// rateLimiter.js
const db = require('./database');

const userRequests = {}; // In-memory store for request counts
const userTokens = {};   //In-memory store for token counts.

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

async function updateRequestCount(user) {
    const userId = user.id;
    if (userRequests[userId]) { //Although it's checked previously, it's good to check it again.
        userRequests[userId].count++;
    }
}

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

async function updateTokenCount(user, tokens) {
  const userId = user.id;
  if(userTokens[userId]) { // Double check for safety
    userTokens[userId].count += tokens;
  }
}
async function updateUserCost(user, cost) {
    user.totalCost += cost;
    await user.save();
}


module.exports = { checkRateLimit, updateRequestCount, checkTokenLimit, updateTokenCount, updateUserCost };
