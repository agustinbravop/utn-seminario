import { useCurrentAdmin } from "../../hooks/useCurrentAdmin";
import { Link } from "react-router-dom";
import { Button, HStack, Icon, MenuItem, MenuList, Tag } from "@chakra-ui/react";
import TennisIcon from "../../assets/svg/TennisIcon";
import { AiOutlineUser } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { Box } from "react-bootstrap-icons";
import { Menu, MenuButton } from "@chakra-ui/react";
import { ArrowForwardIcon, ChevronDownIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";

export default function TopMenu() {
  return (
    <HStack
      className="top-menu"
      backgroundColor="#D5DFE6"
      justifyContent="space-between"
      padding="0 30px 0 30px"
      height="60px"
    >
      <Nav />
    </HStack>
  );
}


function Nav() {
  const { currentAdmin, logout } = useCurrentAdmin();

  if (!currentAdmin) {
    return (
      <>
      <Link to="/landing">
      <img src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png" width={177}/>
    </Link>
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
      </>
    );
  }

  return (
    <>
    <Link to={`/administrador/${currentAdmin.id}`}>
      <img src="https://cdn.discordapp.com/attachments/1031369249345785886/1131656498670485614/SPOILER_logo.png" width={177}/>
    </Link>
    <nav style={{paddingRight:"15px"}}>
      <HStack>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} leftIcon={<AiOutlineUser size="20" />}>
          {currentAdmin.usuario}
        </MenuButton>
        <MenuList>
          <Link to={`/perfil`}>
            <MenuItem > <InfoIcon mr="20px" />   Mi perfil </MenuItem>
          </Link> 
          <Link to={`/landing`}>
            <MenuItem onClick={logout} > <ArrowForwardIcon mr="20px" /> Logout </MenuItem>
          </Link> 
        </MenuList>
      </Menu>
      </HStack>
    </nav>
    </>
  );
}

