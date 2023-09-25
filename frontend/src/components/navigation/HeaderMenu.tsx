import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import {
  Button,
  HStack,
  Icon,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Menu, MenuButton } from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  CalendarIcon,
  ChevronDownIcon,
  HamburgerIcon,
  InfoIcon,
  StarIcon,
} from "@chakra-ui/icons";
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
  const usuario = useBreakpointValue({ base: "", sm: admin.usuario });
  return (
    <>
      <Link to={`/admin/${admin.id}`}>
        <LogoImage />
      </Link>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
          leftIcon={<AiOutlineUser size="20" />}
        >
          {usuario}
        </MenuButton>
        <MenuList>
          <Link to={`/admin/${admin.id}/perfil`}>
            <MenuItem>
              <InfoIcon mr="20px" /> Mi perfil
            </MenuItem>
          </Link>
          <Link to={`/`}>
            <MenuItem onClick={logout}>
              <ArrowForwardIcon mr="20px" /> Cerrar sesión
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
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
  const usuario = useBreakpointValue({ base: "", sm: jugador.usuario });
  return (
    <>
      <Link to={`/jugador/${jugador.id}`}>
        <LogoImage />
      </Link>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
          leftIcon={<AiOutlineUser size="20" />}
        >
          {usuario}
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
              <ArrowForwardIcon mr="20px" /> Cerrar sesión
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    </>
  );
}

/**
 * La barra superior que se le muestra a alguien que no inició sesión.
 */
function UnregisteredNav() {
  const nav = useBreakpointValue({
    base: (
      <Menu>
        <MenuButton as={Button}>
          <HamburgerIcon fontSize="1.5em" />
        </MenuButton>
        <MenuList>
          <Link to="/suscripciones">
            <MenuItem>
              <StarIcon mr="20px" />
              Suscripciones
            </MenuItem>
          </Link>
          <Link to="/login">
            <MenuItem>
              <Icon as={AiOutlineUser} mr="20px" /> Iniciar Sesión
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
    ),
    sm: (
      <HStack>
        <Link to="/suscripciones">
          <Button variant="ghost" size="sm">
            Suscripciones
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
      </HStack>
    ),
  });
  return (
    <>
      <Link to="/">
        <LogoImage />
      </Link>
      {nav}
    </>
  );
}
