import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBars } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import LoginButton from '../Login/LoginButton';
import Profile from '../Login/Profile';
import usersData from '../Login/users.json';
import {
	Logo,
	MobileIcon,
	Nav,
	NavBtn,
	NavItem,
	NavLogo,
	NavMenu,
	NavbarContainer,
} from './NavbarElements';

const Navbar = ({ toggle }) => {
	const { user, isAuthenticated } = useAuth0();
	const [scrollNav, setScrollNav] = useState(false);
	const { t } = useTranslation('Start');

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

	/**
	 * Retrieves the role of the current user.
	 * @returns {string|null} The role of the current user, or null if the user is not found.
	 */
	const getUserRole = () => {
		const currentUser = usersData.users.find((u) => u.email === user.email);
		return currentUser ? currentUser.role : null;
	};

	/**
	 * Represents the role of the authenticated user.
	 * @type {string|null}
	 */
	const userRole = isAuthenticated ? getUserRole() : null;

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
						{isAuthenticated && (
							<NavMenu>
								{(userRole === 'admin' || userRole === 'admin-restricted') && (
									<NavItem>
										<Link
											to="/visits"
											style={{
												textDecoration: 'none',
												color: '#fff',
												fontSize: '1rem',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{t('visits')}
										</Link>
									</NavItem>
								)}
								{userRole === 'viewer' && (
									<NavItem>
										<Link
											to="/frequentVisitor"
											style={{
												textDecoration: 'none',
												color: '#fff',
												fontSize: '1rem',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{t('frequent visitor')}
										</Link>
									</NavItem>
								)}
								{(userRole === 'admin' || userRole === 'admin-restricted') && (
									<NavItem>
										<Link
											to="/delivery"
											style={{
												textDecoration: 'none',
												color: '#fff',
												fontSize: '1rem',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											Delivery
										</Link>
									</NavItem>
								)}
								{(userRole === 'admin' || userRole === 'admin-restricted') && (
									<NavItem>
										<Link
											to="/parkingTimer"
											style={{
												textDecoration: 'none',
												color: '#fff',
												fontSize: '1rem',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{t('Parking and Timer config')}
										</Link>
									</NavItem>
								)}
							</NavMenu>
						)}
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
