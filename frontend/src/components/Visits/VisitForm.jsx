import React from 'react';
import { useTranslation } from 'react-i18next';

const VisitForm = ({ handleSubmit, visitorData, setVisitorData }) => {
	const { t } = useTranslation('visits');
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
	/**
	 * Handles the input change event and updates the visitor data state.
	 * @param {Object} event - The input change event object.
	 */
	const handleInputChange = (event) => {
		const { name, value } = event.target;

		// Validation logic
		let updatedValue = value;

		if (name === 'vehicleLicensePlate') {
			updatedValue = value.slice(0, 6).toUpperCase();
		}

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
	return (
		<form onSubmit={handleSubmit}>
			<div className="container">
				<div className="form-1">
					<label style={{ margin: '5px' }} className="form-label mt-3">
						{t('Rut')}
						<input
							type="text"
							className="form-control mb-3"
							name="rut"
							placeholder={t('Enter the visitor rut')}
							value={visitorData.rut}
							onChange={handleInputChange}
							required
						/>
					</label>
					<div className="flex-container">
						<label style={{ margin: '5px' }} className="form-label mt-3 flex-item">
							{t('Visitor names')}
							<input
								type="text"
								className="form-control mb-3"
								name="firstName"
								placeholder={t('Enter visitor names')}
								value={visitorData.firstName}
								onChange={handleInputChange}
								required
							/>
						</label>
						<label style={{ margin: '5px' }} className="form-label mt-3 flex-item">
							{t('Visitor surname')}
							<input
								type="text"
								className="form-control mb-3"
								name="lastName"
								placeholder={t('Enter visitor surname')}
								value={visitorData.lastName}
								onChange={handleInputChange}
								required
							/>
						</label>
					</div>
				</div>

				<div></div>

				<div className="form-2">
					<label style={{ marginRight: '10px' }} className="form-label mt-3">
						{t('Residence Visited')}
						<input
							type="text"
							className="form-control mb-3"
							name="residenceVisited"
							placeholder={t('Enter the residence')}
							value={visitorData.residenceVisited}
							onChange={handleInputChange}
							required
						/>
					</label>
					<label style={{ marginLeft: '10px' }} className="form-label mt-3">
						{t('Vehicle license')}
						<input
							type="text"
							className="form-control mb-3"
							name="vehicleLicensePlate"
							placeholder={t('Enter the vehicle license plate')}
							value={visitorData.vehicleLicensePlate}
							onChange={handleInputChange}
						/>
					</label>
				</div>
			</div>
			<button style={baseStyle}>{t('Register visit')}</button>
		</form>
	);
};

export default VisitForm;
