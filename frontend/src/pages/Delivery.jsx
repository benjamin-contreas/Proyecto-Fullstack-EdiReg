import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourierInfo from '../components/Delivery/CourierInfo';
import ResidenceNumber from '../components/Delivery/ResidenceNumber';
import { useAuthenticatedFetch } from '../auth/useAuthenticatedFetch';
import { API_URL } from '../config/api';
import { packageApiMessageKey } from '../config/apiMessages';
import './Delivery.css';

function Delivery() {
	const { t } = useTranslation('app');
	const [residenceNumber, setResidenceNumber] = useState('');
	const [residence, setResidence] = useState(null);
	const [message, setMessage] = useState('');
	const [description, setDescription] = useState('');
	const [courierInfo, setCourierInfo] = useState({ firstName: '', lastName: '', rut: '', vehicleLicensePlate: '' });
	const [isLookingUpResidence, setIsLookingUpResidence] = useState(false);
	const [isRegisteringPackage, setIsRegisteringPackage] = useState(false);
	const authenticatedFetch = useAuthenticatedFetch();
	const residents = residence?.residents || [];

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLookingUpResidence(true);
		try {
			const response = await authenticatedFetch(`${API_URL}/api/residence/${residenceNumber}`);
			const json = await response.json();
			if (!response.ok) throw new Error(json.error || 'residence_not_found');
			setResidence(json);
			setMessage('');
		} catch (error) {
			setResidence(null);
			setMessage(t('delivery.errors.residenceNotFound'));
		} finally {
			setIsLookingUpResidence(false);
		}
	};

	const handleCourierInfoChange = (event) => {
		setCourierInfo((current) => ({ ...current, [event.target.id.split('-')[1]]: event.target.value }));
	};

	const handlePackageSubmit = async (event) => {
		event.preventDefault();
		if (!residence) {
			setMessage(t('delivery.errors.selectResidence'));
			return;
		}

		const payload = {
			targetResidenceId: residence._id,
			description,
			deliveredAt: new Date().toISOString(),
			status: 'At Reception',
			courierInfo,
		};

		setIsRegisteringPackage(true);
		try {
			const response = await authenticatedFetch(`${API_URL}/api/packages/createPackage`, {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
			});
			const json = await response.json();
			if (!response.ok) throw new Error(json.error || 'registration_failed');
			setMessage(json.notification?.status === 'not_configured'
				? t('delivery.packageRegistered')
				: t('delivery.errors.registrationFailed'));
		} catch (error) {
			setMessage(t(packageApiMessageKey(error.message)));
		} finally {
			setIsRegisteringPackage(false);
		}
	};

	return (
		<div className="Page-D">
			<h1 className="Delivery-titulo">{t('delivery.title')}</h1>
			<div className="container bg-light" style={{ borderRadius: '10px', padding: '10px' }}>
				<ResidenceNumber handleSubmit={handleSubmit} residenceNumber={residenceNumber}
					handleResidenceNumberChange={(event) => setResidenceNumber(event.target.value)} isLoading={isLookingUpResidence} />
				<form className="mt-3" onSubmit={handlePackageSubmit}>
					<h2>{t('delivery.residents')}</h2>
					{residents.map((resident, index) => (
						<p key={resident._id || index}>{resident.userInfo.firstName} {resident.userInfo.lastName}</p>
					))}
					<div className="mb-3">
						<label htmlFor="description" className="form-label">{t('delivery.packageDescription')}</label>
						<input type="text" id="description" value={description}
							onChange={(event) => setDescription(event.target.value)} className="form-control" />
					</div>
					<CourierInfo courierInfo={courierInfo} handleCourierInfoChange={handleCourierInfoChange} />
					<button className="btn btn-primary" type="submit" disabled={isRegisteringPackage}>
						{t('delivery.registerPackage')}
					</button>
				</form>
				{message && <div role="status" className="alert alert-info mt-3">{message}</div>}
			</div>
		</div>
	);
}

export default Delivery;
