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
  Button,
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon, MinusIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useParams } from "@/router";
import { useReservasByEstablecimientoID } from "@/utils/api/reservas";
import { formatearISO } from "@/utils/dates";
import { useState } from "react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/reservas");
  const navigate = useNavigate();
  const { data: reservas } = useReservasByEstablecimientoID(Number(idEst));

  const [ordenColumna, setOrdenColumna] = useState(null);
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
        ? a.disponibilidad.cancha?.nombre.localeCompare(b.disponibilidad.cancha?.nombre)
        : b.disponibilidad.cancha?.nombre.localeCompare(a.disponibilidad.cancha?.nombre);
    } else if (ordenColumna === "Fecha") {
      return ordenAscendente
        ? a.fechaReservada.localeCompare(b.fechaReservada)
        : b.fechaReservada.localeCompare(a.fechaReservada);
    } else if (ordenColumna === "Jugador") {
      const nombreA = `${a.jugador.nombre} ${a.jugador.apellido}`;
      const nombreB = `${b.jugador.nombre} ${b.jugador.apellido}`;
      return ordenAscendente ? nombreA.localeCompare(nombreB) : nombreB.localeCompare(nombreA);
    } else {
      return 0;
    }
  });

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="30px" mt="0px">
        <Text>
          {reservas.length > 0
            ? "Estas son las reservas actuales para este establecimiento."
            : "Actualmente no hay reservas para este establecimiento."}
        </Text>
      </HStack>
      <TableContainer pt="15px" pb="20px" mr="16%" ml="16%" mb="30px" mt="0px">
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Cancha")}
                style={{ cursor: "pointer" }} // Cambia el cursor al pasar el mouse
              >
                Cancha{" "}
                {ordenColumna === "Cancha" && (
                  // Flecha de ordenamiento ascendente o descendente según el estado
                  <>
                    {ordenAscendente ? 
                      <TriangleUpIcon color="blue.500" />
                    :
                      <TriangleDownIcon color="blue.500" />
                    }
                  </>
                )}
              </Th>
              <Th
                textAlign="center"
                onClick={() => handleOrdenarColumna("Fecha")}
                style={{ cursor: "pointer" }}
              >
                Fecha{" "}
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
                style={{ cursor: "pointer" }}
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
              <Th textAlign="center">Ver Detalle</Th>
              <Th textAlign="center" onClick={() => handleOrdenarColumna("Estado")}>Estado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {reservasOrdenadas?.map((r) => {
              let estado = <TriangleDownIcon color="Red" />;
              if (r.idPagoReserva) {
                estado = <TriangleUpIcon color="Green" />;
              } else if (r.idPagoSenia) {
                estado = <MinusIcon color="orange" />;
              }
              return (
                <Tr key={r.id}>
                  <Td textAlign="center">{r.disponibilidad.cancha?.nombre}</Td>
                  <Td textAlign="center">{formatearISO(r.fechaReservada)} </Td>
                  <Td textAlign="center">
                    {r.jugador.nombre} {r.jugador.apellido}
                  </Td>
                  <Td textAlign="center">
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      onClick={() => navigate(`${r.id}`)}
                    >
                      Ver Detalle
                    </Button>
                  </Td>
                  <Td textAlign="center">{estado}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
