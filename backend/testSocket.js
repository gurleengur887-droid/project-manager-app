const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "" // ❌ empty → should FAIL
  }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌ Error:", err.message);
});