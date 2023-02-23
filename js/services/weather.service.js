import { API_KEY_WEATHER } from './keys.service.js'

export const weatherService = {
	getWeather,
}

function getWeather({ lat, lng }) {
	return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHER}`).then(res => {
		return {
			weather: res.data.weather[0].main,
			temp: res.data.main.temp,
			minTemp: res.data.main['temp_min'],
			maxTemp: res.data.main['temp_max'],
			windSpeed: res.data.wind.speed,
			state: res.data.sys.country,
		}
	})
}
