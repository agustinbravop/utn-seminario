import { useEffect, useContext, createContext, useState } from "react";
import { Administrador } from "../models";
import {
  readLocalStorage,
  writeLocalStorage,
} from "../utils/storage/localStorage";
import jwtDecode from "jwt-decode";
import { JWT } from "../utils/api";
import { apiLogin } from "../utils/api/auth";

interface ICurrentAdminContext {
  currentAdmin?: Administrador;
  logout: () => void;
  login: (correoOUsuario: string, clave: string) => Promise<Administrador>;
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

  const updateCurrentAdmin = () => {
    const usuario = readAdminFromStorage();
    setCurrentAdmin(usuario);
  };

  useEffect(() => {
    updateCurrentAdmin();

    // Responde cuando una request fue rechazada con un status `401 Unauthorized`.
    function handleTokenUpdate(ev: StorageEvent) {
      if (ev.key === "token") {
        updateCurrentAdmin();
      }
    }
    window.addEventListener("storage", handleTokenUpdate);
    return () => {
      window.removeEventListener("storage", handleTokenUpdate);
    };
  }, []);

  const login = async (correoOUsuario: string, clave: string) => {
    return apiLogin(correoOUsuario, clave).then((admin) => {
      setCurrentAdmin(admin);
      return admin;
    });
  };

  const logout = () => {
    writeLocalStorage("token", null);
    setCurrentAdmin(undefined);
  };

  return (
    <CurrentAdminContext.Provider value={{ currentAdmin, login, logout }}>
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
