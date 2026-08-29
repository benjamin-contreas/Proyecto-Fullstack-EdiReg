import React, { useEffect, useState } from 'react';
import ParkingSpacesList from '../components/ParkingTimer/ParkingSpacesList';
import { API_URL } from '../config/api';

const ParkingTimer = () => {
	const [duration, setDuration] = useState('');
	const [notificationTime, setNotificationTime] = useState('');
	const [parkingSpaces, setParkingSpaces] = useState([]);

	useEffect(() => {
		fetch(`${API_URL}/api/parkingSpace/allSpaces`)
			.then((response) => response.json())
			.then(setParkingSpaces)
			.catch((error) => console.error('Error fetching parking spaces:', error));
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`${API_URL}/api/timerConfig/updateConfig`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ duration: Number(duration), notificationTime: Number(notificationTime) }),
			});
			if (!response.ok) throw new Error('Failed to update timer configuration');
			window.alert('Timer configuration updated successfully');
		} catch (error) {
			console.error(error);
			window.alert('Error updating timer configuration');
		}
	};

	return (
		<div className="container mt-4">
			<ParkingSpacesList parkingSpaces={parkingSpaces} />
			<form onSubmit={handleSubmit}>
				<input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (minutes)" />
				<input type="number" value={notificationTime} onChange={(e) => setNotificationTime(e.target.value)} placeholder="Notification Time (minutes)" />
				<button type="submit">Update Configuration</button>
			</form>
		</div>
	);
};

export default ParkingTimer;
