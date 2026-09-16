function normalizeRut(value) {
	return typeof value === 'string'
		? value.trim().replace(/\./g, '').replace(/\s+/g, '').toUpperCase()
		: value;
}

function normalizeVehicleLicensePlate(value) {
	return typeof value === 'string'
		? value.trim().replace(/\s+/g, '').toUpperCase()
		: value;
}

module.exports = { normalizeRut, normalizeVehicleLicensePlate };
