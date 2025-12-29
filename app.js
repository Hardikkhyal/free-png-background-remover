// Application State
let segmenter = null;
let currentImage = null;
let isModelLoaded = false;

// DOM Elements
const uploadSection = document.getElementById('uploadSection');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const originalCanvas = document.getElementById('originalCanvas');
const resultCanvas = document.getElementById('resultCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const newImageBtn = document.getElementById('newImageBtn');
const loadingText = document.getElementById('loadingText');

// Initialize the application
async function init() {
    setupEventListeners();
    await loadModel();
}

// Setup all event listeners
function setupEventListeners() {
    // File input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Upload area click
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Buttons
    downloadBtn.addEventListener('click', downloadImage);
    newImageBtn.addEventListener('click', resetApp);
    
    // Prevent default drag behaviors
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

// Load MediaPipe Selfie Segmentation model
async function loadModel() {
    try {
        showLoading('Loading AI model...');
        
        // MediaPipe Selfie Segmentation provides better results across different lighting conditions
        // Using landscape model for general-purpose segmentation
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        const segmenterConfig = {
            runtime: 'mediapipe',
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
            modelType: 'general' // 'general' works better for various lighting conditions
        };
        
        segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
        
        isModelLoaded = true;
        hideLoading();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        isModelLoaded = false;
        hideLoading();
        showUpload();
        alert('Error loading AI model. Please refresh the page and try again.');
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Handle drag over
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

// Handle drag leave
function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

// Handle drop
function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processFile(file);
    } else {
        alert('Please drop a valid image file');
    }
}

// Process uploaded file
async function processFile(file) {
    // Check if model is loaded
    if (!isModelLoaded || !segmenter) {
        alert('AI model is still loading. Please wait a moment and try again.');
        return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
    }
    
    try {
        showLoading('Processing image...');
        
        // Load image
        const img = await loadImage(file);
        currentImage = img;
        
        // Display original image
        displayOriginalImage(img);
        
        // Remove background
        await removeBackground(img);
        
        hideLoading();
        showResult();
    } catch (error) {
        console.error('Error processing file:', error);
        hideLoading();
        showUpload();
        alert('Error processing image. Please try another image.');
    }
}

// Load image from file
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Display original image on canvas
function displayOriginalImage(img) {
    const ctx = originalCanvas.getContext('2d');
    
    // Set canvas size to image size
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    
    // Draw image
    ctx.drawImage(img, 0, 0);
}

// Remove background using MediaPipe Selfie Segmentation with advanced processing
async function removeBackground(img) {
    // Additional safety check
    if (!segmenter) {
        throw new Error('Segmenter not loaded');
    }
    
    try {
        updateLoadingText('Analyzing image...');
        
        // Perform segmentation with MediaPipe
        const segmentation = await segmenter.segmentPeople(img);
        
        updateLoadingText('Processing segmentation mask...');
        
        // Create result canvas with same dimensions
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        const ctx = resultCanvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
        
        // Extract mask from segmentation
        const mask = await extractMask(segmentation, img.width, img.height);
        
        updateLoadingText('Refining edges...');
        
        // Apply advanced edge refinement for better quality
        const refinedMask = refineEdges(mask, img.width, img.height);
        
        updateLoadingText('Removing background...');
        
        // Apply mask with alpha channel
        for (let i = 0; i < refinedMask.length; i++) {
            // Use the refined mask value as alpha channel
            pixels[i * 4 + 3] = Math.round(refinedMask[i] * 255);
        }
        
        // Apply processed image data
        ctx.putImageData(imageData, 0, 0);
        
        updateLoadingText('Done!');
    } catch (error) {
        console.error('Error removing background:', error);
        throw new Error('Failed to remove background');
    }
}

// Extract mask from segmentation result
async function extractMask(segmentation, width, height) {
    const mask = new Float32Array(width * height);
    
    if (segmentation.length > 0) {
        const seg = segmentation[0];
        const maskData = seg.mask;
        
        // Convert mask data to normalized values (0-1)
        await maskData.toArray().then(array => {
            for (let i = 0; i < array.length; i++) {
                mask[i] = array[i];
            }
        });
    }
    
    return mask;
}

// Advanced edge refinement for cleaner cutouts
function refineEdges(mask, width, height) {
    // Apply bilateral filtering for edge-preserving smoothing
    const refined = bilateralFilter(mask, width, height);
    
    // Apply alpha matting for better edge quality
    const matted = alphaMatting(refined, width, height);
    
    return matted;
}

// Bilateral filter for edge-preserving smoothing
function bilateralFilter(mask, width, height) {
    const filtered = new Float32Array(mask.length);
    const kernelRadius = 3;
    const sigmaSpace = 2.0;
    const sigmaRange = 0.2;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const centerIdx = y * width + x;
            const centerValue = mask[centerIdx];
            
            let weightSum = 0;
            let valueSum = 0;
            
            // Apply kernel
            for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
                for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    
                    // Check bounds
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = ny * width + nx;
                        const value = mask[idx];
                        
                        // Spatial weight
                        const spatialDist = kx * kx + ky * ky;
                        const spatialWeight = Math.exp(-spatialDist / (2 * sigmaSpace * sigmaSpace));
                        
                        // Range weight (value similarity)
                        const rangeDist = (value - centerValue) * (value - centerValue);
                        const rangeWeight = Math.exp(-rangeDist / (2 * sigmaRange * sigmaRange));
                        
                        const weight = spatialWeight * rangeWeight;
                        weightSum += weight;
                        valueSum += weight * value;
                    }
                }
            }
            
            filtered[centerIdx] = valueSum / weightSum;
        }
    }
    
    return filtered;
}

