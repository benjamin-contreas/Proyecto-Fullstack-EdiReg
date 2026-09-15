import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { animateScroll as scroll } from 'react-scroll';
import Profile from '../Login/Profile';
import {
	Logo,
	MobileIcon,
	Nav,
	NavBtn,
	NavLogo,
	NavbarContainer,
} from './NavbarElements';

const Navbar = ({ toggle }) => {
	const [scrollNav, setScrollNav] = useState(false);

	/**
	 * Function to handle the change in navigation based on scroll position.
	 */
	const changeNav = () => {
		if (window.scrollY >= 80) {
			setScrollNav(true);
		} else {
			setScrollNav(false);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', changeNav);
		return () => window.removeEventListener('scroll', changeNav);
	}, []);

	/**
	 * Scrolls to the top of the page.
	 */
	const toggleHome = () => {
		scroll.scrollToTop();
	};

	return (
		<>
			<IconContext.Provider value={{ color: '#fff' }}>
				<Nav scrollNav={scrollNav}>
					<NavbarContainer>
						<NavLogo to="/inicio" onClick={toggleHome}>
							<Logo src={require('../../img/image.png')} alt="logo" />
						</NavLogo>
						<MobileIcon onClick={toggle}>
							<FaBars />
						</MobileIcon>
						<NavBtn>
							{/* <LanguageButton /> */}
							<Profile />
						</NavBtn>
					</NavbarContainer>
				</Nav>
			</IconContext.Provider>
		</>
	);
};

export default Navbar;
