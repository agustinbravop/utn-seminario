import { get, API_URL, del, patchFormData, put, post } from ".";
import { Establecimiento } from "@/models";

export type CrearEstablecimientoReq = Omit<Establecimiento, "id" | "urlImagen">;

export type ModificarEstablecimientoReq = Omit<Establecimiento, "urlImagen">;

function modificarImagen(est: Establecimiento, imagen?: File) {
  if (!imagen) {
    return est;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  return patchFormData<Establecimiento>(
    `${API_URL}/establecimientos/${est.id}/imagen`,
    formData
  );
}

export async function crearEstablecimiento(
  est: CrearEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  return post<Establecimiento>(`${API_URL}/establecimientos`, est).then((est) =>
    modificarImagen(est, imagen)
  );
}

export async function modificarEstablecimiento(
  establecimiento: ModificarEstablecimientoReq,
  imagen?: File
): Promise<Establecimiento> {
  return put<Establecimiento>(
    `${API_URL}/establecimientos/${establecimiento.id}`,
    establecimiento
  ).then((est) => modificarImagen(est, imagen));
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

export async function deleteEstablecimientoByID(idEst: number | undefined) {
  return del(`${API_URL}/establecimientos/${idEst}`);
}
