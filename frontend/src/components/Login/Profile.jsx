import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
	const { user, isAuthenticated, logout } = useAuth0();
	const { t } = useTranslation('Start');
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const baseStyle = {
		backgroundColor: isHovered || isFocused ? '#3a4357' : '#0a152e',
		color: 'white', padding: '5px 10px', border: 'none', borderRadius: '15px',
		cursor: 'pointer', outline: 'none', fontFamily: '"Roboto Mono", monospace', marginTop: '5px',
	};

	if (!isAuthenticated) return null;

	return (
		<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
			<span style={{ color: 'rgb(148, 163, 184)' }}>{user?.name}</span>
			<button onClick={() => logout({ returnTo: window.location.origin })}
				onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
				onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
				style={baseStyle}>{t('Logout')}</button>
		</div>
	);
};

export default Profile;
