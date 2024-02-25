import { Link } from "react-router-dom";
import "./pages/css/Header.css";
import React from "react";


export default function Header() {
    return (
        <header className="header-container">
            <nav>
                <Link to="/login" className="nav-link">
                    Login
                </Link>
                <Link to="/register" className="nav-link">
                    Register
                </Link>
            </nav>
        </header>
    );
}
