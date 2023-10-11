import { EstablecimientoJugador } from "@/components/display";
import {
  BusquedaEstablecimientos,
  useBuscarEstablecimientos,
} from "@/utils/api";
import { SearchIcon } from "@chakra-ui/icons";
import {
  HStack,
  Heading,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatFecha } from "@/utils/dates";
import { useYupForm } from "@/hooks";
import { useWatch } from "react-hook-form";
import { DISCIPLINAS, QuestionImage } from "@/utils/constants";
import { useLocalidadesByProvincia, useProvincias } from "@/utils/api";
import { InputControl, SelectControl } from "@/components/forms";
import { FormProvider } from "react-hook-form";
import DateControl from "@/components/forms/DateControl";
import { useEffect } from "react";
import LoadingSpinner from "@/components/feedback/LoadingSpinner";
import { useBusqueda } from "@/hooks/useBusqueda";

export default function BuscarEstablecimientosPage() {
  const provincias = useProvincias();
  const { filtros, updateFiltros, setFiltro } = useBusqueda();
  const methods = useYupForm<BusquedaEstablecimientos>({
    defaultValues: filtros,
  });
  const values = useWatch({ control: methods.control });
  useEffect(() => {
    updateFiltros(values);
  }, [values, updateFiltros]);

  const { data: ests, isFetchedAfterMount } = useBuscarEstablecimientos({
    ...values,
  });
  const { data: localidades } = useLocalidadesByProvincia(values.provincia);
  useEffect(() => {
    // Evita que la localidad quede desincronizada con los Select de la interfaz.
    if (!localidades.includes(values.localidad ?? "")) {
      methods.setValue("localidad", undefined);
      setFiltro("localidad", "");
    }
  }, [values.localidad, localidades, methods, setFiltro]);

  return (
    <>
      <Heading size="md" textAlign="center">
        Buscá un establecimiento para jugar
      </Heading>
      <FormProvider {...methods}>
        <VStack
          gap="0.3rem"
          bg="#e9eef1"
          mt="15px"
          mx="auto"
          p="0.3rem"
          width="360px"
          borderRadius="10px"
        >
          <HStack spacing="0.3rem">
            <SelectControl
              name="provincia"
              borderRadius="10px"
              bg="white"
              placeholder="Provincia"
              mr="0px"
            >
              {provincias.data?.sort().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </SelectControl>
            <SelectControl
              name="localidad"
              bg="white"
              borderRadius="10px"
              ml="0px"
              placeholder="Localidad"
              value={values.localidad}
            >
              {localidades.sort().map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
              <option key="Otra">Otra</option>
            </SelectControl>
          </HStack>
          <SelectControl
            borderRadius="10px"
            name="disciplina"
            bg="white"
            placeholder="Disciplina"
          >
            {DISCIPLINAS.sort().map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </SelectControl>
          <DateControl
            bg="white"
            borderRadius="10px"
            name="fecha"
            size="md"
            width="100%"
          />
          <InputControl
            bg="white"
            borderRadius="10px"
            name="nombre"
            rightElement={
              <InputRightElement>
                <SearchIcon color="gray.300" />
              </InputRightElement>
            }
            _placeholder={{ color: "#1a202c" }}
            placeholder="Nombre del establecimiento"
            size="md"
            width="100%"
          />
        </VStack>
      </FormProvider>

      <HStack flexWrap="wrap" justifyContent="center" pt="20px" w="330">
        {ests.length > 0 ? (
          ests.map((est) => (
            <EstablecimientoJugador
              key={est.id}
              establecimiento={est}
              date={values.fecha ?? formatFecha(new Date())}
            />
          ))
        ) : isFetchedAfterMount ? (
          <VStack>
            <QuestionImage />
            <Text>No se encontraron establecimientos.</Text>
          </VStack>
        ) : (
          <LoadingSpinner />
        )}
      </HStack>
    </>
  );
}
