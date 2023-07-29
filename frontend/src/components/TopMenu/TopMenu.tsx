import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import {
  Button,
  HStack,
  Icon,
  Image,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import TennisIcon from "@/assets/svg/TennisIcon";
import { AiOutlineUser } from "react-icons/ai";
import { Menu, MenuButton } from "@chakra-ui/react";
import { BsHouses } from "react-icons/bs";
import { ArrowForwardIcon, ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";

export default function TopMenu() {
  return (
    <HStack
      justifyContent="space-between"
      shadow="md"
      padding="0 2rem 0 2rem"
      height="4rem"
    >
      <BrandNav />
      <Nav />
    </HStack>
  );
}

function BrandNav() {
  return (
    <Link to="/">
      <Icon as={TennisIcon} fill="blackAlpha.800" fontSize="40px" />
    </Link>
  );
}

function Nav() {
  const { currentAdmin, logout } = useCurrentAdmin();

  if (!currentAdmin) {
    return (
      <>
        <Link to="/">
          <Image
            src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png"
            alt="logo"
            width={177}
          />
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

  return (
    <>
      <Link to={`/admin/${currentAdmin.id}`}>
        <Image
          src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png"
          alt="logo"
          width={177}
        />
      </Link>
      <nav style={{ paddingRight: "15px" }}>
        <HStack>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              leftIcon={<AiOutlineUser size="20" />}
            >
              {currentAdmin.usuario}
            </MenuButton>
            <MenuList>
              <Link to={`/admin/${currentAdmin.id}`}>
                <MenuItem>
                  <Icon mr="20px" as={BsHouses} /> Mis establecimientos
                </MenuItem>
              </Link>
              <Link to={`/admin/${currentAdmin.id}/perfil`}>
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
