import { postFormData, API_URL, get, putFormData } from ".";
import { Cancha } from "../../types";

export async function crearCancha(
  cancha: Cancha,
  imagen?: File
): Promise<Cancha> {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof Cancha;
  for (key in cancha) {
    formData.append(key, String(cancha[key]));
  }

  return postFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
    formData,
    201
  );
}

export async function getCanchasByEstablecimientoID(
  idEst: number
): Promise<Cancha[]> {
  return get(`${API_URL}/establecimientos/${idEst}`);
}

export async function getCanchaByID(
  idEst: number,
  idCancha: number
): Promise<Cancha> {
  return get(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}

export async function modificarCancha(
  cancha: Cancha,
  imagen?: File
): Promise<Cancha> {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof Cancha;
  for (key in cancha) {
    formData.append(key, String(cancha[key]));
  }

  return putFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
    formData,
    201
  );
}
