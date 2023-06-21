import React, { useEffect } from "react";
import { Administrador } from "../types";
import {
  readLocalStorage,
  writeLocalStorage,
} from "../utils/storage/localStorage";
import jwtDecode from "jwt-decode";
import { JWT } from "../utils/api";

type CurrentAdmin = Administrador | undefined;

interface CurrentAdminContext {
  currentAdmin: CurrentAdmin;
  logout: () => void;
  login: () => void;
}

interface CurrentAdminProviderProps {
  children?: React.ReactNode;
}

export const CurrentAdminContext = React.createContext<
  CurrentAdminContext | undefined
>(undefined);

export function CurrentAdminProvider({ children }: CurrentAdminProviderProps) {
  const [currentAdmin, setCurrentAdmin] =
    React.useState<CurrentAdmin>(undefined);

  useEffect(() => login(), []);

  const login = () => {
    const token = readLocalStorage<JWT>("token");
    if (token) {
      const { usuario } = jwtDecode(token.token) as { usuario: Administrador };
      setCurrentAdmin(usuario);
    } else {
      setCurrentAdmin(undefined);
    }
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
