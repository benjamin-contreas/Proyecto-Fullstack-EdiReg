import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { initReactI18next } from 'react-i18next';

const projectId = process.env.REACT_APP_LOCIZE_PROJECT_ID;
const apiKey = process.env.REACT_APP_LOCIZE_API_KEY;

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
	debug: process.env.NODE_ENV === 'development',
	fallbackLng: 'en',
	saveMissing: Boolean(apiKey),
	backend: { projectId, apiKey, referenceLng: 'en' },
});

export default i18n;
