import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisitForm from '../components/Visits/VisitForm';
import { useAuthenticatedFetch } from '../auth/useAuthenticatedFetch';
import { API_URL } from '../config/api';
import { apiMessageKey } from '../config/apiMessages';
import './Visits.css';

function Visits() {
	const [visitorData, setVisitorData] = useState({
		firstName: '', lastName: '', rut: '', residenceVisited: '', vehicleLicensePlate: '',
	});
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [searchType, setSearchType] = useState('rut');
	const [assignedParkingSpace, setAssignedParkingSpace] = useState(null);
	const { t } = useTranslation('visits');
	const authenticatedFetch = useAuthenticatedFetch();

	const searchVisitor = async (event) => {
		event.preventDefault();
		const isRut = searchType === 'rut';
		const value = isRut ? visitorData.rut : visitorData.vehicleLicensePlate;
		const query = isRut ? `rut=${encodeURIComponent(value)}` : `vehicleLicensePlate=${encodeURIComponent(value)}`;
		try {
			const response = await authenticatedFetch(`${API_URL}/api/visits/${isRut ? 'searchRut' : 'searchPlate'}?${query}`);
			const data = await response.json();
			if (!response.ok) {
				throw new Error(t(apiMessageKey(data.error, 'app:visits.errors.searchFailed')));
			}
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
		setSuccess(null);
		try {
			const response = await authenticatedFetch(`${API_URL}/api/visits/visitRegistry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(visitorData),
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error(t(apiMessageKey(data.error, 'app:visits.errors.registrationFailed')));
			}
			setAssignedParkingSpace(data.assignedParkingSpace?.parkingNumber ?? null);
			setSuccess(t('app:visits.visitRegistered'));
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
				{error && <div className="error" role="alert">{error}</div>}
				{success && <div className="success" role="status">{success}</div>}
				{assignedParkingSpace && <div className="alert alert-info"><strong>{t('Assigned Parking Space')}:</strong> {assignedParkingSpace}</div>}
			</div>
		</div>
	);
}

export default Visits;
