import { useEffect, useContext, createContext, useState } from "react";
import { Jugador } from "@/models";
import { readLocalStorage } from "@/utils/storage/localStorage";
import jwtDecode from "jwt-decode";
import { JWT } from "@/utils/api";
import { useToast } from "@chakra-ui/react";

interface ICurrentJugadorContext {
  jugador: Jugador;
  logout: () => void;
  /** isJugador indica si hay un jugador logueado actualmente. */
  isJugador: boolean;
}

interface CurrentJugadorProviderProps {
  children?: React.ReactNode;
}

// Este jugador nunca debería ser utilizado.
const PLACEHOLDER_JUGADOR = {
  id: 0,
  nombre: "Usuario",
  apellido: "Jugador",
  correo: "jugador@example.com",
  telefono: "00000000",
  usuario: "usuariojugador",
};

const CurrentJugadorContext = createContext<ICurrentJugadorContext | undefined>(
  undefined
);

function readJugadorFromStorage(): Jugador | undefined {
  const token = readLocalStorage<JWT>("token");
  return token
    ? (jwtDecode(token.token) as { jugador: Jugador }).jugador
    : undefined;
}

export function CurrentJugadorProvider({
  children,
}: CurrentJugadorProviderProps) {
  const [currentJugador, setCurrentJugador] = useState<Jugador | undefined>(
    readJugadorFromStorage()
  );
  const toast = useToast(); // Para dar un mensaje de error.

  const updateCurrentJugador = () => {
    const usuario = readJugadorFromStorage();
    setCurrentJugador(usuario);
  };

  useEffect(() => {
    updateCurrentJugador();

    // Se ejecuta cuando el token del localStorage cambia, normalmente al login o logout.
    // También se borra cuando una request es rechazada con un status `401 Unauthorized`.
    function handleTokenUpdate(ev: StorageEvent) {
      if (ev.key === "token") {
        updateCurrentJugador();

        // Si había iniciado sesión pero venció (recibimos un 401), se le informa al usuario.
        if (ev.oldValue && !ev.newValue) {
          toast({
            title: "La sesión actual venció.",
            description: "Por favor inicie sesión de nuevo.",
            status: "error",
          });
        }
      }
    }

    window.addEventListener("storage", handleTokenUpdate);
    return () => {
      window.removeEventListener("storage", handleTokenUpdate);
    };
  }, [toast]);

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentJugador(undefined);
  };

  const isJugador = Boolean(currentJugador);
  const jugador = currentJugador ?? PLACEHOLDER_JUGADOR;

  return (
    <CurrentJugadorContext.Provider value={{ jugador, isJugador, logout }}>
      {children}
    </CurrentJugadorContext.Provider>
  );
}

export function useCurrentJugador() {
  const context = useContext(CurrentJugadorContext);
  if (context === undefined) {
    throw new Error("Usar context dentro de un CurrentJugadorProvider");
  }
  return context;
}
