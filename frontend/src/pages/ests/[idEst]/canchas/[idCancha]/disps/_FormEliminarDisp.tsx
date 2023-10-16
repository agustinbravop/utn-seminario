import { ConfirmSubmitButton } from "@/components/forms";
import { useParams } from "@/router";
import { useEliminarDisponibilidad } from "@/utils/api";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";

interface FormDeleteDisponibilidadProps {
  idDisp: number;
}

export default function FormEliminarDisp({
  idDisp,
}: FormDeleteDisponibilidadProps) {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha/disps");
  const toast = useToast();

  const { mutate: mutateDelete } = useEliminarDisponibilidad({
    onSuccess: () => {
      toast({
        title: "Disponibilidad eliminada.",
        description: "Disponibilidad eliminada exitosamente.",
        status: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error al eliminar la disponibilidad",
        description: "Intente de nuevo.",
        status: "error",
      });
    },
  });

  return (
    <ConfirmSubmitButton
      size="sm"
      colorScheme="gray"
      color="red"
      title="eliminar"
      header="Eliminar disponibilidad"
      body="¿Está seguro de eliminar la disponibilidad?"
      confirm="Aceptar"
      onSubmit={() =>
        mutateDelete({
          idEst: Number(idEst),
          idCancha: Number(idCancha),
          idDisp,
        })
      }
    >
      <DeleteIcon />
    </ConfirmSubmitButton>
  );
}
