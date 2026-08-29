import { useTranslation } from 'react-i18next';
import './inicio.css';

function Inicio() {
	const { t } = useTranslation('Start');
	return (
		<div className='Page-1'>
			<div className='Inicio'>
				<h1 className='Inicio-titulo'> {t('welcome')}</h1>
			</div>
		</div>
	);
}

export default Inicio;
