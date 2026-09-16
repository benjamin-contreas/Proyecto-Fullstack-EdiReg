import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';
import { initReactI18next } from 'react-i18next';

const projectId = process.env.REACT_APP_LOCIZE_PROJECT_ID;
const apiKey = process.env.REACT_APP_LOCIZE_API_KEY;
const bundledResources = {
	en: {
		accessDeniedMessage: 'Your role does not allow access to this section.',
		accessDeniedTitle: 'Access denied',
		navigation: {
			delivery: 'Packages', frequentVisitors: 'Frequent visitors', parking: 'Visitor parking', visits: 'Visits',
		},
		parking: {
			add: 'Add parking space', addError: 'Unable to add the parking space', addSuccess: 'Parking space added',
			alertTime: 'Alert time (minutes)', available: 'Available', duration: 'Duration (minutes)',
			inUse: 'In use', number: 'Parking number', release: 'Release', title: 'Visitor parking spaces',
			updateError: 'Unable to update the timer configuration', updateSuccess: 'Timer configuration updated',
			updateTimer: 'Update timer',
			limitApproaching: 'Parking space {{parkingNumber}} is approaching its time limit',
		},
		visits: {
			frequentVisitorCreated: 'Frequent visitor created.',
			visitRegistered: 'Visit registered.',
			errors: {
				frequentVisitorExists: 'A frequent visitor with this RUT already exists.',
				invalidFrequentVisitor: 'Review the frequent visitor details.',
				invalidVisit: 'Review the visit details.',
				noAvailableParking: 'There are no visitor parking spaces available.',
				residenceNotFound: 'The selected residence does not exist.',
				registrationFailed: 'The visit could not be registered.',
				searchFailed: 'The visitor search failed.',
				visitorNotFound: 'No frequent visitor was found.',
			},
		},
	},
	es: {
		accessDeniedMessage: 'Tu rol no permite acceder a esta sección.',
		accessDeniedTitle: 'Acceso no autorizado',
		navigation: {
			delivery: 'Paquetes', frequentVisitors: 'Visitantes frecuentes', parking: 'Estacionamientos de visita', visits: 'Visitas',
		},
		parking: {
			add: 'Agregar estacionamiento', addError: 'No fue posible agregar el estacionamiento', addSuccess: 'Estacionamiento agregado',
			alertTime: 'Tiempo de aviso (minutos)', available: 'Disponible', duration: 'Duración (minutos)',
			inUse: 'En uso', number: 'Número de estacionamiento', release: 'Liberar', title: 'Estacionamientos de visita',
			updateError: 'No fue posible actualizar el temporizador', updateSuccess: 'Configuración del temporizador actualizada',
			updateTimer: 'Actualizar temporizador',
			limitApproaching: 'El estacionamiento {{parkingNumber}} está próximo a su límite de tiempo',
		},
		visits: {
			frequentVisitorCreated: 'Visitante frecuente creado.',
			visitRegistered: 'Visita registrada.',
			errors: {
				frequentVisitorExists: 'Ya existe un Visitante Frecuente con este RUT.',
				invalidFrequentVisitor: 'Revisa los datos del Visitante Frecuente.',
				invalidVisit: 'Revisa los datos de la visita.',
				noAvailableParking: 'No hay Estacionamientos de Visita disponibles.',
				residenceNotFound: 'La Residencia seleccionada no existe.',
				registrationFailed: 'No fue posible registrar la visita.',
				searchFailed: 'No fue posible buscar al visitante.',
				visitorNotFound: 'No se encontró un Visitante Frecuente.',
			},
		},
	},
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
	debug: process.env.NODE_ENV === 'development',
	fallbackLng: 'en',
	partialBundledLanguages: true,
	resources: {
		en: { app: bundledResources.en },
		es: { app: bundledResources.es },
	},
	saveMissing: Boolean(apiKey),
	backend: { projectId, apiKey, referenceLng: 'en' },
});

export default i18n;
