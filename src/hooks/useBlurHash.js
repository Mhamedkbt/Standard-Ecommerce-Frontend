import { useEffect, useRef, useState, useCallback } from 'react';
import { decode } from 'blurhash';

/**
 * Custom hook to decode a BlurHash string and render it onto a canvas.
 * @param {string} blurHash - The BlurHash string.
 * @param {number} width - Target width for the placeholder canvas.
 * @param {number} height - Target height for the placeholder canvas.
 * @returns {{canvasRef: React.RefObject<HTMLCanvasElement>, placeholderReady: boolean}}
 */
export const useBlurHash = (blurHash, width, height) => {
    const canvasRef = useRef(null);
    const [placeholderReady, setPlaceholderReady] = useState(false);

    const renderBlurHash = useCallback(() => {
        if (!blurHash || !canvasRef.current || width <= 0 || height <= 0) {
            setPlaceholderReady(false);
            return;
        }

        try {
            // 1. Decode the BlurHash into a pixel array (UInt8ClampedArray)
            const pixels = decode(blurHash, width, height);

            // 2. Prepare the Canvas
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // 3. Create image data from the pixel array
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(pixels);

            // 4. Put image data onto the canvas
            ctx.putImageData(imageData, 0, 0);

            setPlaceholderReady(true);
        } catch (error) {
            console.error("Failed to decode/render BlurHash:", error);
            setPlaceholderReady(false);
        }
    }, [blurHash, width, height]);

    useEffect(() => {
        renderBlurHash();
    }, [renderBlurHash]);

    return { canvasRef, placeholderReady };
};