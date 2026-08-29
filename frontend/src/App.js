import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import LanguageButton from './components/LanguageButton';
import LoadingComponent from './components/Loading/LoadingComponent';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { API_URL } from './config/api';
import { LanguageContext } from './context/Contexts';
import FrequentVisitor from './pages/FrequentVisitor';
import ParkingTimer from './pages/ParkingTimer';
import Visits from './pages/Visits';
import Bienvenida from './pages/Bienvenida';
import Delivery from './pages/Delivery';
import Inicio from './pages/Inicio';

const socket = io(API_URL);

function MainApp() {
	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const toggle = () => setIsOpen((open) => !open);

	return (
		<LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
			{location.pathname !== '/' && <Sidebar isOpen={isOpen} toggle={toggle} />}
			{location.pathname !== '/' && <Navbar toggle={toggle} />}
			{location.pathname !== '/' && <div className="lenguaje"><LanguageButton /></div>}
			<Routes>
				<Route path="/" element={<Bienvenida />} />
				<Route path="/inicio" element={<Inicio />} />
				<Route path="/visits" element={<Visits />} />
				<Route path="/delivery" element={<Delivery />} />
				<Route path="/parkingTimer" element={<ParkingTimer />} />
				<Route path="/frequentVisitor" element={<FrequentVisitor />} />
			</Routes>
		</LanguageContext.Provider>
	);
}

function App() {
	useEffect(() => {
		const handleNotification = (message) => window.alert(message);
		socket.on('notifyConcierge', handleNotification);
		return () => socket.off('notifyConcierge', handleNotification);
	}, []);

	return <BrowserRouter><Suspense fallback={<LoadingComponent />}><MainApp /></Suspense></BrowserRouter>;
}

export default App;
