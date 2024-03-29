import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import InformesMenu from "@/components/navigation/InformesMenu";
import { useNavigate, useParams } from "react-router";
import { PagosPorCancha, useInformePagosPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/constants";
import { formatFecha } from "@/utils/dates";
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
import { FaListUl } from "react-icons/fa";
import { DateControl } from "@/components/forms";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useFormSearchParams } from "@/hooks";

const defaultValues = {
  desde: formatFecha(new Date()),
  hasta: formatFecha(new Date()),
};

export default function InformePagosPage() {
  const { idEst } = useParams();
  const methods = useForm({ defaultValues });
  const { desde = "", hasta = "" } = useWatch({
    control: methods.control,
    defaultValue: defaultValues,
  });
  useFormSearchParams({ watch: methods.watch, setValue: methods.setValue });

  const { data: informe } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde: desde,
    fechaHasta: hasta,
  });

  return (
    <Box mx="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Pagos" />
      <Text>
        Se acumula el dinero cobrado de todos los<b> pagos recibidos</b> entre
        las dos fechas indicadas.
      </Text>

      <FormProvider {...methods}>
        <HStack as="form" mb="20px" mt="30px">
          <DateControl w="auto" name="desde" label="Desde" />
          <DateControl w="auto" name="hasta" label="Hasta" />
        </HStack>
      </FormProvider>

      {!informe ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <StatGroup maxW="200px">
            <Stat>
              <StatLabel>
                <Tooltip label="Cantidad de pagos cobrados">Pagos</Tooltip>
              </StatLabel>
              <StatNumber>
                {informe.canchas.reduce((acum, c) => acum + c.pagos.length, 0)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>
                <Tooltip label="Dinero cobrado de los pagos recibidos en el período de tiempo">
                  Ingresos
                </Tooltip>
              </StatLabel>
              <StatNumber>${informe.total}</StatNumber>
            </Stat>
          </StatGroup>

          <Heading fontSize="2xl" my="0.5em" ml="2em">
            Por cancha
          </Heading>
          <HStack wrap="wrap" justify="center">
            {informe.canchas.map((cancha) => (
              <InformePagosDetalleCanchaCard cancha={cancha} />
            ))}
          </HStack>
        </Box>
      )}
    </Box>
  );
}

function InformePagosDetalleCanchaCard({
  cancha,
}: {
  cancha: PagosPorCancha["canchas"][0];
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
            <StatLabel>Pagos</StatLabel>
            <StatNumber>{cancha.pagos.length}</StatNumber>
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
                    <Th>Monto</Th>
                    <Th>Fecha</Th>
                  </Thead>
                  <Tbody>
                    {cancha.pagos.map((p) => (
                      <Tr
                        key={p.id}
                        onClick={() =>
                          navigate(
                            `/ests/${cancha.idEstablecimiento}/reservas/${p.reserva.id}`
                          )
                        }
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        <Td>
                          {p.reserva.jugador
                            ? p.reserva.jugador.nombre
                            : p.reserva.jugadorNoRegistrado}
                        </Td>
                        <Td>$ {p.monto}</Td>
                        <Td>{new Date(p.fechaPago).toLocaleString()}</Td>
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
