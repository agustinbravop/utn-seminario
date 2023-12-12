import { ReservaEstado } from "@/components/display";
import { LoadingSpinner } from "@/components/feedback";
import { EstablecimientoMenu, InformesMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { ReservasPorCancha, useInformeReservasPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/constants";
import { formatFecha } from "@/utils/dates";
import { FaListUl } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Icon,
  Image,
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
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { DateControl } from "@/components/forms";
import { useFormSearchParams } from "@/hooks";

const defaultValues = {
  desde: formatFecha(new Date()),
  hasta: formatFecha(new Date()),
};

export default function InformeReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const methods = useForm({ defaultValues });
  const { desde = "", hasta = "" } = useWatch({
    control: methods.control,
    defaultValue: defaultValues,
  });
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });

  const { data: informe } = useInformeReservasPorCancha({
    idEst: Number(idEst),
    fechaDesde: desde,
    fechaHasta: hasta,
  });

  return (
    <Box mx="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Reservas" />
      <Text>
        Se estima cuánto dinero recibirá el establecimento en base a las
        <b> reservas</b> en un período dado, y muestra de esas reservas el monto
        que efectivamente fue cobrado. No se contabilizan las reservas
        canceladas.
      </Text>

      <FormProvider {...methods}>
        <HStack mb="20px" mt="30px">
          <DateControl w="auto" name="desde" label="Desde" isRequired />
          <DateControl w="auto" name="hasta" label="Hasta" isRequired />
        </HStack>
      </FormProvider>

      {!informe ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <StatGroup maxW="500px">
            <Stat>
              <StatLabel>
                <Tooltip label="Cantidad de reservas que los jugadores del establecimiento hicieron para jugar">
                  Reservas
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

          <Heading size="md" fontSize="2xl" my="0.5em" ml="2em">
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
    <Card key={cancha.id} w="350px" borderRadius="10px">
      <Image
        src={cancha.urlImagen}
        fallback={<FallbackImage h="125px" />}
        h="125px"
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
