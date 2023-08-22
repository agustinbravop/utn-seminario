import { useEffect, useContext, createContext, useState } from "react";
import { Administrador } from "../models";
import { readLocalStorage } from "../utils/storage/localStorage";
import jwtDecode from "jwt-decode";
import { JWT } from "../utils/api";
import { useToast } from "@chakra-ui/react";

interface ICurrentAdminContext {
  currentAdmin?: Administrador;
  logout: () => void;
}

interface CurrentAdminProviderProps {
  children?: React.ReactNode;
}

const CurrentAdminContext = createContext<ICurrentAdminContext | undefined>(
  undefined
);

function readAdminFromStorage(): Administrador | undefined {
  const token = readLocalStorage<JWT>("token");
  return token
    ? (jwtDecode(token.token) as { usuario: Administrador }).usuario
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
            isClosable: true,
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
    setCurrentAdmin(undefined);
  };

  return (
    <CurrentAdminContext.Provider value={{ currentAdmin, logout }}>
      {children}
    </CurrentAdminContext.Provider>
  );
}

export function useCurrentAdmin() {
  const context = useContext(CurrentAdminContext);
  if (context === undefined) {
    throw new Error("Usar context dentro de un CurrentAdminProvider");
  }
  return context;
}
