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
    async getTheLocation() {
      const position = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        let settled = false;
        const finish = (value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(value);
        };
        const timer = setTimeout(() => finish(null), 8000);
        try {
          navigator.geolocation.getCurrentPosition(
            (value) => finish(value),
            () => finish(null),
            {timeout: 8000, maximumAge: 0, enableHighAccuracy: false}
          );
        } catch {
          finish(null);
        }
      });
      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;
      const valid = Number.isFinite(latitude) && Math.abs(latitude) <= 90 &&
        Number.isFinite(longitude) && Math.abs(longitude) <= 180;
      this.lat = valid ? latitude : 48.208174;
      this.lon = valid ? longitude : 16.373819;

      if (typeof window.CONFIG === 'undefined' || !window.CONFIG.GOOGLE_MAPS_API_KEY) {
        console.error('ERROR: Google Maps API key not configured. Please copy config.example.js to config.js and add your API key.');
        return;
      }
      const geoAPIurl =
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        this.lat + "," + this.lon + "&key=" + window.CONFIG.GOOGLE_MAPS_API_KEY;
      // Reverse geocoding must not delay weather after location is resolved.
      fetch(geoAPIurl)
        .then((response) => {
          if (!response.ok) throw new Error('Geocoding request failed');
          return response.json();
        })
        .then((response) => {
          if (!Array.isArray(response?.results)) throw new Error('Invalid geocoding response');
          this.datenPlacesAPI = response;
          if (typeof response.results[0]?.formatted_address === 'string') {
            this.placeString = response.results[0].formatted_address;
          }
        })
        .catch(() => {
          console.error('Geolocation API request failed.');
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
      const currentRequest = fetch(weatherAPIurl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!Number.isFinite(data?.dt) || !Number.isFinite(data?.main?.temp) ||
              typeof data?.weather?.[0]?.description !== 'string' ||
              typeof data?.weather?.[0]?.icon !== 'string') {
            throw new Error('Invalid weather response');
          }
          this.datenWeatherAPI = data;
          this.timestamp = data.dt;
          this.temperature = Math.round(data.main.temp);
          this.weatherStatus = data.weather[0].description;
          this.imgUrl =
            "https://openweathermap.org/img/wn/" +
            data.weather[0].icon +
            "@2x.png";
        })
        .catch(() => {
          console.error('Weather API request failed.');
        });
      
      // Get 5-day forecast
      const forecastAPIurl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        this.lat +
        "&lon=" +
        this.lon +
        "&lang=de&units=metric&appid=" + window.CONFIG.OPENWEATHER_API_KEY;
      
      const forecastRequest = fetch(forecastAPIurl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!Array.isArray(data?.list)) throw new Error('Invalid forecast response');
          // Get one forecast per day (every 8th item = 24 hours)
          for (let i = 0; i < 8; i++) {
            const forecastIndex = i * 8;
            if (data.list[forecastIndex]) {
              const item = data.list[forecastIndex];
              if (!Number.isFinite(item?.main?.temp) ||
                  typeof item?.weather?.[0]?.description !== 'string' ||
                  typeof item?.weather?.[0]?.icon !== 'string') {
                throw new Error('Invalid forecast item');
              }
              this.temparray[i + 1] = Math.round(data.list[forecastIndex].main.temp);
              this.descrArray[i + 1] = data.list[forecastIndex].weather[0].description;
              this.imgSrcArray[i + 1] =
                "https://openweathermap.org/img/wn/" +
                data.list[forecastIndex].weather[0].icon +
                "@2x.png";
            }
          }
        })
        .catch(() => {
          console.error('Forecast API request failed.');
        });
      return Promise.all([currentRequest, forecastRequest]);
    },
    formatDate(timestamp) {
      const timestampDate = new Date(timestamp * 1000);
      const tag = timestampDate.getDay();
      const datum =
        timestampDate.getDate() +
        " " +
        this.monat[timestampDate.getMonth()] +
        " " +
        (timestampDate.getYear() + 1900);
      return this.wochentage[tag] + ", " + datum;
    },
    formatTage(timestamp, num) {
      const timestampDate = new Date(timestamp * 1000);
      const tag = timestampDate.getDay();
      return this.wochentage[(tag + num) % 7];
    },
    formatTime(timestamp) {
      const timestampDate = new Date(timestamp * 1000);
      let stunden = timestampDate.getHours();
      let minuten = timestampDate.getMinutes();
      if (stunden < 10) stunden = "0" + stunden;
      if (minuten < 10) minuten = "0" + minuten;
      return stunden + ":" + minuten;
    },
  },
  async beforeMount() {
    await this.getTheLocation();
    await this.getTheWeather();
  },
});

app.mount('#app');
