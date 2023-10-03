# utn-seminario

Aplicación web responsive que permite la gestión y reserva de canchas deportivas. Proyecto realizado en el cursado 2023 de Seminario Integrador / Habilitación Profesional,
asignatura de la carrera Ingeniería en Sistemas de Información necesaria para el título intermedio "Analista Desarrollador Universitario en Sistemas de Información" de la Universidad Tecnológica Nacional, Facultad Regional Resistencia.

## Equipo

- Andres, Aldo Omar.
- Arrejin, Sixto Feliciano.
- Bravo Pérez, Agustín Nicolás.
- Bustamante, Matias Iván.
- Esquivel, Emilio Matias.
- Ortiz, Claudia Marisela.
- San Lorenzo, André Leandro.

## Levantar la app en entorno local

NOTA: Las variables de entorno que se muestran tienen valores por defecto y pueden ser cambiados a conveniencia.

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
```

3. Obtener las dependencias:

```
npm install
npx run build
```

4. Levantar el servidor:

```
npm run start
```

### Iniciar el front end

5. Obtener las dependencias:

```
cd ../frontend
echo "VITE_API_BASE_URL=http://localhost:3001" > .env
yarn install
```

6. Levantar el servidor:

```
yarn run start
```

## Links Relevantes

- Jira: https://utnfrre-seminario-universitario.atlassian.net/jira/software/projects/US/boards/1
- Google Drive: https://drive.google.com/drive/u/0/folders/1cpGDbShYKnDxkv6juyL-l02bx-Ucvwp-
- Figma: https://www.figma.com/file/Ok5g990L4abUIhmmyQoqBe/Vistas?type=design&t=5SeqAcOXNCbbZyos-0
