import { useLocation } from "react-router";
import { Button, HStack, Heading } from "@chakra-ui/react";
import { useEstablecimientoByID } from "../../utils/api/establecimientos";
import { useParams } from "react-router";
import LoadingSpinner from "../feedback/LoadingSpinner";
import Alerta from "../feedback/Alerta";
import { Link } from "react-router-dom";
import React from "react";

export default function EstablecimientoMenu() {
  const { idEst } = useParams();

  const {
    data: est,
    isLoading,
    isError,
  } = useEstablecimientoByID(Number(idEst));

  if (isError) {
    return <Alerta mensaje="Ha ocurrido un error inesperado" status="error" />;
  }

  if (isLoading || !est) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Heading textAlign="center" pb="7" mt="40px">
        {est.nombre}
      </Heading>

      <HStack m="0.2em 12% 0.75em" borderBottom="#E2E8F0 0.2em solid">
        <LinkButton to={`/ests/${est.id}`}>Información</LinkButton>
        <LinkButton to={`/ests/${est.id}/canchas`}>Canchas</LinkButton>
        <LinkButton to={`/ests/${est.id}/reservas`}>Reservas</LinkButton>
        <LinkButton to={`/ests/${est.id}/informes`}>Informes</LinkButton>
      </HStack>
    </>
  );
}

interface LinkButtonProps {
  to: string;
  children?: React.ReactNode;
}

function LinkButton({ to, children }: LinkButtonProps) {
  const location = useLocation();

  const textDecoration = (targetPath: string) => {
    return location.pathname.endsWith(targetPath) ? "underline" : "none";
  };

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        textDecoration={textDecoration(to)}
        textDecorationThickness="0.2em"
        textDecorationColor="black"
        textUnderlineOffset="0.85em"
      >
        {children}
      </Button>
    </Link>
  );
}
