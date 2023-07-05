import nodemailer from "nodemailer";
import { Establecimiento } from "../models/establecimiento.js";

export async function enviarCorreo(ests: Establecimiento) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USERGMAIL,
      pass: process.env.PASSGMAIL,
    },
  });

  await transporter.sendMail({
    from: "Actualizacion de Datos <seminariointegrador21@gmail.com>",
    to: ests.correo,
    subject: "Actualizacion de datos",
    text: "Los datos ingresados fueron actualizados correctamente",
  });
}
