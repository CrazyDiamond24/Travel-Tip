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

	//TODO:8 Implement search: user enters an address (such as Tokyo) use the google
	//Geocode API to turn it into cords (such as: {lat: 35.62, lng:139.79})
	//TODO: pan the map and also add it as new place.
}

function onCopyLocation() {
	//TODO: 9. button that saves a link to the clipboard. The link will
	//be to your application (URL for GitHub pages) with the Lat and Lng
	//params
}

function onAddMarker() {
	console.log('Adding a marker')
	mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
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
			document.querySelector('.user-pos').innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
		})
		.catch(err => {
			console.log('err!!!', err)
		})
}

function onPanTo(pos) {
	console.log('Panning the Map')
	mapService.panTo(pos)
}

//eden: add marker 3,8
//raina: 5,6
//whoever 9
