import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import { Button, HStack, Icon, MenuItem, MenuList } from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Menu, MenuButton } from "@chakra-ui/react";
import { ArrowForwardIcon, CalendarIcon, ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import { Administrador, Jugador } from "@/models";
import { useCurrentJugador } from "@/hooks/useCurrentJugador";
import { LogoImage } from "@/utils/consts";

export default function HeaderMenu() {
  const { admin, isAdmin, logout: adminLogout } = useCurrentAdmin();
  const { jugador, isJugador, logout: jugadorLogout } = useCurrentJugador();

  let nav = <UnregisteredNav />;
  if (isAdmin) {
    nav = <AdminNav admin={admin} logout={adminLogout} />;
  }
  if (isJugador) {
    nav = <JugadorNav jugador={jugador} logout={jugadorLogout} />;
  }

  return (
    <>
      <HStack
        justifyContent="space-between"
        shadow="md"
        padding="0 2rem 0 2rem"
        height="3.6rem"
        backgroundColor="#f8fafd"
      >
        {nav}
      </HStack>
    </>
  );
}

/**
 * La barra superior que se le muestra a un administrador.
 */
function AdminNav({
  admin,
  logout,
}: {
  admin: Administrador;
  logout: VoidFunction;
}) {
  return (
    <>
      <Link to={`/admin/${admin.id}`}>
        <LogoImage />
      </Link>
      <nav style={{ paddingRight: "0px" }}>
        <HStack>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
              leftIcon={<AiOutlineUser size="20" />}
            >
              {admin.usuario}
            </MenuButton>
            <MenuList>
              <Link to={`/admin/${admin.id}/perfil`}>
                <MenuItem>
                  <InfoIcon mr="20px" /> Mi perfil
                </MenuItem>
              </Link>
              <Link to={`/`}>
                <MenuItem onClick={logout}>
                  <ArrowForwardIcon mr="20px" /> Logout
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </HStack>
      </nav>
    </>
  );
}

/**
 * La barra superior que se le muestra a un jugador.
 */
function JugadorNav({
  jugador,
  logout,
}: {
  jugador: Jugador;
  logout: VoidFunction;
}) {
  return (
    <>
      <Link to={`/jugador/${jugador.id}`}>
        <LogoImage />
      </Link>
      <nav style={{ paddingRight: "0px" }}>
        <HStack>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
              leftIcon={<AiOutlineUser size="20" />}
            >
              {jugador.usuario}
            </MenuButton>
            <MenuList>
              <Link to={`/jugador/${jugador.id}/reservas`}>
                <MenuItem>
                  <CalendarIcon mr="20px" /> Mis reservas
                </MenuItem>
              </Link>
              <Link to={`/jugador/${jugador.id}/perfil`}>
                <MenuItem>
                  <InfoIcon mr="20px" /> Mi perfil
                </MenuItem>
              </Link>
              <Link to={`/`}>
                <MenuItem onClick={logout}>
                  <ArrowForwardIcon mr="20px" /> Logout
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </HStack>
      </nav>
    </>
  );
}

/**
 * La barra superior que se le muestra a alguien que no inició sesión.
 */
function UnregisteredNav() {
  return (
    <>
      <Link to="/">
        <LogoImage />
      </Link>
      <nav>
        <HStack>
          <Link to="/suscripciones">
            <Button variant="ghost" size="sm" color="blackAlpha.800">
              Suscripciones
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
        </HStack>
      </nav>
    </>
  );
}
