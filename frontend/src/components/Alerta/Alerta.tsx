import {
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/alert";
import React from "react";

type alertaProps = {
  mensaje: string;
  status: "info" | "warning" | "success" | "error" | "loading" | undefined;
  descripcion?: string;
};

export default function Alerta({ mensaje, status, descripcion }: alertaProps) {
  return (
    <div>
      <Alert
        status={status}
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {mensaje}
        </AlertTitle>
        {descripcion && (
          <AlertDescription maxWidth="sm">{descripcion}</AlertDescription>
        )}
      </Alert>
    </div>
  );
}
