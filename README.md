# AI Background Remover

A free, unlimited, privacy-first AI background remover that runs entirely in your browser.

- No uploads
- No login
- No watermarks
- No limits
- Works offline

---

## Demo

![Demo GIF](./screenshots/demo.gif)

---

## Live Demo

👉 [Try Now](https://your-demo-link.com)

---

## Features

- 🚀 Fast AI-powered background removal
- 🔒 100% private — images never leave your device
- ✨ High-quality transparent PNG export
- 🎯 Advanced edge refinement for smooth cutouts
- 🌓 Works across different lighting conditions
- ♾️ Unlimited usage with no restrictions
- 📱 Fully responsive and mobile-friendly
- 💾 One-click PNG download
- ⚡ No installation required

---

## Before & After

| Original | Background Removed |
|----------|-------------------|
| ![Before](./screenshots/before.png) | ![After](./screenshots/after.png) |

---

# Why This Project Exists

Most free background remover tools:

- Upload your images to external servers
- Add watermarks
- Require subscriptions
- Limit usage

This project keeps everything local, private, and completely free forever.

---

# How It Works

text
Upload Image
    ↓
MediaPipe Segmentation
    ↓
Edge Refinement
    ↓
Alpha Matting
    ↓
Transparent PNG Export




# Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- TensorFlow.js
- MediaPipe Selfie Segmentation
- Canvas API

---

# Technical Highlights

### AI Segmentation
Uses MediaPipe Selfie Segmentation with the `general` model for accurate person detection.

### Edge Refinement
Applies bilateral filtering and alpha matting for smoother object boundaries.

### Browser Processing
All processing happens locally inside the browser using TensorFlow.js and WebGL acceleration.

---

# Installation

Clone the repository:

`bash
git clone https://github.com/your-username/your-repo-name.git
``

Open the project folder:

``bash
cd your-repo-name


Run locally:

`bash
open index.html
``

Or use VS Code Live Server extension.

--

# Browser Compatibility

| Browser | Support |
|---|---|
| Chrome | ✅ |
| Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Mobile Browsers | ✅ |

---

# Performance

- Typical processing time: 2–5 seconds
- Recommended maximum image size: 10MB
- Model loads asynchronously for better performance

---

# Limitations

- Optimized primarily for person segmentation
- Large images may process more slowly
- Requires JavaScript and WebGL support

---

# Future Enhancements

- Support for object segmentation
- Batch image processing
- Background replacement
- Image editing tools
- Custom background colors
- Adjustable edge refinement settings

---

# Screenshots

## Home Screen

![Home](./screenshots/home.png)

## Processing

![Processing](./screenshots/processing.png)

## Result

![Result](./screenshots/result.png)

---

# Contributing

Contributions are welcome.

You can help by:

- Reporting bugs
- Suggesting improvements
- Submitting pull requests
- Improving documentation

---

# Topics

``text
background-removal
ai
tensorflowjs
mediapipe
image-processing
javascript
web-app
privacy
png
machine-learning
browser-based
photo-editor
`

-

# License

This project is licensed under the MIT License.

---

# Acknowledgments

- TensorFlow.js
- MediaPipe
- Canvas API
- Open-source community
