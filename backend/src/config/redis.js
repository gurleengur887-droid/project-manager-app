const { createClient } = require("redis");

let redisClient;

try {
  redisClient = createClient();

  redisClient.on("error", (err) => {
    console.log("Redis not connected");
  });

  redisClient.connect().catch(() => {
    console.log("Redis connection failed");
  });
} catch (err) {
  console.log("Redis disabled");
}

module.exports = redisClient;