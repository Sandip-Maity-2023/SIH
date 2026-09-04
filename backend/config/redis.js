const { createClient } = require('redis');

// Prefer environment variables, fallback to specified Redis cloud credentials
const client = createClient({
  username: process.env.REDIS_USER || 'default',
  password: process.env.REDIS_PASSWORD || process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST || 'cornsilk-xerophytic-inimitable-69348.db.redis.io',
    port: Number(process.env.REDIS_PORT) || 10080,
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

// Event Listeners
client.on('connect', () => {
  console.log('🔴 Redis client connected successfully');
});

client.on('error', (err) => {
  console.error('🔴 Redis Client Error:', err.message);
});

// Self-executing async connection initializer
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('🔴 Failed to connect to Redis:', err.message);
  }
})();

module.exports = client;