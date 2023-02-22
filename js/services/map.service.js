import { API_KEY_GOOGLE_MAPS, API_KEY_WEATHER } from './keys.service.js'
import { utilService } from './util.service.js'

export const mapService = {
	initMap,
	addMarker,
	panTo,
	getAddressInLatLng,
	getWeather,
	getLatLng,
}

// Var that is used throughout this Module (not global)
var gMap
var gCurrMarker

function initMap(lat = 32.0749831, lng = 34.9120554) {
	return _connectGoogleApi().then(() => {
		console.log('google available')
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 15,
		})

		addMarker().then(res => (gCurrMarker = res))
		gMap.addListener('click', _onMap)
	})
}

function _onMap(ev) {
	const { lat, lng } = getLatLng(ev.latLng)
	document.querySelector('span.user-pos').innerText = `Latitude: ${lat} - Longitude: ${lng}`
	gCurrMarker.setOptions({
		position: { lat, lng },
	})
	//c-I don't think it's the best location but I didn't know where to put it
	utilService.setQueryParams({ lat: lat })
	utilService.setQueryParams({ lng: lng })
	getWeather(lat, lng).then(res => {
		;`<div class="card"></div>`
	})
	panTo(lat, lng)
}

function getLatLng(latLng) {
	return {
		lat: latLng.lat(),
		lng: latLng.lng(),
	}
}

function addMarker(title = '') {
	var marker = new google.maps.Marker({
		position: getLatLng(gMap.getCenter()),
		map: gMap,
		title,
	})
	return Promise.resolve(marker)
}

function panTo(lat, lng) {
	var laLatLng = new google.maps.LatLng(lat, lng)
	gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
	if (window.google) return Promise.resolve()

	var elGoogleApi = document.createElement('script')
	elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_GOOGLE_MAPS}&callback=initMap`
	elGoogleApi.async = true
	document.body.append(elGoogleApi)

	return new Promise((resolve, reject) => {
		elGoogleApi.onload = resolve
		elGoogleApi.onerror = () => reject('Google script failed to load')
	})
}

function getAddressInLatLng(address) {
	return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY_GOOGLE_MAPS}`).then(res => {
		if (!res.data.results.length) return Promise.reject()
		return Promise.resolve(res.data.results[0].geometry)
	})
}

function getWeather(lat, lng) {
	return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHER}`).then(res => {
		return Promise.resolve(res)
	})
}
