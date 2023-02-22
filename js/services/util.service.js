export const utilService = {
	makeId,
	getRandomIntInclusive,
	getValFromParam,
	setQueryParams,
	deleteQueryParam,
}

function makeId(length = 5) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function getValFromParam(key) {
	const queryStringParams = new URLSearchParams(window.location.search)
	return queryStringParams.get(key)
}

function setQueryParams(newParams) {
	const url = new URL(window.location.href)
	const params = new URLSearchParams(url.search)

	for (var paramName in newParams) {
		const paramValue = newParams[paramName]
		params.set(paramName, paramValue)
	}

	url.search = params.toString()
	window.history.pushState({ path: url.href }, '', url.href)
}

function deleteQueryParam(key) {
	const url = new URL(window.location.href)
	const params = new URLSearchParams(url.search)

	params.delete(key)
	url.search = params.toString()

	window.history.pushState({ path: url.href }, '', url.href)
}