// Alpha matting for better transparency handling
function alphaMatting(mask, width, height) {
    const matted = new Float32Array(mask.length);
    const erosionRadius = 2;
    const dilationRadius = 2;
    
    // Create eroded and dilated versions
    const eroded = new Float32Array(mask.length);
    const dilated = new Float32Array(mask.length);
    
    // Erosion (shrink foreground)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const centerIdx = y * width + x;
            let minValue = 1.0;
            
            for (let ky = -erosionRadius; ky <= erosionRadius; ky++) {
                for (let kx = -erosionRadius; kx <= erosionRadius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = ny * width + nx;
                        minValue = Math.min(minValue, mask[idx]);
                    }
                }
            }
            
            eroded[centerIdx] = minValue;
        }
    }
    
    // Dilation (expand foreground)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const centerIdx = y * width + x;
            let maxValue = 0.0;
            
            for (let ky = -dilationRadius; ky <= dilationRadius; ky++) {
                for (let kx = -dilationRadius; kx <= dilationRadius; kx++) {
                    const nx = x + kx;
                    const ny = y + ky;
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = ny * width + nx;
                        maxValue = Math.max(maxValue, mask[idx]);
                    }
                }
            }
            
            dilated[centerIdx] = maxValue;
        }
    }
    
    // Compute trimap and refined alpha
    for (let i = 0; i < mask.length; i++) {
        const e = eroded[i];
        const d = dilated[i];
        const m = mask[i];
        
        // Definite foreground
        if (e > 0.9) {
            matted[i] = 1.0;
        }
        // Definite background
        else if (d < 0.1) {
            matted[i] = 0.0;
        }
        // Unknown region - smooth transition
        else {
            // Apply smoothstep function for natural-looking edges
            const t = (m - 0.3) / 0.4; // Map 0.3-0.7 to 0-1
            const clamped = Math.max(0, Math.min(1, t));
            matted[i] = clamped * clamped * (3 - 2 * clamped);
        }
    }
    
    return matted;
}

// Download processed image
function downloadImage() {
    try {
        // Convert canvas to blob
        resultCanvas.toBlob((blob) => {
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `background-removed-${Date.now()}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
        }, 'image/png');
    } catch (error) {
        console.error('Error downloading image:', error);
        alert('Error downloading image. Please try again.');
    }
}

// Reset application to initial state
function resetApp() {
    // Clear canvases
    const ctxOriginal = originalCanvas.getContext('2d');
    const ctxResult = resultCanvas.getContext('2d');
    ctxOriginal.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    ctxResult.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    
    // Reset file input
    fileInput.value = '';
    
    // Reset state
    currentImage = null;
    
    // Show upload section
    hideResult();
    showUpload();
}

// UI State Management
function showLoading(text) {
    uploadSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    loadingText.textContent = text;
}

function hideLoading() {
    loadingSection.classList.add('hidden');
}

function showResult() {
    uploadSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
}

function hideResult() {
    resultSection.classList.add('hidden');
}

function showUpload() {
    uploadSection.classList.remove('hidden');
    loadingSection.classList.add('hidden');
    resultSection.classList.add('hidden');
}

function updateLoadingText(text) {
    loadingText.textContent = text;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
