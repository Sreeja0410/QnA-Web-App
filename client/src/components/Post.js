import React from 'react';
import '../styles/Post.css';

const Post = ({ post }) => {
    return (
        <div className="post-card">
            <h2 className="post-question">{post.question}</h2>
            <p className="post-tag">Tag: {post.tag}</p>
            <div className="post-actions">
                <button className="like-button">
                    👍 {post.likes}
                </button>
                <button className="dislike-button">
                    👎 {post.dislikes}
                </button>
                <button className="comment-button">
                    💬 {post.comments.length}
                </button>
            </div>
        </div>
    );
};

export default Post;
