import React, { useState } from "react";
import "./css/LogNregister.css";
export default function Register() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function register(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        body: JSON.stringify({ userName, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }


      setErrorMessage("");
      setSuccessMessage("Registration successful!");
    } catch (error) {
      // Handle errors and set the error message for duplicate usernames
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  }

  return (
      <>
        <div className="login-container">
        <form className="register" onSubmit={register}>
          <div className="logo-container">
            <img src="logo.png" alt="Logo" className="logo" />
          </div>
          <h1>Register</h1>
          <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
          />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
          <p>Already have an account? <a href="/login">Login Now.</a></p>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </form>
        </div>
      </>
  );
}
