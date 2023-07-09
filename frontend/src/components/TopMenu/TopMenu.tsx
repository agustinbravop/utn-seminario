import "./TopMenu.scss";
import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import { Button, HStack, Icon, Tag } from "@chakra-ui/react";
import TennisIcon from "../../assets/svg/TennisIcon";
import { InfoIcon } from "@chakra-ui/icons";
import { AiOutlineUser } from "react-icons/ai";

export default function TopMenu() {
  return (
    <HStack
      className="top-menu"
      backgroundColor="blackAlpha.800"
      justifyContent="space-between"
      padding="0 30px 0 30px"
      height="50px"
    >
      <BrandNav />
      <Nav />
    </HStack>
  );
}

function BrandNav() {
  return (
    <Link to="/landing">
      <Icon as={TennisIcon} fill="whiteAlpha.800" fontSize="40px" />
    </Link>
  );
}

function Nav() {
  const { currentAdmin, logout } = useCurrentAdmin();

  if (!currentAdmin) {
    return (
      <nav>
        <HStack>
          <Link to="/suscripciones">
            <Button variant="ghost" size="sm" color="whiteAlpha.800">
              Suscripciones
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              color="#ff5d3d"
              borderColor="tomato"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </HStack>
      </nav>
    );
  }

  return (
    <nav>
      <HStack>
        <Link to={"/perfil"}>
          <Tag>
            <AiOutlineUser size="20" />
            Perfil
          </Tag>
        </Link>

        <Link to={`/administrador/${currentAdmin.id}`}>
          <Tag>{currentAdmin.usuario}</Tag>
        </Link>
        <Link to="/landing">
          <button
            className="btn btn-danger rounded-pill btn-sm"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </Link>
      </HStack>
    </nav>
  );
}
