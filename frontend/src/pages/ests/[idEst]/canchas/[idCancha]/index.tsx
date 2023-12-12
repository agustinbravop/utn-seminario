import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  StackDivider,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCanchaByID,
  useEliminarCancha,
  useHabilitarCancha,
} from "@/utils/api";
import { useParams } from "@/router";
import { FALLBACK_IMAGE_SRC } from "@/utils/constants";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { GrSchedules } from "react-icons/gr";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { ConfirmSubmitButton } from "@/components/forms";
import { CanchaMenu } from "@/components/navigation";

export default function CanchaInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");

  const { data: cancha } = useCanchaByID(Number(idEst), Number(idCancha));
  const navigate = useNavigate();
  const toast = useToast();

  const { mutate: mutateDelete } = useEliminarCancha({
    onSuccess: () => {
      toast({
        title: "Cancha Eliminada.",
        description: `Cancha Eliminada exitosamente.`,
        status: "success",
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const { mutate } = useHabilitarCancha({
    onSuccess: () => {
      toast({
        title: `Cancha ${
          !cancha?.habilitada ? "habilitada" : "deshabilitada"
        }.`,
        status: `${!cancha?.habilitada ? "info" : "warning"}`,
      });
    },
    onError: () => {
      toast({
        title: `Error al ${
          !cancha?.habilitada ? "habilitar" : "deshabilitar"
        } la cancha`,
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  if (!cancha) {
    return <LoadingSpinner />;
  }

  const handleSwitchChange = () => {
    mutate({
      idCancha: cancha.id,
      idEst: cancha.idEstablecimiento,
      habilitada: !cancha.habilitada,
    });
  };

  return (
    <>
      <CanchaMenu />
      <HStack mx="12%" mb="30px" mt="0px">
        <Text>Esta es la información de su cancha.</Text>
      </HStack>
      <Card m="auto" h="75%" w="75%">
        <CardBody display="grid" gridTemplateColumns="1fr 1fr">
          <Image
            src={cancha?.urlImagen}
            fallbackSrc={FALLBACK_IMAGE_SRC}
            h="100%"
            objectFit="cover"
            borderRadius="10px"
          />

          <Stack
            divider={<StackDivider />}
            spacing="1"
            m="0.5rem 1.5rem"
            h="100%"
          >
            <Box>
              <HStack w="100%">
                <Heading size="xs">Habilitación</Heading>
                <Switch
                  isChecked={cancha.habilitada}
                  onChange={handleSwitchChange}
                />
              </HStack>
              <Text fontSize="sm">
                Esta cancha {cancha.habilitada ? "" : "no"} se encuentra
                habilitada
              </Text>
            </Box>
            <Box>
              <Heading size="xs">Descripción</Heading>
              <Text fontSize="sm">{cancha.descripcion}</Text>
            </Box>
            <Box>
              <Heading size="xs">Disciplinas</Heading>
              <Text fontSize="sm">
                {[...new Set(cancha.disciplinas)].join(" - ")}
              </Text>
            </Box>

            <HStack justify="center" mt="1em" spacing="1.5em">
              <Link to="disps">
                <Button leftIcon={<GrSchedules />}>Disponibilidades</Button>
              </Link>
              <Link to="editar">
                <Button leftIcon={<EditIcon />}>Editar</Button>
              </Link>
              <ConfirmSubmitButton
                colorScheme="red"
                onSubmit={() =>
                  mutateDelete({
                    idEst: cancha.idEstablecimiento,
                    idCancha: cancha.id,
                  })
                }
                header="Eliminar cancha"
                body="¿Está seguro de eliminar la cancha?"
                leftIcon={<DeleteIcon />}
              >
                Eliminar
              </ConfirmSubmitButton>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </>
  );
}
