import { API_URL, get, del, patchFormData, post, put } from ".";
import { Cancha } from "@/models";

export type CrearCanchaReq = Omit<Cancha, "id" | "urlImagen">;

export type ModificarCanchaReq = Omit<Cancha, "urlImagen">;

function modificarImagen(cancha: Cancha, imagen?: File) {
  if (!imagen) {
    return cancha;
  }

  const formData = new FormData();
  formData.append("imagen", imagen);
  return patchFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}/imagen`,
    formData
  );
}

export async function crearCancha(
  cancha: CrearCanchaReq,
  imagen?: File
): Promise<Cancha> {
  return post<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
    cancha
  ).then((cancha) => modificarImagen(cancha, imagen));
}

export async function modificarCancha(
  cancha: ModificarCanchaReq,
  imagen?: File
): Promise<Cancha> {
  return put<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
    cancha
  ).then((cancha) => modificarImagen(cancha, imagen));
}

export async function getCanchasByEstablecimientoID(
  idEst: number
): Promise<Cancha[]> {
  return get(`${API_URL}/establecimientos/${idEst}/canchas`);
}

export async function getCanchaByID(
  idEst: number,
  idCancha: number
): Promise<Cancha> {
  return get(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}

export async function deleteCanchaByID(
  idEst: number | undefined,
  idCancha: number | undefined
) {
  return del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}
