import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { ReactComponent as Logo } from "../../assets/svg/tennis-icon.svg";
import "./TopMenu.scss";
import { Link } from "react-router-dom";

export default function TopMenu() {
  return (
    <Navbar bg="dark" variant="dark" className="top-menu">
      <Container>
        <BrandNav />
        <MenuNav />
      </Container>
    </Navbar>
  );
}

function BrandNav() {
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
