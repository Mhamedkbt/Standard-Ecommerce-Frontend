// BlurHashImage.jsx - ONLY THIS FILE IS CHANGED

import React, { useState, useEffect } from 'react';
import { useBlurHash } from '../hooks/useBlurHash'; 

const CANVAS_SIZE = 32; 

export default function BlurHashImage({ 
    src, 
    blurHash, 
    alt = '', 
    className = '',
    imageClassName = 'w-full h-full object-cover absolute inset-0', 
    placeholderClassName = 'w-full h-full'
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Use the custom hook to handle decoding and canvas rendering
    const { canvasRef, placeholderReady } = useBlurHash(blurHash, CANVAS_SIZE, CANVAS_SIZE);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Reset state if the source or hash changes
    useEffect(() => {
        setImageLoaded(false);
        setImageError(false);
    }, [src, blurHash]);

    if (imageError) {
        // Fallback or error state display
        return (
            <div className={`flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg ${className}`}>
                <i className="fas fa-image-slash mr-2"></i> Failed to load image
            </div>
        );
    }
    
    return (
        // The container needs relative positioning, which you correctly add here.
        <div className={`relative overflow-hidden ${className}`}> 
            
            {/* 1. BlurHash Placeholder (Canvas) */}
            {/* 💡 FIX: RENDER THE CANVAS IF IT'S READY, regardless of imageLoaded state. */}
            {/* 💡 The opacity handles the fade-out, ensuring no quick flash/unmount. */}
            {placeholderReady && ( 
                <canvas 
                    ref={canvasRef} 
                    aria-hidden="true" 
                    // Canvas is absolutely positioned and blurred
                    // The opacity is set to 0 when the image is loaded, transitioning out.
                    // This is the CRITICAL line: it controls the fade-out.
                    className={`absolute inset-0 transition-opacity duration-700 blur-lg ${placeholderClassName} ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                />
            )}

            {/* 2. High-Resolution Image */}
            <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                // The image now includes 'absolute inset-0' via the default props for perfect overlap
                className={`${imageClassName} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                style={{ 
                    // This ensures the image reserves space and doesn't "jump" the container.
                    // 'visibility: hidden' prevents the image from briefly appearing before CSS applies opacity.
                    // This is necessary because opacity: 0 still renders the bounding box.
                    visibility: imageLoaded ? 'visible' : 'hidden',
                }}
                loading="lazy"
            />
        </div>
    );
}

