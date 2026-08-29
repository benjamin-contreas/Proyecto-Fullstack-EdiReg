import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LoginButton = () => {
	const { loginWithPopup, isAuthenticated } = useAuth0();
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const { t } = useTranslation('Start');
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) navigate('/inicio');
	}, [isAuthenticated, navigate]);

	const baseStyle = {
		backgroundColor: isHovered || isFocused ? '#3a4357' : '#0a152e',
		color: 'white', padding: '10px 20px', border: 'none',
		borderRadius: '15px', cursor: 'pointer', outline: 'none',
		fontFamily: '"Roboto Mono", monospace',
	};

	return !isAuthenticated ? (
		<button onClick={() => loginWithPopup()}
			onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
			style={baseStyle}>{t('signIn')}</button>
	) : null;
};

export default LoginButton;
