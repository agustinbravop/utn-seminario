import { Administrador } from "@/models";
import { API_URL, get, put } from ".";

export type ModificarAdmin = Omit<Administrador, "suscripcion" | "tarjeta">;

export async function getAdminById(id: number): Promise<Administrador> {
  return get(`${API_URL}/administradores/${id}`)
}

export async function editarPerfil(
  admin: ModificarAdmin
): Promise<Administrador> {
  return put<Administrador>(`${API_URL}/administradores/${admin.id}/perfil`, admin);
}
