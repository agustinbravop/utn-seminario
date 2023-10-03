import { useParams } from "react-router";
import {
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";
import { useEstablecimientoByID } from "@/utils/api/establecimientos";
import { useCanchasByEstablecimientoID } from "@/utils/api/canchas";
import { DIAS_ABBR } from "@/utils/consts";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useState, useEffect } from "react";
import { Cancha, Disponibilidad } from "@/models";
import { createColumnHelper } from "@tanstack/react-table";
import { DisponibilidadesTablePlayer } from "@/components/DisponibilidadesTablePlayer/DisponibilidadesTablePlayer";

type Columnas = Disponibilidad & { cancha?: string };

// TODO: falta filtrar por disponibilidades ya ocupadas en la fecha dada.
/** Genera las filas de disponibilidades que se muestran en la tabla para reservar. */
function construirDisponibilidades(canchas: Cancha[]) {
  return canchas
    .map((c) => c.disponibilidades.map((d) => ({ ...d, cancha: c.nombre })))
    .flat()
    .sort(
      (a, b) =>
        Number(a.horaInicio.split(":")[0]) - Number(b.horaInicio.split(":")[0])
    );
}
export default function ReservarEstablecimiento() {
  const { idEst } = useParams();

  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: canchas } = useCanchasByEstablecimientoID(Number(idEst));
  const disciplinas = [...new Set(canchas?.map((c) => c.disciplinas).flat())];
  const [disciplina, setDisciplina] = useState(disciplinas[0] ?? "");

  useEffect(() => {
    setDisciplina(disciplinas[0] ?? "");
  }, [disciplinas, setDisciplina]);

  const handleDisciplinaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplina(e.target.value);
  };

  if (!est || !canchas) {
    return <LoadingSpinner />;
  }

  const disponibilidades = construirDisponibilidades(canchas);

  //Funcion para filtrar tabla
  const columnHelper = createColumnHelper<Columnas>();

  //Columnas que se van a poder ordenar
  const columns = [
    columnHelper.accessor("horaInicio", {
      cell: (info) => info.getValue(),
      header: "Inicio",
    }),
    columnHelper.accessor("horaFin", {
      cell: (info) => info.getValue(),
      header: "Fin",
    }),
    columnHelper.accessor("precioReserva", {
      cell: (info) => "$" + info.getValue(),
      header: "Precio",
    }),
    columnHelper.accessor("precioSenia", {
      cell: (info) => (info.getValue() ? "$" + info.getValue() : "Sin seña"),
      header: "Seña",
    }),
    columnHelper.accessor("dias", {
      cell: (info) =>
        info
          .getValue()
          .map((d) => DIAS_ABBR[d])
          .join(", "),
      header: "Dias",
    }),
    columnHelper.accessor("cancha", {
      cell: (info) => info.getValue(),
      header: "Cancha",
    }),
  ];

  return (
    <>
      <Heading textAlign="center" mt="40px">
        {est?.nombre}
      </Heading>
      <Select
        placeholder="Disciplina"
        width="150px"
        my="20px"
        fontSize="sm"
        value={disciplina}
        onChange={handleDisciplinaChange}
      >
        {disciplinas.map((d, idx) => (
          <option value={d} key={idx}>
            {d}
          </option>
        ))}
      </Select>
      <Heading size="md">Horarios disponibles</Heading>
      <Text>Seleccione un horario a reservar.</Text>
      <DisponibilidadesTablePlayer columns={columns} data={disponibilidades} />
    </>
  );
}

/*
<Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th>horario</Th>
              <Th>precio</Th>
              <Th>seña</Th>
              <Th>dias</Th>
              <Th>cancha</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {disponibilidades.map(
              (d) =>
                d.disciplina === disciplina && (
                  <Tr key={d.id}>
                    <Td>
                      {d.horaInicio}-{d.horaFin}hs
                    </Td>
                    <Td>${d.precioReserva} </Td>
                    <Td>{d.precioSenia ? `$${d.precioSenia}` : "Sin seña"}</Td>
                    <Td>{d.dias.map((dia) => DIAS_ABBR[dia]).join(", ")}</Td>
                    <Td>{d.cancha}</Td>
                    <Td>
                      <FormReservarDisponibilidad disp={d} />
                    </Td>
                  </Tr>
                )
            )}
          </Tbody>
        </Table>
*/