# 🎨 Free PNG Background Remover

A free, unlimited, high-quality PNG background remover that runs 100% in your browser. No login required, no watermarks, no usage limits.

## ✨ Features

- **🚀 Fast Processing**: AI-powered background removal in seconds
- **🔒 100% Private**: All processing happens locally in your browser - your images never leave your device
- **✨ High Quality**: Preserves fine details and edges using MediaPipe Selfie Segmentation with advanced edge refinement
- **🌓 Lighting Robust**: Works accurately across different lighting conditions (bright, dim, mixed lighting)
- **🎯 Advanced Edge Refinement**: Uses bilateral filtering and alpha matting for professional-quality cutouts
- **♾️ Unlimited**: No limits, no watermarks, completely free forever
- **📱 Mobile Friendly**: Works smoothly on both desktop and mobile devices
- **💾 PNG Export**: Download images with transparent backgrounds
- **🎯 No Setup**: Just open and use - no installation or registration needed

## 🚀 Live Demo

Simply open `index.html` in your browser or deploy to GitHub Pages.

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern responsive design with gradients and animations
- **Vanilla JavaScript**: No framework dependencies
- **Canvas API**: Image manipulation and processing
- **TensorFlow.js**: Machine learning inference in the browser
- **MediaPipe Selfie Segmentation**: Advanced person segmentation optimized for various lighting conditions
- **Bilateral Filtering**: Edge-preserving smoothing for cleaner cutouts
- **Alpha Matting**: Professional-grade transparency handling


## 🔧 Technical Details

### Model
- Uses MediaPipe Selfie Segmentation with 'general' model type for robust performance
- Optimized for browser performance with excellent accuracy across lighting conditions
- Advanced edge refinement with bilateral filtering
- Alpha matting for professional-quality transparency

### Image Processing Pipeline
1. **Segmentation**: MediaPipe analyzes the image and creates an initial mask
2. **Bilateral Filtering**: Edge-preserving smoothing that maintains sharp edges while reducing noise
3. **Alpha Matting**: Creates smooth transitions at object boundaries using erosion/dilation
4. **Smoothstep Function**: Natural-looking edge transitions for professional results

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

### Performance
- Model loads asynchronously
- Processing time varies by image size (typically 2-5 seconds)
- Recommended max image size: 10MB

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning in the browser
- [MediaPipe](https://google.github.io/mediapipe/) - Selfie Segmentation model for accurate results

## ⚠️ Limitations

- Works best with images containing people (optimized for person segmentation)
- Large images may take longer to process due to advanced edge refinement
- Requires modern browser with JavaScript and WebGL enabled

## 🔮 Future Enhancements

- Support for more object types (animals, products, etc.)
- Advanced edge refinement options
- Batch processing
- Image editing tools (crop, resize, adjust)
- Custom background colors/images

---

Made with ❤️ for the open-source community
