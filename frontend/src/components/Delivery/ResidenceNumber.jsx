import { useTranslation } from "react-i18next";


const ResidenceNumber = ({
	handleSubmit,
	residenceNumber,
	handleResidenceNumberChange,
}) => {
	const { t } = useTranslation("delivery");
	return (
		<form className="mt-3" onSubmit={handleSubmit}>
			<div className="mb-3">
				<label htmlFor="residenceNumber" className="form-label">
					Residence Number:
				</label>
				<input
					type="text"
					id="residenceNumber"
					value={residenceNumber}
					onChange={handleResidenceNumberChange}
					className="form-control"
				/>
			</div>
			<button className="btn btn-primary" type="submit">
				{t('Submit')}
			</button>
		</form>
	);
};

export default ResidenceNumber;
