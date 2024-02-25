import React, { useState } from "react";
import HomePage from "./HomePage";
import "./css/LogNregister.css";


export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);



    async function login(e) {
        e.preventDefault();

        // Basic form validation
        if (!userName && !password) {
            setErrorMessage("Please enter both username and password");
            return;
        } else if (!userName) {
            setErrorMessage("Please enter a username");
            return;
        } else if (!password) {
            setErrorMessage("Please enter a password");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                if (response.status === 401) {
                    // Unauthorized (username not found or incorrect password)
                    setErrorMessage("Username not found or incorrect password");
                } else {
                    throw new Error(errorData.message);
                }
            } else {
                // Login successful, clear any previous error messages and set success message
                setErrorMessage("");
                setSuccessMessage("Login successful!");

                // Set the success state to true
                setIsLoginSuccess(true);


            }
        } catch (error) {
            // Handle other errors
            setErrorMessage(error.message);
            setSuccessMessage("");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>

            {!isLoginSuccess ? (
                <div className="login-container">
                <form className="LogIn" onSubmit={login}>
                    <div className="logo-container">
                        <img src="logo.png" alt="Logo" className="logo" />
                    </div>
                    <h1>Login</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    <p className="register-link">
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
                </div>
            ) : (
                <HomePage userName={userName} />
            )}

        </div>
    );
}
