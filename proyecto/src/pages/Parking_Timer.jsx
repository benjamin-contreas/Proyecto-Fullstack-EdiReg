import React, { useEffect, useState } from 'react';
import ParkingSpacesList from '../components/ParkingTimer/ParkingSpacesList';

const Parking_Timer = () => {
	const [duration, setDuration] = useState('');
	const [notificationTime, setNotificationTime] = useState('');
	const [parkingSpaces, setParkingSpaces] = useState([]);

	useEffect(() => {
		console.log('Starting Effect');
		fetch('http://localhost:4000/api/parkingSpace/allSpaces')
			.then((response) => {
				console.log('Fetching success :)');
				return response.json(); // Correctly return the promise here
			})
			.then((data) => setParkingSpaces(data))
			.catch((error) => console.error('Error fetching parking spaces:', error));
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(
				'http://localhost:4000/api/timerConfig/updateConfig',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						duration: duration,
						notificationTime: notificationTime,
					}),
				}
			);
			if (!response.ok) {
				throw new Error('Failed to update timer configuration');
			}

			const data = await response.json();
			console.log('Timer configuration updated successfully:', data);
			alert('Timer configuration updated successfully:', data);
		} catch (error) {
			console.error('Error updating timer configuration:', error);
			alert('Error updating timer configuration:', error);
		}
	};

	return (
		<div className="container mt-4">
			<ParkingSpacesList parkingSpaces={parkingSpaces} />
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					value={duration}
					onChange={(e) => setDuration(e.target.value)}
					placeholder="Duration (minutes)"
				/>
				<input
					type="number"
					value={notificationTime}
					onChange={(e) => setNotificationTime(e.target.value)}
					placeholder="Notification Time (minutes)"
				/>
				<button type="submit">Update Configuration</button>
			</form>
		</div>
	);
};

export default Parking_Timer;
