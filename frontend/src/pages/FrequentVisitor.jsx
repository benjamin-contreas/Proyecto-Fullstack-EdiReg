import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FrequentVisitorForm from '../components/Visits/FrequentVisitorForm';
import { useAuthenticatedFetch } from '../auth/useAuthenticatedFetch';
import { API_URL } from '../config/api';
import { apiMessageKey } from '../config/apiMessages';
import './FrequentVisitor.css';

const initialVisitorData = {
	firstName: '', lastName: '', rut: '', frequentApartment: '', vehicleLicensePlate: '',
};

const FrequentVisitor = () => {
	const [visitorData, setVisitorData] = useState(initialVisitorData);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const { t } = useTranslation('visits');
	const authenticatedFetch = useAuthenticatedFetch();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null);
		setSuccess(null);
		try {
			const response = await authenticatedFetch(`${API_URL}/api/visits/newFrequentVisitor`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(visitorData),
			});
			const json = await response.json();
			if (!response.ok) {
				throw new Error(t(apiMessageKey(json.error, 'app:visits.errors.invalidFrequentVisitor')));
			}
			setVisitorData(initialVisitorData);
			setSuccess(t('app:visits.frequentVisitorCreated'));
		} catch (submitError) {
			setError(submitError.message);
		}
	};

	return (
		<div className="container-2">
			<h1>{t('new frequent visitor')}</h1>
			<div className="container-2-form">
				<FrequentVisitorForm handleSubmit={handleSubmit} visitorData={visitorData} setVisitorData={setVisitorData} />
				{error && <div className="error" role="alert">{error}</div>}
				{success && <div className="success" role="status">{success}</div>}
			</div>
		</div>
	);
};

export default FrequentVisitor;
