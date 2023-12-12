import { EstablecimientoMenu } from "@/components/navigation";
import {
  HStack,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  FormLabel,
  Button,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useParams } from "@/router";
import { useReservasByEstablecimientoID } from "@/utils/api/reservas";
import { estaEntreFechas, formatFecha, formatFechaISO } from "@/utils/dates";
import { useState } from "react";
import { floatingLabelActiveStyles } from "@/themes/components";
import { IndicadorOrdenColumna, ReservaEstado } from "@/components/display";
import { Link } from "react-router-dom";
import { useFormSearchParams, useYupForm } from "@/hooks";
import { FormProvider, useWatch } from "react-hook-form";
import { DateControl, InputControl, SelectControl } from "@/components/forms";
import { estadoReserva, nombreCompletoJugador } from "@/utils/reservas";
import { Reserva } from "@/models";

const ordenarReservas = (rs: Reserva[], columna: string, asc: boolean) => {
  const reservas = rs.toSorted((a, b) => {
    if (columna === "Cancha") {
      return a.disponibilidad.cancha.nombre.localeCompare(
        b.disponibilidad.cancha.nombre
      );
    } else if (columna === "Disciplina") {
      return a.disponibilidad.disciplina.localeCompare(
        b.disponibilidad.disciplina
      );
    } else if (columna === "Fecha") {
      return a.fechaReservada.localeCompare(b.fechaReservada);
    } else if (columna === "HoraInicio") {
      return a.disponibilidad.horaInicio.localeCompare(
        b.disponibilidad.horaInicio
      );
    } else if (columna === "Jugador") {
      return nombreCompletoJugador(a).localeCompare(nombreCompletoJugador(b));
    } else if (columna === "Estado") {
      return estadoReserva(a).localeCompare(estadoReserva(b));
    } else {
      return 0;
    }
  });
  if (!asc) {
    // Invierte el orden ascendente para ordenar descendentemente.
    reservas.reverse();
  }
  return reservas;
};

const filtrarReservas = (rs: Reserva[], filtros: FiltrosTablaReservas) => {
  return rs.filter((r) => {
    const nombreIncluido = nombreCompletoJugador(r)
      .toLowerCase()
      .includes(filtros.nombre?.toLowerCase() ?? "");
    const fechaCoincide = estaEntreFechas(
      r.fechaReservada,
      filtros.desde,
      filtros.hasta
    );
    const estadoCoincide =
      filtros.estado === "" || filtros.estado === estadoReserva(r);

    return nombreIncluido && fechaCoincide && estadoCoincide;
  });
};

interface FiltrosTablaReservas {
  desde?: string;
  hasta?: string;
  nombre?: string;
  estado?: string;
}

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/reservas");
  const { data } = useReservasByEstablecimientoID(Number(idEst));

  const [ordenColumna, setOrdenColumna] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  const methods = useYupForm<FiltrosTablaReservas>({
    defaultValues: {
      desde: formatFecha(new Date()),
      hasta: formatFecha(new Date()),
      estado: "",
      nombre: "",
    },
  });
  const filtros = useWatch({ control: methods.control });
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });
  let reservas = ordenarReservas(data, ordenColumna, ordenAscendente);
  reservas = filtrarReservas(reservas, filtros);

  const handleOrdenarColumna = (nombreColumna: string) => {
    if (ordenColumna === nombreColumna) {
      if (ordenAscendente) {
        // Se estaba ordenando ASC, ahora pasa a ordenarse DESC.
        setOrdenAscendente(false);
      } else {
        // Previamente se ordenó ASC y luego DESC, ahora se elimina el orden.
        setOrdenColumna("");
      }
    } else {
      // Se pasa a ordenar ASC según una columna nueva.
      setOrdenColumna(nombreColumna);
      setOrdenAscendente(true);
    }
  };

  return (
    <Box mx="12%" mb="30px" mt="0px">
      <EstablecimientoMenu />
      <Text>
        {reservas.length > 0
          ? "Estas son las reservas actuales para este establecimiento."
          : "Actualmente no hay reservas para este establecimiento."}
      </Text>
      <FormProvider {...methods}>
        <HStack
          as="form"
          mb="20px"
          mt="20px"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputControl
            w="auto"
            name="nombre"
            placeholder="Nombre"
            label={
              <FormLabel sx={{ ...floatingLabelActiveStyles }}>
                Jugador
              </FormLabel>
            }
          />
          <DateControl w="auto" name="desde" label="Desde" />
          <DateControl w="auto" name="hasta" label="Hasta" />
          <SelectControl
            name="estado"
            placeholder="Todos"
            label="Estado"
            w="auto"
          >
            {["Pagada", "Señada", "No pagada", "Cancelada"].map((estado, i) => (
              <option key={i} value={estado}>
                {estado}
              </option>
            ))}
          </SelectControl>
          <Tooltip label="Usted reserva un horario en nombre de clientes no registrados en PlayFinder">
            <Link
              style={{ marginLeft: "auto" }}
              to={`/search/est/${idEst}/reservar`}
            >
              <Button>Reservar</Button>
            </Link>
          </Tooltip>
        </HStack>
      </FormProvider>
      <TableContainer mt="1em" mb="1em">
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Fecha")}
                cursor="pointer"
              >
                Fecha reservada{" "}
                {ordenColumna === "Fecha" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("HoraInicio")}
                cursor="pointer"
              >
                Hora inicio{" "}
                {ordenColumna === "HoraInicio" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Jugador")}
                cursor="pointer"
              >
                Jugador{" "}
                {ordenColumna === "Jugador" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Estado")}
                cursor="pointer"
              >
                Estado{" "}
                {ordenColumna === "Estado" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Cancha")}
                cursor="pointer"
              >
                Cancha{" "}
                {ordenColumna === "Cancha" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Disciplina")}
                cursor="pointer"
              >
                Disciplina{" "}
                {ordenColumna === "Disciplina" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th textAlign="center">Ver Detalle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservas.map((r) => (
              <Tr key={r.id}>
                <Td textAlign="center">{formatFechaISO(r.fechaReservada)}</Td>
                <Td textAlign="center">{r.disponibilidad.horaInicio}</Td>
                <Td textAlign="center">
                  {nombreCompletoJugador(r)}
                  {r.jugadorNoRegistrado && "*"}
                </Td>
                <Td textAlign="center">
                  <ReservaEstado res={r} />
                </Td>
                <Td textAlign="center">{r.disponibilidad.cancha.nombre}</Td>
                <Td textAlign="center">{r.disponibilidad.disciplina}</Td>
                <Td textAlign="center">
                  <Link to={`${r.id}`}>
                    <PlusSquareIcon w={5} h={5} />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Text>
        * Estos jugadores fueron cargados por el administrador del
        establecimiento, y la reserva se hizo en su nombre.
      </Text>
    </Box>
  );
}
