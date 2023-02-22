import { API_KEY_GOOGLE_MAPS } from './keys.service.js'
export const mapService = {
	initMap,
	addMarker,
	panTo,
	getAddressInLatLng,
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

		gCurrMarker = addMarker()
		gMap.addListener('click', _onMap)
	})
}

function _onMap(ev) {
	const { lat, lng } = _getLatLng(ev.latLng)
	document.querySelector('span.user-pos').innerText = `Latitude: ${lat} - Longitude: ${lng}`
	gCurrMarker.setOptions({
		position: { lat, lng },
	})

	panTo(lat, lng)
}

function _getLatLng(latLng) {
	return {
		lat: latLng.lat(),
		lng: latLng.lng(),
	}
}

function addMarker(title = '') {
	var marker = new google.maps.Marker({
		position: _getLatLng(gMap.getCenter()),
		map: gMap,
		title,
	})
	return marker
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
