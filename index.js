const container = document.querySelector('.container');
const containerTwo = document.querySelector('.container-two');
const searchButton = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const timeDetails = document.querySelector('.time-details');
const localNews = document.querySelector('.local-news');
const articleOne = document.querySelector('.article-one');
const articleTwo = document.querySelector('.article-two');
const articleThree = document.querySelector('.article-three');
const newsList = document.querySelector('.news-list');
const pElement = document.createElement('p');
	pElement.textContent = "Sorry, couldn't find related news."
const error = document.querySelector('.not-found');
const body = document.querySelector('.body');

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchButton.click();
    event.target.blur();
  }
}

document.addEventListener('keypress', handleKeyPress);

searchButton.addEventListener('click', () => {
	const city = document.querySelector('.search-box input').value.toLowerCase();

	if (city === '')
		return;

	weatherBox.classList.remove('fade-in');
	weatherDetails.classList.remove('fade-in');
	timeDetails.classList.remove('fade-in');
	localNews.classList.remove('fade-in');
	containerTwo.classList.remove('fade-in');

  const requestOptions = {
    method: 'GET'
  };

	fetch(`https://weather-app-proxy1-af2cdf67cffc.herokuapp.com/weather?city=${encodeURIComponent(city)}`, requestOptions)
		.then(response => response.json())
		.then(json => {

			articleOne.innerHTML = '';
			articleTwo.innerHTML = '';
			articleThree.innerHTML = '';

			if(pElement.parentElement === newsList) {
					newsList.removeChild(pElement)
			};

			if (json.cod === '404') {
				container.classList.add('enlarge');
				weatherBox.style.display = 'none';
				weatherDetails.style.display = 'none';
				timeDetails.style.display = 'none';
				localNews.style.display = 'none';
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
					const localHours = currentTime.getUTCHours().toString().padStart(2);
					const localMinutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
					const localSeconds = currentTime.getUTCSeconds().toString().padStart(2, '0');
					let localtime;
					if (Number(localHours) === 12) {
						localtime = `${localHours}:${localMinutes}` + ' PM';
					} else if (Number(localHours) > 12) {
						localtime = `${localHours - 12}:${localMinutes}` + ' PM';
					} else if (Number(localHours) < 12 && Number(localHours) > 0) {
						localtime = `${localHours}:${localMinutes}` + ' AM';
					} else if (Number(localHours) === 0) {
						localtime = `12:${localMinutes}` + ' AM';
					}

			//Day or Night
			if (currentTime > sunsetDate || currentTime < sunriseDate) {
				body.classList.add('faade-in');
			}

			if ((currentTime < sunsetDate && currentTime > sunriseDate) && body.classList.contains('faade-in')) {
				body.classList.remove('faade-in');
			}



			const image = document.querySelector('.weather-box img');
			const temperature = document.querySelector('.weather-box .temperature');
			const description = document.querySelector('.weather-box .description');
			const humidity = document.querySelector('.weather-details .humidity span');
			const wind = document.querySelector('.weather-details .wind span');
			const localTime = document.querySelector('.time-details .time-now span');
			const sunriseTime = document.querySelector('.time-details .sunrise span');
			const sunsetTime = document.querySelector('.time-details .sunset span');
			longitude = json.coord.lon;
			latitude = json.coord.lat;

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
			localNews.style.display = '';
			containerTwo.style.display = '';
			weatherBox.classList.add('fade-in');
			weatherDetails.classList.add('fade-in');
			timeDetails.classList.add('fade-in');
			localNews.classList.add('fade-in');
			containerTwo.classList.add('fade-in');
			container.classList.add('enlarge');

			console.log(json);

	function getCurrentDate() {
  	const now = new Date();
  	now.setDate(now.getDate() - 3); // Subtract one day

  	let year = now.getFullYear();
  	let month = String(now.getMonth() + 1).padStart(2, '0');
  	let day = String(now.getDate()).padStart(2, '0');

  	if (day <= '00') {
    // If day becomes zero, set it to 28
   		day = '28';
  	}

  	return `${year}-${month}-${day}`;
	}

	const currentDate = getCurrentDate();
	console.log(currentDate);

	const country = json.sys.country.toLowerCase();
	
	articleOne.innerHTML = "Searching...";

	let controller;
	let signal;

	function makeFetchRequest() {
  	if (controller) {
    // Abort the previous request
    controller.abort();
  	}

 			controller = new AbortController();
  		signal = controller.signal;

			fetch(`https://api.worldnewsapi.com/search-news?api-key=2eab0e76597441efbb5e1da1361a30aa&text=${encodeURIComponent(city)}&source-countries=${encodeURIComponent(country)}&earliest-publish-date=${encodeURIComponent(currentDate)}`, { signal })
				.then(response => response.json())
				.then(json => {
					console.log(json);
					if(json.news.length >= 3) {
				    const articles = json.news.slice(0, 3);
				    	if (articles[0].title.length === 0) {
				    		articleOne.innerHTML = '';
				    	} else {
				    	articleOne.innerHTML = "- " + articles[0].title;
				    		articleOne.setAttribute('href', articles[0].url);				    		
				    	}
				    	if (articles[1].title.length === 0) {
				    		articleTwo.innerHTML = '';
				    	} else {
				    	articleTwo.innerHTML = "- " + articles[1].title;
				    		articleTwo.setAttribute('href', articles[1].url);				    		
				    	}
				    	if (articles[2].title.length === 0) {
				    		articleThree.innerHTML = '';
				    	} else {
				    	articleThree.innerHTML = "- " + articles[2].title;
				    		articleThree.setAttribute('href', articles[2].url);				    		
				    	}			
					} else if(json.news.length === 2) {
							const articles = json.news.slice(0, 2);
				    	if (articles[0].title.length === 0) {
				    		articleOne.innerHTML = '';
				    	} else {
				    	articleOne.innerHTML = "- " + articles[0].title;
				    		articleOne.setAttribute('href', articles[0].url);				    		
				    	}
				    	if (articles[1].title.length === 0) {
				    		articleTwo.innerHTML = '';
				    	} else {
				    	articleTwo.innerHTML = "- " + articles[1].title;
				    		articleTwo.setAttribute('href', articles[1].url);				    		
				    	}
					} else if (json.news.length === 1) {
							const articles = json.news[0];
				    	if (articles[0].title.length === 0) {
				    		articleOne.innerHTML = '';
				    	} else {
				    	articleOne.innerHTML = "- " + articles[0].title;
				    		articleOne.setAttribute('href', articles[0].url);				    		
				    	}
					}	else if (json.news.length === 0) {
							articleOne.innerHTML = "";
							newsList.appendChild(pElement);
					}	
				})
	}
	makeFetchRequest();
	})
})
