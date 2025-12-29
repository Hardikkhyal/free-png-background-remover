# 🎨 Free PNG Background Remover

A free, unlimited, high-quality PNG background remover that runs 100% in your browser. No login required, no watermarks, no usage limits.

## ✨ Features

- **🚀 Fast Processing**: AI-powered background removal in seconds
- **🔒 100% Private**: All processing happens locally in your browser - your images never leave your device
- **✨ High Quality**: Preserves fine details and edges using TensorFlow.js BodyPix model
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
- **BodyPix Model**: Person segmentation for background removal

## 📖 How to Use

1. **Open the App**: Open `index.html` in any modern web browser
2. **Upload Image**: Drag and drop an image or click to browse
3. **Wait for Processing**: The AI model will automatically remove the background
4. **Download**: Click "Download PNG" to save your image with a transparent background

## 💻 Local Development

No build process required! Simply:

```bash
# Clone the repository
git clone https://github.com/Hardikkhyal/free-png-background-remover.git

# Open in browser
cd free-png-background-remover
open index.html
# or just double-click index.html
```

## 🌐 Deploy to GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select the main branch as source
4. Your app will be live at `https://yourusername.github.io/free-png-background-remover/`

## 🔧 Technical Details

### Model
- Uses TensorFlow.js BodyPix model with ResNet50 architecture
- Optimized for browser performance with medium internal resolution
- Configurable segmentation threshold for quality control

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
- [BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) - Person segmentation model

## ⚠️ Limitations

- Works best with images containing people
- Background removal quality depends on image clarity
- Large images may take longer to process
- Requires modern browser with JavaScript enabled

## 🔮 Future Enhancements

- Support for more object types (animals, products, etc.)
- Advanced edge refinement options
- Batch processing
- Image editing tools (crop, resize, adjust)
- Custom background colors/images

---

Made with ❤️ for the open-source community