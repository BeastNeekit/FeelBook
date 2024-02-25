import React, { useState } from "react";
import "./pages/css/Post.css";

export default function Post({ role, name, description, email }) {
    const [showDetails, setShowDetails] = useState(false);

    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const handleEmailClick = (emailAddress) => {
        window.location.href = `mailto:${emailAddress}`;
    };

    return (
        <div className="post">
            <div className="image" onClick={handleToggleDetails}>
                {role === "Manager" && <img src="Neekit.jpg" alt={name} className="avatar" />}
                {role === "Programmer" && <img src="susmita.jpg" alt={name} className="avatar" />}
                {role === "Analyzer" && <img src="samikshya.JPG" alt={name} className="avatar" />}
                {role === "Graphic-designer" && <img src="santa.jpeg" alt={name} className="avatar" />}
                {role === "Tester" && <img src="karki.jpeg" alt={name} className="avatar" />}
            </div>
            <div className="content">
                <h2 className="title">{name}</h2>
                <p className="description">{description}</p>
            </div>
            {showDetails && (
                <div className="details-content">
                    <h3>Details</h3>
                    <p><strong>Role:</strong> {role}</p>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> <a href={`mailto:${email}`} onClick={() => handleEmailClick(email)}>{email}</a></p>
                </div>
            )}
        </div>
    );
}
