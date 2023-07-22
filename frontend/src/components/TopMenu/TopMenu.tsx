import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import { Button, HStack, Icon, Tag } from "@chakra-ui/react";
import TennisIcon from "../../assets/svg/TennisIcon";
import { AiOutlineUser } from "react-icons/ai";

export default function TopMenu() {
  return (
    <HStack
      className="top-menu"
      backgroundColor="#F2EDE3 "
      justifyContent="space-between"
      padding="0 30px 0 30px"
      height="60px"
    >
      <BrandNav />
      <Nav />
    </HStack>
  );
}

function BrandNav() {
  return (
    <Link to="/landing">
      <img src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png" width={177}/>
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
            <Button variant="ghost" size="sm" color="black">
              Suscripciones
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              color="black"
              borderColor="black"
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
        <Link to={`/perfil`}>
          <Tag>
            <AiOutlineUser size="20" />
            {currentAdmin.usuario}
          </Tag>
        </Link>
        <Link to="/landing">
          <Button
            borderRadius="2xl"
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={logout}
          >
            Cerrar Sesión
          </Button>
        </Link>
      </HStack>
    </nav>
  );
}
