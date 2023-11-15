import {
  BadGatewayError,
  InternalServerError,
  UnauthorizedError,
} from "../apierrors";

/** Los datos que el usuario de Google compartió con nuestra app. */
type GoogleUserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name?: string;
  picture?: string;
  locale: string;
};

/**
 * Luego de la pantalla de consentimiento, Google redirige al usuario al front junto a un parámetro `code`.
 * El front pasa ese `code` al back end, y esta función lo utiliza para cambiarlo por un `access_token`.
 */
export async function getAccessTokenFromGoogleCode(code: string) {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "post",
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        // Esta `redirect_uri` debe ser la misma que la configurada en las credenciales de Google.
        redirect_uri: "http://localhost:5173/auth/redirect/google",
        grant_type: "authorization_code",
        code,
      }),
    });
    const data = await res.json();
    return data.access_token;
  } catch {
    throw new UnauthorizedError("Error al autenticar el usuario con Google");
  }
}

/**
 * Esta función obtiene el correo y perfil del usuario que
 * dio su consentimiento para que los podamos leer.
 * @param access_token el `access_token` previamente obtenido para validar la request.
 */
export async function getGoogleUserInfo(access_token: string) {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (res.ok) {
      
      return (await res.json()) as GoogleUserInfo;
    }
  } catch {
    throw new InternalServerError(
      "Error al comunicarse con el servidor de Google"
    );
  }
  throw new BadGatewayError("Error al obtener de Google los datos del usuario");
}
