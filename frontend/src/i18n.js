import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { initReactI18next } from 'react-i18next';

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: true,
		fallbackLng: 'en',
		saveMissing: true,
		backend: {
			projectId: '847ab060-8a7a-4ce8-85a0-d3082b642baf',
			apiKey: 'fb71fef0-cd1b-4638-bec7-e9c9d8ba050f',
			referenceLng: 'en',
		},
	});
