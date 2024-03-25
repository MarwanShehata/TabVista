/* eslint max-classes-per-file: "off" */
/* eslint-disable */

document.addEventListener('DOMContentLoaded', function () {
  fadeIn(document.querySelector('.fade-in'));

  const userForm = document.querySelector('.userForm');
  const clock = document.querySelector('.clock');
  const mantra = document.querySelector('.mantra');

  // Check if first name and email are already in local storage
  const firstName = localStorage.getItem('firstName');
  const email = localStorage.getItem('email');

  if (firstName && email) {
    // If first name and email are already in local storage, show the clock and mantra
    clock.style.display = 'block';
    updateMantra(firstName);
    mantra.style.display = 'block';
    userForm.style.display = 'none';
  } else {
    // If first name and/or email are not in local storage, show the form and hide the clock and mantra
    clock.style.display = 'none';
    mantra.style.display = 'none';
    userForm.style.display = 'block';
  }

  userForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('email').value;
    const firstNameRegex = /^[a-zA-Z]{1,10}$/;
    if (!firstName || firstNameRegex.test(firstName) || firstName.length > 10) {
      alert('Please enter a valid first name (max 10 characters, no spaces).');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!emailRegex.test(email) || !firstNameRegex.test(firstName)) {
      alert('Either your email address or first name are incorrect');
      return;
    }
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('email', email);

    // Show the clock and mantra and remove the form after submission
    clock.style.display = 'block';
    updateMantra(firstName);
    mantra.style.display = 'block';
    userForm.remove();
  });

  function updateMantra(firstName) {
    const now = new Date();
    const hours = now.getHours();
    let message;
    let greeting;
    let name;

    if (hours >= 5 && hours < 12) {
      greeting = `Good Morning, `;
    } else if (hours >= 12 && hours < 17) {
      greeting = `Good Afternoon, `;
    } else if (hours >= 17 && hours < 20) {
      greeting = `Good Evening, `;
    } else {
      greeting = `Good Night, `;
    }
    name = firstName;
    message = greeting + name;
    mantra.textContent = message;
  }

  // Update the mantra text every hour
  setInterval(
    function () {
      if (firstName) {
        updateMantra(firstName);
      }
    },
    60 * 60 * 1000,
  ); // 60 seconds * 60 minutes * 1000 milliseconds = 1 hour
});

//////////////////////////////////////
function fadeIn(element) {
  element.style.opacity = 0;
  element.classList.remove('hidden');

  let opacity = 0;
  let interval = setInterval(() => {
    opacity += 0.02;
    element.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(interval);
    }
  }, 5);
}

document.addEventListener('DOMContentLoaded', function () {
  fadeIn(document.querySelector('.fade-in'));
});
/////
class Clock {
  constructor(clockElement, mainTextElement, userName) {
    this.clockElement = clockElement;
    this.mainTextElement = mainTextElement;
    this.userName = userName;
    this.setupClock();
  }

  setupClock() {
    this.updateTime();
    this.startClockTicking();
  }

  startClockTicking() {
    setInterval(() => this.updateTime(), 60000);
  }

  updateTime() {
    const dateObj = new Date();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const time = `${hours}:${minutes}`;
    this.clockElement.textContent = time;

    this.greetUser(hours);
  }

  greetUser(hours) {
    if (hours >= 5 && hours < 12) {
      this.mainTextElement.textContent = `Good Morning, ${this.userName}`;
    } else if (hours >= 12 && hours < 17) {
      this.mainTextElement.textContent = `Good Afternoon, ${this.userName}`;
    } else if (hours >= 17 && hours < 20) {
      this.mainTextElement.textContent = `Good Evening, ${this.userName}`;
    } else {
      this.mainTextElement.textContent = `Good Night, ${this.userName}`;
    }
  }
}

const clockElement = document.querySelector('.clock');
const mainTextElement = document.querySelector('.mantra');

let userName;
/* Hardcoded, to be changed dynamically from input from users */
/* Either a greeting or a mantra */
/* That's why I put a general name for .mantra as mainTextElement */

// eslint-disable-next-line no-unused-vars
const clock = new Clock(clockElement, mainTextElement, userName);

/// ///////////////////
class WeatherApp {
  #API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  #city = document.querySelector('.city');
  #weather = document.querySelector('.weather');
  #feelsLikeElement = document.querySelector('.feelsLikeValue');
  #humidityElement = document.querySelector('.humidityValue');
  #weatherIcon = document.querySelector('#weatherIcon');
  #weatherTemp = document.querySelector('.weatherTemp');
  #weatherDescription = document.querySelector('.weatherDescription');

