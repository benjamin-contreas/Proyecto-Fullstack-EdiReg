import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FrequentVisitorForm from '../components/Visits/FrequentVisitorForm';
import './frequent.css';

const FrequentVisitor = () => {
	const [visitorData, setVisitorData] = useState({
		firstName: '',
		lastName: '',
		rut: '',
		frequentApartment: '',
		vehicleLicensePlate: '',
	});
	const [error, setError] = useState(null);
	const { t } = useTranslation('visits');

	/**
	 * Resets the visitor data to empty values.
	 */
	const resetVisitorData = () => {
		setVisitorData({
			firstName: '',
			lastName: '',
			rut: '',
			frequentApartment: '',
			vehicleLicensePlate: '',
		});
	};

	/**
	 * Handles the form submission for the frequent visitor page.
	 * @param {Event} event - The form submission event.
	 * @returns {Promise<void>} - A promise that resolves when the form submission is complete.
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Validation logic

		const response = await fetch(
			'http://localhost:4000/api/visits/newFrequentVisitor',
			{
				method: 'POST',
				body: JSON.stringify(visitorData),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const json = await response.json;

		if (!response.ok) {
			setError(json.error);
		} else {
			setError(null);
			resetVisitorData();
		}

		console.log(visitorData);
	};

	return (
		<div className="container-2">
			<div>
				<h1>{t('new frequent visitor')}</h1>
				<div className="container-2-form">
					<FrequentVisitorForm
						handleSubmit={handleSubmit}
						visitorData={visitorData}
						setVisitorData={setVisitorData}
					></FrequentVisitorForm>
				</div>
			</div>
		</div>
	);
};

export default FrequentVisitor;
