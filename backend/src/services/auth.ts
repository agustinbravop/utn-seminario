import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.js";
import { Result, ok, err } from "neverthrow";
import { Administrador } from "../models/administrador.js";
import { ApiError } from "../utils/apierrors.js";
import { SignJWT, jwtVerify, decodeJwt, JWTPayload } from "jose";
import { KeyLike, createSecretKey } from "crypto";

/**
 * Representa el tipo de un usuario.
 * Se usa en los middlewares de autorización para definir a qué endpoints tiene acceso.
 */
export enum Rol {
  Jugador = "Jugador",
  Administrador = "Administrador",
}

export interface AuthService {
  loginUsuario(
    correoOUsuario: string,
    clave: string
  ): Promise<Result<string, ApiError>>;
  registrarAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>>;
  verifyJWT(token: string): Promise<boolean>;
  getRolesFromJWT(token: string): Rol[];
}

export class AuthServiceImpl implements AuthService {
  private repo: AuthRepository;
  private secretKey: KeyLike;
  private SALT_ROUNDS: number;

  constructor(repository: AuthRepository) {
    this.SALT_ROUNDS = 10;
    this.repo = repository;
    this.secretKey = createSecretKey(process.env.JWT_SECRET || "", "utf-8");
  }

  /**
   * Extrae los roles del JWT, que van guardados en el capo 'roles' del payload.
   * Antes de usar esta funcion es importante verificar que el JWT sea válido.
   * @param token el JWT del usuario como string.
   * @returns Rol[] los roles del usuario.
   */
  getRolesFromJWT(token: string): Rol[] {
    const payload: JWTPayload = decodeJwt(token);
    if (!(payload["roles"] instanceof Array)) {
      return [];
    }

    // Traducción de String[] a Rol[]
    const rolesJwt: string[] = payload["roles"];
    const roles = (Object.keys(Rol) as unknown as (keyof typeof Rol)[])
      .filter((rol) => rolesJwt.includes(rol))
      .map((rolJwt) => Rol[rolJwt]);
    return roles;
  }

  /**
   * Esta función genera un JWT con los datos del usuario y sus roles.
   * @param usuario el Administrador que va a ir en el payload. Corresponde al usuario autenticado.
   * @returns un `Promise<string>` con el JWT firmado.
   */
  private async signJWT(usuario: Administrador): Promise<string> {
    const token = await new SignJWT({ usuario, roles: [Rol.Administrador] })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setSubject(usuario.id.toString())
      .setIssuer(process.env.JWT_ISSUER || "canchasapi")
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME || "1h") // token expiration time, e.g., "1 day"
      .sign(this.secretKey as Uint8Array);

    return token;
  }

  /**
   * Valida un JWT. Un JWT es auténtico si fue firmado por la función signJWT.
   * @returns true si el JWT es válido. Retorna falso en caso contrario.
   */
  async verifyJWT(token: string): Promise<boolean> {
    try {
      await jwtVerify(token, this.secretKey as Uint8Array, {
        issuer: process.env.JWT_ISSUER,
      });
      return true;
    } catch (e) {
      // token verification failed
      return false;
    }
  }

  /**
   * Valida que el correo/usuario corresponda con la clave y que la clave sea correcta.
   * @param correoOUsuario el correo o username del usuario.
   * @param clave la contraseña en texto plano del usuario.
   * @returns el JWT de la sesión si los datos son correctos. ApiError si alguna validación falla.
   */
  async loginUsuario(
    correoOUsuario: string,
    clave: string
  ): Promise<Result<string, ApiError>> {
    const adminConClaveResult = await this.repo.getAdministradorYClave(
      correoOUsuario
    );
    if (adminConClaveResult.isErr()) {
      return err(adminConClaveResult._unsafeUnwrapErr());
    }

    const { admin, clave: hash } = adminConClaveResult._unsafeUnwrap();
    const esValido = await bcrypt.compare(clave, hash);
    if (!esValido) {
      return err(new ApiError(401, "Contraseña incorrecta"));
    }

    const jwt = await this.signJWT(admin);
    return ok(jwt);
  }

  /**
   * Se hashea la clave del usuario y luego se lo persiste en la base de datos.
   * @param admin el nuevo Administrador a registrar.
   * @param clave la contraseña en texto plano del nuevo usuario administrador.
   * @returns el Administrador creado.
   */
  async registrarAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>> {
    const hash = await bcrypt.hash(clave, this.SALT_ROUNDS);
    let now = new Date();
    const anioString = String(now.getUTCFullYear()).slice(-2);
    const anioActual = Number(anioString);
    const mesString = String(now.getUTCMonth() + 1);
    const mesActual = Number(mesString);

    const ArregloDigitos = admin.tarjeta.vencimiento.split("/");
    const mesDigitos = Number(ArregloDigitos[0]);
    const anioDigitos = Number(ArregloDigitos[1]);
    if (anioActual <= anioDigitos) {
      const dif = mesActual - mesDigitos;

      if (dif >= 2) {
        return await this.repo.crearAdministrador(admin, hash);
      }
      return err(
        new ApiError(
          400,
          "La tarjeta ingresada esta vencida " + admin.tarjeta.vencimiento
        )
      );
    }
    return err(
      new ApiError(
        500,
        "La tarjeta ingresada esta vencida " + admin.tarjeta.vencimiento
      )
    );
  }
}
