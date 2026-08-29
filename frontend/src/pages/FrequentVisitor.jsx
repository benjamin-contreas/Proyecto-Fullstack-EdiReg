import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FrequentVisitorForm from '../components/Visits/FrequentVisitorForm';
import { API_URL } from '../config/api';
import './FrequentVisitor.css';

const initialVisitorData = {
	firstName: '', lastName: '', rut: '', frequentApartment: '', vehicleLicensePlate: '',
};

const FrequentVisitor = () => {
	const [visitorData, setVisitorData] = useState(initialVisitorData);
	const [error, setError] = useState(null);
	const { t } = useTranslation('visits');

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch(`${API_URL}/api/visits/newFrequentVisitor`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(visitorData),
			});
			const json = await response.json();
			if (!response.ok) throw new Error(json.error || 'Failed to create frequent visitor');
			setError(null);
			setVisitorData(initialVisitorData);
		} catch (submitError) {
			setError(submitError.message);
		}
	};

	return (
		<div className="container-2">
			<h1>{t('new frequent visitor')}</h1>
			<div className="container-2-form">
				<FrequentVisitorForm handleSubmit={handleSubmit} visitorData={visitorData} setVisitorData={setVisitorData} />
				{error && <div className="error">{error}</div>}
			</div>
		</div>
	);
};

export default FrequentVisitor;
