import React from 'react'
import {
    SidebarContainer, Icon, CloseIcon,
    SidebarLink, Link, SidebarWrapper, SidebarMenu
} from './SidebarElements'


const Sidebar = ({ isOpen, toggle }) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <Link href='/visits' style={{ textDecoration: 'none', color: 'white' }}>Visitas</Link>
                    <SidebarLink></SidebarLink>
                    <Link href='/vehiculos' style={{ textDecoration: 'none', color: 'white' }}>Vehiculos</Link>
                    <SidebarLink></SidebarLink>
                    <Link href='/delivery' style={{ textDecoration: 'none', color: 'white' }}>Delivery</Link>
                    <SidebarLink></SidebarLink>
                </SidebarMenu>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
