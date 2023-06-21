import React, { useEffect } from "react";
import { Administrador } from "../types";
import {
  readLocalStorage,
  writeLocalStorage,
} from "../utils/storage/localStorage";
import jwtDecode from "jwt-decode";
import { JWT, apiLogin } from "../utils/api";

interface ICurrentAdminContext {
  currentAdmin?: Administrador;
  logout: () => void;
  login: (correoOUsuario: string, clave: string) => Promise<Administrador>;
}

interface CurrentAdminProviderProps {
  children?: React.ReactNode;
}

export const CurrentAdminContext = React.createContext<ICurrentAdminContext>({
  login: (correoOUsuario, clave) => Promise.reject(),
  logout: () => {},
});

export function CurrentAdminProvider({ children }: CurrentAdminProviderProps) {
  const [currentAdmin, setCurrentAdmin] = React.useState<
    Administrador | undefined
  >(undefined);

  useEffect(() => {
    const token = readLocalStorage<JWT>("token");
    if (token) {
      const { usuario } = jwtDecode(token.token) as { usuario: Administrador };
      setCurrentAdmin(usuario);
    } else {
      setCurrentAdmin(undefined);
    }
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

export const useCurrentAdmin = () => React.useContext(CurrentAdminContext);
