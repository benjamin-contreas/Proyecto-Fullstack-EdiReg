const apiMessageKeys = Object.freeze({
	frequent_visitor_exists: 'app:visits.errors.frequentVisitorExists',
	invalid_frequent_visitor: 'app:visits.errors.invalidFrequentVisitor',
	invalid_visit: 'app:visits.errors.invalidVisit',
	no_available_parking: 'app:visits.errors.noAvailableParking',
	residence_not_found: 'app:visits.errors.residenceNotFound',
	visit_registration_failed: 'app:visits.errors.registrationFailed',
	visitor_not_found: 'app:visits.errors.visitorNotFound',
});

export function apiMessageKey(errorCode, fallbackKey) {
	return apiMessageKeys[errorCode] || fallbackKey;
}
