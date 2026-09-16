export const ROLES_CLAIM =
	process.env.REACT_APP_AUTH0_ROLES_CLAIM || 'https://edireg.app/roles';

export const ROLES = Object.freeze({
	ADMINISTRATOR: 'Administrator',
	CONCIERGE: 'Concierge',
});

export const ROUTE_ACCESS = Object.freeze({
	'/delivery': [ROLES.CONCIERGE],
	'/frequentVisitor': [ROLES.CONCIERGE],
	'/inicio': [ROLES.ADMINISTRATOR, ROLES.CONCIERGE],
	'/parkingTimer': [ROLES.ADMINISTRATOR, ROLES.CONCIERGE],
	'/visits': [ROLES.CONCIERGE],
});

const NAVIGATION = Object.freeze([
	{ labelKey: 'navigation.visits', path: '/visits' },
	{ labelKey: 'navigation.frequentVisitors', path: '/frequentVisitor' },
	{ labelKey: 'navigation.delivery', path: '/delivery' },
	{ labelKey: 'navigation.parking', path: '/parkingTimer' },
]);

export function rolesFor(user) {
	return Array.isArray(user?.[ROLES_CLAIM]) ? user[ROLES_CLAIM] : [];
}

export function canAccess(user, allowedRoles) {
	const roles = rolesFor(user);
	return allowedRoles.some((role) => roles.includes(role));
}

export function navigationFor(user) {
	return NAVIGATION.filter((item) => canAccess(user, ROUTE_ACCESS[item.path]));
}

export function isAdministrator(user) {
	return canAccess(user, [ROLES.ADMINISTRATOR]);
}
