//DOM elements for momento
const time = document.getElementById("time");
const period = document.getElementById("am-pm");
const timeLine = document.querySelector(".time-line");
const greeting = document.getElementById("greeting");
const name = document.getElementById("name");
const focus = document.getElementById("focus");

//DOM selection for weather
const userLocation = document.querySelector(".user-location");
const weatherIcon = document.querySelector(".weather-icon");
const tempDegree = document.querySelector(".temperature-degree");
const tempDesc = document.querySelector(".temperature-description");

//create weather object
const weather = {
  unit: "celsius",
};

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notification.style.display = "block";
  notification.innerHTML = "<p>Browser doesn't support geolocation</p>";
}

function setPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  getWeather(lat, long);
}

function showError(error) {
  console.log(error);
  notification.style.display = "block";
  notification.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(lat, long) {
  const key = "cb04f2859cde50372ad8d69941629ab2";
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=${key} `;

  fetch(api)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.temperature = Math.floor(data.main.temp);
      weather.iconId = data.weather[0].icon;
      weather.description = data.weather[0].description;
    })
    .then(function () {
      displayWeather();
    });
}

function displayWeather() {
  userLocation.innerHTML = weather.city;
  weatherIcon.innerHTML = `<img class="icon-img" src = "http://openweathermap.org/img/wn/${weather.iconId}@2x.png" />`;
  tempDegree.innerHTML = `${weather.temperature}<span class="mark">°C</span>`;
  tempDesc.innerHTML = `<p class="desc-text">${weather.description}</p>`;
}

function celsiusToFahrenheit(temp) {
  return (temp * 9) / 5 + 32;
}

tempDegree.addEventListener("click", function () {
  if (weather.temperature === undefined) return;
  if (weather.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature);
    fahrenheit = Math.floor(fahrenheit);
    tempDegree.innerHTML = `${fahrenheit}<span class="mark">°F</span>`;
    weather.unit = "fahrenheit";
  } else {
    tempDegree.innerHTML = `${weather.temperature}<span class="mark">°C</span>`;
    weather.unit = "celsius";
  }
});

//show the time function
function showTime() {
  let today = new Date();
  let hour = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();

  //set AM or PM
  //   hour >= 12 ? (amPm = "PM") : (amPm = "AM");
  amPm = hour >= 12 ? "PM" : "AM";

  //set 12h format, add zero to the single unit of min and sec
  hour > 12 ? (hour = hour - 12) : (hour = hour);
  min < 10 ? (min = "0" + min) : (min = min);
  sec < 10 ? (sec = "0" + sec) : (sec = sec);
  //same as - sec = sec < 10 ? "0" + sec : sec;

  //output time
  time.innerHTML = `${hour}<span>:</span>${min}`;
  period.innerHTML = amPm;

  //call the function every 1 s
  setTimeout(showTime, 1000);
}

//set bg image and greeting according to time
function showBgGreet() {
  let today = new Date();
  let hour = today.getHours();

  if (hour < 12) {
    document.body.style.backgroundImage = "url('images/morning.jpg')";
    greeting.innerText = "Good Morning,";
  } else if (hour < 18) {
    document.body.style.backgroundImage = "url('images/afternoon.jpg')";
    document.body.style.backgroundPosition = "center";
    greeting.innerText = "Good Afternoon,";
  } else {
    document.body.style.backgroundImage = "url('images/evening.jpg')";
    greeting.innerText = "Good Evening,";
    document.body.style.color = "#fff";
  }
}

//set customized name and focus
function getName() {
  if (localStorage.getItem("name") === null) {
    name.innerText = "[Enter name]";
  } else {
    name.innerText = localStorage.getItem("name");
  }
}

function getFocus() {
  if (localStorage.getItem("focus") === null) {
    // focus.innerText = "[Enter focus]";
    focus.style.borderBottom = "2px solid #ccc";
  } else {
    focus.innerText = localStorage.getItem("focus");
    focus.style.borderBottom = "0px solid white";
  }
}

//possible 1, user taps the enter key - keypress
name.addEventListener("keypress", setName);
focus.addEventListener("keypress", setFocus);

//possible 2, user clicks out of the area - blur
name.addEventListener("blur", setName);
focus.addEventListener("blur", setFocus);

function setName(e) {
  if (e.type === "keypress") {
    //make sure enter is pressed, enter is the code 13
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      //prevent enter into the next line, blur the name area
      name.blur();
    }
  } else {
    //else is the blur
    localStorage.setItem("name", e.target.innerText);
  }
}

function setFocus(e) {
  if (e.type === "keypress") {
    //make sure enter is pressed, enter is the code 13
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      //prevent enter into the next line, blur the name area
      focus.blur();
    }
  } else {
    //else is the blur
    localStorage.setItem("focus", e.target.innerText);
  }
}

//run the function
showTime();
showBgGreet();
getName();
getFocus();
setName();
setFocus();
