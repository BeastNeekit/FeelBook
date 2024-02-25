// VisitorProfile.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/UserProfile.css";
import iconImage from "../images/icon.png";
import Avatar from "../images/Avatar.webp";

const VisitorProfile = () => {
    const { userName } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user-specific posts, uploaded photos, and profile picture when the component mounts
        fetchUserData();
    }, [userName]);

    const fetchUserData = async () => {
        try {
            // Fetch user-specific posts
            const postsResponse = await fetch(`http://localhost:4000/user-posts/${userName}`);
            const postData = await postsResponse.json();
            setUserPosts(postData);

            // Fetch user's uploaded photos
            const photosResponse = await fetch(`http://localhost:4000/user-photos/${userName}`);
            if (photosResponse.ok) {
                const photosData = await photosResponse.json();
                setUploadedPhotos(photosData);
            } else {
                setUploadedPhotos([]);
            }

            // Fetch user's profile picture
            const profilePictureResponse = await fetch(`http://localhost:4000/profile-picture/${userName}`);
            if (profilePictureResponse.ok) {
                const profilePictureData = await profilePictureResponse.blob();
                setProfilePicture(URL.createObjectURL(profilePictureData));
            } else {
                // If profile picture doesn't exist, set default value
                setProfilePicture(Avatar); // Assuming Avatar is the imported image
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleNavigateBack = () => {
        navigate(-1); // Navigate back one step
    };

    return (
        <div className="user-profile">
            <div className="navigation-photo" onClick={handleNavigateBack}>
                <h2>
                    <img src={iconImage} alt="Back" />
                    {userName}
                </h2>
            </div>
            {/* Display the profile picture */}
            {profilePicture && (
                <div className="profile-picture">
                    <img src={profilePicture} alt={`${userName}'s Profile`} />
                </div>
            )}
            <div className="user-posts">
                <div>
                    <h3>POSTS</h3>
                </div>
                <ul>
                    {userPosts.map((post) => (
                        <li key={post._id}>{post.content}</li>
                    ))}
                </ul>
            </div>
            <div className="uploaded-photos">
                <h3>Uploaded Photos</h3>
                <ul>
                    {uploadedPhotos.map((photo) => (
                        <li key={photo.id || photo.url}>
                            <img src={photo.url} alt={`Uploaded by ${userName}`} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VisitorProfile;
