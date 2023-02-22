import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const LOCATIONS_KEY = 'locationDB'

_createLocs()

export const locService = {
	query,
	get,
	remove,
	save,
}

function query() {
	return storageService.query(LOCATIONS_KEY).then(locs => {
		return locs
	})
}

function get(locId) {
	return storageService.get(LOCATIONS_KEY, locId)
}

function remove(locId) {
	return storageService.remove(LOCATIONS_KEY, locId)
}

function save(location) {
	if (location.id) {
		return storageService.put(LOCATIONS_KEY, location) //update
	} else {
		return storageService.post(LOCATIONS_KEY, location) //create
	}
}

// function getEmptyPlace(name = '', score = 0) {
// 	return { id: '', name, score }
// }

function _createLocs() {
	storageService.query(LOCATIONS_KEY).then(res => {
		if (!res || !res.length) {
			_createDemoData()
		}
	})
}

function _createDemoData() {
	let demoLocations = [
		{ name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
		{ name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
	]

	demoLocations.forEach(loc => {
		save(_createLoc(loc))
	})
}

function _createLoc({ lat, lng, name }) {
	return {
		name,
		lat,
		lng,
		weather: '',
		createdAt: new Date().toLocaleDateString(),
		updatedAt: new Date().toLocaleDateString(),
	}
}
