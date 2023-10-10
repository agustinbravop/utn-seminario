import { useParams } from "react-router";
import { Heading, Select, Text } from "@chakra-ui/react";
import {
  BuscarDisponibilidadResult,
  useBuscarDisponibilidades,
  useEstablecimientoByID,
} from "@/utils/api";
import { DIAS_ABBR } from "@/utils/consts";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useState, useEffect, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { TablaDisponibilidadesReservables } from "@/components/TablaDisponibilidadesReservables/TablaDisponibilidadesReservables";
import { ordenarDias } from "@/utils/dias";
import { horaADecimal } from "@/utils/dates";

export default function ReservarEstablecimiento() {
  const { idEst } = useParams();

  const { data: est } = useEstablecimientoByID(Number(idEst));
  const { data: disps } = useBuscarDisponibilidades({
    idEst: Number(idEst),
    fechaDisponible: "2023-10-12", // TODO: parametrizar filtro de fecha disponible
  });
  const disciplinas = useMemo(
    () => [...new Set(disps?.map((c) => c.disciplina))],
    [disps]
  );
  const [disciplina, setDisciplina] = useState(disciplinas[0] ?? "");

  useEffect(() => {
    setDisciplina(disciplinas[0] ?? "");
  }, [disciplinas, setDisciplina]);

  if (!est || !disps) {
    return <LoadingSpinner />;
  }

  const handleDisciplinaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisciplina(e.target.value);
  };

  //Funcion para filtrar tabla
  const columnHelper = createColumnHelper<BuscarDisponibilidadResult>();

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
        ordenarDias(info.getValue())
          .map((dia) => DIAS_ABBR[dia])
          .join(", "),
      header: "Dias",
    }),
    columnHelper.accessor("cancha.nombre", {
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
      <TablaDisponibilidadesReservables
        columns={columns}
        data={disps.sort(
          (a, b) => horaADecimal(a.horaInicio) - horaADecimal(b.horaInicio)
        )}
      />
    </>
  );
}
