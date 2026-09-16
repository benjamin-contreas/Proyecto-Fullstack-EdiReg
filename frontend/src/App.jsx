import { Suspense, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import LanguageButton from './components/LanguageButton';
import LoadingComponent from './components/Loading/LoadingComponent';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { API_URL } from './config/api';
import ProtectedRoute from './auth/ProtectedRoute';
import { canAccess, ROLES, ROUTE_ACCESS } from './auth/accessPolicy';
import { LanguageContext } from './context/Contexts';
import FrequentVisitor from './pages/FrequentVisitor';
import ParkingTimer from './pages/ParkingTimer';
import Visits from './pages/Visits';
import Bienvenida from './pages/Bienvenida';
import Delivery from './pages/Delivery';
import Inicio from './pages/Inicio';

function SocketNotifications() {
	const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
	const { t } = useTranslation('app');

	useEffect(() => {
		if (!isAuthenticated || !canAccess(user, [ROLES.CONCIERGE])) return undefined;

		let socket;
		let cancelled = false;
		const connect = async () => {
			try {
				const accessToken = await getAccessTokenSilently();
				if (cancelled) return;
				socket = io(API_URL, { auth: { accessToken } });
				socket.on('notifyConcierge', ({ parkingNumber }) => {
					window.alert(t('parking.limitApproaching', { parkingNumber }));
				});
			} catch (error) {
				console.error('Unable to connect to parking alerts:', error);
			}
		};
		connect();

		return () => {
			cancelled = true;
			socket?.disconnect();
		};
	}, [getAccessTokenSilently, isAuthenticated, t, user]);

	return null;
}

function MainApp() {
	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const toggle = () => setIsOpen((open) => !open);

	return (
		<LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
			<SocketNotifications />
			{location.pathname !== '/' && <Sidebar isOpen={isOpen} toggle={toggle} />}
			{location.pathname !== '/' && <Navbar toggle={toggle} />}
			{location.pathname !== '/' && <div className="lenguaje"><LanguageButton /></div>}
			<Routes>
				<Route path="/" element={<Bienvenida />} />
				<Route path="/inicio" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/inicio']}><Inicio /></ProtectedRoute>} />
				<Route path="/visits" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/visits']}><Visits /></ProtectedRoute>} />
				<Route path="/delivery" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/delivery']}><Delivery /></ProtectedRoute>} />
				<Route path="/parkingTimer" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/parkingTimer']}><ParkingTimer /></ProtectedRoute>} />
				<Route path="/frequentVisitor" element={<ProtectedRoute allowedRoles={ROUTE_ACCESS['/frequentVisitor']}><FrequentVisitor /></ProtectedRoute>} />
			</Routes>
		</LanguageContext.Provider>
	);
}

function App() {
	return <BrowserRouter><Suspense fallback={<LoadingComponent />}><MainApp /></Suspense></BrowserRouter>;
}

export default App;
