import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisitForm from '../components/Visits/VisitForm';
import { API_URL } from '../config/api';
import './Visits.css';

function Visits() {
	const [visitorData, setVisitorData] = useState({
		firstName: '', lastName: '', rut: '', residenceVisited: '', vehicleLicensePlate: '', visitParkingId: '',
	});
	const [error, setError] = useState(null);
	const [searchType, setSearchType] = useState('rut');
	const [assignedParkingSpace, setAssignedParkingSpace] = useState(null);
	const { t } = useTranslation('visits');

	const searchVisitor = async (event) => {
		event.preventDefault();
		const isRut = searchType === 'rut';
		const value = isRut ? visitorData.rut : visitorData.vehicleLicensePlate;
		const query = isRut ? `rut=${encodeURIComponent(value)}` : `vehicleLicensePlate=${encodeURIComponent(value)}`;
		try {
			const response = await fetch(`${API_URL}/api/visits/${isRut ? 'searchRut' : 'searchPlate'}?${query}`);
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || 'Failed to fetch visitor');
			setVisitorData((current) => ({ ...current, ...data, residenceVisited: data.frequentApartment }));
			setError(null);
		} catch (searchError) {
			setError(searchError.message);
		}
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setVisitorData((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);
		try {
			let visitParkingId = '';
			let parkingNumber = null;

			if (visitorData.vehicleLicensePlate) {
				const parkingResponse = await fetch(`${API_URL}/api/parkingSpace/assignSpace`, {
					method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}),
				});
				const parkingData = await parkingResponse.json();
				if (!parkingResponse.ok) throw new Error(parkingData.message || 'Failed to assign parking space');
				visitParkingId = parkingData.id;
				parkingNumber = parkingData.parkingNumber;
			}

			const response = await fetch(`${API_URL}/api/visits/visitRegistry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...visitorData, visitParkingId }),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error || 'Failed to register visit');
			setAssignedParkingSpace(parkingNumber);
			window.alert(t('successful registration'));
		} catch (submitError) {
			setError(submitError.message);
		}
	};

	return (
		<div className="Page-Visits">
			<div className="container">
				<h1>{t('Visits Register')}</h1>
				<div className="buttons">
					<button onClick={() => setSearchType('rut')}>{t('Search by Rut')}</button>
					<button onClick={() => setSearchType('plate')}>{t('Search by Plate Number')}</button>
					<form onSubmit={searchVisitor}>
						<input name={searchType === 'rut' ? 'rut' : 'vehicleLicensePlate'}
							value={searchType === 'rut' ? visitorData.rut : visitorData.vehicleLicensePlate}
							onChange={handleInputChange}
							placeholder={searchType === 'rut' ? t('Enter RUT') : t('Enter Plate Number')} />
						<button type="submit">{t('Search')}</button>
					</form>
				</div>
				<VisitForm setVisitorData={setVisitorData} handleSubmit={handleSubmit} visitorData={visitorData} />
				{error && <div className="error">{error}</div>}
				{assignedParkingSpace && <div className="alert alert-info"><strong>{t('Assigned Parking Space')}:</strong> {assignedParkingSpace}</div>}
			</div>
		</div>
	);
}

export default Visits;
