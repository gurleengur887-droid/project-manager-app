const { io } = require("socket.io-client");

const socket = io("https://project-manager-app-ka5u.onrender.com", {
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