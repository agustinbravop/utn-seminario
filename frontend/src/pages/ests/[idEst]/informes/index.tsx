import { ReservaEstado } from "@/components/display";
import { LoadingSpinner } from "@/components/feedback";
import { EstablecimientoMenu, InformesMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { ReservasPorCancha, useInformeReservasPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/constants";
import { formatFecha } from "@/utils/dates";
import { useState } from "react";
import { FaListUl } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function InformeReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const [fechaDesde, setFechaDesde] = useState(formatFecha(new Date()));
  const [fechaHasta, setFechaHasta] = useState(formatFecha(new Date()));

  const { data: informe } = useInformeReservasPorCancha({
    idEst: Number(idEst),
    fechaDesde: fechaDesde,
    fechaHasta: fechaHasta,
  });

  return (
    <Box mr="12%" ml="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Reservas" />
      <HStack mb="20px" mt="30px">
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha desde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <FormLabel>Desde</FormLabel>
        </FormControl>
        <FormControl variant="floating" width="auto">
          <Input
            type="date"
            placeholder="Fecha hasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <FormLabel>Hasta</FormLabel>
        </FormControl>
      </HStack>

      <Text>
        Se acumula el dinero que se espera recibir de todas las
        <b> reservas a jugar</b> entre las dos fechas de filtro. Ayuda a estimar
        cuánto dinero recibirá el establecimento en base a lo que se juega en un
        día dado. No se contabilizan las reservas canceladas.
      </Text>
      {!informe ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <StatGroup width="fit-content" gap="40px" my="20px">
            <Stat>
              <StatLabel>
                <Tooltip label="Cantidad de reservas que los jugadores del establecimiento hicieron para jugar">
                  Reservas a ser jugadas
                </Tooltip>
              </StatLabel>
              <StatNumber>
                {informe.canchas.reduce(
                  (acum, c) => acum + c.reservas.length,
                  0
                )}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>
                <Tooltip label="Dinero que se espera recibir si todas las reservas que se van a jugar en este período de tiempo son pagadas">
                  Ingresos estimados
                </Tooltip>
              </StatLabel>
              <StatNumber>${informe.estimado}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>
                <Tooltip label="Dinero recibido hasta ahora correspondiente a las reservas que se van a jugar en este período de tiempo">
                  Ingresos cobrados
                </Tooltip>
              </StatLabel>
              <StatNumber>${informe.total}</StatNumber>
            </Stat>
          </StatGroup>

          <Heading size="lg" my="0.5em" ml="2em">
            Por cancha
          </Heading>
          <HStack wrap="wrap" justify="center">
            {informe.canchas.map((cancha) => (
              <InformeReservasDetalleCanchaCard cancha={cancha} />
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
}

function InformeReservasDetalleCanchaCard({
  cancha,
}: {
  cancha: ReservasPorCancha["canchas"][0];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Card key={cancha.id} width="350px" borderRadius="10px">
      <Image
        src={cancha.urlImagen}
        fallback={<FallbackImage height="125px" />}
        height="125px"
        fit="cover"
        borderRadius="10px 10px 0 0"
      />
      <CardBody px="0.5em">
        <HStack justify="space-between" mr="1em">
          <Heading mx="1em" size="md">
            {cancha.nombre}
          </Heading>
          <Button size="sm" onClick={onOpen}>
            <Icon as={FaListUl} />
          </Button>
        </HStack>
        <StatGroup mx="1em" mt="0.5em">
          <Stat>
            <StatLabel>Reservas</StatLabel>
            <StatNumber>{cancha.reservas.length}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Estimado</StatLabel>
            <StatNumber>${cancha.estimado}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Ingresado</StatLabel>
            <StatNumber>${cancha.total}</StatNumber>
          </Stat>
        </StatGroup>

        <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Detalle de la cancha {cancha.nombre}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Th>Jugador</Th>
                    <Th>Fecha</Th>
                    <Th>Horario</Th>
                    <Th>Estado</Th>
                  </Thead>
                  <Tbody>
                    {cancha.reservas
                      .sort(
                        (a, b) =>
                          // Ordenar por fecha (y por horario de inicio si es misma fecha)
                          a.fechaReservada.localeCompare(b.fechaReservada) * 2 +
                          a.disponibilidad.horaInicio.localeCompare(
                            b.disponibilidad.horaInicio
                          )
                      )
                      .map((res) => (
                        <Tr
                          key={res.id}
                          onClick={() =>
                            navigate(
                              `/ests/${cancha.idEstablecimiento}/reservas/${res.id}`
                            )
                          }
                          _hover={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          <Td>
                            {res.jugador
                              ? res.jugador.nombre
                              : res.jugadorNoRegistrado}
                          </Td>
                          <Td>
                            {new Date(res.fechaReservada).toLocaleDateString()}
                          </Td>
                          <Td>
                            {res.disponibilidad.horaInicio}
                            {" - "}
                            {res.disponibilidad.horaFin}
                          </Td>
                          <Td>
                            <ReservaEstado res={res} />
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </ModalBody>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
