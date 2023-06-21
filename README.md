# utn-seminario

Aplicación web para la reserva de chanchas. Proyecto realizado como parte del cursado 2023 de Seminario Integrador / Habilitación Profesional,
materia de la carrera Ingeniería en Sistemas de Información dentro de la Universidad Tecnológica Nacional, Facultad Regional Resistencia.

## Levantar la app en entorno local

NOTA: Tener en cuenta que las variables de entorno que se muestran acá tienen valores placeholders o defaults.

1. Clonar el repositorio:

```
git clone https://github.com/agustinbravop/utn-seminario
```

### Iniciar el back end

Requisitos: tener en local una base de datos PostgreSQL. Se puede descargar en https://www.postgresql.org/download/. Conviene además tener una interfaz como [DBeaver](https://dbeaver.io/download/).

2. Crear en la carpeta `backend/` un archivo `.env` con las siguientes variables de entorno:

```shell
DATABASE_URL=postgresql://postgres:root@localhost:5432/canchasdb
SHADOW_DATABASE_URL=postgresql://postgres:root@localhost:5432/canchasdb-shadow
JWT_SECRET=l7K15qPS401QMpTNXHfg5YTvkIvmUPQY
JWT_ISSUER=canchas-api
JWT_EXPIRATION_TIME=1h
PORT=3001
```

3. Obtener las dependencias:

```
cd backend
npm install
npx prisma generate dev
```

4. Levantar el servidor:

```
npm run start
```

### Iniciar el front end

5. Obtener las dependencias:

```
cd ../frontend
echo "REACT_APP_API_BASE_URL=http://localhost:3001" > .env
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
