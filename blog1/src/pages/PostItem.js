import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationModel";

const PostItem = ({ post, userName, handleDeletePost }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(true);

    const handleConfirmDelete = () => {
        setShowConfirmation(false);
        setShowDeleteButton(false);
        handleDeletePost(post._id);
    };

    const handleDeleteButtonClick = () => {
        setShowConfirmation(true);
        setShowDeleteButton(false);
    };

    return (
        <div key={post._id} className="post">
            <Link to={`/visitor-profile/${post.userName}`}>
                <img src={post.profilePicture} alt={`${post.userName}'s Profile`} />
            </Link>
            <p className="post-content">
                <span className="post-author">{post.userName}:</span>
                {post.content}
            </p>

            {post.userName === userName && showDeleteButton && (
                <button onClick={handleDeleteButtonClick}>Delete</button>
            )}

            {showConfirmation && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this post?"
                    onCancel={() => {
                        setShowConfirmation(false);
                        setShowDeleteButton(true);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default PostItem;
