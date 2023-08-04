
import { postFormData, API_URL, get, putFormData, del } from ".";
import { Cancha, Disponibilidad } from "@/models";

export type CrearCanchaReq = Omit<Cancha, "id" | "urlImagen">;

export type ModificarCanchaReq = Omit<Cancha, "urlImagen">;

export async function crearCancha(
  cancha: CrearCanchaReq,
  disp : Disponibilidad,
  imagen?: File
): Promise<Cancha> {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof CrearCanchaReq;
  for (key in cancha) {
    formData.append(key, String(cancha[key]));
  }
  console.log(disp)

  return postFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas`,
    formData
  );
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

export async function modificarCancha(
  cancha: ModificarCanchaReq,
  imagen?: File
): Promise<Cancha> {
  const formData = new FormData();
  if (imagen) {
    formData.append("imagen", imagen);
  }
  let key: keyof ModificarCanchaReq;
  for (key in cancha) {
    formData.append(key, String(cancha[key]));
  }

  return putFormData<Cancha>(
    `${API_URL}/establecimientos/${cancha.idEstablecimiento}/canchas/${cancha.id}`,
    formData
  );
}


export async function deleteCanchaByID(
  idEst: number | undefined,
  idCancha: number| undefined
) {
  return del(`${API_URL}/establecimientos/${idEst}/canchas/${idCancha}`);
}