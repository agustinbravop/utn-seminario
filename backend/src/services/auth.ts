import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.js";
import { Result, ok, err } from "neverthrow";
import { Administrador } from "../models/administrador.js";
import { ApiError } from "../utils/apierrors.js";
import { SignJWT, jwtVerify, decodeJwt, JWTPayload } from "jose";
import { KeyLike, createSecretKey } from "crypto";

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

export class AuthServiceImpl {
  private repo: AuthRepository;
  private secretKey: KeyLike;
  private SALT_ROUNDS: number;

  constructor(repository: AuthRepository) {
    this.SALT_ROUNDS = 10;
    this.repo = repository;
    this.secretKey = createSecretKey(process.env.JWT_SECRET || "", "utf-8");
  }

  // Extrae los roles del JWT y los devuelve como Rol[].
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

  // signJWT crea un JSON Web Token con un Administrador como payload.
  // Setea los headers del JWT según variables de entorno.
  private async signJWT(usuario: Administrador): Promise<string> {
    const token = await new SignJWT({ ...usuario, roles: [Rol.Administrador] })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setSubject(usuario.id.toString())
      .setIssuer(process.env.JWT_ISSUER || "canchasapi")
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME || "1h") // token expiration time, e.g., "1 day"
      .sign(this.secretKey as Uint8Array);

    return token;
  }

  // veriftJWT devuelve true si el JWT es auténtico.
  // El JWT es auténtico si fue firmado por la función signJWT.
  async verifyJWT(token: string): Promise<boolean> {
    try {
      await jwtVerify(
        token,
        this.secretKey as Uint8Array,
        {
          issuer: process.env.JWT_ISSUER,
        }
      );
      return true;
    } catch (e) {
      // token verification failed
      return false;
    }
  }

  // hasAllRoles verifica el token JWT de un usuario y devuelve verdadero si tiene todos los roles (permisos) pasados por parámetro.
  // Un usuario no registrado no tiene roles.
  async hasAllRoles(
    token: string,
    roles: Rol[]
  ): Promise<Result<boolean, ApiError>> {
    const esValido = await this.verifyJWT(token);
    if (!esValido) {
      return err(new ApiError(401, "Token inválido"));
    }
    const rolesResult = await this.repo.getRoles(token);
    if (rolesResult.isErr()) {
      return rolesResult.map((_) => false);
    }

    const rolesUsuario = rolesResult._unsafeUnwrap();
    if (rolesUsuario.every((rol) => roles.includes(rol))) {
      return ok(true);
    }
    return ok(false);
  }

  // loginUsuario devuelve un JWT si el correo coincide con la contraseña.
  // Devuelve un ApiError en caso contrario.
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

  async registrarAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>> {
    const hash = await bcrypt.hash(clave, this.SALT_ROUNDS);
    return await this.repo.crearAdministrador(admin, hash);
  }
}
