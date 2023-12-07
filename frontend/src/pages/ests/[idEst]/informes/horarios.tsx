import { EstablecimientoMenu } from "@/components/navigation";
import { Bar, Line } from "react-chartjs-2";
import { Select, HStack, Box, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "@/router";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useDiasDeSemanaPopulares, useHorariosPopulares } from "@/utils/api";
import { LoadingSpinner } from "@/components/feedback";
import { DIAS, HORARIOS } from "@/utils/constants";
import InformesMenu from "@/components/navigation/InformesMenu";

const CHART_COLOR = "rgba(237, 137, 54, 0.75)";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function InformeHorariosPage() {
  const [desde, setDesde] = useState("00:00");
  const [hasta, setHasta] = useState("23:55");
  return (
    <Box mx="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Horarios" />
      <Text>
        Este informe muestra los horarios y días de semana históricamente más
        concurridos del establecimiento, en base a todas las reservas que se
        realizaron en PlayFinder. No se contabilizan las reservas canceladas.
      </Text>
      <HStack my="1em">
        <span>Filtrar desde las</span>
        <Select
          maxW="90px"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
        >
          {HORARIOS.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </Select>
        <span>hs hasta las</span>
        <Select
          maxW="90px"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
        >
          {HORARIOS.map((hora) => (
            <option key={hora} value={hora}>
              {hora}
            </option>
          ))}
        </Select>
        <span>hs.</span>
      </HStack>

      <VStack gap="2em" justify="center">
        <HorariosChart desde={desde} hasta={hasta} />
        <DiasDeSemanaChart desde={desde} hasta={hasta} />
      </VStack>
    </Box>
  );
}

interface ChartProps {
  desde: string;
  hasta: string;
}

function DiasDeSemanaChart({ desde, hasta }: ChartProps) {
  const { idEst } = useParams("/ests/:idEst/informes/horarios");
  const { data } = useDiasDeSemanaPopulares({
    idEst: Number(idEst),
    horaInicio: desde,
    horaFin: hasta,
  });

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <Bar
      data={{
        labels: [...DIAS],
        datasets: [
          {
            label: "Cantidad de reservas",
            data: data,
            backgroundColor: CHART_COLOR,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Reservas por día de semana",
            align: "center",
          },
        },
        scales: {
          y: { min: 0, ticks: { stepSize: 1 } },
          x: { ticks: { color: "black" }, grid: { lineWidth: 0 } },
        },
      }}
      id="diasDeSemana"
    />
  );
}

function HorariosChart({ desde, hasta }: ChartProps) {
  const { idEst } = useParams("/ests/:idEst/informes/horarios");
  const { data } = useHorariosPopulares({
    idEst: Number(idEst),
    horaInicio: desde,
    horaFin: hasta,
  });

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <Line
      data={{
        labels: [...HORARIOS].filter((h) => desde <= h && h <= hasta),
        datasets: [
          {
            label: "Cantidad de reservas",
            data: data,
            borderColor: CHART_COLOR,
            pointStyle: false,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Reservas por horario",
            align: "center",
          },
        },
        scales: {
          y: { min: 0, ticks: { stepSize: 1 } },
          x: { ticks: { color: "black" } },
        },
      }}
      id="horarios"
    />
  );
}
