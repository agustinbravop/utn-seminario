import { useLocation } from "react-router";
import { Button, HStack, Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "../../utils/api/establecimientos";
import { useParams } from "react-router";
import LoadingSpinner from "../feedback/LoadingSpinner";
import Alerta from "../feedback/Alerta";
import { Link } from "react-router-dom";
import React from "react";
import { EstablecimientoBreadcrumb } from ".";

export default function EstablecimientoMenu() {
  const { idEst } = useParams();
  const {
    data: est,
    isLoading,
    isError,
  } = useEstablecimientoByID(Number(idEst));

  if (isError) {
    return <Alerta mensaje="Ha ocurrido un error" status="error" />;
  }

  if (isLoading || !est) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <EstablecimientoBreadcrumb returnTo="/ests" />
      <Heading textAlign="center" pb="7">
        {est.nombre}
      </Heading>

      <HStack mt="0.2em" mb="0.75em" borderBottom="#E2E8F0 0.2em solid">
        <LinkButton to={[`/ests/${est.id}`]}>Información</LinkButton>
        <LinkButton to={[`/ests/${est.id}/canchas`]}>Canchas</LinkButton>
        <LinkButton to={[`/ests/${est.id}/reservas`]}>Reservas</LinkButton>
        <LinkButton to={[`/ests/${est.id}/pagos`]}>Pagos</LinkButton>
        <LinkButton
          to={[
            `/ests/${est.id}/informes`,
            `/ests/${est.id}/informes/horarios`,
            `/ests/${est.id}/informes/pagos`,
          ]}
        >
          Informes
        </LinkButton>
      </HStack>
    </>
  );
}

interface LinkButtonProps {
  to: string[];
  children?: React.ReactNode;
}

// Subraya solo el link que corresponde a la página actual.
const textDecoration = (currentPath: string, targetPaths: string[]) => {
  return targetPaths.some((path) => currentPath.endsWith(path))
    ? "underline"
    : "none";
};

function LinkButton({ to, children }: LinkButtonProps) {
  const location = useLocation();

  return (
    <Link to={`${to[0]}${location.search}`}>
      <Button
        variant="ghost"
        textDecoration={textDecoration(location.pathname, to)}
        textDecorationThickness="0.2em"
        textDecorationColor="brand.500"
        textUnderlineOffset="0.85em"
      >
        {children}
      </Button>
    </Link>
  );
}
