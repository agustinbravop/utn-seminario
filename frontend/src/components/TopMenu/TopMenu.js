import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { ReactComponent as Logo } from "../../assets/svg/tennis-icon.svg";
import "./TopMenu.scss";
import { Link } from "react-router-dom";
import { readLocalStorage } from "../../utils/storage/localStorage";


export default function TopMenu() {



  const info = readLocalStorage('token');
  function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
  

  const data = decodeJWT(info)
  console.log(data)

  return (
    <Navbar bg="dark" variant="dark" className="top-menu">
      <Container>
        <BrandNav/>
        <MenuNav />
        {data.usuario.usuario && <button className="btn btn-light rounded-pill btn-sm">{data.usuario.usuario}</button>}
      </Container>
    </Navbar>
  );
}

function BrandNav(props) {
  return (
    <Navbar.Brand>
      <Link to={"/landing"}>
        <Logo />
      </Link>
    </Navbar.Brand>
  );
}

function MenuNav() {
  return <Nav className="mr-auto"></Nav>;
}
