import React from 'react';
import './Avatar.css';

const Avatar = ({ image, username, imageSize, fontSize }) => {
    return (
        <div className="avatar" style={{ '--image-size': imageSize, '--font-size': fontSize }}>
            <img src={image} alt="avatar" className="avatar-image" />
            <span className="avatar-username">{username}</span>
        </div>
    );
};

export default Avatar;
