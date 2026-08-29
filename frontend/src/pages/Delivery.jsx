import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourierInfo from '../components/Delivery/CourierInfo';
import ResidenceNumber from '../components/Delivery/ResidenceNumber';
import ResidentCheckbox from '../components/Delivery/ResidentsCheckbox';
import { API_URL } from '../config/api';
import './Delivery.css';

function Delivery() {
	const { t } = useTranslation('delivery');
	const [residenceNumber, setResidenceNumber] = useState('');
	const [residents, setResidents] = useState([]);
	const [message, setMessage] = useState('');
	const [description, setDescription] = useState('');
	const [selectedResidents, setSelectedResidents] = useState([]);
	const [courierInfo, setCourierInfo] = useState({ firstName: '', lastName: '', rut: '', vehicleLicensePlate: '' });

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`${API_URL}/api/residence/${residenceNumber}`);
			const json = await response.json();
			if (!response.ok) throw new Error(json.error || 'Error retrieving residents');
			setResidents(json.residents || []);
			setMessage('');
		} catch (error) {
			setResidents([]);
			setMessage(error.message);
		}
	};

	const handleCheckboxChange = (checked, index) => {
		setSelectedResidents((current) => checked ? [...current, index] : current.filter((item) => item !== index));
	};

	const handleCourierInfoChange = (event) => {
		setCourierInfo((current) => ({ ...current, [event.target.id.split('-')[1]]: event.target.value }));
	};

	const handlePackageSubmit = async (event) => {
		event.preventDefault();
		if (!residents.length) {
			setMessage('Search for a residence before registering a package');
			return;
		}

		const residentMails = selectedResidents.map((index) => residents[index]?.userInfo?.email).filter(Boolean);
		const payload = {
			targetResidenceId: residents[0].userInfo.residence,
			description,
			deliveredAt: new Date().toISOString(),
			status: 'At Reception',
			courierInfo,
			residentMails,
		};

		try {
			const response = await fetch(`${API_URL}/api/packages/createPackage`, {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
			});
			const json = await response.json();
			if (!response.ok) throw new Error(json.error || 'Error creating package');
			setMessage('Package created successfully');
		} catch (error) {
			setMessage(error.message);
		}
	};

	return (
		<div className="Page-D">
			<h1 className="Delivery-titulo">Delivery Checkout</h1>
			<div className="container bg-light" style={{ borderRadius: '10px', padding: '10px' }}>
				<ResidenceNumber handleSubmit={handleSubmit} residenceNumber={residenceNumber}
					handleResidenceNumberChange={(event) => setResidenceNumber(event.target.value)} />
				<form className="mt-3" onSubmit={handlePackageSubmit}>
					<h2>{t('THE RESIDENTS')}</h2>
					{residents.map((resident, index) => (
						<ResidentCheckbox key={resident._id || index} resident={resident} index={index}
							onCheckboxChange={(checked) => handleCheckboxChange(checked, index)} />
					))}
					<div className="mb-3">
						<label htmlFor="description" className="form-label">{t('Package Description:')}</label>
						<input type="text" id="description" value={description}
							onChange={(event) => setDescription(event.target.value)} className="form-control" />
					</div>
					<CourierInfo courierInfo={courierInfo} handleCourierInfoChange={handleCourierInfoChange} />
					<button className="btn btn-primary" type="submit">{t('Submit')}</button>
				</form>
				{message && <div>{message}</div>}
			</div>
		</div>
	);
}

export default Delivery;