  static #getCoordinates() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000 },
      );
    });
  }

  static #handleGeolocationError(error) {
    console.log(error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      default:
        console.log('An error occurred while getting the location.');
    }
  }

  async #fetchWeatherData(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.#API_KEY}&units=metric`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const data = await response.json();
      localStorage.setItem('openweathermapResponseJSON', JSON.stringify(data));
      this.#updateUI(data);
      this.#removeWeatherDataFromLocalStorage();
    } catch (error) {
      console.error(error);
    }
  }

  #updateUI(data) {
    const temp = Math.floor(data.main.temp);
    const weatherDescription = data.weather[0].description;
    const cityName = data.name;
    const countryName = data.sys.country;
    const feelsLike = Math.floor(data.main.feels_like);
    const iconCode = data.weather[0].icon;
    console.log(iconCode);

    const humidity = Math.floor(data.main.humidity);
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const capitalizedWeatherDescription = weatherDescription.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );

    this.#weatherTemp.textContent = `${temp}°C, `;
    this.#weatherDescription.textContent = `${capitalizedWeatherDescription}`;
    this.#city.textContent = `${cityName}, ${countryName}`;
    this.#feelsLikeElement.textContent = `${feelsLike}°C`;
    this.#humidityElement.textContent = `${humidity}%`;

    this.#feelsLikeElement.closest('li').classList.remove('hidden');
    this.#humidityElement.closest('li').classList.remove('hidden');

    this.#weatherIcon.src = iconUrl;
    this.#weatherIcon.alt = weatherDescription;
    this.#weatherIcon.classList.remove('hidden');
  }
  #removeWeatherDataFromLocalStorage() {
    setTimeout(
      () => {
        localStorage.removeItem('openweathermapResponseJSON');
      },
      1 * 60 * 60 * 1000,
    );
  }

  async getWeather() {
    const storedData = localStorage.getItem('openweathermapResponseJSON');

    if (storedData) {
      this.#updateUI(JSON.parse(storedData));
    } else {
      try {
        const coordinates = await WeatherApp.#getCoordinates();
        this.#fetchWeatherData(coordinates.lat, coordinates.lon);
      } catch (error) {
        WeatherApp.#handleGeolocationError(error);
      }
    }
  }
}

const app = new WeatherApp();
app.getWeather();

/////////////
class QuoteFetcher {
  // Private properties
  #quoteLength = 100;
  #apiURL = `https://api.quotable.io/random?maxLength=${this.#quoteLength}`;
  #quoteElement = document.querySelector('#quote');
  #authorElement = document.querySelector('.quoteAuthor');
  constructor() {
    this.#fetchRandomQuote();
  }

  async #fetchRandomQuote() {
    try {
      const response = await fetch(this.#apiURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      this.#quoteElement.textContent = data.content;
      this.#authorElement.textContent = data.author;
    } catch (error) {
      console.error(error);
    }
  }

  static init() {
    new QuoteFetcher();
  }
}

QuoteFetcher.init();
////////

const UNSPLASH_API_ENDPOINT = `https://api.unsplash.com/photos/random/?query=nature&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&fm=jpg&fit=crop&w=1080&q=80&fit=max`;
const backgroundImage = document.querySelector('.container');
/////////////
const displayPhotoDetails = () => {
  const storedPhotoInfo = localStorage.getItem('unsplashResponseObject');
  if (!storedPhotoInfo) {
    console.log('No photo details found in localStorage.');
    return;
  }
  const photoInformation = JSON.parse(storedPhotoInfo);
  const photographer = document.querySelector('.photographer');
  const photoLink = document.querySelector('.photoLink');
  console.log(photoInformation);
  photoLink.href = photoInformation.imageURL;
  photographer.textContent = photoInformation.photographer;
  photographer.href = photoInformation.photographerLink;
};
/////////////
const unsplashFetch = async () => {
  try {
    const response = await fetch(UNSPLASH_API_ENDPOINT, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);

    const photoInfo = {
      title: data.alt_description,
      photographer: data.user.name,
      imageURL: data.urls.regular,
      photographerLink: data.user.links.html,
      likes: data.likes,
    };
    localStorage.setItem('unsplashResponseObject', JSON.stringify(photoInfo));
    setBackgroundImage(photoInfo.imageURL);
    displayPhotoDetails();
  } catch (error) {
    console.error(error);
  }
};

const setBackgroundImage = (imageUrl) => {
  backgroundImage.style.backgroundImage = `url("${imageUrl}")`;
};

