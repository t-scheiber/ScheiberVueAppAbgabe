# Weather App - Vue.js 🌤️

**🌐 Live Site:** [weatherapp.thomasscheiber.com](https://weatherapp.thomasscheiber.com/)

A weather application built with Vue.js that displays current weather conditions and a 5-day forecast. Created as an assignment demonstrating Vue.js fundamentals.

## 🌤️ Features

- **Current Weather Display**: Real-time weather for any location
- **5-Day Forecast**: Extended weather predictions
- **Weather Icons**: Visual representation of weather conditions
- **Temperature Display**: Current temperature with weather status
- **Date & Time**: Formatted display of current date and time
- **Responsive Design**: Works on all devices

## 🛠️ Technologies Used

- **Vue.js 3** - Progressive JavaScript framework (CDN version)
- **HTML5** - Structure and markup
- **CSS3** - Styling with Bootstrap integration
- **Bootstrap 5** - UI components and responsive grid
- **OpenWeatherMap API** - Weather data source

## 🎯 Key Features

### Current Weather
- Location display
- Current temperature
- Weather status description
- Weather condition icon
- Formatted date and time

### 5-Day Forecast
- Daily temperature predictions
- Weather icons for each day
- Weather descriptions
- Clean forecast card layout

## 📦 Setup & Installation

### Quick Start (Using Environment Variables - Recommended)

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your API keys:
   ```env
   OPENWEATHER_API_KEY=your_actual_openweathermap_api_key
   GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
   ```
4. Generate `config.js` from your `.env` file:
   ```bash
   bun run generate-config
   ```
   Or with npm:
   ```bash
   npm run generate-config
   ```
5. Open `index.html` in your browser or serve with a local server:
   ```bash
   npx serve .
   ```

### Alternative Setup (Manual Config)

If you prefer to set up manually:
1. Copy `config.example.js` to `config.js`
2. Edit `config.js` and add your API keys directly
3. Open `index.html` in your browser

### Getting API Keys

- **OpenWeatherMap API Key**: Get your free key from [OpenWeatherMap API](https://openweathermap.org/api)
- **Google Maps API Key**: Get your key from [Google Cloud Console](https://console.cloud.google.com/)
  - Enable "Geocoding API" for reverse geocoding functionality

## 🏗️ Project Structure

```
ScheiberVueAppAbgabe/
├── index.html          # Main HTML with Vue app
├── script.js           # Vue.js application logic
├── style.css           # Custom styling
├── config.js           # API keys (generated from .env - DO NOT COMMIT)
├── config.example.js   # Example config file
├── .env                # Environment variables (DO NOT COMMIT)
├── .env.example        # Example environment variables
├── generate-config.js  # Script to generate config.js from .env
├── package.json        # Node.js dependencies and scripts
├── nixpacks.toml       # Nixpacks deployment configuration
├── images/             # Weather icons and assets
└── README.md           # Documentation
```

## 🔐 Environment Variables

This project uses environment variables for secure API key management. The setup process:

1. **Create `.env` file**: Copy `.env.example` to `.env`
2. **Add your API keys**: Edit `.env` with your actual keys
3. **Generate config**: Run `bun run generate-config` to create `config.js`
4. **Deploy**: The generated `config.js` is used by the app

**Important**: 
- Never commit `.env` or `config.js` to version control
- Both files are in `.gitignore` for security
- Use `.env.example` as a template for required variables

### Deployment

#### Nixpacks (Railway, Render, etc.)

The project includes a `nixpacks.toml` configuration file for easy deployment:

1. **Set environment variables** in your platform's dashboard:
   - `OPENWEATHER_API_KEY`
   - `GOOGLE_MAPS_API_KEY`

2. **Deploy**: The build process will automatically:
   - Install Node.js and Bun
   - Run `bun install` (which triggers `postinstall` to generate config.js)
   - Generate `config.js` from environment variables
   - Serve the static files

The `generate-config.js` script automatically reads from `process.env` during the build phase, so your API keys are securely injected into `config.js` at build time.

#### Other Platforms (Vercel, Netlify, etc.)

1. **Set environment variables** in your hosting platform's dashboard:
   - `OPENWEATHER_API_KEY`
   - `GOOGLE_MAPS_API_KEY`

2. **Add a build step** that generates `config.js`:
   ```bash
   bun run generate-config
   ```
   Or with npm:
   ```bash
   npm run generate-config
   ```

3. **For platforms with build hooks**, the `package.json` already includes:
   ```json
   {
     "scripts": {
       "build": "bun run generate-config"
     }
   }
   ```

The `generate-config.js` script reads from `process.env` (environment variables) when available, making it compatible with most deployment platforms.

## 💡 Vue.js Concepts Demonstrated

### Vue Fundamentals
- **Vue Instance**: Main app initialization
- **Data Properties**: Reactive data management
- **Computed Properties**: For formatted dates and times
- **Methods**: Weather data fetching and formatting
- **Template Syntax**: Vue directives (v-if, v-else, v-for)
- **Event Handling**: User interactions

### Vue Directives Used
- `v-if / v-else`: Conditional rendering
- `{{ }}`: Text interpolation
- `:src`: Dynamic attribute binding
- `v-bind`: Dynamic property binding

## 🌐 API Integration

Integrates with **OpenWeatherMap API** to fetch:
- Current weather data
- 5-day/3-hour forecast
- Weather condition icons
- Temperature information

## 📱 Responsive Design

Built with Bootstrap 5 for responsiveness:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Features Breakdown

### Weather Data Display
```javascript
// Vue data structure
{
  title: 'Weather App',
  placeString: 'Vienna, Austria',
  temperature: '22',
  weatherStatus: 'Partly Cloudy',
  imgUrl: 'path/to/icon.png',
  temparray: [...], // 5-day temperatures
  descrArray: [...], // Weather descriptions
  imgSrcArray: [...] // Weather icons
}
```

### Date Formatting
- Day name display
- Formatted dates for forecast
- Time display with locale formatting
- Multi-language support (German/English)

## 📚 Learning Outcomes

This project demonstrates:
- Vue.js fundamentals and syntax
- Reactive data binding
- API integration with Vue
- Component-based thinking
- Template rendering
- Bootstrap integration
- Responsive web design

## 🎓 Assignment Context

Created as part of a web development course assignment, showcasing:
- Vue.js framework understanding
- Modern JavaScript
- API consumption
- Responsive design
- Clean code organization

## 🚀 Future Enhancements

Potential improvements:
- Location search functionality
- Geolocation support
- Unit conversion (°C/°F)
- Hourly forecast view
- Weather alerts
- Favorite locations
- Dark mode

## 🌟 Why Vue.js?

This project uses Vue.js because:
- **Simple setup**: CDN-based, no build tools needed
- **Reactive**: Automatic UI updates
- **Declarative**: Easy-to-read templates
- **Progressive**: Can be adopted incrementally
- **Lightweight**: Fast and efficient

---

**Built with Vue.js** 💚 | **Weather by OpenWeatherMap** 🌤️ | **Responsive with Bootstrap** 📱
