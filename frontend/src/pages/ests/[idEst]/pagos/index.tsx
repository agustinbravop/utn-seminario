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
  // Tooltip,
  Box,
} from "@chakra-ui/react";
import {
  TriangleUpIcon,
  TriangleDownIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useParams } from "@/router";
import { formatFecha, formatISOFecha } from "@/utils/dates";
import { useState } from "react";
import { floatingLabelActiveStyles } from "@/themes/components";
import { useEffect } from "react";
import { useInformePagosPorCancha } from "@/utils/api";
import { CircleIcon } from "@/components/media-and-icons";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/pagos");
  const navigate = useNavigate();

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDesde, setFiltroDesde] = useState(formatFecha(new Date()));
  const [filtroHasta, setFiltroHasta] = useState(formatFecha(new Date()));
  const [filtroEstado, setFiltroEstado] = useState("");

  const { data: dataPagos } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde: String(filtroDesde),
    fechaHasta: String(filtroHasta)
  })
  const pagos = dataPagos?.canchas?.flatMap((cancha) => {
    return cancha.pagos
  })

  useEffect(() => {
    if (pagos) {
      console.log("pagos: ", pagos)
    }
  }, [pagos])

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

  const pagosOrdenados = [...(pagos || [])].sort((a, b) => {
    if (ordenColumna === "Cancha") { //queda
      return ordenAscendente
        ? a.reserva.disponibilidad.cancha.nombre.localeCompare(
          b.reserva.disponibilidad.cancha.nombre
        )
        : b.reserva.disponibilidad.cancha.nombre.localeCompare(
          a.reserva.disponibilidad.cancha.nombre
        );
    } else if (ordenColumna === "Fecha") { //Fecha del pago
      return ordenAscendente
        ? a.fechaPago.localeCompare(b.fechaPago)
        : b.fechaPago.localeCompare(a.fechaPago);
    } else if (ordenColumna === "Jugador") { //Queda
      const nombreA = `${a.reserva.jugador?.nombre} ${a.reserva.jugador?.apellido}`;
      const nombreB = `${b.reserva.jugador?.nombre} ${b.reserva.jugador?.apellido}`;
      return ordenAscendente
        ? nombreA.localeCompare(nombreB)
        : nombreB.localeCompare(nombreA);
    } else if (ordenColumna === "Estado") {
      const estadoA = (a.monto === a.reserva.precio)
        ? "P. Total"
        : "Seña";

      const estadoB = (a.monto === a.reserva.precio)
        ? "P. Total"
        : "Seña";

      return ordenAscendente
        ? estadoA.localeCompare(estadoB)
        : estadoB.localeCompare(estadoA);
    } else {
      return 0;
    }
  });

  const pagosFiltrados = pagosOrdenados.filter((p) => {
    const nombreJugador = `${p.reserva.jugador?.nombre} ${p.reserva.jugador?.apellido}`;
    const estado = (p.monto === p.reserva.precio)
      ? "P. Total"
      : "Seña";

    const nombreIncluido = nombreJugador
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());

    let estadoCoincide = false;
    if (filtroEstado === estado && estado === "P. Total") {
      estadoCoincide = true;
    } else if (filtroEstado === estado && filtroEstado === "Seña") {
      estadoCoincide = true;
    } else if (filtroEstado === "") {
      return nombreIncluido;
    }

    return nombreIncluido && estadoCoincide;
  });

  return (
    <Box mr="12%" ml="12%" mb="30px" mt="0px">
      <EstablecimientoMenu />
      <Text>
        {pagos.length > 0
          ? "Estos son los pagos para este establecimiento."
          : "Actualmente no cuenta con pagos en este establecimiento."}
      </Text>
      <HStack mb="20px" mt="20px">
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

      <TableContainer mt="1em" mb="1em">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Fecha")}
                cursor="pointer"
              >
                Fecha del pago{" "}
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
                onClick={() => handleOrdenarColumna("Monto")}
                cursor="pointer"
              >
                Monto ($){" "}
                {ordenColumna === "Monto" && (
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
                Tipo de pago{" "}
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
            {pagosFiltrados.map((p) => {
              const tipo = (p.monto === p.reserva.precio)
                ? 'P. Total'
                : 'Seña';

              return (
                <Tr key={p.id}>
                  <Td textAlign="center">{formatISOFecha(p.fechaPago)}</Td>
                  <Td textAlign="center">{ p.reserva.jugador
                    ? `${p.reserva.jugador?.nombre} ${p.reserva.jugador?.apellido}`
                    : p.reserva.jugadorNoRegistrado && `${p.reserva.jugadorNoRegistrado}*`}
                  </Td>
                  <Td textAlign="center">{p.reserva.disponibilidad.cancha.nombre}</Td>
                  <Td textAlign="center">{p.monto}</Td>
                  <Td textAlign="center">
                    {tipo}{" "}
                    <CircleIcon color={tipo === 'P. Total' ? "green" : "yellow"} verticalAlign="-0.2em" />
                  </Td>
                  <Td textAlign="center">
                    <PlusSquareIcon
                      w={5}
                      h={5}
                      cursor="pointer"
                      onClick={() => navigate(`/ests/${idEst}/reservas/${p.reserva.id}`)}
                    />
                  </Td>
                </Tr>
              );
            })}
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
