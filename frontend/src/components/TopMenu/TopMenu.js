import React from 'react';
import {Container, Navbar, Nav} from 'react-bootstrap';
import { ReactComponent as Logo } from '../../assets/svg/tennis-icon.svg';

import "./TopMenu.scss";

export default function TopMenu() {
    return (
        <Navbar bg='dark' variant='dark' className='top-menu'>
            <Container>
                <BrandNav />
                <MenuNav />
            </Container>
        </Navbar>
    );
}

function BrandNav() {
    return (<Navbar.Brand>
        <Logo />
        <div>Cancha Club</div>
    </Navbar.Brand>)
};

function MenuNav() {
    return (<Nav className='mr-auto'>
            <Nav.Link href='#'>Establecimientos</Nav.Link>
            <Nav.Link href='#'>Eventos</Nav.Link>
            <Nav.Link href='#'>Grupos</Nav.Link>
        </Nav>)
};