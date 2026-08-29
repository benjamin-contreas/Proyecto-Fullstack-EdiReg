import { useState } from 'react';
import CourierInfo from '../components/Delivery/CourierInfo';
import ResidenceNumber from '../components/Delivery/ResidenceNumber';
import ResidentCheckbox from '../components/Delivery/ResidentsCheckbox';
import './Delivery.css';
import { useTranslation } from 'react-i18next';

function Delivery() {
	const { t } = useTranslation('delivery');
	const [residenceNumber, setResidenceNumber] = useState('');
	const [residents, setResidents] = useState();
	const [message, setMessage] = useState('');
	const [description, setDescription] = useState('');
	const [selectedResidents, setSelectedResidents] = useState([]);
	const [courierInfo, setCourierInfo] = useState({
		firstName: '',
		lastName: '',
		rut: '',
		vehicleLicensePlate: '',
	});

	const handleResidenceNumberChange = (event) => {
		setResidenceNumber(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const response = await fetch(
			`http://localhost:4000/api/residence/${residenceNumber}`
		);
		const json = await response.json();

		if (response.ok) {
			const mappedResidents = json.residents.map((resident) => resident);
			setResidents(mappedResidents);
			console.log(mappedResidents[0]);
		} else {
			// skipcq: JS-0002
			console.log('Error retrieving residents');
		}
	};

	const handleCheckboxChange = (isChecked, index) => {
		if (isChecked) {
			setSelectedResidents((prev) => [...prev, index]);
		} else {
			setSelectedResidents((prev) => prev.filter((i) => i !== index));
		}
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};
	const handleCourierInfoChange = (event) => {
		setCourierInfo({
			...courierInfo,
			[event.target.id.split('-')[1]]: event.target.value,
		});
	};

	/**
	 * Handles the submission of a package.
	 * @param {Event} event - The event object.
	 * @returns {Promise<void>} - A promise that resolves when the package submission is complete.
	 */
	const handlePackageSubmit = async (event) => {
		event.preventDefault();
		const selectedResidentEmails = selectedResidents.map(
			(index) => residents[index].userInfo.email
		);
		const packageData = {
			targetResidenceId: residents[0].userInfo.residence,
			description,
			deliveredAt: new Date().toISOString(),
			status: 'At Reception',
			courierInfo,
			residentMails: selectedResidentEmails,
		};
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/packages/createPackage`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(packageData),
				}
			);

			if (response.ok) {
				const json = await response.json();
				// skipcq: JS-0002
				console.log(json);
				setMessage('Package created successfully');
			} else {
				// skipcq: JS-0002
				console.log('ERROR: Error in creating package');
				setMessage('Error in creating package');
			}
		} catch (error) {
			console.log('ERROR: ', error);
			setMessage('Unexpected error occurred');
		}
	};

	return (
		<div className='Page-D'>
			<h1 className='Delivery-titulo'>Delivery Checkout</h1>
			<div className="container bg-light " style={{borderRadius: '10px', padding: '10px'}}>
				<ResidenceNumber
					// skipcq: JS-0417
					handleSubmit={handleSubmit}
					residenceNumber={residenceNumber}
					// skipcq: JS-0417
					handleResidenceNumberChange={handleResidenceNumberChange}
				/>
				<form
					className="mt-3"
					// skipcq: JS-0417
					onSubmit={handlePackageSubmit}
				>
					<h2>{t('THE RESIDENTS')}</h2>
					{residents?.map((resident, index) => {
						return (
							<ResidentCheckbox
								key={index}
								resident={resident}
								index={index}
								// skipcq: JS-0417
								onCheckboxChange={(isChecked) => handleCheckboxChange(isChecked, index)}
							/>
						);
					})}
					<div className="mb-3" >
						<label htmlFor="description" className="form-label">
							{t('Package Description:')}
						</label>
						<input
							type="text"
							id="description"
							value={description}
							// skipcq: JS-0417
							onChange={handleDescriptionChange}
							className="form-control"
						/>
					</div>
					<div className="mb-3">
						<CourierInfo
							courierInfo={courierInfo}
							// skipcq: JS-0417
							handleCourierInfoChange={handleCourierInfoChange}
						/>
					</div>

					<button className="btn btn-primary" type="submit">
						{t('Submit')}
					</button>
				</form>
				{message && <div>{message}</div>}
			</div>
			<div className="spacer"></div>
		</div>

	);
}

export default Delivery;
