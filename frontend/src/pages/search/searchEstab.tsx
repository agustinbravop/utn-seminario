import EstablecimientoJugador from "@/components/EstablecimientoJugador/EstablecimientoJugador";
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
import { useWatch } from "react-hook-form";
import React, { useEffect, useState } from "react";

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
  const { data } = useEstablecimientosPlayer();

  const [filtro, setFiltro] = useState("");
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [localidad, setLocalidad] = useState("");
  const [prov, setProv] = useState("");

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

  const establecimientosFiltrados = data.filter((establecimiento) => {
    const nombre = establecimiento.nombre.toLowerCase();
    const provinciaSelect = prov.toLowerCase();
    const localidadSelect = localidad.toLowerCase();

    //Aca me fijo si cuales son los fltros que cumplen y los devuelvo
    //Van en variables para que no se haga tan largo abajo
    const filtroNombre = nombre.includes(filtro.toLowerCase());
    const filtroProvincia =
      !provinciaSelect ||
      establecimiento.provincia.toLowerCase() === provinciaSelect;
    const filtroLocalidad =
      !localidadSelect ||
      establecimiento.localidad.toLowerCase() === localidadSelect;

    return filtroNombre && filtroProvincia && filtroLocalidad;
  });

  return (
    <>
      <Heading textAlign="center">Establecimientos</Heading>

      <Box display="flex" justifyContent="center">
        <VStack>
        <InputGroup width="300px">
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputRightElement>
          <Input
            focusBorderColor="lightblue"
            placeholder="Nombre del establecimiento"
            size="md"
            width="100%"
            onChange={handleChange}
            value={filtro}
          />
        </InputGroup>

        <HStack>

        <Select
          name="provincia"
          placeholder="Provincia"
          value={prov}
          onChange={(e) => setProv(e.target.value)}
          children={provincias.data?.sort().map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        />
        <Select
          name="localidad"
          placeholder="Localidad"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
        >
          {localidades.sort().map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
          <option key="Otra" value="Otra">
            Otra
          </option>
        </Select>
        </HStack>
        </VStack>
      </Box>

      <HStack display="flex" flexWrap="wrap" justifyContent="center" w="330">
        {(filtro ? establecimientosFiltrados : data).map((est) => (
          <EstablecimientoJugador key={est.id} establecimiento={est} />
        ))}
      </HStack>
    </>
  );
}
