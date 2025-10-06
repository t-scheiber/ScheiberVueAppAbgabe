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

```bash
# No build process required!
# Simply open index.html in a web browser

# Or serve with a local server:
npx serve .
```

## 🏗️ Project Structure

```
ScheiberVueAppAbgabe/
├── index.html      # Main HTML with Vue app
├── script.js       # Vue.js application logic
├── style.css       # Custom styling
├── images/         # Weather icons and assets
└── README.md       # Documentation
```

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
