import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.js";
import { Administrador } from "../models/administrador.js";
import {
  ApiError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/apierrors.js";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { KeyLike, createSecretKey } from "crypto";
import { Jugador } from "../models/jugador.js";

/**
 * Representa el tipo de un usuario.
 * Se usa en los middlewares de autorización para definir a qué endpoints tiene acceso.
 */
export enum Rol {
  Jugador = "Jugador",
  Administrador = "Administrador",
}

export type Usuario =
  | {
      admin: Administrador;
      jugador?: never;
    }
  | {
      admin?: never;
      jugador: Jugador;
    };

export type JWTUserPayload = JWTPayload & Usuario;

export interface AuthService {
  registrarAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Administrador>;
  registrarJugador(jugador: Jugador, clave: string): Promise<Jugador>;
  loginUsuario(correoOUsuario: string, clave: string): Promise<string>;
  cambiarClave(
    correoOUsuario: string,
    actual: string,
    nueva: string
  ): Promise<string>;
  verifyJWT(token: string): Promise<JWTUserPayload | null>;
  getRolesFromJWT(jwt: JWTUserPayload): Rol[];
  hasRol(jwt: JWTUserPayload, rol: Rol): boolean;
  refreshJWT(token: string): Promise<string>;
}

export class AuthServiceImpl implements AuthService {
  private repo: AuthRepository;
  private secretKey: KeyLike;
  private SALT_ROUNDS: number;

  constructor(repository: AuthRepository) {
    this.SALT_ROUNDS = 10;
    this.repo = repository;
    this.secretKey = createSecretKey(process.env.JWT_SECRET ?? "", "utf-8");
  }

  /**
   * Extrae los roles del JWT, que van guardados en el capo 'roles' del payload.
   * Antes de usar esta funcion es importante verificar que el JWT sea válido.
   * @param token el JWT del usuario como string.
   * @returns Rol[] los roles del usuario.
   */
  getRolesFromJWT(jwt: JWTUserPayload) {
    if (!(jwt["roles"] instanceof Array)) {
      return [];
    }

    // Se extraen los roles del JWT payload.
    const rolesJwt: string[] = jwt["roles"];
    const roles = Object.keys(Rol)
      .filter((rol) => rolesJwt.includes(rol))
      .map((rolJwt) => Rol[rolJwt as keyof typeof Rol]);

    return roles;
  }

  hasRol(jwt: JWTUserPayload, rol: Rol): boolean {
    const roles = this.getRolesFromJWT(jwt);
    return roles.includes(rol);
  }

  /**
   * Esta función genera un JWT con los datos del usuario y sus roles.
   * @param usuario el Administrador que va a ir en el payload. Corresponde al usuario autenticado.
   * @returns un `Promise<string>` con el JWT firmado.
   */
  private async signJWT(usuario: Usuario) {
    let id;
    let payload;
    if (usuario.admin) {
      id = usuario.admin.id;
      payload = { admin: usuario.admin, roles: [Rol.Administrador] };
    } else {
      id = usuario.jugador.id;
      payload = { jugador: usuario.jugador, roles: [Rol.Jugador] };
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setSubject(id.toString())
      .setIssuer(process.env.JWT_ISSUER || "canchasapi")
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME || "1h") // token expiration time, e.g., "1 day"
      .sign(this.secretKey as Uint8Array);

    return token;
  }

  /**
   * Valida un JWT. Un JWT es auténtico si fue firmado por la función signJWT.
   * @returns true si el JWT es válido. Retorna falso en caso contrario.
   */
  async verifyJWT(token: string) {
    try {
      const jwt = await jwtVerify(token, this.secretKey as Uint8Array, {
        issuer: process.env.JWT_ISSUER,
      });
      return jwt.payload as JWTUserPayload;
    } catch (e) {
      // token verification failed
      return null;
    }
  }

  /**
   * Valida que el correo/usuario corresponda con la clave y que la clave sea correcta.
   * @param correoOUsuario el correo o username del usuario.
   * @param clave la contraseña en texto plano del usuario.
   * @returns el JWT de la sesión si los datos son correctos.
   * @throws un ApiError si alguna validación falla.
   */
  async loginUsuario(correoOUsuario: string, clave: string) {
    const userConClave = await this.compararClave(
      correoOUsuario,
      clave,
      new UnauthorizedError("Contraseña incorrecta")
    );
    return await this.signJWT(userConClave);
  }

  private async compararClave(
    correoOUsuario: string,
    clave: string,
    error: ApiError
  ) {
    const userConClave = await this.repo.getUsuarioYClave(correoOUsuario);

    const { clave: hash } = userConClave;
    const esValido = await bcrypt.compare(clave, hash);
    if (!esValido) {
      throw error;
    }
    return userConClave;
  }

  /**
   * Retorna un nuevo JWT con los datos **actualizados** del usuario.
   * @param token el access token actual del usuario.
   * @returns el nuevo JWT de la sesión, con una nueva expiry date.
   * @throws un ApiError si alguna validación falla.
   */
  async refreshJWT(token: string) {
    const jwt = await this.verifyJWT(token);
    if (!jwt) {
      throw new UnauthorizedError("Token inválido");
    }

    // Se obtienen los datos actuales del usuario al que corresponde el JWT.
    const correo = jwt.admin ? jwt.admin.correo : jwt.jugador.correo;
    const userConClave = await this.repo.getUsuarioYClave(correo);

    return await this.signJWT(userConClave);
  }

  private async validarUnicidad(correo: string, usuario: string) {
    try {
      await this.repo.getUsuarioYClave(correo);
      await this.repo.getUsuarioYClave(usuario);
    } catch (e) {
      if (e instanceof NotFoundError) {
        // No existe usuario con ese correo o usuario, asi que la unicidad se mantiene.
        return;
      } else {
        // Hubo otro tipo de error.
        throw e;
      }
    }
    // Si `getUsuarioYClave()` no lanza error, es porque el correo o usuario ya está ocupado.
    throw new ConflictError("Ya existe un usuario con ese correo o usuario");
  }

  /**
   * Se hashea la clave del usuario y luego se lo persiste en la base de datos.
   * @param admin el nuevo Administrador a registrar.
   * @param clave la contraseña en texto plano del nuevo usuario administrador.
   * @returns el Administrador creado.
   */
  async registrarAdministrador(admin: Administrador, clave: string) {
    const hash = await bcrypt.hash(clave, this.SALT_ROUNDS);

    await this.validarUnicidad(admin.correo, admin.usuario);

    const now = new Date();
    const anioActual = String(now.getUTCFullYear()).slice(-2);
    const mesActual = String(now.getUTCMonth() + 1);
    const [mes, anio] = admin.tarjeta.vencimiento.split("/");

    if (anioActual > anio || (anioActual === anio && mesActual > mes + 1)) {
      throw new BadRequestError(
        "La tarjeta no puede estar vencida o próxima a vencer"
      );
    }

    return await this.repo.crearAdministrador(admin, hash);
  }

  /**
   * Se hashea la clave del usuario y luego se lo persiste en la base de datos.
   * @param jugador el nuevo Jugador a registrar.
   * @param clave la contraseña en texto plano del nuevo usuario jugador.
   * @returns el Jugador creado.
   */
  async registrarJugador(jugador: Jugador, clave: string) {
    const hash = await bcrypt.hash(clave, this.SALT_ROUNDS);

    await this.validarUnicidad(jugador.correo, jugador.usuario);

    return await this.repo.crearJugador(jugador, hash);
  }

  async cambiarClave(correoOUsuario: string, actual: string, nueva: string) {
    await this.compararClave(
      correoOUsuario,
      actual,
      new BadRequestError("La contraseña actual es incorrecta")
    );

    const hash = await bcrypt.hash(nueva, this.SALT_ROUNDS);
    const userConClave = await this.repo.cambiarClave(correoOUsuario, hash);
    return await this.signJWT(userConClave);
  }
}
