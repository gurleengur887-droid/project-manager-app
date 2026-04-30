import { useState } from "react";
import axios from "axios";

function Register({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
     await axios.post("https://project-manager-app-ka5u.onrender.com/api/auth/register", {
  name: email.split("@")[0],  
  email,
  password,
});

      alert("Account created! Now login.");
      switchToLogin();
    } catch (err) {
  console.log("ERROR:", err.response?.data || err.message);
  alert("Failed");
}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign Up</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleRegister}>
          Create Account
        </button>

        <p
          onClick={switchToLogin}
          style={styles.switchText}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },
  heading: {
    color: "white",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  switchText: {
    marginTop: "12px",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Register;