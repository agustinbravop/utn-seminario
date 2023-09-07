import { useParams } from "@/router";
import { useEliminarDisponibilidad } from "@/utils/api/disponibilidades";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  useToast,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from "@chakra-ui/react";

interface FormDeleteDisponibilidadProps {
  idDisp: number;
}

export default function FormDeleteDisponibilidad({
  idDisp,
}: FormDeleteDisponibilidadProps) {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha/disps");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { mutate: mutateDelete } = useEliminarDisponibilidad({
    onSuccess: () => {
      toast({
        title: "Disponibilidad eliminada.",
        description: `Disponibilidad eliminada exitosamente.`,
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al eliminar la cancha",
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });
  const handleEliminar = () => {
    mutateDelete({ idEst: Number(idEst), idCancha: Number(idCancha), idDisp });
    onClose();
  };

  return (
    <>
      <Button size="sm" color="red" onClick={onOpen} title="eliminar">
        <DeleteIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar disponibilidad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Está seguro de eliminar la disponibilidad?</ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blackAlpha"
              backgroundColor="black"
              onClick={handleEliminar}
            >
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
