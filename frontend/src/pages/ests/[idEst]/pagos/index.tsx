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
  Tfoot,
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
import { ReservasPorCanchaQuery, useInformePagosPorCancha } from "@/utils/api";
//Quedaría agregat un total de pagos, ver el tema de que no muestras los pagos de señas
export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/pagos");
  const navigate = useNavigate();

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDesde, setFiltroDesde] = useState(formatFecha(new Date()));
  const [filtroHasta, setFiltroHasta] = useState(formatFecha(new Date()));
  const [filtroEstado, setFiltroEstado] = useState("");

  const params = {
    idEst: Number(idEst),
    ...(filtroDesde && { fechaDesde: String(filtroDesde) }),
    ...(filtroHasta && { fechaHasta: String(filtroHasta) }),
  };

  const { data: dataPagos } = useInformePagosPorCancha(
    params as ReservasPorCanchaQuery
  );
  const pagos = dataPagos?.canchas?.flatMap((cancha) => {
    return cancha.pagos;
  });

  useEffect(() => {
    if (pagos) {
      console.log("pagos: ", pagos);
    }
  }, [pagos]);

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
    if (ordenColumna === "Cancha") {
      //queda
      return ordenAscendente
        ? a.reserva.disponibilidad.cancha.nombre.localeCompare(
            b.reserva.disponibilidad.cancha.nombre
          )
        : b.reserva.disponibilidad.cancha.nombre.localeCompare(
            a.reserva.disponibilidad.cancha.nombre
          );
    } else if (ordenColumna === "Fecha") {
      //Fecha del pago
      return ordenAscendente
        ? a.fechaPago.localeCompare(b.fechaPago)
        : b.fechaPago.localeCompare(a.fechaPago);
    } else if (ordenColumna === "Jugador") {
      //Queda
      const nombreA = a.reserva.jugador
        ? `${a.reserva.jugador.nombre} ${a.reserva.jugador.apellido}`
        : a.reserva.jugadorNoRegistrado
          ? `${a.reserva.jugadorNoRegistrado}`
          : " ";
      const nombreB = b.reserva.jugador
        ? `${b.reserva.jugador.nombre} ${b.reserva.jugador.apellido}`
        : b.reserva.jugadorNoRegistrado
          ? `${b.reserva.jugadorNoRegistrado}`
          : " ";
      return ordenAscendente
        ? nombreA.localeCompare(nombreB)
        : nombreB.localeCompare(nombreA);
    } else if (ordenColumna === "Estado") {
      const estadoA =
        a.monto === a.reserva.senia
          ? "Pago Seña"
          : a.monto === a.reserva.precio
            ? "Pago Total"
            : "Pago Adicional";

      const estadoB =
        b.monto === b.reserva.senia
          ? "Pago Seña"
          : b.monto === b.reserva.precio
            ? "Pago Total"
            : "Pago Adicional";

      return ordenAscendente
        ? estadoA.localeCompare(estadoB)
        : estadoB.localeCompare(estadoA);
    } else if (ordenColumna === "Monto") {
      return ordenAscendente ? a.monto - b.monto : b.monto - a.monto;
    } else {
      return 0;
    }
  });

  const pagosFiltrados = pagosOrdenados.filter((p) => {
    const nombreJugador = p.reserva.jugador
      ? `${p.reserva.jugador.nombre} ${p.reserva.jugador.apellido}`
      : p.reserva.jugadorNoRegistrado
        ? `${p.reserva.jugadorNoRegistrado}`
        : " ";
    const estado =
      p.monto === p.reserva.senia
        ? "Pago Seña"
        : p.monto === p.reserva.precio
          ? "Pago Total"
          : "Pago Adicional";

    const nombreIncluido = nombreJugador
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());

    let estadoCoincide = false;
    if (filtroEstado === estado && estado === "Pago Total") {
      estadoCoincide = true;
    } else if (filtroEstado === estado && filtroEstado === "Pago Seña") {
      estadoCoincide = true;
    } else if (filtroEstado === estado && filtroEstado === "Pago Adicional") {
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
        {pagos && pagos.length > 0
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
            {["Pago Total", "Pago Seña", "Pago Adicional"].map((pago, i) => (
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
              <Th textAlign="center">Ver Detalle</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pagosFiltrados.map((p, idx) => {
              const tipo =
                p.monto === p.reserva.senia
                  ? "Pago Seña"
                  : p.monto === p.reserva.precio
                    ? "Pago Total"
                    : "Pago Adicional";

              const bgColor = idx % 2 === 0 ? "gray.100" : "white";

              return (
                <Tr key={p.id} bgColor={bgColor}>
                  <Td textAlign="center">{formatISOFecha(p.fechaPago)}</Td>
                  <Td textAlign="center">
                    {p.reserva.jugador
                      ? `${p.reserva.jugador?.nombre} ${p.reserva.jugador?.apellido}`
                      : p.reserva.jugadorNoRegistrado &&
                        `${p.reserva.jugadorNoRegistrado}*`}
                  </Td>
                  <Td textAlign="center">
                    {p.reserva.disponibilidad.cancha.nombre}
                  </Td>
                  <Td textAlign="center">
                    {tipo}{" "}
                    {/* <CircleIcon color={tipo === 'P. Total' ? "green" : (tipo === 'Seña' ? "yellow" : "orange")} verticalAlign="-0.2em" /> */}
                  </Td>
                  <Td textAlign="center">{p.monto}</Td>
                  <Td textAlign="center">
                    <PlusSquareIcon
                      w={5}
                      h={5}
                      cursor="pointer"
                      onClick={() =>
                        navigate(`/ests/${idEst}/reservas/${p.reserva.id}`)
                      }
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td textAlign="center"></Td>
              <Td textAlign="center"></Td>
              <Td textAlign="center"></Td>
              <Td textAlign="center"></Td>
              <Td textAlign="center">
                <strong style={{ color: "#4a5568" }}>Total ($):</strong>{" "}
                {dataPagos?.total}
              </Td>
              <Td textAlign="center"></Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}
