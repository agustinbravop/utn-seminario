import { Heading, Text, useToast } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useCanchaByID } from "@/utils/api";
import { useParams } from "@/router";
import FormDisp from "./_FormDisp";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
  useCrearDisponibilidad,
  useDisponibilidadesByCanchaID,
  useModificarDisponibilidad,
} from "@/utils/api";
import FormEliminarDisp from "./_FormEliminarDisp";
import { Disponibilidad, DisponibilidadForm } from "@/models";
import { decimalAHora, horaADecimal } from "@/utils/dates";
import { CanchaMenu } from "@/components/navigation";
import { ordenarDias } from "@/utils/dias";

/**
 * Deriva el valor del campo 'minutosReserva' del DisponibilidadForm
 * en base a la horaInicio y horaFin de una Disponibilidad.
 * Esto es necesario porque el back end no tiene 'minutosReserva'.
 */
function calcularMinutosReserva(disp: Disponibilidad) {
  const diff = horaADecimal(disp.horaFin) - horaADecimal(disp.horaInicio);
  return diff * 60;
}

export default function CanchaInfoPage() {
  const { idEst, idCancha } = useParams("/ests/:idEst/canchas/:idCancha");
  const { data } = useCanchaByID(Number(idEst), Number(idCancha));
  const { data: disponibilidades, isLoading } = useDisponibilidadesByCanchaID(
    Number(idEst),
    Number(idCancha)
  );
  const toast = useToast();

  const { mutate: mutateCrear } = useCrearDisponibilidad({
    onSuccess: () => {
      toast({
        title: "Disponibilidad creada.",
        description: `Se registró exitosamente.`,
        status: "success",
      });
    },
    onError: (e) => {
      toast({
        title: e.conflictMsg("Error al crear la disponibilidad."),
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  const { mutate: mutateModificar } = useModificarDisponibilidad({
    onSuccess: () => {
      toast({
        title: "Disponibilidad modificada.",
        description: `El cambio se guardó exitosamente.`,
        status: "success",
      });
    },
    onError: (e) => {
      toast({
        title: e.conflictMsg("Error al modificar la disponibilidad."),
        description: `Intente de nuevo.`,
        status: "error",
      });
    },
  });

  if (!data || isLoading) {
    return <LoadingSpinner />;
  }

  const handleCrearDisponibilidad = (disp: DisponibilidadForm) => {
    const fin = horaADecimal(disp.horaFin);
    const horasReserva = disp.minutosReserva / 60;
    const dispInicio = horaADecimal(disp.horaInicio);

    let dispFin = dispInicio + horasReserva;
    while (dispFin <= fin) {
      mutateCrear({
        ...disp,
        horaInicio: decimalAHora(dispInicio),
        horaFin: decimalAHora(dispFin),
        idEst: Number(idEst),
        idCancha: Number(idCancha),
      });
      dispFin += horasReserva;
    }
  };

  return (
    <>
      <CanchaMenu />
      <Heading size="md">Disponibilidades de la cancha</Heading>
      <Text>
        Las disponibilidades determinan en qué horario se pueden hacer reservas.
        Las reservas que sus clientes vayan a realizar, ocuparán una
        disponibilidad en la fecha reservada.
      </Text>
      <FormDisp
        variant="crear"
        onSubmit={handleCrearDisponibilidad}
        resetValues={{ idCancha: Number(idCancha) }}
      />
      <TableContainer pt="15px" pb="20px" mr="100px">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Disciplina</Th>
              <Th>Horario</Th>
              <Th>Precio</Th>
              <Th>Días</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {disponibilidades.map((d) => (
              <Tr key={d.id}>
                <Td> {d.disciplina} </Td>
                <Td>
                  {d.horaInicio} - {d.horaFin}
                </Td>
                <Td> ${d.precioReserva} </Td>
                <Td>{ordenarDias(d.dias).join(" - ")}</Td>
                <Td display="flex" gap="10px" p="0.2em">
                  <FormDisp
                    variant="modificar"
                    onSubmit={(disp) =>
                      mutateModificar({
                        ...disp,
                        idEst: Number(idEst),
                        id: d.id,
                      })
                    }
                    resetValues={{
                      ...d,
                      minutosReserva: calcularMinutosReserva(d),
                    }}
                  />
                  <FormEliminarDisp idDisp={d.id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
