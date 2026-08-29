import styled from "styled-components";
import { Link as LinkS } from 'react-scroll';
import { Link as LinkR } from 'react-router-dom';
import { FaTimes } from "react-icons/fa";

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    // background-color: rgba(0,0,0,.7)
    background: rgba(0,0,0,.7);
    
    display: grid;
    align-items: center;
    top: 0;
    left: 0;
    transition: 0.3s ease-in-out;
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
`;

export const CloseIcon = styled(FaTimes)`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;
    font-size: 2rem;
    cursor: pointer;
    outline: none;
`;

export const Icon = styled.div`
    color: #fff;
`;

export const SidebarWrapper = styled.div`
    color: #fff;
`;

export const SidebarMenu = styled.ul`
    dislay: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 80px);
    text-align: center;
    margin-bottom: 9rem;

    @media screen and (max-width: 400px) {
        grid-template-rows: repeat(6, 60px);
    }
`;

export const SidebarLink = styled(LinkS)`
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition 0.2s ease-in-out;
    text-decoration; none;
    color: #fff;
    cursor: pointer;

    &:hover {
        color: #01bf71;
        transition: 0.2s ease-in-out;
    }
`;

export const NavLinkr = styled(LinkR)`
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition 0.2s ease-in-out;
    text-decoration; none;
    color: #fff;
    cursor: pointer;

    &:hover {
        color: #01bf71;
        transition: 0.2s ease-in-out;
    }
`;

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
`;


export const SidebarRoute = styled(LinkR)`
    border-radius: 50px;
    background: #191919;
    white-space: nowrap;
    padding: 16px 64px;
    color: #ffffff;
    font-size: 19px;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    transition all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition all 0.2s ease-in-out;
        color: #000000;
        background: #ffffff;
    }
`;

export const Link = styled.a`
    height: 100%;
    padding: 0 1rem;
    margin-bottom: 40px;
    
    font-size: 1.5rem;
    text-decoration: none;
    line-height: 91px;
    text-align: center;
    color: #fff;
    `