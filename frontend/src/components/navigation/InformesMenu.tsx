import { ChevronDownIcon } from "@chakra-ui/icons";
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
import { BsGraphUpArrow } from "react-icons/bs";
import { IoTodayOutline } from "react-icons/io5";
import { MdAutoGraph } from "react-icons/md";

type Informe = "Reservas" | "Pagos" | "Horarios";

const titulo = {
  Reservas: "Reservas por período",
  Pagos: "Pagos por período",
  Horarios: "Horarios populares",
};

export default function InformesMenu({ informe }: { informe: Informe }) {
  const { idEst } = useParams();
  return (
      <HStack my="1.5em" gap="2em">
      <HStack>
        <Heading size="lg">{titulo[informe]}</Heading>
      </HStack>
      <HStack marginLeft="auto">
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
                  <Icon as={MdAutoGraph} mr="20px" /> Reservas
                </MenuItem>
              </Link>
            )}
            {informe !== "Pagos" && (
              <Link to={`/ests/${idEst}/informes/pagos`}>
                <MenuItem>
                  <Icon as={BsGraphUpArrow} mr="20px" /> Pagos
                </MenuItem>
              </Link>
            )}
            {informe !== "Horarios" && (
              <Link to={`/ests/${idEst}/informes/horarios`}>
                <MenuItem>
                  <Icon as={IoTodayOutline} mr="20px" /> Horarios
                </MenuItem>
              </Link>
            )}
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
}
