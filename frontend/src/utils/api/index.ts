import { Administrador, Suscripcion } from "../../types";
import jwtDecode from "jwt-decode";
import { readLocalStorage, writeLocalStorage } from "../storage/localStorage";

export const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, msg: string) {
    super(msg);
    this.message = msg;
    this.status = status;
  }
}

export type JWT = {
  token: string;
};

/**
 * Una petición al backend fallida devuelve un `ApiError`.
 * Esta función ayuda a tirar un error con la información del ApiError.
 * @param res la respuesta con status indeseado.
 * @returns una promesa con el `ApiError` parseado.
 */
async function reject(res: Response): Promise<ApiError> {
  const body = await res.json();
  console.error(body);

  // Un status code `401 Unauthorized` significa que el JSON Web Token venció.
  if (res.status === 401) {
    writeLocalStorage("token", null);
  }

  return Promise.reject(
    new ApiError(
      (body && body.status) || 0,
      (body && body.message) || "Ocurrió un error inesperado"
    )
  );
}

/**
 * Ayuda a construir las solicitudes.
 * @param method el verbo HTTP de la petición
 * @param endpoint el endpoint de la API
 * @param token JWT necesario para los endpoints protegidos
 * @returns el objeto Request que consume `fetch`, al hacer `fetch(request(...))`
 */
function request(method: string, endpoint: string): Request {
  const token = readLocalStorage<JWT>("token");
  return new Request(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token.token}` : "",
    },
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  });
}

export async function get<T>(endpoint: string): Promise<T> {
  return fetch(request("GET", endpoint))
    .then((res) => (res.ok ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function post<T>(
  endpoint: string,
  body: object,
  expectedStatus: number
): Promise<T> {
  console.log(body);
  return fetch(request("POST", endpoint), {
    body: JSON.stringify(body),
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function postFormData<T>(
  endpoint: string,
  formData: FormData,
  expectedStatus: number
): Promise<T> {
  const token = readLocalStorage<JWT>("token");
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token.token}` : "",
    },
    body: formData,
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function putFormData<T>(
  endpoint: string,
  formData: FormData,
  expectedStatus: number
): Promise<T> {
  const token = readLocalStorage<JWT>("token");
  return fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token.token}` : "",
    },
    body: formData,
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return get(`${API_URL}/suscripciones`);
}

export async function apiLogin(
  correoOUsuario: string,
  clave: string
): Promise<Administrador> {
  return post<JWT>(
    `${API_URL}/auth/login`,
    {
      correoOUsuario: correoOUsuario,
      clave: clave,
    },
    200
  )
    .then((data) => {
      writeLocalStorage("token", data);
      return jwtDecode(data.token) as { usuario: Administrador };
    })
    .then((payload) => payload.usuario)
    .then((data) => data as Administrador);
}

export async function apiRegister(
  usuario: Administrador,
  clave: string
): Promise<Administrador> {
  return post<Administrador>(
    `${API_URL}/auth/register`,
    {
      ...usuario,
      clave,
      idSuscripcion: usuario.suscripcion?.id,
    },
    201
  );
}
