import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
	fallbackLng: 'en',
	lng: 'en',
	resources: {
		en: {
			app: {
				navigation: {
					delivery: 'Packages', frequentVisitors: 'Frequent visitors', parking: 'Visitor parking', visits: 'Visits',
				},
				visits: {
					frequentVisitorCreated: 'Frequent visitor created',
					visitRegistered: 'Visit registered',
				},
			},
			Start: { Logout: 'Logout' },
			visits: {},
		},
	},
	interpolation: { escapeValue: false },
});

export default i18n;
