import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Stack,
  StackDivider,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  useEliminarEstablecimiento,
  useEstablecimientoByID,
  useHabilitarEstablecimiento,
} from "@/utils/api";
import { Image } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { FALLBACK_IMAGE_SRC } from "@/utils/consts";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { ConfirmSubmitButton } from "@/components/forms";
import { EstablecimientoMenu } from "@/components/navigation";

export default function EstablecimientoInfoPage() {
  const { idEst } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: est } = useEstablecimientoByID(Number(idEst));

  const { mutate: mutateDelete } = useEliminarEstablecimiento({
    onSuccess: () => {
      toast({
        title: "Establecimiento eliminado.",
        description: `Establecimiento eliminado exitosamente.`,
        status: "success",
      });
      navigate(`/admin/${est?.idAdministrador}`);
    },
    onError: () => {
      toast({
        title: "Error al eliminar el establecimiento",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const { mutate } = useHabilitarEstablecimiento({
    onSuccess: () => {
      // Usa `!data?.habilitado` porque data es el valor previo al cambio del back end.
      toast({
        title: `Establecimiento ${
          !est?.habilitado ? "habilitado" : "deshabilitado"
        }.`,
        status: `${!est?.habilitado ? "info" : "warning"}`,
      });
    },
    onError: () => {
      toast({
        title: `Error al ${
          est?.habilitado ? "habilitar" : "deshabilitar"
        } el establecimiento`,
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  if (!est) {
    return <LoadingSpinner />;
  }

  const handleSwitchChange = () => {
    mutate({
      idEst: est.id,
      habilitado: !est.habilitado,
    });
  };

  return (
    <>
      <EstablecimientoMenu />
      <Text m="0 16% 30px 16%">
        Esta es la información de su establecimiento.
      </Text>
      <Card m="auto" width="60%">
        <CardBody display="grid" gridTemplateColumns="1fr 1fr">
          <Image
            src={est?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            height="100%"
            objectFit="cover"
            borderRadius="10px"
          />

          <Box mt="55px" ml=" 50px" height="100%">
            <Stack divider={<StackDivider />} spacing="1" mt="-2rem">
              <Box>
                <HStack>
                  <Heading size="xs">Habilitación</Heading>
                  <Switch
                    isChecked={est.habilitado}
                    onChange={handleSwitchChange}
                  />
                </HStack>
                <Text fontSize="sm">
                  Este establecimiento {est.habilitado ? "" : "no"} se encuentra
                  habilitado
                </Text>
              </Box>
              <Box>
                <Heading size="xs">Dirección</Heading>
                <Text fontSize="sm">{est?.direccion}</Text>
              </Box>
              <Box>
                <Heading size="xs">Horario de atención</Heading>
                <Text fontSize="sm">{est?.horariosDeAtencion}</Text>
              </Box>
              <Box>
                <Heading size="xs">Correo de contacto</Heading>
                <Text fontSize="sm">{est?.correo}</Text>
              </Box>
              <Box>
                <Heading size="xs">Numero de teléfono</Heading>
                <Text fontSize="sm">{est?.telefono}</Text>
              </Box>
              <Box height="100%">
                <Heading size="xs">Localidad</Heading>
                <Text fontSize="sm">
                  {est?.localidad}, {est?.provincia}
                </Text>
                <Box pt="25%" display="flex" justifyContent="center">
                  <Link to="editar">
                    <Button mr="30px" leftIcon={<EditIcon />}>
                      Editar
                    </Button>
                  </Link>
                  <ConfirmSubmitButton
                    colorScheme="red"
                    leftIcon={<DeleteIcon />}
                    header="Eliminar establecimiento"
                    body="¿Está seguro de eliminar el establecimiento?"
                    onSubmit={() => mutateDelete(Number(est?.id))}
                  >
                    Eliminar
                  </ConfirmSubmitButton>
                </Box>
              </Box>
            </Stack>
          </Box>
        </CardBody>
      </Card>
    </>
  );
}
