import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth";
import { Result, ok, err } from "neverthrow";
import { Administrador } from "../models/administrador";
import { ApiError } from "../utils/apierrors";
import { SignJWT, jwtVerify } from "jose";
import { KeyLike, createSecretKey } from "crypto";

interface AuthService {
  loginUsuario(
    correoOUsuario: string,
    clave: string
  ): Promise<Result<string, ApiError>>;
  registrarAdministrador(
    admin: Administrador,
    clave: string
  ): Promise<Result<Administrador, ApiError>>;
}

export class AuthServiceImpl {
  repo: AuthRepository;
  secretKey: KeyLike;
  SALT_ROUNDS: number;

  constructor(repository: AuthRepository) {
    this.SALT_ROUNDS = 10;
    this.repo = repository;
    this.secretKey = createSecretKey(process.env.JWT_SECRET || "", "utf-8");
  }

  private async signJWT(usuario: Administrador): Promise<string> {
    const token = await new SignJWT(usuario)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setSubject(usuario.id.toString())
      .setIssuer(process.env.JWT_ISSUER || "canchasapi")
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME || "1h") // token expiration time, e.g., "1 day"
      .sign(this.secretKey as Uint8Array);
    console.log(token);

    return token;
  }

  private async verifyJWT(token: string): Promise<boolean> {
    try {
      const { payload, protectedHeader } = await jwtVerify(
        token,
        this.secretKey as Uint8Array,
        {
          issuer: process.env.JWT_ISSUER,
        }
      );
      console.log(payload);
      console.log(protectedHeader);
      return true;
    } catch (e) {
      // token verification failed
      console.log("Token is invalid");
      return false;
    }
  }

  async loginUsuario(
    correoOUsuario: string,
    clave: string
  ): Promise<Result<string, ApiError>> {
    const adminConClaveResult =
      await this.repo.getAdministradorByCorreoOUsuario(correoOUsuario);
    if (adminConClaveResult.isErr()) {
      return err(adminConClaveResult._unsafeUnwrapErr());
    }

    const { admin, clave: hash } = adminConClaveResult._unsafeUnwrap();
    const esValido = await bcrypt.compare(hash, clave);
    if (!esValido) {
      return err(new ApiError(401, "Error al validar el JWT"));
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
