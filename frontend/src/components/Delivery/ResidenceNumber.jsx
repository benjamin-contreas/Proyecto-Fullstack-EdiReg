import { useTranslation } from 'react-i18next';

const ResidenceNumber = ({
	handleSubmit,
	residenceNumber,
	handleResidenceNumberChange,
	isLoading,
}) => {
	const { t } = useTranslation('app');
	return (
		<form className="mt-3" onSubmit={handleSubmit}>
			<div className="mb-3">
				<label htmlFor="residenceNumber" className="form-label">
					{t('delivery.residenceNumber')}
				</label>
				<input
					type="text"
					id="residenceNumber"
					value={residenceNumber}
					onChange={handleResidenceNumberChange}
					className="form-control"
				/>
			</div>
			<button className="btn btn-primary" type="submit" disabled={isLoading}>
				{t('delivery.findResidence')}
			</button>
		</form>
	);
};

export default ResidenceNumber;
