import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisitForm from '../components/Visits/VisitForm';
import './Visits.css';

function Visits() {
	const [visitorData, setVisitorData] = useState({
		firstName: '',
		lastName: '',
		rut: '',
		residenceVisited: '',
		vehicleLicensePlate: null,
		visitParkingId: '',
	});
	const [error, setError] = useState({
		handleRutError: null,
		handlePlateSearchError: null,
		handleSubmitError: null,
	});
	const [searchType, setSearchType] = useState('rut');
	const [assignedParkingSpace, setAssignedParkingSpace] = useState(null);
	const { t } = useTranslation('visits');

	useEffect(() => {
		console.log(visitorData);
	}, [visitorData]);

	/**
	 * Handles the event when a user enters a RUT (Rol Único Tributario) and submits the form.
	 * @param {Event} event - The event object.
	 * @returns {Promise<void>} - A promise that resolves when the function finishes executing.
	 */
	const handleRut = async (event) => {
		event.preventDefault();
		const rut = visitorData.rut;

		try {
			const response = await fetch(
				`http://localhost:4000/api/visits/searchRut?rut=${rut}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Failed to fetch visitor');
			}
			setVisitorData((prevState) => ({
				...prevState,
				residenceVisited: data.frequentApartment,
				...data,
			}));
			console.log(data);
		} catch (error) {
			console.error('Error fetching frequent visitor:', error);
			setError((prevError) => ({
				...prevError,
				handleRutError: error.message || 'Failed to fetch visitor',
			}));
		}
	};

	const handlePlateSearch = async (event) => {
		event.preventDefault();
		const plate = visitorData.vehicleLicensePlate;

		try {
			const response = await fetch(
				`http://localhost:4000/api/visits/searchPlate?vehicleLicensePlate=${plate}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.message || 'Failed to fetch visitor');
			}
			console.log(data);
			setVisitorData((prevState) => ({
				...prevState,
				residenceVisited: data.frequentApartment,
				...data,
			}));
		} catch (error) {
			console.error('Error fetching frequent visitor:', error);
			setError((prevError) => ({
				...prevError,
				handlePlateSearchError: error.message || 'Failed to fetch visitor',
			}));
		}
	};

	const handleSearchType = (type) => {
		if (type === 'rut') {
			setSearchType('rut');
		}
		if (type === 'plate') {
			setSearchType('plate');
		}
	};

	/**
	 * Handles the input change event and updates the visitor data state.
	 * @param {Object} event - The input change event object.
	 */
	const handleInputChange = (event) => {
		const { name, value } = event.target;

		// Validation logic
		let updatedValue = value;
		if (name === 'rut') {
			// Remove non-numeric characters
			updatedValue = value.replace(/[^\d]/g, '');
			if (updatedValue.length > 1) {
				updatedValue = `${updatedValue.slice(0, -1)}-${updatedValue.slice(-1)}`;
			}
		}
		setVisitorData((prevVisitorData) => {
			return {
				...prevVisitorData,
				[name]: updatedValue,
			};
		});
	};

	/**
	 * Handles the form submission.
	 *
	 * @param {Event} event - The form submission event.
	 * @returns {void}
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();
		// Early return if no vehicle license plate is provided
		if (!visitorData.vehicleLicensePlate) {
			console.log('No vehicle license plate provided.');
			return;
		}

		try {
			const parkingResponse = await fetch(
				'http://localhost:4000/api/parkingSpace/assignSpace',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						vehicleLicensePlate: visitorData.vehicleLicensePlate,
					}),
				}
			);

			if (!parkingResponse.ok) {
				const parkingError = await parkingResponse.json();
				throw new Error(parkingError.message || 'Failed to assign parking space');
			}

			const parkingData = await parkingResponse.json();
			console.log('Assigned parking number:', parkingData.parkingNumber);
			setAssignedParkingSpace(parkingData.parkingNumber);

			const updatedVisitorData = {
				...visitorData,
				visitParkingId: parkingData.id,
			};

			const submitResponse = await fetch(
				'http://localhost:4000/api/visits/visitRegistry',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedVisitorData),
				}
			);

			if (!submitResponse.ok) {
				const submitError = await submitResponse.json();
				throw new Error(submitError.message || 'Failed to register visit');
			}

			const submitData = await submitResponse.json();
			console.log('Visit registered successfully:', submitData);
			alert(t('successful registration'));
		} catch (error) {
			console.error('Error during form submission:', error);
			setError((prevError) => ({
				...prevError,
				handleSubmitError: error.message,
			}));
		}
	};

	/**
	 * Resets the visitor data by setting all fields to empty strings.
	 */
	const resetVisitorData = () => {
		setVisitorData({
			firstName: '',
			lastName: '',
			rut: '',
			residenceVisited: '',
			vehicleLicensePlate: null,
			visitParkingId: '',
		});
	};

	const baseStyle = {
		backgroundColor: '#3a4357',
		color: 'white',
		padding: '5px 15px',
		border: 'none',
		borderRadius: '10px',
		cursor: 'pointer',
		outline: 'none',
		fontFamily: '"Roboto Mono", monospace',
		margin: '0 10px',
	};

	return (
		<div className="Page-Visits">
			<div className="container">
				<h1>{t('Visits Register')}</h1>
				<div className="visits-forms">
					<div className="buttons">
						<button style={baseStyle} onClick={() => handleSearchType('rut')}>
							{t('Search by Rut')}
						</button>
						<button style={baseStyle} onClick={() => handleSearchType('plate')}>
							{t('Search by Plate Number')}
						</button>
						{searchType === 'rut' && (
							<>
								<form onSubmit={handleRut}>
									<input
										type="text"
										name="rut"
										value={visitorData.rut}
										onChange={handleInputChange}
										placeholder={t('Enter RUT')}
										style={{ marginBottom: '2px', borderRadius: '5px'}}
									/>
									<button type="submit" style={baseStyle}>
										{t('Search')}
									</button>
								</form>
								{error.handleRutError && (
									<div className="error">{error.handleRutError}</div>
								)}
							</>
						)}
						{searchType === 'plate' && (
							<>
								<form onSubmit={handlePlateSearch}>
									<input
										type="text"
										name="vehicleLicensePlate"
										value={visitorData.vehicleLicensePlate}
										onChange={handleInputChange}
										placeholder={t('Enter Plate Number')}
										style={{ marginBottom: '2px', borderRadius: '5px'}}
									/>
									<button type="submit" style={baseStyle}>
										{t('Search')}
									</button>
								</form>
								{error.handlePlateSearchError && (
									<div className="error">{error.handlePlateSearchError}</div>
								)}
							</>
						)}
					</div>
					<div className="visit-form">
						<VisitForm
							setVisitorData={setVisitorData}
							handleSubmit={handleSubmit}
							visitorData={visitorData}
						/>
						{error.handleSubmitError && (
							<div className="error">{error.handleSubmitError}</div>
						)}
					</div>
					{/* Display assigned parking space if available */}
					{assignedParkingSpace && (
						<div className="alert alert-info" role="alert">
							<h2>
								<strong>{t('Assigned Parking Space')}:</strong> {assignedParkingSpace}
							</h2>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Visits;
