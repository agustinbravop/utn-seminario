import {
  useEffect,
  useCallback,
  useContext,
  createContext,
  useState,
} from "react";
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

const CurrentAdminContext = createContext<ICurrentAdminContext>({
  login: (correoOUsuario, clave) => Promise.reject(),
  logout: () => {},
});

export function CurrentAdminProvider({ children }: CurrentAdminProviderProps) {
  const [currentAdmin, setCurrentAdmin] = useState<Administrador | undefined>(
    undefined
  );

  const updateCurrentAdmin = () => {
    const token = readLocalStorage<JWT>("token");
    if (token) {
      const { usuario } = jwtDecode(token.token) as { usuario: Administrador };
      setCurrentAdmin(usuario);
    } else {
      setCurrentAdmin(undefined);
    }
  };

  useEffect(() => {
    updateCurrentAdmin();
  }, []);

  const handleTokenUpdate = useCallback((ev: StorageEvent) => {
    if (ev.key === "token") {
      updateCurrentAdmin();
    }
  }, []);

  useEffect(() => {
    // Responde cuando una request fue rechazada con un status `401 Unauthorized`.
    window.addEventListener("storage", handleTokenUpdate);
    return () => window.removeEventListener("storage", handleTokenUpdate);
  }, [handleTokenUpdate]);

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

export const useCurrentAdmin = () => useContext(CurrentAdminContext);
