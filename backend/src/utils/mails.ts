import nodemailer from "nodemailer";
import { UsuarioConClave } from "../repositories/auth";
import { BadRequestError } from "./apierrors";

export async function enviarCorreo(admin: UsuarioConClave) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USERGMAIL,
      pass: process.env.PASSGMAIL,
    },
  });
  try {
    await transporter.sendMail({
      from: "Cambio de Contraseña <seminariointegrador21@gmail.com>",
      to: admin.admin?.correo,
      subject: "Cambio de contraseña",
      html: `<p>Estimado/a ${admin.admin?.correo} su contraseña se ha cambiado con exito </p>`,
    });
  } catch (error) {
    console.error(error);
    throw new BadRequestError(
      "Ha ocurrido un error no se pudo enviar el correo. Intente más tarde"
    );
  }
}
