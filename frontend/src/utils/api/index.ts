import { readLocalStorage, writeLocalStorage } from "../storage/localStorage";

export const API_URL = process.env.REACT_APP_API_BASE_URL;

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

  return Promise.reject(
    new ApiError(
      body?.status ?? 500,
      body?.message ?? "Ocurrió un error inesperado"
    )
  ).catch((e) => e); // Sin este `catch()`, se lanza el `ApiError` y JavaScript paniquea.
}

/**
 * Helper function que construye una petición HTTP.
 * @param method el verbo HTTP de la petición.
 * @param endpoint el endpoint de la API.
 * @param token JWT, necesario para endpoints protegidos.
 * @returns una promesa cumplida con el body esperado de tipo `T` si fue exitosa, o rechazada con un `ApiError` como 'reason' si hubo un error.
 */
async function request<T>(
  method: string,
  endpoint: string,
  body?: object
): Promise<T> {
  const token = readLocalStorage<JWT>("token");

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token.token}` : "",
      },
      mode: "cors",
      cache: "default",
      body: JSON.stringify(body),
    });

    if (res.ok) {
      // El status code está entre 200 y 299, y la petición fue exitosa.
      return res.json();
    } else {
      // Se lanza un `ApiError`. Sirve para determinar por qué falló una request.
      throw reject(res);
    }
  } catch {
    // `fetch()` lanza un error cuando hay errores de red (ej: sin WiFi).
    // Como no se tiene un response body, se fabrica un `ApiError` genérico.
    throw new ApiError(500, "Error de red");
  }
}

export async function get<T>(endpoint: string): Promise<T> {
  return request("GET", endpoint);
}

export async function post<T>(endpoint: string, body: object): Promise<T> {
  return request("POST", endpoint, body);
}

export async function postFormData<T>(
  endpoint: string,
  formData: FormData
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
  }).then<T>((res) => (res.ok ? res.json() : reject(res)));
}

export async function putFormData<T>(
  endpoint: string,
  formData: FormData
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
  }).then<T>((res) => (res.ok ? res.json() : reject(res)));
}
