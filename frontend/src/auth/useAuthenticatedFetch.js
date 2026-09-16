import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

export function useAuthenticatedFetch() {
	const { getAccessTokenSilently } = useAuth0();

	return useCallback(async (input, init = {}) => {
		const accessToken = await getAccessTokenSilently();
		const headers = new Headers(init.headers || {});
		headers.set('Authorization', `Bearer ${accessToken}`);

		return fetch(input, { ...init, headers });
	}, [getAccessTokenSilently]);
}
