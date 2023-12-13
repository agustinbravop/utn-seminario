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
  Box,
  Tfoot,
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useParams } from "@/router";
import { formatFecha, formatISO } from "@/utils/dates";
import { useState } from "react";
import { floatingLabelActiveStyles } from "@/themes/components";
import { useBuscarPagos } from "@/utils/api";
import { Link } from "react-router-dom";
import { tipoPago } from "@/utils/pagos";
import { IndicadorOrdenColumna } from "@/components/display";
import { nombreCompletoJugador } from "@/utils/reservas";
import { useFormSearchParams } from "@/hooks";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { DateControl, InputControl, SelectControl } from "@/components/forms";
import { PagoConReserva } from "@/models";

const ordenarPagos = (ps: PagoConReserva[], columna: string, asc: boolean) => {
  const pagos = ps.toSorted((a, b) => {
    if (columna === "Cancha") {
      return a.reserva.disponibilidad.cancha.nombre.localeCompare(
        b.reserva.disponibilidad.cancha.nombre
      );
    } else if (columna === "Fecha") {
      return a.fechaPago.localeCompare(b.fechaPago);
    } else if (columna === "Jugador") {
      return nombreCompletoJugador(a.reserva).localeCompare(
        nombreCompletoJugador(b.reserva)
      );
    } else if (columna === "Tipo") {
      return tipoPago(a).localeCompare(tipoPago(b));
    } else if (columna === "Monto") {
      return a.monto - b.monto;
    } else {
      // Por defecto se ordena por fecha de pago.
      return a.fechaPago.localeCompare(b.fechaPago);
    }
  });
  if (!asc) {
    // Invierte el orden ascendente para ordenar descendentemente.
    pagos.reverse();
  }
  return pagos;
};

const filtrarPagos = (pagos: PagoConReserva[], filtros: FiltrosTablaPagos) => {
  return pagos.filter((p) => {
    const nombreIncluido = nombreCompletoJugador(p.reserva)
      .toLowerCase()
      .includes(filtros.nombre?.toLowerCase() ?? "");
    const tipoCoincide = filtros.tipo === tipoPago(p) || filtros.tipo === "";

    return nombreIncluido && tipoCoincide;
  });
};

interface FiltrosTablaPagos {
  desde?: string;
  hasta?: string;
  nombre?: string;
  tipo?: string;
}

export default function EstablecimientoPagosPage() {
  const { idEst } = useParams("/ests/:idEst/pagos");

  const [ordenColumna, setOrdenColumna] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  const methods = useForm<FiltrosTablaPagos>({
    defaultValues: {
      desde: formatFecha(new Date()),
      hasta: formatFecha(new Date()),
      tipo: "",
      nombre: "",
    },
  });
  const filtros = useWatch({ control: methods.control });
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });

  const { data } = useBuscarPagos({
    idEst: Number(idEst),
    fechaDesde: String(filtros.desde),
    fechaHasta: String(filtros.hasta),
  });
  let pagos = ordenarPagos(data, ordenColumna, ordenAscendente);
  pagos = filtrarPagos(pagos, filtros);

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
        {pagos && pagos.length > 0
          ? "Estos son los pagos cobrados del establecimiento."
          : "Actualmente no cuenta con pagos registrados."}
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
          <SelectControl name="tipo" placeholder="Todos" label="Tipo" w="auto">
            {["Total", "Seña", "Restante"].map((tipo, i) => (
              <option key={i} value={tipo}>
                {tipo}
              </option>
            ))}
          </SelectControl>
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
                Fecha del pago{" "}
                {ordenColumna === "Fecha" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                onClick={() => handleOrdenarColumna("Monto")}
                cursor="pointer"
                px="0px"
                isNumeric
              >
                Monto ($){" "}
                {ordenColumna === "Monto" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Tipo")}
                cursor="pointer"
              >
                Tipo de pago{" "}
                {ordenColumna === "Tipo" && (
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
                onClick={() => handleOrdenarColumna("Cancha")}
                cursor="pointer"
              >
                Cancha{" "}
                {ordenColumna === "Cancha" && (
                  <IndicadorOrdenColumna asc={ordenAscendente} />
                )}
              </Th>
              <Th textAlign="center">Ver Reserva</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pagos.map((p) => (
              <Tr key={p.id}>
                <Td textAlign="center">{formatISO(p.fechaPago)}</Td>
                <Td isNumeric px="0px">
                  ${p.monto}
                </Td>
                <Td textAlign="center">{tipoPago(p)}</Td>
                <Td textAlign="center">
                  {nombreCompletoJugador(p.reserva)}
                  {p.reserva.jugadorNoRegistrado && "*"}
                </Td>
                <Td textAlign="center">
                  {p.reserva.disponibilidad.cancha.nombre}
                </Td>
                <Td textAlign="center">
                  <Link to={`/ests/${idEst}/reservas/${p.reserva.id}`}>
                    <PlusSquareIcon w={5} h={5} cursor="pointer" />
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th textAlign="center">Total</Th>
              <Td isNumeric px="0px">
                ${pagos.reduce((acum, pago) => acum + pago.monto, 0)}
              </Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <Text>
        * Estos jugadores fueron cargados por el administrador del
        establecimiento, y la reserva se hizo en su nombre.
      </Text>
    </Box>
  );
}
