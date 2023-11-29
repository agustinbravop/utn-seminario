import { ChevronDownIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  Button,
  Icon,
  MenuList,
  MenuItem,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

type Informe = "Reservas" | "Pagos" | "Horarios";

const titulo = {
  Reservas: "Reservas por período",
  Pagos: "Pagos cobrados por período",
  Horarios: "Horarios populares",
};

export default function InformesMenu({ informe }: { informe: Informe }) {
  const { idEst } = useParams();
  return (
    <HStack my="1.5em" gap="2em">
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
        >
          {informe}
        </MenuButton>
        <MenuList zIndex="dropdown">
          {informe !== "Reservas" && (
            <Link to={`/ests/${idEst}/informes`}>
              <MenuItem>
                <InfoIcon mr="20px" /> Reservas
              </MenuItem>
            </Link>
          )}
          {informe !== "Pagos" && (
            <Link to={`/ests/${idEst}/informes/pagos`}>
              <MenuItem>
                <InfoIcon mr="20px" /> Pagos
              </MenuItem>
            </Link>
          )}
          {informe !== "Horarios" && (
            <Link to={`/ests/${idEst}/informes/horarios`}>
              <MenuItem>
                <InfoIcon mr="20px" /> Horarios
              </MenuItem>
            </Link>
          )}
        </MenuList>
      </Menu>
      <Heading size="lg">{titulo[informe]}</Heading>
    </HStack>
  );
}
