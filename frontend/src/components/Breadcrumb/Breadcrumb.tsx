import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { Administrador, Cancha, Establecimiento } from "@/models";
import { useCanchaByID } from "@/utils/api/canchas";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  BreadcrumbLink,
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";

type Params = {
  cancha: Cancha | null;
  establecimiento: Establecimiento | null
  currentAdmin: Administrador | null
}

export default function Breadcrumb({ data }: {data: Params}) {

  const { cancha, establecimiento, currentAdmin } = data;



  const location = useLocation();
  let actualLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      actualLink += `/${crumb}`;

      return actualLink === "/estsz" ||
        actualLink === "/admin" ? null : actualLink ===
        `/admin/${currentAdmin?.id}/perfil` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}> Perfil </Link>
        </BreadcrumbItem>
      ) : actualLink === `/ests` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>
            Establecimientos
          </Link>
        </BreadcrumbItem>
        ): actualLink === `/ests/${crumb}` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>
            {establecimiento?.nombre}
          </Link>
        </BreadcrumbItem>
      ) : actualLink === `/ests/${establecimiento?.id}/canchas/${cancha?.id}` ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}>{cancha?.nombre}</Link>
        </BreadcrumbItem>
      ) : actualLink === `/admin/${currentAdmin?.id}` &&
        actualLink === location.pathname ? (
        <BreadcrumbItem key={actualLink}>
          <Link to={actualLink}> Home </Link>
        </BreadcrumbItem>
      ) : crumb === currentAdmin?.id.toString() ? null : (
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
  return (
    <ChakraBreadcrumb
      spacing="8px"
      separator={<ChevronRightIcon color="gray.500" />}
    >
      {crumbs}
    </ChakraBreadcrumb>
  );
}
