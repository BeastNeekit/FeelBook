import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import feelBook from "../images/icon.png";
import Avatar from "../images/Avatar.webp";
import PostItem from "./PostItem";
import "./css/homepage.css";


export default function HomePage({ userName }) {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [userProfilePicture, setUserProfilePicture] = useState(null);

    useEffect(() => {
        fetchPosts();
        fetchUserProfilePicture();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };
    const handlePostSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newPost, userName }),
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            fetchPosts();

            setNewPost("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:4000/posts");
            const data = await response.json();

           
            const postsWithProfilePictures = await Promise.all(
                data.map(async (post) => {
                    const profilePictureResponse = await fetch(`http://localhost:4000/profile-picture/${post.userName}`);
                    if (profilePictureResponse.ok) {
                        const profilePictureData = await profilePictureResponse.blob();
                        post.profilePicture = URL.createObjectURL(profilePictureData);
                    } else {
                        post.profilePicture = Avatar;
                    }
                    return post;
                })
            );

            setPosts(postsWithProfilePictures);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchUserProfilePicture = async () => {
        try {
            const profilePictureResponse = await fetch(`http://localhost:4000/profile-picture/${userName}`);
            if (profilePictureResponse.ok) {
                const profilePictureData = await profilePictureResponse.blob();
                setUserProfilePicture(URL.createObjectURL(profilePictureData));
            } else {
                setUserProfilePicture(Avatar);
            }
        } catch (error) {
            console.error("Error fetching user profile picture:", error);
        }
    };

    const filteredPosts = posts.filter((post) => {
        const lowerCaseUserName = post.userName?.toLowerCase(); // Use optional chaining to handle potential undefined
        return lowerCaseUserName && lowerCaseUserName.includes(searchUser.toLowerCase());
    });

    const handleVisitProfile = (authorUserName) => {
        console.log(`Visit profile of: ${authorUserName}`);
    };


    return (
        <div className="homepage">
            <div className="header">
                <p className="T1">
                    <img src={feelBook} alt="FeelBook Logo" className="feelBook-logo" />
                    FeelBook
                </p>
            </div>
            <div className="welcome-message">
                <p>
                    Welcome,{" "}
                    <Link to={`/login/profile/${userName}`}>
                        {userProfilePicture && <img src={userProfilePicture} alt="Profile" className="user-profile-picture" />}
                        <span className="user-name">{userName}</span>

                    </Link>
                </p>
            </div>

            <a href="/">
                <button>Logout</button>
            </a>
            <div className="news-feed">
                <h2>NewsFeed</h2>
                <div className="post-form">
                    <form onSubmit={handlePostSubmit}>
                        <input
                            placeholder="What's on your mind?"
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
                <div className="search-user">
                    <input
                        type="text"
                        placeholder="Search User..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    />
                </div>
                <div className="post-list">
                    {filteredPosts.map((post) => (
                        <PostItem key={post._id} post={post} userName={userName} handleDeletePost={handleDeletePost} />
                    ))}
                </div>
            </div>
        </div>
    );
}
