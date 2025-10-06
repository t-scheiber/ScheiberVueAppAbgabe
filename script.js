const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      title: "Weather App with Vue JS",
      datenWeatherAPI: [],
      datenPlacesAPI: {},
      placesAPIURL: "",
      placeString: "",
      placeStringPlaceholder: "Wien, Österreich",
      timestamp: 1636845558,
      temperature: 20,
      stadt: "",
      stadtteil: "",
      tempPrefix: "Temperatur aktuell:",
      tempSuffix: "° C",
      weatherStatus: "",
      lon: 16.373819,
      lat: 48.208174,
      am: "am",
      um: "um",
      wetterString: "Wetterbericht für",
      tempfuer: "Temperatur für",
      datumUhrzeit: "",
      wochentage: [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ],
      monat: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ],
      temparray: [],
      descrArray: [],
      vorhersage: "Vorhersage: ",
      imgUrl: "",
      imgSrcArray: [],
    };
  },
  methods: {
    getTheLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lon = position.coords.longitude;
        console.log(this.lat, this.lon);
        const geoAPIurl =
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          this.lat +
          "," +
          this.lon +
          "&key=AIzaSyD9Q9ReYYVC92AiA4GV589_RcqZfYfiN1Q";
        console.log(geoAPIurl);

        fetch(geoAPIurl)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((response) => {
            this.datenPlacesAPI = response;
            if (response.results && response.results.length > 0) {
              this.placeString = response.results[0].formatted_address;
            }
            console.log(this.placeString);
          })
          .catch((error) => {
            console.error('Geolocation API error:', error);
          });
      });
    },
    getTheWeather() {
      // Check if API key is configured
      if (typeof window.CONFIG === 'undefined' || !window.CONFIG.OPENWEATHER_API_KEY) {
        console.error('ERROR: OpenWeatherMap API key not configured. Please copy config.example.js to config.js and add your API key.');
        alert('API key not configured. Please see console for details.');
        return;
      }
      
      const weatherAPIurl =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        this.lat +
        "&lon=" +
        this.lon +
        "&lang=de&units=metric&appid=" + window.CONFIG.OPENWEATHER_API_KEY;
      console.log(weatherAPIurl);
      fetch(weatherAPIurl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.datenWeatherAPI = data;
          this.timestamp = data.dt;
          this.temperature = Math.round(data.main.temp);
          this.weatherStatus = data.weather[0].description;
          this.imgUrl =
            "https://openweathermap.org/img/wn/" +
            data.weather[0].icon +
            "@2x.png";
        })
        .catch((error) => {
          console.error('Weather API error:', error);
        });
      
      // Get 5-day forecast
      const forecastAPIurl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        this.lat +
        "&lon=" +
        this.lon +
        "&lang=de&units=metric&appid=" + window.CONFIG.OPENWEATHER_API_KEY;
      
      fetch(forecastAPIurl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Get one forecast per day (every 8th item = 24 hours)
          for (let i = 0; i < 8; i++) {
            const forecastIndex = i * 8;
            if (data.list[forecastIndex]) {
              this.temparray[i + 1] = Math.round(data.list[forecastIndex].main.temp);
              this.descrArray[i + 1] = data.list[forecastIndex].weather[0].description;
              this.imgSrcArray[i + 1] =
                "https://openweathermap.org/img/wn/" +
                data.list[forecastIndex].weather[0].icon +
                "@2x.png";
            }
          }
        })
        .catch((error) => {
          console.error('Forecast API error:', error);
        });
    },
    formatDate(timestamp) {
      timestampDate = new Date(timestamp * 1000);
      tag = timestampDate.getDay();
      datum =
        timestampDate.getDate() +
        " " +
        this.monat[timestampDate.getMonth()] +
        " " +
        (timestampDate.getYear() + 1900);
      return this.wochentage[tag] + ", " + datum;
    },
    formatTage(timestamp, num) {
      timestampDate = new Date(timestamp * 1000);
      tag = timestampDate.getDay();
      return this.wochentage[(tag + num) % 7];
    },
    formatTime(timestamp) {
      timestampDate = new Date(timestamp * 1000);
      stunden = timestampDate.getHours();
      minuten = timestampDate.getMinutes();
      if (stunden < 10) stunden = "0" + stunden;
      if (minuten < 10) minuten = "0" + minuten;
      return stunden + ":" + minuten;
    },
  },
  beforeMount() {
    this.getTheLocation();
    this.getTheWeather();
  },
});

app.mount('#app');
