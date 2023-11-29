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

export default function InformesMenu({ title }: { title: string }) {
  const { idEst } = useParams();
  return (
    <HStack my="1.5em" gap="2em">
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<Icon as={ChevronDownIcon} boxSize={6} />}
        >
          Informes
        </MenuButton>
        <MenuList zIndex="dropdown">
          <Link to={`/ests/${idEst}/informes`}>
            <MenuItem>
              <InfoIcon mr="20px" /> Reservas
            </MenuItem>
          </Link>
          <Link to={`/ests/${idEst}/informes/pagos`}>
            <MenuItem>
              <InfoIcon mr="20px" /> Pagos
            </MenuItem>
          </Link>
          <Link to={`/ests/${idEst}/informes/horarios`}>
            <MenuItem>
              <InfoIcon mr="20px" /> Horarios
            </MenuItem>
          </Link>
        </MenuList>
      </Menu>
      <Heading size="lg">{title}</Heading>
    </HStack>
  );
}
