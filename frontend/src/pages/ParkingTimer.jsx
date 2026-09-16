import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ParkingSpacesList from '../components/ParkingTimer/ParkingSpacesList';
import { isAdministrator } from '../auth/accessPolicy';
import { useAuthenticatedFetch } from '../auth/useAuthenticatedFetch';
import { useAuth0 } from '@auth0/auth0-react';
import { API_URL } from '../config/api';

const ParkingTimer = () => {
	const [duration, setDuration] = useState('');
	const [notificationTime, setNotificationTime] = useState('');
	const [parkingSpaces, setParkingSpaces] = useState([]);
	const [parkingNumber, setParkingNumber] = useState('');
	const { user } = useAuth0();
	const { t } = useTranslation('app');
	const authenticatedFetch = useAuthenticatedFetch();
	const canManageConfiguration = isAdministrator(user);

	useEffect(() => {
		authenticatedFetch(`${API_URL}/api/parkingSpace/allSpaces`)
			.then((response) => response.json())
			.then(setParkingSpaces)
			.catch((error) => console.error('Error fetching parking spaces:', error));
	}, [authenticatedFetch]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await authenticatedFetch(`${API_URL}/api/timerConfig/updateConfig`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ duration: Number(duration), notificationTime: Number(notificationTime) }),
			});
			if (!response.ok) throw new Error(t('parking.updateError'));
			window.alert(t('parking.updateSuccess'));
		} catch (error) {
			console.error(error);
			window.alert(t('parking.updateError'));
		}
	};

	const handleCreateParkingSpace = async (event) => {
		event.preventDefault();
		try {
			const response = await authenticatedFetch(`${API_URL}/api/parkingSpace/createSpace`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ parkingNumber: Number(parkingNumber) }),
			});
			if (!response.ok) throw new Error(t('parking.addError'));
			const createdSpace = await response.json();
			setParkingSpaces((current) => [...current, createdSpace]);
			setParkingNumber('');
			window.alert(t('parking.addSuccess'));
		} catch (error) {
			console.error(error);
			window.alert(t('parking.addError'));
		}
	};

	return (
		<div className="container mt-4">
			<ParkingSpacesList parkingSpaces={parkingSpaces} canManageConfiguration={canManageConfiguration} />
			{canManageConfiguration && <form onSubmit={handleSubmit}>
				<input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder={t('parking.duration')} />
				<input type="number" value={notificationTime} onChange={(e) => setNotificationTime(e.target.value)} placeholder={t('parking.alertTime')} />
				<button type="submit">{t('parking.updateTimer')}</button>
			</form>}
			{canManageConfiguration && <form onSubmit={handleCreateParkingSpace}>
				<input type="number" min="1" required value={parkingNumber}
					onChange={(event) => setParkingNumber(event.target.value)} placeholder={t('parking.number')} />
				<button type="submit">{t('parking.add')}</button>
			</form>}
		</div>
	);
};

export default ParkingTimer;
