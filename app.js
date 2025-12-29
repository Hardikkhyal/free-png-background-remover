// Main application state
let segmenter = null;
let currentImage = null;
let useFallback = false;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processingSection = document.getElementById('processingSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const originalCanvas = document.getElementById('originalCanvas');
const resultCanvas = document.getElementById('resultCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const retryBtn = document.getElementById('retryBtn');
const errorText = document.getElementById('errorText');

// Check if TensorFlow.js and body-segmentation are available
function checkDependencies() {
    return typeof tf !== 'undefined' && typeof bodySegmentation !== 'undefined';
}

// Initialize the segmentation model
async function initModel() {
    try {
        if (!checkDependencies()) {
            console.warn('TensorFlow.js or body-segmentation not available, using fallback method');
            useFallback = true;
            return;
        }
        
        console.log('Loading segmentation model...');
        
        // Use MediaPipe SelfieSegmentation model which is excellent for background removal
        // It's designed to work well with portraits and preserves fine details like hair
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        const segmenterConfig = {
            runtime: 'tfjs',
            modelType: 'general' // 'general' works better for various subjects, not just selfies
        };
        
        segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        console.log('Falling back to color-based background removal');
        useFallback = true;
    }
}

// File upload handlers
uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragging');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
});

// Process uploaded file
async function handleFile(file) {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload a valid image file (PNG, JPG, WEBP)');
        return;
    }

    // Show processing state
    hideAllSections();
    processingSection.style.display = 'block';

    try {
        // Load the image
        const image = await loadImage(file);
        currentImage = image;

        // Initialize model if not already loaded
        if (!segmenter) {
            await initModel();
        }

        // Remove background
        await removeBackground(image);

        // Show results
        hideAllSections();
        resultSection.style.display = 'block';
    } catch (error) {
        console.error('Error processing image:', error);
        showError(error.message || 'Failed to process image. Please try again.');
    }
}

// Load image from file
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                resolve(img);
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Remove background from image
async function removeBackground(image) {
    try {
        // Draw original image
        const originalCtx = originalCanvas.getContext('2d');
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        originalCtx.drawImage(image, 0, 0);

        if (useFallback || !segmenter) {
            // Use fallback color-based background removal
            await removeBackgroundFallback(image);
        } else {
            // Use AI-based segmentation
            await removeBackgroundAI(image);
        }

        console.log('Background removal complete');
    } catch (error) {
        console.error('Error in removeBackground:', error);
        throw error;
    }
}

// AI-based background removal using TensorFlow.js
async function removeBackgroundAI(image) {
    // Perform segmentation
    console.log('Performing AI segmentation...');
    const segmentation = await segmenter.segmentPeople(image, {
        multiSegmentation: false,
        segmentBodyParts: false
    });

    if (!segmentation || segmentation.length === 0) {
        throw new Error('No subject detected in the image');
    }

    // Get the mask
    const mask = segmentation[0].mask;
    const maskData = await mask.toImageData();

    // Create result canvas with transparency
    const resultCtx = resultCanvas.getContext('2d');
    resultCanvas.width = image.width;
    resultCanvas.height = image.height;

    // Draw the original image
    resultCtx.drawImage(image, 0, 0);

    // Get image data to modify
    const imageData = resultCtx.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;
    const maskPixels = maskData.data;

    // Apply mask with edge refinement
    for (let i = 0; i < pixels.length; i += 4) {
        const maskIndex = i;
        
        // The mask value (0-255) represents the probability of the pixel being part of the person
        const maskValue = maskPixels[maskIndex];
        
        // Use the mask value directly as alpha for smooth edges
        // This preserves fine details like hair
        pixels[i + 3] = maskValue;
    }

    // Apply the modified image data
    resultCtx.putImageData(imageData, 0, 0);

    // Apply edge refinement for better quality
    await refineEdges(resultCanvas, maskData);
}

