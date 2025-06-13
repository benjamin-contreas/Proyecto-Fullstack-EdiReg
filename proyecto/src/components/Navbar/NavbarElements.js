import styled from 'styled-components';
import { Link as LinkR } from 'react-router-dom';
import { Link as LinkS } from 'react-scroll';


export const Nav = styled.nav`
    background: ${({ scrollNav }) => (scrollNav ? '#0000' : '#0000')};
    backdrop-filter: blur(10px);
    background-color: rgba(0,0,0,.7);
    box-shadow: 0 0 6px 2px rgb(0 0 0 / 20%);
    heigth: 80px;
    padding: 0 20px;
    margin-top: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    position: sticky;
    top: 14.900000000000006px;
    margin: 0 19px;
    border-radius: 15px;
    z-index: 10;

    @media screen and (max-width: 960px) {
        transition: 0.8s all ease;
    } 
`;

export const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    height: 90px;
    z-index: 1;
    width: 100%;
    padding: 0 24px:
    max-width: 1100px;
    margin: 3px 10px;
`;

export const NavLogo = styled(LinkR)`
    color: #fff;
    justify-self: flex-start;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    // margin-left: 24px;
    fond-weight: bold;
    text-decoration: none;
`;

export const Logo = styled.img`
    width: 50px;
    height: auto;
    `

export const MobileIcon = styled.div`
    display: none;
    
    @media screen and (max-width: 700px) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
        color: #fff;
    }
`;

export const NavMenu = styled.ul`
    display: flex;
    align-items: center;
    list-style: none;
    text-align: center;
    // margin-left: 10%;

    @media screen and (max-width: 700px) {
        display: none;
    }
`;

export const NavItem = styled.li`
    height: 89px;
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-right: 15px;
    margin-left: 15px;


`;

export const NavLinks = styled(LinkS)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        border-bottom: 3px solid #01bf71;
    }
`;

export const NavLinkr = styled(LinkR)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        border-bottom: 3px solid #01bf71;
    }
`;

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;

    @media screen and (max-width: 700px) {
        display: none;
    }
`;

export const NavBtinLink = styled(LinkR)`
    width: auto;
    min-width: 150px;
    max-width: 300px;
    border-radius: 50px;
    background: #191919;
    // margin-left: 70px;
    // margin-right: 25px;
    padding: 10px 22px; 
    white-sapce: nowrap;
    color: #ffffff;
    font-size: 19px;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    text-align: center;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #ffffff;
        color: #000000;
    }

    @media screen and (max-width: 1060px) {
        width: 150px;

`