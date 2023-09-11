import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";
import { Busqueda } from "@/models";
import { useEstablecimientosPlayer } from "@/utils/api/establecimientos";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type ApiGobProv = {
  provincias: Provincia[];
};

type ApiGobLoc = {
  municipios: Localidad[];
};

type Localidad = { id: number; nombre: string };

type Provincia = {
  centroide: {};
  id: number;
  nombre: string;
};

export default function SearchEstab() {
  const queryClient = useQueryClient();

  const [filtro, setFiltro] = useState("");
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState("");
  const [prov, setProv] = useState("");
  const [deporte, setDeporte] = useState("");

  const [nombre, setNombre] = useState("");

  const { data } = useEstablecimientosPlayer({
    localidad: localidad,
    provincia: prov,
    nombre: nombre,
    disciplina: deporte,
  });

  useEffect(() => {
    queryClient.refetchQueries(["establecimientos", "jugador"]); //No esta haciendo el refetch :(
    console.log(nombre, prov, localidad, deporte)
  }, [nombre, prov, localidad, deporte])

  const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [dateSelect, setDateSelect] = useState(obtenerFechaActual)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
  };

  const provincias = useQuery<string[]>(["provincias"], {
    queryFn: () =>
      fetch("https://apis.datos.gob.ar/georef/api/provincias")
        .then((req) => req.json())
        .then(
          (data: ApiGobProv) => data?.provincias?.map((p) => p.nombre) ?? []
        ),
  });

  useEffect(() => {
    fetch(
      `https://apis.datos.gob.ar/georef/api/municipios?provincia=${prov}&campos=nombre&max=150`
    )
      .then((response) => response.json())
      .then((data: ApiGobLoc) => {
        setLocalidades(data?.municipios?.map((m) => m.nombre) ?? []);
      });
  }, [prov]);


  return (
    <>
      <Heading textAlign="center">Establecimientos</Heading>

      <Box display="flex" justifyContent="center" paddingTop="15px">
        <VStack>
          <InputGroup width="330px">
            <InputRightElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputRightElement>
            <Input
              focusBorderColor="lightblue"
              placeholder="Nombre del establecimiento"
              size="md"
              width="100%"
              // onChange={handleChange
              onChange={(e) => { setNombre(e.target.value) }}
            // value={filtro}
            />
          </InputGroup>

          <HStack>
            <Select
              placeholder="Provincia"
              onChange={(e) => setProv(e.target.value)}
              children={provincias.data?.sort().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            />
            <Select
              placeholder="Localidad"
              onChange={(e) => setLocalidad(e.target.value)}
            >
              {localidades.sort().map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
              <option key="Otra">Otra</option>
            </Select>
          </HStack>
          <Select
            placeholder="Disciplina"
            onChange={(e) => {
              setDeporte(e.target.value);
            }}
          >
            <option key="Basket">Basket</option>
            <option key="Futbol">Futbol</option>
            <option key="Tenis">Tenis</option>
            <option key="Padel">Padel</option>
            <option key="Otra">Otra</option>
          </Select>
          <Input
            type='date'
            focusBorderColor="lightblue"
            placeholder="Nombre del establecimiento"
            size="md"
            width="100%"
            onChange={(e) => setDateSelect(e.target.value)}
            value={dateSelect}
          />
        </VStack>
      </Box>
      <HStack display="flex" flexWrap="wrap" justifyContent="center" pt="20px" w="330">
        {(data).map(
          (est) => (
            <EstablecimientoJugador key={est.id} establecimiento={est} date={dateSelect} />
          )
        )}
      </HStack>
    </>
  );
}
