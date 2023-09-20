import { readLocalStorage, writeLocalStorage } from "../localStorage";

export const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

/**
 * Representa un error del backend, con su `status` y su `message`.
 * El `message` no suele ser un mensaje muy legible para el cliente, a menos que
 * sea un error 409 Conflict.
 */
export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
    this.message = msg;
  }
}

export type JWT = {
  token: string;
};

/**
 * Helper function que rechaza una petición al backend fallida.
 * Procesa la petición para procesar y devolver un error de tipo `ApiError`.
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

  throw new ApiError(
    body?.status ?? 500,
    body?.message ?? "Ocurrió un error inesperado"
  );
}

/**
 * Helper function que construye una petición HTTP.
 * @param method el verbo HTTP de la petición.
 * @param endpoint el endpoint de la API.
 * @param body el body tal cual a enviar en la request (opcional).
 * @param headers headers a agregar (opcional). Por defecto se setean 'Authorization' al Bearer JWT y el 'Content-Type' a application/json.
 * @returns una promesa cumplida con el body esperado de tipo `T` si fue exitosa, o rechazada con un `ApiError` como 'reason' si hubo un error.
 */
async function request<T>(
  method: string,
  endpoint: URL | RequestInfo,
  body?: BodyInit,
  headers: HeadersInit = {}
): Promise<T> {
  const token = readLocalStorage<JWT>("token");

  let res = undefined;
  try {
    res = await fetch(endpoint, {
      method,
      body,
      headers: {
        Authorization: token ? `Bearer ${token.token}` : "",
        ...headers,
      },
      mode: "cors",
      cache: "default",
    });
  } catch {
    // `fetch()` lanza un error cuando hay errores de red (ej: sin WiFi).
    // Como no se tiene un response body, se fabrica un `ApiError` genérico.
    throw new ApiError(500, "Error de red");
  }

  if (res && res.ok) {
    // El status code está entre 200 y 299, y la petición fue exitosa.
    return res.json();
  } else {
    // Se lanza un `ApiError`. Sirve para determinar por qué falló una request.
    throw await reject(res);
  }
}

export async function get<T>(endpoint: URL | RequestInfo): Promise<T> {
  return request("GET", endpoint);
}

export async function post<T>(
  endpoint: URL | RequestInfo,
  body: any
): Promise<T> {
  return request("POST", endpoint, JSON.stringify(body), {
    "Content-Type": "application/json",
  });
}

export async function put<T>(
  endpoint: URL | RequestInfo,
  body: any
): Promise<T> {
  return request("PUT", endpoint, JSON.stringify(body), {
    "Content-Type": "application/json",
  });
}

export async function patch<T>(
  endpoint: URL | RequestInfo,
  body: any
): Promise<T> {
  return request("PATCH", endpoint, JSON.stringify(body), {
    "Content-Type": "application/json",
  });
}

export async function del<T = void>(endpoint: URL | RequestInfo): Promise<T> {
  return request("DELETE", endpoint);
}

export async function patchFormData<T>(
  endpoint: URL | RequestInfo,
  formData: FormData
): Promise<T> {
  return request("PATCH", endpoint, formData);
}
