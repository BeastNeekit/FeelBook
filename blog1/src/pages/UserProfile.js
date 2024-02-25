import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/UserProfile.css";
import iconImage from "../images/icon.png";
import Avatar from "../images/Avatar.webp";
const UserProfile = () => {
    const { userName } = useParams();
    const [userPosts, setUserPosts] = useState([]);
    const [photos, setPhotos] = useState(null);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();
    const [selectedProfileFileName, setSelectedProfileFileName] = useState("");
    const [selectedPhotosFileName, setSelectedPhotosFileName] = useState("");

    useEffect(() => {

        fetchUserData();
    }, [userName]);

    const fetchUserData = async () => {
        try {

            const postsResponse = await fetch(`http://localhost:4000/user-posts/${userName}`);
            const postData = await postsResponse.json();
            setUserPosts(postData);


            const photosResponse = await fetch(`http://localhost:4000/user-photos/${userName}`);
            if (photosResponse.ok) {
                const photosData = await photosResponse.json();
                setUploadedPhotos(photosData);
            } else {
                setUploadedPhotos([]);
            }


            const profilePictureResponse = await fetch(`http://localhost:4000/profile-picture/${userName}`);
            if (profilePictureResponse.ok) {
                const profilePictureData = await profilePictureResponse.blob();
                setProfilePicture(URL.createObjectURL(profilePictureData));
            } else {
                // If profile picture doesn't exist, set default value
                setProfilePicture(Avatar);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:4000/user-posts/${postId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }


            fetchUserData();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handlePhotoUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("photos", photos);


            const response = await fetch(`http://localhost:4000/upload-photo/${userName}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {

                throw new Error("Failed to upload photos");
            }



            fetchUserData();
        } catch (error) {
            console.error("Error uploading photos:", error);
        }
    };
    const handleProfilePictureUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("profilePicture", profilePicture);

            const response = await fetch(`http://localhost:4000/upload-profile-picture/${userName}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload profile picture");
            }


            fetchUserData();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setSelectedProfileFileName(file ? file.name : "");
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setSelectedProfileFileName(file ? file.name : "");
    };
    const handlePhotosChange = (e) => {
        const file = e.target.files[0];
        setPhotos(file);
        setSelectedPhotosFileName(file ? file.name : "");
    };

    return (
        <div className="user-profile">
            <div className="navigation-photo" onClick={() => navigate(-1)}>
                <h2> <img src={iconImage} alt="Back" />{userName}</h2>
            </div>
            {profilePicture && (
                <div className="profile-picture">
                    <img src={profilePicture} alt={`${userName}'s Profile`} />
                </div>
            )}
            <div className="profile-picture-upload">
                <h3>Upload Profile Picture</h3>
                <label htmlFor="file-upload" className="custom-file-input">
                    Choose File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button onClick={handleProfilePictureUpload}>Upload Profile Picture</button>
            </div>

            <div className="user-posts">
                <div>
                    <h3>POSTS</h3>
                </div>
                <ul>
                    {userPosts.map((post) => (
                        <li key={post._id}>
                            {post.content}
                            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="photo-upload">
                <h3>Upload Photos</h3>
                <label htmlFor="photos-upload" className="custom-file-input">
                    Choose File
                </label>
                <span className="file-name">{selectedPhotosFileName}</span>
                <input
                    id="photos-upload"
                    className="upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotosChange}
                />
                <button onClick={handlePhotoUpload}>Upload</button>
            </div>

            <div className="uploaded-photos">
                <h3>Uploaded Photos</h3>
                <ul>
                    {uploadedPhotos.map((photo) => (
                        <li key={photo.id || photo.url}>
                            <img
                                src={photo.url}
                                alt={`Uploaded by ${userName}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>




        </div>
    );
};

export default UserProfile;
