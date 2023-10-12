import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { EstablecimientoMenu } from "@/components/navigation";
import { useParams } from "@/router";
import { useInformePagosPorCancha } from "@/utils/api";
import { FallbackImage } from "@/utils/constants";
import { formatFecha, formatISOFecha } from "@/utils/dates";
import {
  Box,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

export default function EstablecimientoReservasPage() {
  const { idEst } = useParams("/ests/:idEst/informes");
  const [fechaDesde, setFechaDesde] = useState<string>(formatFecha(new Date()));
  const [fechaHasta, setFechaHasta] = useState<string>(formatFecha(new Date()));

  const { data: informe } = useInformePagosPorCancha({
    idEst: Number(idEst),
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
  });
  console.log(informe);

  const ingresosStat = (label: string, ingresos: number) => {
    return (
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>${ingresos}</StatNumber>
        <StatHelpText>
          {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
          {fechaHasta && formatISOFecha(fechaHasta)}
        </StatHelpText>
      </Stat>
    );
  };

  const reservasStat = (label: string, reservas: number) => {
    return (
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{reservas}</StatNumber>
        <StatHelpText>
          {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
          {fechaHasta && formatISOFecha(fechaHasta)}
        </StatHelpText>
      </Stat>
    );
  };

  return (
    <>
      <EstablecimientoMenu />
      <HStack mr="16%" ml="16%" mb="20px" mt="30px">
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

      {!informe ? (
        <LoadingSpinner />
      ) : (
        <Box mx="12%">
          <StatGroup width="450px" gap="40px" m="20px auto">
            <Tooltip label="Dinero que se espera recibir al terminar el período, si todas las reservas son pagadas">
              <Stat>
                <StatLabel>Total estimado</StatLabel>
                <StatNumber>${informe.estimado}</StatNumber>
                <StatHelpText>
                  {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
                  {fechaHasta && formatISOFecha(fechaHasta)}
                </StatHelpText>
              </Stat>
            </Tooltip>
            <Tooltip label="Cantidad de inero recibido por el establecimiento hasta ahora">
              <Stat>
                <StatLabel>Total ingresado</StatLabel>
                <StatNumber>${informe.total}</StatNumber>
                <StatHelpText>
                  {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
                  {fechaHasta && formatISOFecha(fechaHasta)}
                </StatHelpText>
              </Stat>
            </Tooltip>
            <Tooltip label="Cantidad de reservas a ser usadas en el período de tiempo">
              <Stat>
                <StatLabel>Reservas recibidas</StatLabel>
                <StatNumber>
                  {informe.canchas.reduce(
                    (acum, c) => acum + c.reservas.length,
                    0
                  )}
                </StatNumber>
                <StatHelpText>
                  {fechaDesde && formatISOFecha(fechaDesde)} -{" "}
                  {fechaHasta && formatISOFecha(fechaHasta)}
                </StatHelpText>
              </Stat>
            </Tooltip>
          </StatGroup>
          <Heading size="lg" mb="0.5em" ml="2em">
            Por cancha
          </Heading>
          <HStack wrap="wrap" justify="center">
            {informe.canchas.map((cancha) => (
              <Card key={cancha.id} width="400px" borderRadius="10px">
                <Image
                  src={cancha.urlImagen}
                  fallback={<FallbackImage height="125px" />}
                  height="125px"
                  fit="cover"
                  borderRadius="10px 10px 0 0"
                />
                <CardBody>
                  <Heading size="md">{cancha.nombre}</Heading>
                  <StatGroup>
                    {ingresosStat("Estimado", informe.estimado)}
                    {ingresosStat("Ingresos", cancha.total)}
                    {reservasStat("Reservas", cancha.reservas.length)}
                  </StatGroup>
                </CardBody>
              </Card>
            ))}
          </HStack>
        </Box>
      )}
    </>
  );
}
