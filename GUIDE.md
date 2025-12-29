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
- Use images with clear subjects (people, products, animals)
- Good lighting and contrast improves results
- Images under 5MB process faster
- High-resolution images maintain quality better

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
Edit `app.js` line 52-56 to adjust model parameters:
```javascript
model = await bodyPix.load({
    architecture: 'ResNet50',  // or 'MobileNetV1' for faster loading
    outputStride: 16,          // 8, 16, or 32 (lower = more accurate, slower)
    quantBytes: 4              // 1, 2, or 4 (higher = more accurate, slower)
});
```

### Adjust Segmentation Quality
Edit `app.js` line 170-173:
```javascript
const segmentation = await model.segmentPerson(img, {
    flipHorizontal: false,
    internalResolution: 'medium',  // 'low', 'medium', 'high', or 'full'
    segmentationThreshold: 0.7     // 0.0 to 1.0 (higher = more strict)
});
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
- Try images with better lighting
- Adjust `segmentationThreshold` (0.5-0.9)
- Use higher `internalResolution`
- Ensure subject is clearly visible

### Slow processing
- Reduce image size before upload
- Use 'MobileNetV1' architecture instead
- Increase `outputStride` to 32
- Close other browser tabs

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
- [BodyPix Model Guide](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

Happy background removing! 🎨
