import { Alert, Heading, Text, useToast } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useCanchaByID } from "@/utils/api/canchas";
import { useParams } from "@/router";
import SubMenu from "@/components/SubMenu/SubMenu";
import FormDisponibilidad from "./_formDisp";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
  useCrearDisponibilidad,
  useDisponibilidadesByCanchaID,
  useModificarDisponibilidad,
} from "@/utils/api/disponibilidades";
import FormDeleteDisponibilidad from "./_formEliminar";
import { Disponibilidad, DisponibilidadForm } from "@/models";
import { decimalAHora, horaADecimal } from "@/utils/dates";

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

  const { mutate: mutateCrear, isError } = useCrearDisponibilidad();

  const { mutate: mutateModificar } = useModificarDisponibilidad({
    onSuccess: () => {
      toast({
        title: "Disponibilidad modificada.",
        description: `El cambio se guardó exitosamente.`,
        status: "success",
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Error al modificar la disponibilidad.",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  if (!data || isLoading) {
    return <LoadingSpinner />;
  }

  const defaultDisponibilidad = {
    horaFin: "",
    horaInicio: "",
    dias: [],
    disciplina: "",
    precioReserva: NaN,
    precioSenia: undefined,
    minutosReserva: NaN,
    idCancha: Number(idCancha),
  };

  const handleCrearDisponibilidad = (disp: DisponibilidadForm) => {
    const fin = horaADecimal(disp.horaFin);
    const horasReserva = disp.minutosReserva / 60;
    let dispInicio = horaADecimal(disp.horaInicio);
    while (dispInicio < fin) {
      const dispFin = dispInicio + horasReserva;
      mutateCrear({
        ...disp,
        horaInicio: decimalAHora(dispInicio),
        horaFin: decimalAHora(dispFin),
        idEst: Number(idEst),
        idCancha: Number(idCancha),
      });
      dispInicio += horasReserva;
    }
  };

  return (
    <>
      <SubMenu canchas={true} nombreCancha={data.nombre} />
      <Heading size="md">Disponibilidades de la cancha</Heading>
      <Text>
        Las disponibilidades determinan en qué horario se pueden hacer reservas.
        Las reservas que sus clientes vayan a realizar, ocuparán una
        disponibilidad en la fecha reservada.
      </Text>
      <FormDisponibilidad
        variant="crear"
        onSubmit={handleCrearDisponibilidad}
        resetValues={defaultDisponibilidad}
      />
      {isError && (
        <Alert status="error" margin="20px">
          Hubo un error inesperado al intentar crear la disponibilidad. Intente
          de nuevo.
        </Alert>
      )}
      <TableContainer pt="15px" pb="20px" mr="700px">
        <Table variant="simple" m="auto" size="sm">
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
                <Td>{d.dias.sort().join(" - ")}</Td>
                <Td display="flex" gap="10px" p="0.2em">
                  <FormDisponibilidad
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
                  <FormDeleteDisponibilidad idDisp={d.id} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
