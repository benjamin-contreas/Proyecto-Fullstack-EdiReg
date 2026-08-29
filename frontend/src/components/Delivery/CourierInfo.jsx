import { useTranslation } from "react-i18next";


const CourierInfo = ({ courierInfo, handleCourierInfoChange }) => {
	const { t } = useTranslation("delivery");
	return (
		<>
			<h3 className="h3">Courier Info</h3>
			<div className="mb-3">
				<label htmlFor="courier-firstName" className="form-label">
					{t('First Name')}
				</label>
				<input
					type="text"
					id="courier-firstName"
					value={courierInfo.firstName}
					onChange={handleCourierInfoChange}
					className="form-control"
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="courier-lastName" className="form-label">
					{t('Last Name')}
				</label>
				<input
					type="text"
					id="courier-lastName"
					value={courierInfo.lastName}
					onChange={handleCourierInfoChange}
					className="form-control"
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="courier-rut" className="form-label">
					RUT
				</label>
				<input
					type="text"
					id="courier-rut"
					value={courierInfo.rut}
					onChange={handleCourierInfoChange}
					className="form-control"
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="courier-vehicleLicensePlate" className="form-label">
					{t('Vehicle License Plate')}
				</label>
				<input
					type="text"
					id="courier-vehicleLicensePlate"
					value={courierInfo.vehicleLicensePlate}
					onChange={handleCourierInfoChange}
					className="form-control"
				/>
			</div>
		</>
	);
};

export default CourierInfo;
