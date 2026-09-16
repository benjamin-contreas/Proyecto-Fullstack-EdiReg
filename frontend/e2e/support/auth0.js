export function useAuth0() {
	return {
		getAccessTokenSilently: async () => window.__EDIREG_E2E_ACCESS_TOKEN__,
		isAuthenticated: true,
		isLoading: false,
		logout: () => {},
		user: {
			name: 'Conserje Demo',
			'https://edireg.app/roles': ['Concierge'],
		},
	};
}
