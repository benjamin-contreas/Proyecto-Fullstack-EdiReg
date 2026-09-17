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
				delivery: {
					title: 'Package registration', residenceNumber: 'Residence number', findResidence: 'Find residence',
					residents: 'Residents', packageDescription: 'Package description', courierInformation: 'Courier information',
					firstName: 'First name', lastName: 'Last name', rut: 'RUT', vehicleLicensePlate: 'Vehicle license plate',
					registerPackage: 'Register package', packageRegistered: 'Package registered. Email notifications are not configured.',
					errors: {
						selectResidence: 'Find a residence before registering a package.',
						residenceNotFound: 'The selected residence does not exist.',
						invalidPackage: 'Review the package details.', registrationFailed: 'The package could not be registered.',
					},
				},
			},
			Start: { Logout: 'Logout' },
			visits: {},
		},
	},
	interpolation: { escapeValue: false },
});

export default i18n;
