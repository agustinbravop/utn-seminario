import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { ReactComponent as Logo } from "../../assets/svg/tennis-icon.svg";
import "./TopMenu.scss";
import { Link } from "react-router-dom";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";

export default function TopMenu() {
  const { currentAdmin, logout } = useCurrentAdmin();

  return (
    <Navbar bg="dark" variant="dark" className="top-menu">
      <Container>
        <BrandNav />
        <MenuNav />
        {currentAdmin && (
          <button
            className="btn btn-light rounded-pill btn-sm"
          >
            {currentAdmin.usuario}
          </button>
        )}
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
