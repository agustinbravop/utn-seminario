# utn-seminario

Aplicación web responsive para la gestión y reserva de canchas deportivas. Proyecto realizado en el cursado 2023 de Seminario Integrador / Habilitación Profesional,
asignatura necesaria para obtener el título intermedio **Analista Desarrollador Universitario en Sistemas de Información**
de la carrera Ingeniería en Sistemas de Información de la Universidad Tecnológica Nacional, Facultad Regional Resistencia.

## Equipo

Trabajamos colaborativamente a lo largo de ocho sprints de tres semanas cada uno.

- Andres, Aldo Omar.
- Arrejin, Sixto Feliciano.
- Bravo Pérez, Agustín Nicolás.
- Bustamante, Matias Iván.
- Esquivel, Emilio Matias.
- Ortiz, Claudia Marisela.
- San Lorenzo, André Leandro.

## Demo en vivo

El deploy de la aplicación se puede encontrar en: https://playfinder-front.gentlesand-306ace58.brazilsouth.azurecontainerapps.io/.
Los servidores son un contenedor Docker para el front end, otro contenedor para el back end, y una base de datos PostgreSQL de Microsoft Azure.
La primer petición siempre demora un poco en responder porque la aplicación necesita inicializarse (si no hay demanda el servidor se "suspende" temporalmente).

Nota: este link eventualmente estará desactualizado. Si no funciona es porque la demo ya se dejó de mantener.

## Arquitectura

El repositorio se divide en dos carpetas `backend` y `frontend`.

- El back end es una API REST implementada en NodeJS con TypeScript, Express y PrismaORM que se conecta a una base de datos relacional PostgreSQL.
- El front end es una Single Page Application desarrollada en React con TypeScript y Vite que usa ChakraUI como librería de componentes.

Para desarrollar una funcionalidad desde cero, lo que se hace es lo siguiente:

1. Se desarrolla un **repository** en `backend/src/repositories` que se encarga de acceder a la base de datos PostgreSQL mediante Prisma.
2. Se define un **service** en `backend/src/services` que implementa la lógica de negocio aislada de los otros detalles de implementación.
3. Se crea un **handler** de Express en `backend/src/handlers` que llama al service con los parámetros de las peticiones HTTP.
4. En `backend/src/routers` se acopla el handler de Express a su **endpoint** correspondiente (y se declaran los _middlewares_ correspondientes).
5. Se define un **hook** en `frontend/src/utils/api` qua la librería TanStack Query para consumir el endpoint HTTP recién creado.
6. Se crea un archivo en `frontend/src/pages` que representa una **página** del sitio web y usa los hooks creados para interactuar el back end.

Por ejemplo, si un usuario quiere reservar una cancha en un horario, se da la siguiente secuencia:

1. El usuario navega mediante la SPA a la página definida en `frontend/src/pages/search/est/reservar.tsx` y selecciona reservar un horario.
2. React invoca al hook `useCrearReserva()` creado en `frontend/src/utils/api/reservas.tsx` que envía una petición `POST /reservas` con los datos de la reserva.
3. En el back end, el servidor Express capta esa petición HTTP y la rutea al handler correspondiente que fue montado en `backend/src/routers/reservas.ts`.
4. El handler definido en `backend/src/handlers/reservas.ts` obtiene los datos de la petición y llama al service definido en `backend/src/services/reservas.ts`.
5. El service realiza las validaciones de negocio (que la reserva sea para una fecha futura, que sea de un horario todavía no reservado, etc...) e invoca al repository.
6. Finalmente, el repository creado en `backend/src/repositories/reservas.ts` interactua con la base de datos PostgreSQL para registrar la reserva creada.

También hay middlewares de validaciones y autenticación, configuraciones de estilos y una capa del modelo que debe ser mantenida tanto en el back end
como en el front end, dado que son dos aplicaciones separadas y desacopladas entre sí que se comunican mediante la API definida.

## Levantar app en entorno local de desarrollo

Nota: Las variables de entorno que se muestran tienen valores por defecto y pueden ser cambiados a conveniencia.

1. Clonar el repositorio:

```
git clone https://github.com/agustinbravop/utn-seminario
```

### Iniciar el back end

Requisitos: tener una base de datos PostgreSQL local o en la nube. Se puede descargar en https://www.postgresql.org/download/. Es útil además tener una interfaz como [DBeaver](https://dbeaver.io/download/).

2. Crear en la carpeta `backend/` un archivo `.env` con las siguientes variables de entorno:

```shell
DATABASE_URL=postgresql://postgres:root@localhost:5432/canchasdb
SHADOW_DATABASE_URL=postgresql://postgres:root@localhost:5432/canchasdb-shadow
JWT_SECRET=l7K15qPS401QMpTNXHfg5YTvkIvmUPQY
JWT_ISSUER=canchas-api
JWT_EXPIRATION_TIME=24h
PORT=3001

FRONT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=242199369878-vh11h5c6s5t8oo0sp4tubclc3mv59l11.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET={secret}
SENDGRID_API_KEY={secret}
SENDGRID_VERIFIED_SENDER=playfinder0@gmail.com
```

3. Obtener las dependencias:

```
npm install
npm run migrate
npm run build
```

4. Levantar el servidor:

```
npm run dev
```

### Iniciar el front end

5. Obtener las dependencias:

```
cd ../frontend
yarn install
```

6. Crear en la carpeta `frontend/` un archivo `.env` con las siguientes variables de entorno:

```shell
VITE_API_BASE_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=242199369878-vh11h5c6s5t8oo0sp4tubclc3mv59l11.apps.googleusercontent.com
VITE_BASE_URL=http://localhost:5173
```

7. Levantar el servidor:

```
yarn start
```

## Links Relevantes

- Jira: https://utnfrre-seminario-universitario.atlassian.net/jira/software/projects/US/boards/1
- Google Drive: https://drive.google.com/drive/u/0/folders/1cpGDbShYKnDxkv6juyL-l02bx-Ucvwp-
- Figma: https://www.figma.com/file/Ok5g990L4abUIhmmyQoqBe/Vistas?type=design&t=5SeqAcOXNCbbZyos-0