const storedPhotoInfo = localStorage.getItem('unsplashResponseObject');

if (!storedPhotoInfo) {
  unsplashFetch();
} else {
  const photoInfo = JSON.parse(storedPhotoInfo);
  setBackgroundImage(photoInfo.imageURL);
  displayPhotoDetails();
}
//////////////

const city = document.querySelector('.city');
const weatherContainer = document.querySelector('.weatherContainer');
const feelsLike = document.querySelector('.feelsLike');
const feelsLikeValue = document.querySelector('.feelsLikeValue');
const humidity = document.querySelector('.humidity');
const humidityValue = document.querySelector('.humidityValue');

let isVisible = false;

city.addEventListener('click', toggleVisibility);
weatherContainer.addEventListener('click', toggleVisibility);

function toggleVisibility() {
  isVisible = !isVisible;

  if (isVisible) {
    feelsLike.style.display = 'block';
    feelsLikeValue.style.display = 'block';
    humidity.style.display = 'block';
    humidityValue.style.display = 'block';
  } else {
    feelsLike.style.display = 'none';
    feelsLikeValue.style.display = 'none';
    humidity.style.display = 'none';
    humidityValue.style.display = 'none';
  }
}
/////////////
class App {
  #tasks;
  #storageKey = 'simpletodo';

  constructor() {
    this.#tasks = document.querySelector('.app-list ul');
    this.init();
  }

  init() {
    this.storage('get');
    document
      .querySelector('.app-insert input')
      .addEventListener('keyup', this.#handleInput.bind(this));
    document
      .querySelector('.app-list')
      .addEventListener('click', this.#handleClick.bind(this));
  }

  #handleInput(e) {
    if (e.which === 13 && e.target.value !== '') {
      this.addTask(e.target.value);
      this.storage('update');
      e.target.value = '';
    }
  }

  #handleClick(e) {
    if (e.target.classList.contains('remove-task')) {
      this.removeTask(e.target.parentNode);
    } else if (e.target.classList.contains('task')) {
      this.completeTask(e.target);
    }
  }

  addTask(task) {
    const newTask = document.createElement('li');
    newTask.setAttribute('class', 'task');
    newTask.innerHTML =
      task +
      '<a href="javascript:;" class="remove-task" id="remove">remove</a>';
    this.#tasks.appendChild(newTask);
  }

  removeTask(task) {
    task.style.opacity = 0;
    setTimeout(() => {
      task.remove();
      this.storage('update');
    }, 400);
  }

  completeTask(task) {
    task.classList.toggle('task-complete');
    this.storage('update');
  }

  storage(type) {
    if (type === 'get') {
      if (localStorage.getItem(this.#storageKey) !== null) {
        this.#tasks.innerHTML = localStorage.getItem(this.#storageKey);
      }
    } else if (type === 'update') {
      const str = this.#tasks.innerHTML;
      localStorage.setItem(this.#storageKey, str);
    }
  }

  static getStorageKey() {
    return new this().#storageKey;
  }
}

new App();

/* 

| Method Type   | Purpose                              | Example                                              |
| ------------- | ------------------------------------ | ---------------------------------------------------- |
| Private (`#`) | Internal tasks, logic implementation | `#handleInput`, `#handleClick`, `#tasks.appendChild` |
| Public        | External interaction, user actions   | `addTask`, `removeTask`, `completeTask`, `storage`   |



    Breakdown:
        setTimeout(() => { ... }, 400): Delays the execution of the code within the arrow function by 400 milliseconds (0.4 seconds).
        this.storage('update'): Calls the storage method with the argument "update" to save data to local storage.

    Purpose: This code creates a visual delay for actions like removing a task from the list. It allows for a smoother user experience by showing a fading animation before updating the data in local storage.
    
        e.which === 13: Checks if the keycode of the key pressed is 13, which corresponds to the Enter key.
        e.target.value !== '': Ensures that the input field is not empty.

    Purpose: This condition typically triggers actions when the user presses Enter and has entered some text, commonly used for actions like submitting forms or adding items in a list.

    ***Output HTML***:
  ```html 
  <nav class="topLeft" role="navigation" aria-label="Settings menu">
    <section class="app-insert">
      <input type="text" name="task" placeholder="Insert your task here..." />
    </section>

    <section class="app-list">
      <ul>
        <li class="task">
          Buy groceries<a href="javascript:;" class="remove-task">remove</a>
        </li>
        <li class="task">
          Rent Airbnb<a href="javascript:;" class="remove-task">remove</a>
        </li>
      </ul>
    </section>
  </nav>
  ```

*/
