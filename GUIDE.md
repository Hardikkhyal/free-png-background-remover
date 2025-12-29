# Quick Start Guide

## 🚀 Getting Started

### Option 1: Open Locally
1. Download or clone this repository
2. Double-click `index.html` or open it in your browser
3. Start removing backgrounds!

### Option 2: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from main branch"
4. Your app will be live at `https://yourusername.github.io/free-png-background-remover/`

### Option 3: Deploy to Other Platforms

#### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site is live instantly!

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

#### GitHub Codespaces
1. Open in Codespaces
2. Run: `python3 -m http.server 8000`
3. Open the forwarded port in your browser

## 💡 Usage Tips

### Best Results
- Use images with clear subjects (people work best with this model)
- The tool now works well in various lighting conditions (bright, dim, mixed)
- Images under 5MB process faster
- High-resolution images maintain quality better with the new edge refinement
- Works best when subject contrasts with background

### Supported Formats
- **Input**: JPG, PNG, WEBP
- **Output**: PNG with transparency

### Browser Requirements
- Chrome 80+ (recommended)
- Firefox 75+
- Safari 13.1+
- Edge 80+

## 🔧 Customization

### Change Model Settings
The app now uses MediaPipe Selfie Segmentation. To adjust settings, edit `app.js` lines 54-58:
```javascript
const segmenterConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
    modelType: 'general' // 'general' for robust performance, 'landscape' for portraits
};
```

### Adjust Edge Refinement
To modify edge quality, edit the configuration constants at the top of `app.js` (lines 7-12):
```javascript
const BILATERAL_FILTER_CONFIG = {
    kernelRadius: 3,      // Larger = more smoothing (1-5)
    sigmaSpace: 2.0,      // Spatial smoothing strength
    sigmaRange: 0.2       // Edge preservation strength
};
```

### Adjust Alpha Matting
To change transparency handling, edit the configuration constants in `app.js` (lines 14-21):
```javascript
const ALPHA_MATTING_CONFIG = {
    erosionRadius: 2,              // Edge shrinking (1-3)
    dilationRadius: 2,             // Edge expansion (1-3)
    foregroundThreshold: 0.9,      // Values above this are definite foreground
    backgroundThreshold: 0.1,      // Values below this are definite background
    transitionStart: 0.3,          // Start of smooth transition zone
    transitionRange: 0.4           // Range of smooth transition (0.3 to 0.7)
};
```

### Update Styles
Edit `styles.css` to customize:
- Colors (line 8-9: gradient colors)
- Font (line 6: font-family)
- Spacing and layout
- Mobile breakpoints (line 351+)

## 🐛 Troubleshooting

### Model won't load
- Check internet connection (needs CDN access for first load)
- Try refreshing the page
- Clear browser cache
- Check browser console for errors

### Poor background removal quality
- The new model works better in various lighting conditions
- Ensure subject is clearly visible and distinct from background
- Try adjusting bilateral filter settings for more/less smoothing
- For very complex edges, you may need to adjust alpha matting parameters

### Slow processing
- Reduce image size before upload
- The new algorithm includes edge refinement which takes extra time but provides better quality
- Close other browser tabs
- Ensure your device has sufficient memory available

### Browser compatibility issues
- Update to latest browser version
- Enable JavaScript
- Check if WebGL is supported: visit `chrome://gpu`

## 📞 Support

Found a bug? Have a suggestion?
- Open an issue on GitHub
- Check existing issues first
- Include browser version and console errors

## 🎓 Learn More

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [MediaPipe Selfie Segmentation](https://google.github.io/mediapipe/solutions/selfie_segmentation.html)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

Happy background removing! 🎨
