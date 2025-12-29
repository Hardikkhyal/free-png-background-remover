# 🎨 Free PNG Background Remover

A free, unlimited, high-quality PNG background remover that runs entirely in your browser. No login required, no watermarks, and no usage limits!

## ✨ Features

- **🔒 100% Private** - All processing happens locally in your browser. No data is uploaded to any server
- **💰 Free Forever** - Unlimited use with no hidden costs or subscriptions
- **🎯 High Quality** - Preserves fine edges like hair and soft outlines
- **📱 Mobile Friendly** - Works smoothly on both desktop and mobile devices
- **⚡ No Login Required** - Start using immediately without creating an account
- **🚫 No Watermark** - Download clean, professional results
- **🌐 Works Offline** - Once loaded, works without an internet connection
- **🎨 Transparent PNG Export** - Get perfect transparent backgrounds

## 🚀 How to Use

1. **Upload an Image**
   - Click the upload area or drag and drop an image
   - Supports PNG, JPG, and WEBP formats (up to 10MB)

2. **Wait for Processing**
   - The AI model will automatically remove the background
   - This may take a few moments depending on image size

3. **Download Your Result**
   - Preview the before/after comparison
   - Click "Download PNG" to save your transparent image

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Responsive design with modern styling
- **Vanilla JavaScript** - No frameworks, pure JS
- **Canvas API** - Image manipulation and processing
- **TensorFlow.js** - AI-powered background removal
- **MediaPipe Selfie Segmentation** - High-quality segmentation model

## 🌐 Live Demo

Visit the app: [GitHub Pages Link]

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Hardikkhyal/free-png-background-remover.git
   cd free-png-background-remover
   ```

2. Open `index.html` in your browser:
   - Simply double-click the file, or
   - Use a local server (recommended):
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with npx)
     npx serve
     ```

3. Navigate to `http://localhost:8000` in your browser

## 📦 Deployment

This app is designed to work with GitHub Pages:

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and root directory
4. Your app will be live at `https://yourusername.github.io/free-png-background-remover/`

## 🎯 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## 🔧 How It Works

1. **Image Upload** - User selects an image file
2. **Model Loading** - TensorFlow.js loads the MediaPipe Selfie Segmentation model
3. **Segmentation** - AI identifies the foreground subject
4. **Mask Generation** - Creates a precise mask with alpha channel
5. **Edge Refinement** - Applies smoothing to preserve fine details
6. **Export** - Generates a transparent PNG with high quality

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 🙏 Acknowledgments

- TensorFlow.js team for the amazing ML framework
- MediaPipe for the segmentation model
- The open-source community

## ⚠️ Known Limitations

- Best results with clear subject-background separation
- Processing time varies with image size and device performance
- Large images (>5MP) may take longer to process on mobile devices

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.