import { API_KEY_GOOGLE_MAPS } from './keys.service.js'
import { utilService } from './util.service.js'

export const mapService = {
	initMap,
	addMarker,
	panTo,
	getAddressCoords,
	getLatLng,
	getCurrPos,
	getUserPos,
}

// Var that is used throughout this Module (not global)
var gMap, gCurrPos
var gCurrMarker

function initMap(lat = 32.0749831, lng = 34.9120554) {
	return _connectGoogleApi().then(() => {
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 15,
		})

		panTo(lat, lng)
		gCurrMarker = addMarker()
		gMap.addListener('click', _onMap)
	})
}

function getCurrPos() {
	return gCurrPos
}

function _onMap(ev) {
	const { lat, lng } = getLatLng(ev.latLng)

	utilService.setQueryParams({ lat: lat })
	utilService.setQueryParams({ lng: lng })

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
		position: gCurrPos,
		map: gMap,
		title,
	})
	return marker
}

function panTo(lat, lng) {
	gCurrPos = { lat, lng }

	var laLatLng = new google.maps.LatLng(lat, lng)
	gCurrMarker?.setOptions({
		position: laLatLng,
	})

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

function getAddressCoords(address) {
	return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY_GOOGLE_MAPS}`).then(res => {
		if (!res.data.results.length) return Promise.reject()
		return Promise.resolve(res.data.results[0].geometry.location)
	})
}

function getUserPos() {
	if (!navigator.geolocation) return
	return new Promise((resolve, reject) => {
		return navigator.geolocation.getCurrentPosition(resolve, reject)
	}).then(({ coords }) => {
		return {
			lat: coords.latitude,
			lng: coords.longitude,
		}
	})
}
