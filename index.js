const container = document.querySelector('.container');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const timeDetails = document.querySelector('.time-details');
const error = document.querySelector('.not-found');
const body = document.body;

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchButton.click();
    event.target.blur();
  }
}

document.addEventListener('keypress', handleKeyPress);

searchButton.addEventListener('click', () => {
	const APIKey = 'b39d513a750acb9a5bc743d054326fa9';
	const city = document.querySelector('.search-box input').value;

	if (city === '')
		return;

	weatherBox.classList.remove('fade-in');
	weatherDetails.classList.remove('fade-in');
	timeDetails.classList.remove('fade-in');

	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`)
		.then(response => response.json())
		.then(json => {

			if (json.cod === '404') {
				container.classList.add('enlarge');
				weatherBox.style.display = 'none';
				weatherDetails.style.display = 'none';
				timeDetails.style.display = 'none';
				error.style.display = 'block';
				error.classList.add('fade-in');
				return;
			}

			error.style.display = 'none';
			error.classList.remove('fadeIn');

			//Sunrise
			const unixSunrise = json.sys.sunrise;
			const timeZoneOffset = json.timezone;
			const sunriseDate = new Date(unixSunrise * 1000 + timeZoneOffset * 1000);

			const sunriseHours = sunriseDate.getUTCHours().toString().padStart(2);
			const sunriseMinutes = sunriseDate.getUTCMinutes().toString().padStart(2, '0');
			const sunriseSeconds = sunriseDate.getUTCSeconds().toString().padStart(2, '0');

			const sunrise = `${sunriseHours}:${sunriseMinutes}` + ' AM';

			//Sunset
			const unixSunset = json.sys.sunset;
			const sunsetDate = new Date(unixSunset * 1000 + timeZoneOffset * 1000);

			const sunsetHours = sunsetDate.getUTCHours().toString().padStart(2, '0');
			const sunsetMinutes = sunsetDate.getUTCMinutes().toString().padStart(2, '0');
			const sunsetSeconds = sunsetDate.getUTCSeconds().toString().padStart(2, '0');

			let sunset;
			sunsetHours > 12 ? sunset = `${sunsetHours - 12}:${sunsetMinutes}` + ' PM' : sunset = `${sunsetHours}:${sunsetMinutes}` + ' PM';
			//Current Local Time
			const currentTime = new Date();
				currentTime.setSeconds(currentTime.getSeconds() + json.timezone);
					const localHours = currentTime.getUTCHours().toString().padStart(2, '0');
					const localMinutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
					const localSeconds = currentTime.getUTCSeconds().toString().padStart(2, '0');
					let localtime;
					if (Number(localHours) === 12) {
						localtime = `${localHours}:${localMinutes}` + ' PM';
					} else if (Number(localHours) > 12) {
						localtime = `${localHours - 12}:${localMinutes}` + ' PM';
					} else if(Number(localHours) < 12) {
						localtime = `${localHours}:${localMinutes}` + ' AM';
					}		

			//Day or Night
			if (currentTime > sunsetDate || currentTime < sunriseDate) {
				body.classList.add('day-to-night');
				body.classList.remove('night-to-day');
			}

			if ((currentTime < sunsetDate && currentTime > sunriseDate) && body.classList.contains('day-to-night')) {
				body.classList.remove('day-to-night');
				body.classList.add('night-to-day');
			}



			const image = document.querySelector('.weather-box img');
			const temperature = document.querySelector('.weather-box .temperature');
			const description = document.querySelector('.weather-box .description');
			const humidity = document.querySelector('.weather-details .humidity span');
			const wind = document.querySelector('.weather-details .wind span');
			const localTime = document.querySelector('.time-details .time-now span');
			const sunriseTime = document.querySelector('.time-details .sunrise span');
			const sunsetTime = document.querySelector('.time-details .sunset span');

			switch (json.weather[0].main) {
				case 'Clear':
					switch (currentTime > sunsetDate || currentTime < sunriseDate) {
						case true:
							image.src = 'assets/clear-night.png';
							break;

						case false:
							image.src = 'assets/clear.png';
							break;
					}
					break;

				case 'Rain':
					image.src = 'assets/rain.png';
					break;

				case 'Snow':
					image.src = 'assets/snow.png';
					break;	

				case 'Clouds':
					image.src = 'assets/clouds.png';
					break;

				case 'Haze':
					image.src = 'assets/haze.png';
					break;	

				case 'Mist':
					image.src = 'assets/haze.png';
					break;

				case 'Thunderstorm':
					image.src = 'assets/thunderstorm.png';
					break;

				default:
					image.src = '';			
			}

			temperature.innerHTML = `${parseInt(json.main.temp)}<span>˚F</span>`;
			description.innerHTML = `${(json.weather[0].description)}`;
			humidity.innerHTML = `${json.main.humidity}%`;
			wind.innerHTML = `${parseInt(json.wind.speed)}mph`;
			localTime.innerHTML = localtime;
			sunriseTime.innerHTML = sunrise;
			sunsetTime.innerHTML = sunset;

			weatherBox.style.display = '';
			weatherDetails.style.display = '';
			timeDetails.style.display = '';
			weatherBox.classList.add('fade-in');
			weatherDetails.classList.add('fade-in');
			timeDetails.classList.add('fade-in');
			container.classList.add('enlarge');

			console.log(json);

		})
})
