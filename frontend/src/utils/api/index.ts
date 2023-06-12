import { Administrador, Establecimiento, Suscripcion } from "../../types";
import jwtDecode from "jwt-decode";
const API_URL = process.env.REACT_APP_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, msg: string) {
    super(msg);
    this.message = msg;
    this.status = status;
  }
}

type JWT = {
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
function request(method: string, endpoint: string, token?: string): Request {
  return new Request(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    mode: "cors" as RequestMode,
    cache: "default" as RequestCache,
  });
}

async function get<T>(endpoint: string, token?: string): Promise<T> {
  return fetch(request("GET", endpoint, token))
    .then((res) => (res.ok ? res.json() : reject(res)))
    .then((data) => data as T);
}

async function post<T>(
  endpoint: string,
  body: object,
  expectedStatus: number,
  token?: string
): Promise<T> {
  return fetch(request("POST", endpoint, token), {
    body: JSON.stringify(body),
  })
    .then((res) => (res.status === expectedStatus ? res.json() : reject(res)))
    .then((data) => data as T);
}

export async function getSuscripciones(): Promise<Suscripcion[]> {
  return get(`${API_URL}/suscripciones`);
}

export async function login(
  correoOUsuario: string,
  clave: string
): Promise<Administrador> {
  return post<JWT>(
    `${API_URL}/auth/login`,
    {
      correo: correoOUsuario,
      usuario: correoOUsuario,
      clave: clave,
    },
    200
  )
    .then((data) => {
      writeLocalStorage("token", data.token);
      return jwtDecode(data.token) as { usuario: Administrador };
    })
    .then((payload) => payload.usuario)
    .then((data) => data as Administrador);
}

export async function register(usuario: Administrador): Promise<Administrador> {
  return post<JWT>(`${API_URL}/auth/register`, usuario, 201)
    .then((data) => {
      writeLocalStorage("token", data.token);
      return jwtDecode(data.token) as { usuario: Administrador };
    })
    .then((payload) => payload.usuario)
    .then((data) => data as Administrador);
}

export async function crearEstablecimiento(
  establecimiento: Establecimiento
): Promise<Establecimiento> {
  const token = readLocalStorage("token");
  return post<Establecimiento>(
    `${API_URL}/establecimientos`,
    establecimiento,
    201,
    token
  );
}
