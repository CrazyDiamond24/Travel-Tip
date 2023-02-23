import { locationService } from './services/location.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit

function onInit() {
	onRenderLocs()
	onInitMap()
}

function onRenderLocs() {
	showLoader()
	locationService.query().then(renderLocs).then(hideLoader).then(addEventListeners).catch(console.error)
}

function onRenderWeather() {
	const pos = mapService.getCurrPos()
	if (!pos) return
	weatherService.getWeather(pos).then(renderWeather).catch(console.error)
}

function onInitMap() {
	mapService.initMap().then(_getLocationStringParams).catch(console.error)
}

function onSearchPlace(ev) {
	ev.preventDefault()
	const address = document.querySelector('input').value
	if (!address) return

	mapService
		.getAddressCoords(address)
		.then(({ lat, lng }) => {
			debugger
			onPanTo(lat, lng)
			locationService.save({ name: address, lat, lng }).then(onRenderLocs).catch(console.error)
			onRenderWeather()
		})
		.catch(console.error)
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
	const { lat, lng } = mapService.getCurrPos()
	locationService.save({ name: title, lat, lng }).then(onRenderLocs).catch(console.error)
}

function addEventListeners() {
	window.onAddMarker = onAddMarker
	window.onPanTo = onPanTo
	window.onGetLocs = onGetLocs
	window.onGetUserPos = onGetUserPos
	window.onSearchPlace = onSearchPlace
	window.onCopyLocation = onCopyLocation
	window.onGoToLoc = onGoToLoc
	window.onUpdateLocation = onUpdateLocation
	window.onRemoveLoc = onRemoveLoc
}

function onGetLocs() {
	locationService.query.then(locs => {
		document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
	})
}

function onGetUserPos() {
	getPosition()
		.then(pos => {
			onPanTo(pos.coords.latitude, pos.coords.longitude)
		})
		.catch(console.log)
}

function renderWeather(weatherInfo) {
	const { weather, state, temp, minTemp, maxTemp, windSpeed } = weatherInfo
	document.querySelector('.weather-main').innerText = weather
	document.querySelector('.weather-state').innerText = state
	document.querySelector('.temp').innerText = temp + '°'
	document.querySelector('.min-temp').innerText = minTemp + '°'
	document.querySelector('.max-temp').innerText = maxTemp + '°'
	document.querySelector('.speed').innerText = windSpeed
}

function onPanTo(lat, lng) {
	mapService.panTo(lat, lng)
	utilService.setQueryParams({ lat: lat })
	utilService.setQueryParams({ lng: lng })
	onRenderWeather()
}

function renderLocs(locs) {
	document.querySelector('.loc-container').innerHTML = locs
		.map(loc => {
			return `
          <li>
					<div> 
          <span>${loc.name} ${loc.updatedAt ? `(${loc.updatedAt})` : `(${loc.createdAt})`}</span>
          <button class="btn" onclick="onRemoveLoc('${loc.id}')">Delete</button>
          <button class="btn" onclick="onGoToLoc(${loc.lat}, ${loc.lng})">GoTo</button>
					<button class="btn" onclick="onUpdateLocation('${loc.id}')">Update</button>
					</div>
					<p class="user-pos"> Latitude: ${loc.lat.toFixed(5)} - Longitude: ${loc.lng.toFixed(5)} </p>
					</li>
      `
		})
		.join('')
}

function onGoToLoc(lat, lng) {
	onPanTo(lat, lng)
}

function onRemoveLoc(locId) {
	locationService.remove(locId).then(onRenderLocs).catch(console.error)
}

function onUpdateLocation(locId) {
	const newName = prompt('Enter new name')
	if (!newName) return
	locationService.get(locId).then(location => {
		location.name = newName
		location.updatedAt = new Date().toLocaleDateString()
		locationService
			.save(location)
			.then(() => {
				renderLocs()
			})
			.catch(err => console.log('unsuccessful update'))
	})
}

function showLoader() {
	//document.querySelector('.spinner').classList.remove('hide')
	//document.querySelector('.locations').classList.add('hide')
}

function hideLoader() {
	//document.querySelector('.spinner').classList.add('hide')
	//document.querySelector('.locations').classList.remove('hide')
}
