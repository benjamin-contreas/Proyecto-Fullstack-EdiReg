import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './App.css';
import LanguageButton from './components/LanguageButton';
import LoadingComponent from './components/Loading/LoadingComponent';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { LanguageContext } from './context/Contexts';
import FrequentVisitor from './pages/FrequentVisitor';
import ParkingTimer from './pages/Parking_Timer';
import Visits from './pages/Visits';
import Bienvenida from './pages/bienvenida';
import Delivery from './pages/Delivery';
import Inicio from './pages/inicio';

const socket = io('http://localhost:4000');

function MainApp() {
	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
			{location.pathname !== '/' && <Sidebar isOpen={isOpen} toggle={toggle} />}
			{location.pathname !== '/' && <Navbar toggle={toggle} />}
			{location.pathname !== '/' && (
				<div className="lenguaje">
					<LanguageButton />
				</div>
			)}
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
		socket.on('notifyConcierge', (message) => {
			console.log(message);
			alert(message); // Replace this with a more suitable notification mechanism
		});
	}, []);
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingComponent />}>
				<MainApp />
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
