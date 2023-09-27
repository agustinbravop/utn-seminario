import { Administrador, Cancha, Establecimiento } from "@/models";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  Button,
  HStack,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";

type Params = {
  cancha?: Cancha;
  establecimiento?: Establecimiento;
  admin?: Administrador;
};

export default function Breadcrumb({ cancha, establecimiento, admin }: Params) {
  const location = useLocation();
  let actualLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      actualLink += `/${crumb}`;

      return actualLink === "/estsz" ||
        actualLink === "/admin" ? null : actualLink ===
        `/admin/${admin?.id}/perfil` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}> Perfil </Link>
        </BreadcrumbItem>
      ) : actualLink === `/ests` ? (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}>Establecimientos</BreadcrumbLink>
        </BreadcrumbItem>
      ) : actualLink === `/ests/${crumb}` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>{establecimiento?.nombre}</Link>
        </BreadcrumbItem>
      ) : actualLink ===
        `/ests/${establecimiento?.id}/canchas/${cancha?.id}` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>{cancha?.nombre}</Link>
        </BreadcrumbItem>
      ) : actualLink === `/admin/${admin?.id}` &&
        actualLink === location.pathname ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}> Home </Link>
        </BreadcrumbItem>
      ) : crumb === admin?.id.toString() ? null : (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>
            {(crumb.charAt(0).toUpperCase() + crumb.slice(1)).replace(
              /([a-z])([A-Z])/g,
              "$1 $2"
            )}
          </Link>
        </BreadcrumbItem>
      );
    });

  const navigate = useNavigate();
  const next = (dir: boolean) => {
    dir ? navigate(+1) : navigate(-1);
  };

  return (
    <HStack pt={2} ml="17.3%" mr="17.%" spacing={1}>
      <Button size="xs" backgroundColor="white" onClick={() => next(false)}>
        <ChevronLeftIcon boxSize={6} />
      </Button>
      <ChakraBreadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        {crumbs}
      </ChakraBreadcrumb>
    </HStack>
  );
}
