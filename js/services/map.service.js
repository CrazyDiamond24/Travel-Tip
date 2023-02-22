import { API_KEY_GOOGLE_MAPS } from './keys.service.js'
export const mapService = {
	initMap,
	addMarker,
	panTo,
	getAddressInLatLng,
	getLatLngFromAddress,
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
	return _connectGoogleApi().then(() => {
		console.log('google available')
		gMap = new google.maps.Map(document.querySelector('#map'), {
			center: { lat, lng },
			zoom: 15,
		})
		//DONE: when the map is pressed the location will apear
		gMap.addListener('click', ev => {
			const lat = ev.latLng.lat()
			const lng = ev.latLng.lng()
			document.querySelector('span.user-pos').innerText = `Latitude: ${lat} - Longitude: ${lng}`
		})
	})
}

function addMarker(loc) {
	var marker = new google.maps.Marker({
		position: loc,
		map: gMap,
		title: 'Hello World!',
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

function getLatLngFromAddress(lat, lng) {
	return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY_GOOGLE_MAPS}`).then(res => {
		return Promise.resolve(res)
	})
}
