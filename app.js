// Application State
let model = null;
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

// Load TensorFlow.js BodyPix model
async function loadModel() {
    try {
        showLoading('Loading AI model...');
        
        // BodyPix is lighter and faster than U²-Net, suitable for browser use
        // ResNet50 architecture provides good quality
        model = await bodyPix.load({
            architecture: 'ResNet50',
            outputStride: 16,
            quantBytes: 4
        });
        
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
    if (!isModelLoaded || !model) {
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

// Remove background using TensorFlow.js BodyPix
async function removeBackground(img) {
    // Additional safety check
    if (!model) {
        throw new Error('Model not loaded');
    }
    
    try {
        updateLoadingText('Analyzing image...');
        
        // Perform segmentation
        const segmentation = await model.segmentPerson(img, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: 0.7
        });
        
        updateLoadingText('Removing background...');
        
        // Create result canvas with same dimensions
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        const ctx = resultCanvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
        
        // Apply mask - make background transparent
        const mask = segmentation.data;
        for (let i = 0; i < mask.length; i++) {
            // If pixel is background (0), make it transparent
            if (mask[i] === 0) {
                pixels[i * 4 + 3] = 0; // Set alpha to 0
            }
        }
        
        // Apply processed image data
        ctx.putImageData(imageData, 0, 0);
        
        updateLoadingText('Done!');
    } catch (error) {
        console.error('Error removing background:', error);
        throw new Error('Failed to remove background');
    }
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
