import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearchPlace = onSearchPlace
window.onCopyLocation = onCopyLocation
window.onGoToLoc = onGoToLoc
window.onUpdateLocation = onUpdateLocation
window.onRemoveLoc = onRemoveLoc

function onInit() {
	mapService
		.initMap()
		.then(() => {
			console.log('Map is ready')
			_getLocationStringParams()
		})
		.catch(() => console.log('Error: cannot init map'))
	renderLocs()
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
			//FIXME - it wont render!!!!!! iiiiifff
			locService.save({ lat, lng, name: locName }).then(renderLocs)
		})
		.catch(err => console.log('no res'))
}

function _getLocationStringParams() {
	let lat = utilService.getValFromParam('lat')
	let lng = utilService.getValFromParam('lng')

	if (!lat || !lng) return
	mapService.panTo(lat, lng)
}

function onCopyLocation() {
	let lat = utilService.getValFromParam('lat')
	let lng = utilService.getValFromParam('lng')

	navigator.clipboard.writeText(`https://crazydiamond24.github.io/Travel-Tip/lat=${lat},lng=${lng}`)
}

function onAddMarker() {
	let title = prompt('Name of location?')
	mapService.addMarker(title).then(marker => {
		const { lat, lng } = mapService.getLatLng(marker.getPosition())
		console.log(marker)
		locService.save({ name: title, lat, lng })
	})
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
	getPosition()
		.then(pos => {
			console.log('User position is:', pos.coords)
			document.querySelector('.user-pos').innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
		})
		.catch(err => {
			console.log('err!!!', err)
		})
}

// function onPanTo(pos) {
//   console.log('Panning the Map')
//   mapService.panTo(pos)
// }

//Here we need to make sure the object doesn't start with updated date and only show one date.
function renderLocs() {
	locService.query().then(locs => {
		var strHtml = locs
			.map(loc => {
				return `
          <li>${loc.name}
          <span>${loc.updatedAt ? `(${loc.updatedAt})` : `(${loc.createdAt})`}</span>
          <button class="btn" onclick="onRemoveLoc('${loc.id}')">Delete</button>
          <button class="btn" onclick="onGoToLoc(${loc.lat}, ${loc.lng})">GoTo</button>
          <button class="btn" onclick="onUpdateLocation('${loc.id}')">Update</button>
          </li>
      `
			})
			.join('')
		var elLocs = document.querySelector('.loc-container')
		elLocs.innerHTML = strHtml
	})
}

//need to add a marker here
function onGoToLoc(lat, lng) {
	mapService.panTo(lat, lng)
}

function onRemoveLoc(locId) {
	locService.remove(locId).then(() => {
		renderLocs()
	})
}

//Don't know what to update yet, so this is just a text for now
function onUpdateLocation(locId) {
	const newName = prompt('Enter new name')
	if (!newName) return
	locService.get(locId).then(location => {
		location.name = newName
		location.updatedAt = new Date().toLocaleDateString()
		locService
			.save(location)
			.then(() => {
				renderLocs()
			})
			.catch(err => console.log('unsuccessful update'))
	})
}

//eden: add marker 3,8
//raina: 5,6
//whoever 9
