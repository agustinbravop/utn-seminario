import {
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/alert";

type AlertaProps = {
  mensaje: string;
  status: "info" | "warning" | "success" | "error" | "loading" | undefined;
  descripcion?: string;
};

export default function Alerta({ mensaje, status, descripcion }: AlertaProps) {
  return (
    <Alert
      status={status}
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      h="100px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {mensaje}
      </AlertTitle>
      {descripcion && (
        <AlertDescription maxWidth="sm">{descripcion}</AlertDescription>
      )}
    </Alert>
  );
}
