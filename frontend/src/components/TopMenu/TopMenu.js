import React from 'react';
import {Container, Navbar, Nav, Button} from 'react-bootstrap';
import { ReactComponent as Logo } from '../../assets/svg/tennis-icon.svg';
import "./TopMenu.scss";
import { Link } from 'react-router-dom';

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
        <div>
            <Link to={'/home'}><Button>Cancha Club</Button></Link>
        </div>
    </Navbar.Brand>)
};

function MenuNav() {
    return (
    <Nav className='mr-auto'>
            <Nav.Link href="/frontend/src/pages/establecimientoPage.js" className='link'>Establecimientos</Nav.Link>
            <Nav.Link href='#'>Eventos</Nav.Link>
            <Nav.Link href='#'>Grupos</Nav.Link>
        </Nav>)
};