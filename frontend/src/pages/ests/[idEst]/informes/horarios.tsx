import { EstablecimientoMenu } from "@/components/navigation";
import { Bar } from "react-chartjs-2";
import { Select, HStack, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "@/router";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useDiasDeSemanaPopulares } from "@/utils/api";
import { LoadingSpinner } from "@/components/feedback";
import { DIAS, HORARIOS } from "@/utils/constants";
import InformesMenu from "@/components/navigation/InformesMenu";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function InformeHorariosPage() {
  return (
    <Box mx="12%">
      <EstablecimientoMenu />
      <InformesMenu informe="Horarios" />
      <Text>
        Este gráfico muestra los días históricamente más concurridos de este
        establecimiento, en base a todas las reservas que se realizaron en
        PlayFinder.
      </Text>
      <Bars />
    </Box>
  );
}

function Bars() {
  const { idEst } = useParams("/ests/:idEst/informes/horarios");

  const [desde, setDesde] = useState("00:00");
  const [hasta, setHasta] = useState("23:55");
  const { data } = useDiasDeSemanaPopulares({
    idEst: Number(idEst),
    horaInicio: desde,
    horaFin: hasta,
  });

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <HStack my="1em">
        <span>Desde las</span>
        <Select
          maxW="100"
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
          maxW="100"
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
      <Bar
        data={{
          labels: DIAS,
          datasets: [
            {
              label: "Cantidad de Reservas",
              data: data,
              backgroundColor: "rgba(0, 220, 195, 0.5)",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: "Cantidad de reservas por rango horarios",
              align: "center",
            },
          },
          scales: {
            y: { min: 0 },
            x: { ticks: { color: "black" } },
          },
        }}
      />
    </>
  );
}
