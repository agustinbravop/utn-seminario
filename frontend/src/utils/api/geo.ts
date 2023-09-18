import { UseApiQueryOptions, useApiQuery } from "@/hooks";

type Localidad = {
  id: number;
  nombre: string;
};

type Provincia = {
  centroide: {};
  id: number;
  nombre: string;
};

type ApiProvinciasResponse = {
  provincias: Provincia[];
};

type ApiLocalidadesResponse = {
  municipios: Localidad[];
};

/**
 * Obtiene un arreglo con las provincias de Argentina.
 * Ej: ['Buenos Aires', 'Catamarca', 'Chaco', ...].
 */
export function useProvincias(options?: UseApiQueryOptions<string[]>) {
  return useApiQuery(["provincias"], undefined, {
    ...options,
    initialData: [],
    queryFn: () =>
      fetch("https://apis.datos.gob.ar/georef/api/provincias")
        .then((res) => res.json())
        .then(
          (data: ApiProvinciasResponse) =>
            data?.provincias?.map((p) => p.nombre) ?? []
        ),
  });
}

/**
 * Obtiene un arreglo con las localidades de una provincia de Argentina.
 */
export function useLocalidadesByProvincia(
  provincia?: string,
  options?: UseApiQueryOptions<string[]>
) {
  return useApiQuery(["localidades", provincia], undefined, {
    ...options,
    initialData: [],
    queryFn: () =>
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&campos=nombre&max=150`
      )
        .then((res) => res.json())
        .then(
          (data: ApiLocalidadesResponse) =>
            data?.municipios?.map((m) => m.nombre) ?? []
        ),
  });
}
