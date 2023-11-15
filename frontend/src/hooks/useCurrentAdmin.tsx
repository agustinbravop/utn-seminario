import { useEffect, useContext, createContext, useState } from "react";
import { Administrador } from "../models";
import { readLocalStorage } from "../utils/localStorage";
import jwtDecode from "jwt-decode";
import { JWT } from "@/utils/api";
import { useToast } from "@chakra-ui/react";
import { refreshToken } from "@/utils/api";

interface ICurrentAdminContext {
  admin: Administrador;
  logout: () => void;
  /** isAdmin indica si hay un administrador logueado actualmente. */
  isAdmin: boolean;
}

interface CurrentAdminProviderProps {
  children?: React.ReactNode;
}

// Este admin nunca debería ser utilizado.
const PLACEHOLDER_ADMIN = {
  id: 0,
  nombre: "Usuario",
  apellido: "Admin",
  correo: "admin@example.com",
  suscripcion: {
    id: 0,
    nombre: "Suscripción",
    limiteEstablecimientos: 0,
    costoMensual: 4000,
  },
  telefono: "00000000",
  usuario: "usuarioadmin",
  tarjeta: {
    id: 0,
    cvv: 0,
    numero: "0000000000000000",
    nombre: "USUARIO ADMIN",
    vencimiento: "01/31",
  },
};

const CurrentAdminContext = createContext<ICurrentAdminContext | undefined>(
  undefined
);

function readAdminFromStorage(): Administrador | undefined {
  const token = readLocalStorage<JWT>("token");
  return token
    ? (jwtDecode(token.token) as { admin: Administrador }).admin
    : undefined;
}

export function CurrentAdminProvider({ children }: CurrentAdminProviderProps) {
  const [currentAdmin, setCurrentAdmin] = useState<Administrador | undefined>(
    readAdminFromStorage()
  );
  const toast = useToast(); // Para dar un mensaje de error.

  const updateCurrentAdmin = () => {
    const usuario = readAdminFromStorage();
    setCurrentAdmin(usuario);
  };

  useEffect(() => {
    updateCurrentAdmin();
    refreshToken();

    // Se ejecuta cuando el token del localStorage cambia, normalmente al login o logout.
    // También se borra cuando una request es rechazada con un status `401 Unauthorized`.
    function handleTokenUpdate(ev: StorageEvent) {
      if (ev.key === "token") {
        updateCurrentAdmin();

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
    toast({
      title: "Se cerró la sesión actual.",
      status: "info",
    });
    localStorage.removeItem("token");
    setCurrentAdmin(undefined);
  };

  const isAdmin = Boolean(currentAdmin);
  const admin: Administrador = currentAdmin ?? PLACEHOLDER_ADMIN;

  return (
    <CurrentAdminContext.Provider value={{ admin, logout, isAdmin }}>
      {children}
    </CurrentAdminContext.Provider>
  );
}

/**
 * Este hook asume que siempre es usado desde una página accesible por un administrador y
 * que por ende siempre existe un admin logueado, por eso siempre habrá un valor en `admin`
 * .
 * Si se desea validar si el usuario está logueado como admin o no, se debe usar `isAdmin`.
 */
export function useCurrentAdmin() {
  const context = useContext(CurrentAdminContext);
  if (context === undefined) {
    throw new Error("Usar context dentro de un CurrentAdminProvider");
  }

  return context;
}
