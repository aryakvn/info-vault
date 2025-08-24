# InfoVault 🔐

A secure, offline-capable Progressive Web App (PWA) for managing personal information, credit cards, wallet addresses, and other sensitive data with a beautiful neumorphic design.

![InfoVault](https://img.shields.io/badge/InfoVault-Secure%20Storage-blue)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5.18-green)
![PWA](https://img.shields.io/badge/PWA-Ready-orange)
![Offline](https://img.shields.io/badge/Offline-Capable-brightgreen)

## ✨ Features

- **🔒 Secure Storage**: Store sensitive information locally with encryption
- **📱 Progressive Web App**: Install as a native app on any device
- **🌐 Offline-First**: Works completely offline with local data storage
- **🎨 Beautiful UI**: Modern neumorphic design with smooth animations
- **🔍 Smart Search**: Find information quickly with intelligent search
- **🏷️ Organized Categories**: Organize data by type (credit cards, wallets, phone numbers, etc.)
- **📱 Responsive Design**: Optimized for mobile and desktop use
- **⚡ Fast Performance**: Built with Vue 3 and Vite for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/info-vault.git
   cd info-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: Vue.js 3.5.18
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: Vue Router 4.5.1
- **PWA Support**: Service Worker + Web App Manifest
- **Icons**: Font Awesome

## 📱 PWA Features

InfoVault is a fully-featured Progressive Web App that includes:

- **Install Prompt**: Add to home screen on supported devices
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen mode and native app feel
- **Fast Loading**: Optimized for performance and user experience

## 🎯 Usage

### Adding Information

1. Tap the **+** button in the top-right corner
2. Select the type of information (Credit Card, Wallet, Phone, etc.)
3. Fill in the required details
4. Add optional labels for better organization
5. Save your information

### Managing Information

- **View**: Tap any card to view full details
- **Edit**: Modify existing information with the edit button
- **Delete**: Remove information you no longer need
- **Search**: Use the search bar to find specific items quickly

### Categories

- **Credit Cards**: Store card numbers, expiry dates, and CVV
- **Wallets**: Save cryptocurrency wallet addresses and names
- **Phone Numbers**: Keep important contact numbers
- **Postal Codes**: Store addresses and postal information
- **Custom**: Add any other type of information

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=InfoVault
VITE_APP_DESCRIPTION=Secure Information Storage
```

### PWA Configuration

The PWA settings can be customized in `public/manifest.json`:

- App name and description
- Theme colors
- Icons and splash screens
- Shortcuts and navigation

## 📁 Project Structure

```
info-vault/
├── public/                 # Static assets and PWA files
│   ├── icons/             # App icons for different sizes
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/                   # Source code
│   ├── components/        # Vue components
│   │   ├── AddInfoModal.vue
│   │   ├── InfoCard.vue
│   │   ├── SearchBar.vue
│   │   └── ...
│   ├── App.vue           # Main application component
│   └── main.js           # Application entry point
├── package.json           # Dependencies and scripts
└── vite.config.js        # Vite configuration
```

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages

1. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Run: `npm run deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Font Awesome for the beautiful icons
- PWA community for the progressive web app standards

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Made with ❤️ by the InfoVault Team**

*Secure • Fast • Beautiful*
