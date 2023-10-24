import { formatFecha } from "@/utils/dates";
import { useContext, createContext, useState, useMemo } from "react";
import { useCurrentJugador } from ".";

export interface BusquedaFiltros {
  /** id de la cancha a reservar. */
  idCancha?: number;
  /** id del establecimiento a reservar. */
  idEst?: number;
  /** Busca disponibilidades que sean de esa disciplina. */
  disciplina?: string;
  /** Busca disponibilidades todavía no reservadas en esa fecha. */
  fecha?: string;
  /** Busca disponibilidades en esa provincia. */
  provincia?: string;
  /** Busca disponibilidades en esa localidad. Requiere un valor en `provincia`. */
  localidad?: string;
  /** Busca disponibilidades de canchas habilitadas (o deshabilitadas). */
  habilitada?: boolean;
}

interface IBusquedaContext {
  /** Filtros de búsqueda. */
  filtros: BusquedaFiltros;
  /** Sobreescribe todos los filtros. */
  updateFiltros: React.Dispatch<React.SetStateAction<BusquedaFiltros>>;
  /** Actualiza un solo filtro. */
  setFiltro: (filtro: keyof BusquedaFiltros, valor: string | number) => void;
}

interface BusquedaProviderProps {
  children?: React.ReactNode;
}

const BusquedaContext = createContext<IBusquedaContext | undefined>(undefined);

export function BusquedaProvider({ children }: BusquedaProviderProps) {
  const { jugador } = useCurrentJugador();
  const [filtros, updateFiltros] = useState<BusquedaFiltros>({
    fecha: useMemo(() => formatFecha(new Date()), []),
    provincia: jugador.provincia,
    localidad: jugador.localidad,
    disciplina: jugador.disciplina,
    habilitada: true,
  });

  const setFiltro = useMemo(
    () => (filtro: keyof BusquedaFiltros, valor?: string | number) => {
      updateFiltros((prev) => ({ ...prev, [filtro]: valor }));
    },
    []
  );

  return (
    <BusquedaContext.Provider value={{ filtros, updateFiltros, setFiltro }}>
      {children}
    </BusquedaContext.Provider>
  );
}

export function useBusqueda() {
  const context = useContext(BusquedaContext);
  if (context === undefined) {
    throw new Error("Usar context dentro de un BusquedaProvider");
  }
  return context;
}
