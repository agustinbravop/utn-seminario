import { postFormData, get, API_URL, putFormData } from ".";
import { Establecimiento } from "../../types";

function buildFormData(establecimiento: Establecimiento, imagen?: File) {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof Establecimiento;
  for (key in establecimiento) {
    formData.append(key, String(establecimiento[key]));
  }

  return formData;
}

export async function crearEstablecimiento(
  establecimiento: Establecimiento,
  imagen?: File
): Promise<Establecimiento> {
  return postFormData<Establecimiento>(
    `${API_URL}/establecimientos`,
    buildFormData(establecimiento, imagen),
    201
  );
}

export async function modificarEstablecimiento(
  establecimiento: Establecimiento,
  imagen?: File
): Promise<Establecimiento> {
  return putFormData<Establecimiento>(
    `${API_URL}/establecimientos`,
    buildFormData(establecimiento, imagen),
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
