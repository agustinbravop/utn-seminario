import { useCurrentAdmin } from "@/hooks/useCurrentAdmin";
import { useCanchaByID } from "@/utils/api/canchas";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  BreadcrumbLink,
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router";

export default function Breadcrumb() {
  const { idEst, idCancha, idAdmin } = useParams();
  const { admin } = useCurrentAdmin();

  const { data: establecimiento } = useEstablecimientoByID(Number(idEst));
  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
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
          <BreadcrumbLink href={actualLink}> Perfil </BreadcrumbLink>
        </BreadcrumbItem>
      ) : actualLink === `/ests` ? (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}>Establecimientos</BreadcrumbLink>
        </BreadcrumbItem>
      ) : actualLink === `/ests/${crumb}` ? (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}>
            {establecimiento?.nombre}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ) : actualLink === `/ests/${idEst}/canchas/${cancha?.id}` ? (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}>{cancha?.nombre}</BreadcrumbLink>
        </BreadcrumbItem>
      ) : actualLink === `/admin/${admin?.id}` &&
        actualLink === location.pathname ? (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}> Home </BreadcrumbLink>
        </BreadcrumbItem>
      ) : crumb === idAdmin?.toString() ? null : (
        <BreadcrumbItem key={actualLink}>
          <BreadcrumbLink href={actualLink}>
            {(crumb.charAt(0).toUpperCase() + crumb.slice(1)).replace(
              /([a-z])([A-Z])/g,
              "$1 $2"
            )}
          </BreadcrumbLink>
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
