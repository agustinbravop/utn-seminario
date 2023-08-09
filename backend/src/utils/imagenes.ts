import cloudinary from "cloudinary";
import { ApiError, InternalServerError } from "./apierrors";

cloudinary.v2.config({
  cloud_name: "dlyqi5ko6",
  api_key: "798868126356395",
  api_secret: "n7hRWH7DrYaytTlmM1dgHBK7DgM",
});

/**
 * Almacena una imagen. Actualmente, se las sube a cloudinary, un servicio de terceros.
 * @param img el archivo a subir a cloudinary.
 * @param errorMsg el `ApiError` a throwear si esta función falla.
 * @returns una promesa con la url del archivo si se resuelve correctamente.
 */
export async function subirImagen(
  img: Express.Multer.File,
  error?: ApiError
): Promise<string> {
  try {
    const result = await cloudinary.v2.uploader.upload(img.path);
    return Promise.resolve(result.url);
  } catch (e) {
    console.error(e);
    throw error ?? new InternalServerError("Error al subir la imagen");
  }
}
