# Gym Tracker PWA - Deployment Guide

## Development Server

To run the app locally:

```bash
# Using Python (recommended)
python3 server.py

# Alternative: Using Node.js (if you have it installed)
npx serve .

# Alternative: Using PHP (if available)
php -S localhost:8000
```

Then open: http://localhost:8000

## Testing PWA Features

1. **Install PWA**: 
   - Chrome: Look for install icon in address bar
   - Safari (iOS): Add to Home Screen from share menu

2. **Offline Test**:
   - Load the app while online
   - Turn off internet/airplane mode
   - App should still work fully

3. **Storage Test**:
   - Add/edit some exercise weights
   - Close browser/app completely
   - Reopen - data should persist

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import the repository
4. Deploy automatically

### Manual Deployment

Upload these files to any web server:
- index.html
- styles.css
- app.js
- manifest.json
- sw.js
- icons/ directory

## Performance Optimization

The app is designed to:
- Load in under 2 seconds
- Work completely offline
- Store data locally (no internet required)
- Be installable as a native app

## Browser Support

- ✅ Chrome 70+
- ✅ Safari 12+ (iOS/macOS)
- ✅ Firefox 65+
- ✅ Edge 79+

## Troubleshooting

1. **Service Worker not registering**: Check console for errors, ensure HTTPS in production
2. **Icons not showing**: Verify SVG files are accessible
3. **Data not persisting**: Check if localStorage is enabled in browser
4. **PWA not installable**: Ensure manifest.json is valid and served over HTTPS