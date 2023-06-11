import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dlyqi5ko6",
  api_key: "798868126356395",
  api_secret: "n7hRWH7DrYaytTlmM1dgHBK7DgM",
});

/**
 *
 * @param img el archivo a subir a cloudinary.
 * @returns una promesa con la url del archivo si se resuelve correctamente.
 */
export async function subirImagen(img: Express.Multer.File): Promise<string> {
  try {
    const result = await cloudinary.v2.uploader.upload(img.path);
    return Promise.resolve(result.url);
  } catch (e) {
    return Promise.reject();
  }
}
