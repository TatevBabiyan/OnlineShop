import React from 'react';
import config from '../../config';

const MediaRenderer = ({ src, className, alt, poster, ...props }) => {
    if (!src) return null;

    const url = src.startsWith('http') ? src : `${config.apiHost}${src}`;

    // Basic extension check
    const isVideo = url.match(/\.(mp4|webm|ogg|mov)$|^data:video/i);

    if (isVideo) {
        return (
            <video
                src={url}
                className={className}
                autoPlay
                loop
                muted
                playsInline
                poster={poster}
                {...props}
            />
        );
    }

    return (
        <img
            src={url}
            className={className}
            alt={alt || ''}
            {...props}
        />
    );
};

export default MediaRenderer;
