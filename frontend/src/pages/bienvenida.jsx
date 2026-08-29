import './bienvenida.css';
import LoginButton from '../components/Login/LoginButton';

function Bienvenida() {
	return (
		<div className='Page-0'>
			<div className='Bienvenida'>
				<h1 className='Bienvenida-titulo'> Bienvenido a EdiRegs</h1>
                <LoginButton />
			</div>
		</div>
	);
}

export default Bienvenida;