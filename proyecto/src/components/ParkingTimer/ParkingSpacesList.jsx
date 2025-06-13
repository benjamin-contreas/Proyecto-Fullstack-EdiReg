import React from 'react';

const ParkingSpacesList = ({ parkingSpaces }) => {
	const toggleUse = async (id, isOnUse) => {
		// Only attempt to toggle if the space is currently in use
		if (isOnUse) {
			try {
				const response = await fetch(
					`http://localhost:4000/api/parkingSpace/toggleUse/${id}`,
					{
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (!response.ok) {
					throw new Error('Failed to toggle parking space use');
				}
				const updatedSpace = await response.json();
				console.log('Parking space use toggled successfully:', updatedSpace);
			} catch (error) {
				console.error('Error toggling parking space use:', error);
			}
		} else {
			console.log('Parking space is already available, no action taken.');
		}
	};

	return (
		<div className="container mt-4">
			<h2 className="h2 mb-3" style={{color: 'rgb(148, 163, 184)'}}>Parking Spaces</h2>
			<ul className="list-group">
				{parkingSpaces.map((space) => (
					<li
						key={space._id}
						className="list-group-item d-flex justify-content-between align-items-center"
					>
						Parking Number: {space.parkingNumber}
						<span className={space.isOnUse ? 'badge bg-success' : 'badge bg-danger'}>
							{space.isOnUse ? 'In Use' : 'Available'}
						</span>
						<button
							onClick={() => toggleUse(space._id, space.isOnUse)}
							className="btn btn-primary"
						>
							Toggle Use
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ParkingSpacesList;
