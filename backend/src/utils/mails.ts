import nodemailer, { TransportOptions } from "nodemailer";
import { Usuario } from "../services/auth.js";
import { BadGatewayError } from "./apierrors.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAUTH2",
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASSWORD,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
} as TransportOptions);

export async function enviarRecuperarClave(user: Usuario, urlToken: string) {
  const correo = user.admin ? user.admin.correo : user.jugador.correo;
  const nombre = user.admin
    ? `${user.admin.nombre} ${user.admin.apellido}`
    : `${user.jugador.nombre} ${user.jugador.apellido}`;
  try {
    await transporter.sendMail({
      from: "PlayFinder <playfinder0@gmail.com>",
      to: correo,
      subject: "PlayFinder - Restablecer su contraseña",
      html: `
      <h1>PlayFinder</h1>
      <p>Estimado/a ${nombre}, usted ha solicitado recuperar su contraseña de PlayFinder.</p>
      <p>Para cambiar su contraseña por una nueva, haga click en el siguiente link: 
        <a href=${urlToken}>${urlToken}</a>
      </p>`,
    });
  } catch (error) {
    console.error(error);
    throw new BadGatewayError(
      "Error al intentar enviar el correo para recuperar la contraseña."
    );
  }
}
