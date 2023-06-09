import { postFormData, get, API_URL, putFormData } from ".";
import { Establecimiento } from "../../models";

export type CrearEstablecimientoReq = Omit<Establecimiento, "id" | "urlImagen">;

export type ModificarEstablecimientoReq = Omit<Establecimiento, "urlImagen">;

export async function crearEstablecimiento(
  est: CrearEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof CrearEstablecimientoReq;
  for (key in est) {
    formData.append(key, String(est[key]));
  }

  console.log(est, formData);

  return postFormData<Establecimiento>(
    `${API_URL}/establecimientos`,
    formData,
    201
  );
}

export async function modificarEstablecimiento(
  establecimiento: ModificarEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  console.log(establecimiento);

  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof ModificarEstablecimientoReq;
  for (key in establecimiento) {
    formData.append(key, String(establecimiento[key]));
  }

  return putFormData<Establecimiento>(
    `${API_URL}/establecimientos`,
    formData,
    200
  );
}

export async function getEstablecimientosByAdminID(
  idAdmin: number
): Promise<Establecimiento[]> {
  return get(`${API_URL}/establecimientos/byAdmin/${idAdmin}`);
}

export async function getEstablecimientoByID(
  id: number
): Promise<Establecimiento> {
  return get(`${API_URL}/establecimientos/${id}`);
}
