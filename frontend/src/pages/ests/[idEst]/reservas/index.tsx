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
  Input,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import {
  TriangleUpIcon,
  TriangleDownIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useParams } from "@/router";
import { useReservasByEstablecimientoID } from "@/utils/api/reservas";
import { estaEntreFechas, formatFecha, formatISOFecha } from "@/utils/dates";
import { useState } from "react";
import { floatingLabelActiveStyles } from "@/themes/components";
import { ReservaEstado } from "@/components/display";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/reservas");
  const navigate = useNavigate();
  const { data: reservas } = useReservasByEstablecimientoID(Number(idEst));

  const [ordenColumna, setOrdenColumna] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const handleOrdenarColumna = (nombreColumna: string) => {
    if (ordenColumna === nombreColumna) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(nombreColumna);
      setOrdenAscendente(true);
    }
  };

  const reservasOrdenadas = [...(reservas || [])].sort((a, b) => {
    if (ordenColumna === "Cancha") {
      return ordenAscendente
        ? a.disponibilidad.cancha.nombre.localeCompare(
            b.disponibilidad.cancha.nombre
          )
        : b.disponibilidad.cancha.nombre.localeCompare(
            a.disponibilidad.cancha.nombre
          );
    } else if (ordenColumna === "Disciplina") {
      return ordenAscendente
        ? a.disponibilidad.disciplina.localeCompare(b.disponibilidad.disciplina)
        : b.disponibilidad.disciplina.localeCompare(
            a.disponibilidad.disciplina
          );
    } else if (ordenColumna === "Fecha") {
      return ordenAscendente
        ? a.fechaReservada.localeCompare(b.fechaReservada)
        : b.fechaReservada.localeCompare(a.fechaReservada);
    } else if (ordenColumna === "HoraInicio") {
      return ordenAscendente
        ? a.disponibilidad.horaInicio.localeCompare(b.disponibilidad.horaInicio)
        : b.disponibilidad.horaInicio.localeCompare(
            a.disponibilidad.horaInicio
          );
    } else if (ordenColumna === "Jugador") {
      const nombreA = `${a.jugador.nombre} ${a.jugador.apellido}`;
      const nombreB = `${b.jugador.nombre} ${b.jugador.apellido}`;
      return ordenAscendente
        ? nombreA.localeCompare(nombreB)
        : nombreB.localeCompare(nombreA);
    } else if (ordenColumna === "Estado") {
      const estadoA = a.idPagoReserva
        ? "C - Pagado"
        : a.idPagoSenia
        ? "B - Señado"
        : "A - No Pagado";

      const estadoB = b.idPagoReserva
        ? "C - Pagado"
        : b.idPagoSenia
        ? "B - Señado"
        : "A - No Pagado";

      return ordenAscendente
        ? estadoA.localeCompare(estadoB)
        : estadoB.localeCompare(estadoA);
    } else {
      return 0;
    }
  });

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDesde, setFiltroDesde] = useState(formatFecha(new Date()));
  const [filtroHasta, setFiltroHasta] = useState(formatFecha(new Date()));
  const [filtroEstado, setFiltroEstado] = useState("");

  const reservasFiltradas = reservasOrdenadas.filter((r) => {
    const nombreJugador = `${r.jugador.nombre} ${r.jugador.apellido}`;
    const estado = r.idPagoReserva
      ? "Pagada"
      : r.idPagoSenia
      ? "Señada"
      : "No Pagada";

    const nombreIncluido = nombreJugador
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const fechaCoincide = estaEntreFechas(
      r.fechaReservada,
      filtroDesde,
      filtroHasta
    );

    var estadoCoincide = false;
    if (filtroEstado === estado && estado === "Pagada") {
      estadoCoincide = true;
    } else if (filtroEstado === estado && filtroEstado === "No Pagada") {
      estadoCoincide = true;
    } else if (filtroEstado === estado && filtroEstado === "Señada") {
      estadoCoincide = true;
    } else if (filtroEstado === "") {
      return nombreIncluido && fechaCoincide;
    }

    return nombreIncluido && fechaCoincide && estadoCoincide;
  });

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="12%" ml="12%" mb="30px" mt="0px">
        <Text>
          {reservas.length > 0
            ? "Estas son las reservas actuales para este establecimiento."
            : "Actualmente no hay reservas para este establecimiento."}
        </Text>
      </HStack>
      <HStack mr="12%" ml="12%" mb="20px" mt="0px">
        <FormControl variant="floating" width="auto">
          <Input
            type="text"
            placeholder="Nombre"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <FormLabel sx={{ ...floatingLabelActiveStyles }}>Jugador</FormLabel>
        </FormControl>
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            name="desde"
            placeholder="Fecha"
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
          />
          <FormLabel>Desde</FormLabel>
        </FormControl>
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            name="hasta"
            placeholder="Fecha"
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
          />
          <FormLabel>Hasta</FormLabel>
        </FormControl>

        <FormControl variant="floating" width="auto">
          <Select
            width="auto"
            placeholder="Todos"
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            {["Pagada", "Señada", "No Pagada"].map((pago, i) => (
              <option key={i} value={pago}>
                {pago}
              </option>
            ))}
          </Select>
          <FormLabel>Estado</FormLabel>
        </FormControl>
      </HStack>
      <TableContainer pt="15px" pb="20px" mr="12%" ml="12%" mb="30px" mt="0px">
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Cancha")}
                cursor="pointer"
              >
                Cancha{" "}
                {ordenColumna === "Cancha" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Disciplina")}
                cursor="pointer"
              >
                Disciplina{" "}
                {ordenColumna === "Disciplina" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Fecha")}
                cursor="pointer"
              >
                Fecha reservada{" "}
                {ordenColumna === "Fecha" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("HoraInicio")}
                cursor="pointer"
              >
                Hora inicio{" "}
                {ordenColumna === "HoraInicio" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Jugador")}
                cursor="pointer"
              >
                Jugador{" "}
                {ordenColumna === "Jugador" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Estado")}
                cursor="pointer"
              >
                Estado{" "}
                {ordenColumna === "Estado" && (
                  <>
                    {ordenAscendente ? (
                      <TriangleUpIcon color="blue.500" />
                    ) : (
                      <TriangleDownIcon color="blue.500" />
                    )}
                  </>
                )}
              </Th>
              <Th textAlign="center">Ver Detalle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservasFiltradas.map((r) => {
              return (
                <Tr key={r.id}>
                  <Td textAlign="center">{r.disponibilidad.cancha.nombre}</Td>
                  <Td textAlign="center">{r.disponibilidad.disciplina}</Td>
                  <Td textAlign="center">{formatISOFecha(r.fechaReservada)}</Td>
                  <Td textAlign="center">{r.disponibilidad.horaInicio}</Td>
                  <Td textAlign="center">
                    {r.jugador.nombre} {r.jugador.apellido}
                  </Td>
                  <Td textAlign="center">
                    <ReservaEstado res={r} />
                  </Td>
                  <Td textAlign="center">
                    <PlusSquareIcon
                      w={5}
                      h={5}
                      cursor="pointer"
                      onClick={() => navigate(`${r.id}`)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
