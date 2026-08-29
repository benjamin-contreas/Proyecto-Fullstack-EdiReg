import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../context/Contexts';

const LanguageButton = () => {
	const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext);
	const { i18n, t } = useTranslation('Start');

	useEffect(() => {
		// Load language stored in localStorage when initializing the component
		const savedLanguage = localStorage.getItem('appLanguage');
		if (savedLanguage) {
			setCurrentLanguage(savedLanguage);
			i18n.changeLanguage(savedLanguage);
		}
	}, [setCurrentLanguage, i18n]);

	/**
	 * Changes the language of the application.
	 * @param {string} lng - The language code to change to.
	 * @returns {void}
	 */
	const changeLanguage = (lng) => {
		setCurrentLanguage(lng);
		i18n.changeLanguage(lng);
		localStorage.setItem('appLanguage', lng);
	};

	/**
	 * Returns the style object for a language button.
	 * @param {string} language - The language for which the button style is generated.
	 * @returns {Object} The style object for the language button.
	 */
	const getButtonStyle = (language) => ({
		backgroundColor: currentLanguage === language ? '#3a4357' : '#0a152e',
		boxShadow: currentLanguage === language ? '0 0 10px #3a4357' : 'none',
		color: 'white',
		padding: '5px 10px',
		border: 'none',
		borderRadius: '10px',
		cursor: 'pointer',
		outline: 'none',
		fontFamily: '"Roboto Mono", monospace',
		margin: '0 10px',
	});

	return (
		<div
			className="d-flex align-items-center"
			style={{ justifyContent: 'flex-end' }}
		>
			<button onClick={() => changeLanguage('es')} style={getButtonStyle('es')}>
				{t('language button es')}
			</button>
			<button onClick={() => changeLanguage('en')} style={getButtonStyle('en')}>
				{t('language button en')}
			</button>
		</div>
	);
};

export default LanguageButton;
