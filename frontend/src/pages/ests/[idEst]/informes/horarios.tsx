import { EstablecimientoMenu } from "@/components/navigation";
import { Bar } from "react-chartjs-2";
import { Select, HStack, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "@/router";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { EstadisticaDia, useEstadisticasHorarios } from "@/utils/api";
import { LoadingSpinner } from "@/components/feedback";
import { HORAS, MINUTOS } from "@/utils/constants";
import InformesMenu from "@/components/navigation/InformesMenu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function horarios() {
  const tiempo: string[] = [];
  let tiempoTemp: string;
  HORAS.forEach((element) => {
    MINUTOS.forEach((x) => {
      tiempoTemp = element + ":" + x;
      tiempo.push(tiempoTemp);
    });
  });
  return tiempo;
}

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

function getMaxValue(estadistica: EstadisticaDia) {
  const dias = [];
  dias.push(estadistica.Domingo);
  dias.push(estadistica.Lunes);
  dias.push(estadistica.Martes);
  dias.push(estadistica.Miercoles);
  dias.push(estadistica.Jueves);
  dias.push(estadistica.Viernes);
  dias.push(estadistica.Sabado);
  let max = 0;
  dias.forEach((item) => {
    if (item >= max) {
      max = item;
    }
  });
  return max;
}

function Bars() {
  const ArrayHorarios = horarios();
  const { idEst } = useParams("/ests/:idEst/informes/horarios");
  console.log(idEst);
  const dias = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];

  const [desde, setDesde] = useState("00:00");
  const [hasta, setHasta] = useState("23:55");
  const { data: estadistica } = useEstadisticasHorarios({
    idEst: Number(idEst),
    horaInicio: desde,
    horaFinal: hasta,
  });

  if (!estadistica) {
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
          {ArrayHorarios.map((hora, index) => (
            <option key={index} value={hora}>
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
          {ArrayHorarios.map((hora, index) => (
            <option key={index} value={hora}>
              {hora}
            </option>
          ))}
        </Select>
        <span>hs.</span>
      </HStack>
      <div
        className="bg-light mx-auto px-2 border border-2 border-primary"
        style={{ width: "700px", height: "400px", margin: "auto" }}
      >
        <Bar
          data={{
            labels: dias,
            datasets: [
              {
                label: "Cantidad de Reservas",
                data: estadistica,
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
              y: {
                min: 0,
                max: getMaxValue(estadistica),
              },
              x: {
                ticks: { color: "black" },
              },
            },
          }}
        />
      </div>
    </>
  );
}
