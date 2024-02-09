const app = Vue.createApp({
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
      navigator.geolocation.getCurrentPosition(function (position) {
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
          .then(function (response) {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(function (response) {
            this.datenPlacesAPI = response;
            this.placeString = 
              this.datenPlacesAPI.results[6].formatted_address;
            // document.getElementById("#placeString").innerHTML = JSON.stringify( //Ich hab' absolut keinen Plan wieso es mir den Ort nicht ausgibt... :(
            //   this.placeString
            // );
            console.log(this.placeString);
          });
      });
    },
    getTheWeather() {
      const weatherAPIurl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        this.lat +
        "&lon=" +
        this.lon +
        "&exclude=minutely,hourly,alerts&lang=de&units=metric&appid=fdfcb95e1babade12aa1dc9af7cc7efd";
      console.log(weatherAPIurl);
      fetch(weatherAPIurl)
        .then((response) => response.json())
        .then((data) => (this.datenWeatherAPI = data))
        .then(
          (data) => (
            (this.timestamp = data.current.dt),
            (this.temperature = data.current.temp),
            (this.weatherStatus = data.current.weather[0].description),
            (this.imgUrl =
              "https://openweathermap.org/img/wn/" +
              data.current.weather[0].icon +
              "@2x.png"),
            (this.temparray[1] = data.daily[0].temp.day),
            (this.temparray[2] = data.daily[1].temp.day),
            (this.temparray[3] = data.daily[2].temp.day),
            (this.temparray[4] = data.daily[3].temp.day),
            (this.temparray[5] = data.daily[4].temp.day),
            (this.temparray[6] = data.daily[5].temp.day),
            (this.temparray[7] = data.daily[6].temp.day),
            (this.temparray[8] = data.daily[7].temp.day),
            (this.descrArray[1] = data.daily[0].weather[0].description),
            (this.descrArray[2] = data.daily[1].weather[0].description),
            (this.descrArray[3] = data.daily[2].weather[0].description),
            (this.descrArray[4] = data.daily[3].weather[0].description),
            (this.descrArray[5] = data.daily[4].weather[0].description),
            (this.descrArray[6] = data.daily[5].weather[0].description),
            (this.descrArray[7] = data.daily[6].weather[0].description),
            (this.descrArray[8] = data.daily[7].weather[0].description),
            (this.imgSrcArray[1] =
              "https://openweathermap.org/img/wn/" +
              data.daily[0].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[2] =
              "https://openweathermap.org/img/wn/" +
              data.daily[1].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[3] =
              "https://openweathermap.org/img/wn/" +
              data.daily[2].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[4] =
              "https://openweathermap.org/img/wn/" +
              data.daily[3].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[5] =
              "https://openweathermap.org/img/wn/" +
              data.daily[4].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[6] =
              "https://openweathermap.org/img/wn/" +
              data.daily[5].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[7] =
              "https://openweathermap.org/img/wn/" +
              data.daily[6].weather[0].icon +
              "@2x.png"),
            (this.imgSrcArray[8] =
              "https://openweathermap.org/img/wn/" +
              data.daily[7].weather[0].icon +
              "@2x.png")
          )
        );
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

app.mount("#app");
