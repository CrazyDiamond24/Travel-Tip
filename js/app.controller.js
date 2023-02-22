import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchPlace = onSearchPlace
window.onCopyLocation = onCopyLocation

function onInit() {
	mapService
		.initMap()
		.then(() => {
			console.log('Map is ready')
		})
		.catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
	console.log('Getting Pos')
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	})
}

function onSearchPlace(ev) {
	ev.preventDefault()

	const locName = document.querySelector('input').value
	mapService
		.getAddressInLatLng(locName)
		.then(res => {
			const { lat, lng } = res.location
			onPanTo(lat, lng)
			locService.save({ lat, lng, name: locName })
		})
		.catch(err => console.log('no res'))
	//DONE:8 Implement search: user enters an address (such as Tokyo) use the google
	//Geocode API to turn it into cords (such as: {lat: 35.62, lng:139.79})
	//DONE: pan the map and also add it as new place.
}

function onCopyLocation() {
	//TODO: 9. button that saves a link to the clipboard. The link will
	//be to your application (URL for GitHub pages) with the Lat and Lng
	//params
}

function onAddMarker(pos) {
	console.log('Adding a marker')
	mapService.addMarker(pos)
}

function onGetLocs() {
	locService.getLocs().then(locs => {
		console.log('Locations:', locs)
		document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
	})
}

function onGetUserPos() {
	getPosition()
		.then(pos => {
			console.log('User position is:', pos.coords)
			onPanTo(pos.coords.latitude, pos.coords.longitude)
		})
		.catch(err => {
			console.log('err!!!', err)
		})
}

function onPanTo(lat, lng) {
	document.querySelector('span.user-pos').innerText = `Latitude: ${lat} - Longitude: ${lng}`
	mapService.panTo({ lat, lng })
}

//eden: add marker 3,8
//raina: 5,6
//whoever 9
