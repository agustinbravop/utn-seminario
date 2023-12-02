import { Usuario } from "../services/auth.js";
import { BadGatewayError } from "./apierrors.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function enviarRecuperarClave(user: Usuario, urlToken: string) {
  const correo = user.admin ? user.admin.correo : user.jugador.correo;
  const nombre = user.admin
    ? `${user.admin.nombre} ${user.admin.apellido}`
    : `${user.jugador.nombre} ${user.jugador.apellido}`;

  const msg = {
    to: correo,
    from: process.env.SENDGRID_VERIFIED_SENDER ?? "playfinder0@gmail.com",
    subject: "PlayFinder - Restablecer su contraseña",
    html: `
      <h1>PlayFinder</h1>
      <p>Estimado/a ${nombre}, usted ha solicitado recuperar su contraseña de PlayFinder.</p>
      <p>Para cambiar su contraseña por una nueva, haga click en el siguiente link: 
        <a href="${urlToken}">${urlToken}</a>
      </p>`,
  };

  try {
    sgMail.send(msg);
  } catch (error) {
    console.error(error);
    throw new BadGatewayError(
      "Error al intentar enviar el correo para recuperar la contraseña."
    );
  }
}