// Fallback color-based background removal
async function removeBackgroundFallback(image) {
    console.log('Using fallback background removal...');
    
    const resultCtx = resultCanvas.getContext('2d');
    resultCanvas.width = image.width;
    resultCanvas.height = image.height;
    
    // Draw the original image
    resultCtx.drawImage(image, 0, 0);
    
    // Get image data
    const imageData = resultCtx.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;
    
    // Sample corner colors to determine background color
    const corners = [
        { x: 0, y: 0 },
        { x: image.width - 1, y: 0 },
        { x: 0, y: image.height - 1 },
        { x: image.width - 1, y: image.height - 1 }
    ];
    
    const backgroundColor = sampleBackgroundColor(pixels, image.width, corners);
    
    // Remove background based on color similarity
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Calculate color difference
        const diff = colorDistance(r, g, b, backgroundColor.r, backgroundColor.g, backgroundColor.b);
        
        // Threshold for background detection (adjust for better results)
        const threshold = 40;
        
        if (diff < threshold) {
            // Make pixel transparent
            pixels[i + 3] = 0;
        } else if (diff < threshold * 2) {
            // Partially transparent for edge smoothing
            const alpha = Math.min(255, ((diff - threshold) / threshold) * 255);
            pixels[i + 3] = alpha;
        }
    }
    
    // Apply the modified image data
    resultCtx.putImageData(imageData, 0, 0);
    
    // Apply additional smoothing
    await smoothEdgesFallback(resultCanvas);
}

// Sample background color from corners
function sampleBackgroundColor(pixels, width, corners) {
    let totalR = 0, totalG = 0, totalB = 0;
    
    corners.forEach(corner => {
        const idx = (corner.y * width + corner.x) * 4;
        totalR += pixels[idx];
        totalG += pixels[idx + 1];
        totalB += pixels[idx + 2];
    });
    
    return {
        r: Math.round(totalR / corners.length),
        g: Math.round(totalG / corners.length),
        b: Math.round(totalB / corners.length)
    };
}

// Calculate color distance
function colorDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt(
        Math.pow(r1 - r2, 2) +
        Math.pow(g1 - g2, 2) +
        Math.pow(b1 - b2, 2)
    );
}

// Smooth edges for fallback method
async function smoothEdgesFallback(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a copy for reading
    const original = new Uint8ClampedArray(pixels);
    
    // Apply simple box blur to alpha channel for smoother edges
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // Only smooth semi-transparent pixels (edges)
            if (original[idx + 3] > 0 && original[idx + 3] < 255) {
                let sum = 0;
                let count = 0;
                
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nIdx = ((y + dy) * width + (x + dx)) * 4;
                        sum += original[nIdx + 3];
                        count++;
                    }
                }
                
                pixels[idx + 3] = Math.round(sum / count);
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Refine edges for better quality (preserves hair and soft edges)
async function refineEdges(canvas, maskData) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const maskPixels = maskData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Create a temporary array for the refined alpha channel
    const refinedAlpha = new Uint8ClampedArray(pixels.length / 4);

    // Apply a subtle feathering effect to smooth edges
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const maskIdx = idx;
            
            // Get surrounding mask values for smoothing
            let sum = 0;
            let count = 0;
            
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nIdx = (ny * width + nx) * 4;
                        sum += maskPixels[nIdx];
                        count++;
                    }
                }
            }
            
            // Average with slight bias toward the original
            const smoothed = (maskPixels[maskIdx] * 0.6 + (sum / count) * 0.4);
            refinedAlpha[idx / 4] = Math.round(smoothed);
        }
    }

    // Apply the refined alpha channel
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i + 3] = refinedAlpha[i / 4];
    }

    ctx.putImageData(imageData, 0, 0);
}

// Download the result
downloadBtn.addEventListener('click', () => {
    try {
        resultCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `background-removed-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    } catch (error) {
        console.error('Error downloading image:', error);
        showError('Failed to download image. Please try again.');
    }
});

// Process new image
newImageBtn.addEventListener('click', () => {
    fileInput.value = '';
    currentImage = null;
    hideAllSections();
    document.querySelector('.upload-section').style.display = 'block';
});

// Retry after error
retryBtn.addEventListener('click', () => {
    fileInput.value = '';
    currentImage = null;
    hideAllSections();
    document.querySelector('.upload-section').style.display = 'block';
});

// Show error message
function showError(message) {
    hideAllSections();
    errorSection.style.display = 'block';
    errorText.textContent = message;
}

// Hide all section displays
function hideAllSections() {
    document.querySelector('.upload-section').style.display = 'none';
    processingSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Initialize on page load
window.addEventListener('load', () => {
    console.log('Application initialized');
    // Preload the model in the background for faster processing
    initModel().catch(err => {
        console.error('Failed to preload model:', err);
    });
});
