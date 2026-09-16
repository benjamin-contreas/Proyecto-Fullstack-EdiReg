import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { navigationFor } from '../../auth/accessPolicy';
import {
    SidebarContainer, Icon, CloseIcon,
    SidebarNavLink, SidebarWrapper, SidebarMenu
} from './SidebarElements'


const Sidebar = ({ isOpen, toggle }) => {
	const { user } = useAuth0();
	const { t } = useTranslation('app');
	const navigation = navigationFor(user);

    return (
		<SidebarContainer $isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
					{navigation.map((item) => (
						<SidebarNavLink key={item.path} to={item.path} onClick={toggle}>{t(item.labelKey)}</SidebarNavLink>
					))}
                </SidebarMenu>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
