import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				audience,
				redirect_uri: window.location.origin,
				scope: 'openid profile email read:operations write:operations manage:configuration',
			}}
		>
			<App />
		</Auth0Provider>
	</React.StrictMode>
);
