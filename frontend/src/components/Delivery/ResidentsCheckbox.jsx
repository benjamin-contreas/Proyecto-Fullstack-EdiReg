const ResidentCheckbox = ({ resident, index, onCheckboxChange }) => {
	return (
		<div key={index}>
			<input
				type="checkbox"
				id={`resident-${index}`}
				name="resident"
				value={`${resident.userInfo.firstName} ${resident.userInfo.lastName}`}
				// skipcq: JS-0417
				onChange={(e) => onCheckboxChange(e.target.checked)}
			/>
			<label htmlFor={`resident-${index}`}>
				{resident.userInfo.firstName} {resident.userInfo.lastName}{' '}
				{resident.userInfo.email}
			</label>
		</div>
	);
};

export default ResidentCheckbox;
