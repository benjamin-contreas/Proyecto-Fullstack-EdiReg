# EdiReg

**EdiReg** es una aplicación web full-stack basada en el stack **MERN** para digitalizar procesos de recepción en edificios y condominios. El sistema centraliza el registro de visitas, la administración de visitantes frecuentes, la recepción de paquetes y la gestión de estacionamientos de visita.

Fue desarrollado de forma individual en 2024 para el ramo **Programación Profesional**, durante cuarto año de Ingeniería Civil Informática en la **Universidad Adolfo Ibáñez**.

> **Estado:** proyecto académico finalizado. El código fue posteriormente ordenado y documentado para portfolio; algunas integraciones externas, como Auth0, Locize y Mailgun, requieren credenciales propias para volver a habilitar todas las funcionalidades.

## Descripción general

EdiReg separa frontend y backend en aplicaciones independientes:

- **React** para la interfaz web.
- **Node.js + Express** para la API REST.
- **MongoDB + Mongoose** para persistencia.
- **Auth0** para autenticación en el frontend.
- **Mailgun** para notificaciones de paquetes por correo.
- **Socket.IO + node-cron** para la implementación experimental de alertas de estacionamiento.
- **i18next + Locize** para internacionalización.

## Funcionalidades

### Visitas

- Registro de visitas.
- CRUD de visitantes frecuentes.
- Búsqueda de visitantes frecuentes por RUT.
- Búsqueda por patente.
- Asociación opcional de un estacionamiento cuando la visita ingresa en vehículo.

### Paquetes

- Consulta de residentes por número de residencia.
- Registro de paquetes recibidos en conserjería.
- Selección de residentes a notificar.
- Envío de correo mediante Mailgun cuando la integración está configurada.

### Estacionamientos

- Creación y consulta de estacionamientos.
- Asignación de un espacio disponible.
- Cambio del estado de uso.
- Configuración de duración y tiempo de aviso.
- Implementación parcial de alertas mediante Socket.IO.

### Autenticación e idiomas

- Autenticación de la interfaz mediante Auth0.
- Navegación con React Router.
- Internacionalización mediante i18next y Locize.

## Stack tecnológico

| Área | Tecnologías |
| --- | --- |
| Frontend | React, React Router, Styled Components |
| Backend | Node.js, Express |
| Base de datos | MongoDB, Mongoose |
| Autenticación | Auth0 |
| Email | Mailgun |
| Tiempo real | Socket.IO |
| Tareas programadas | node-cron |
| Internacionalización | i18next, react-i18next, Locize |
| Contenedores | Docker, Docker Compose |
| Testing backend | Node.js Test Runner |
| Control de versiones | Git, GitHub |

## Arquitectura

```text
Proyecto-Fullstack-EdiReg/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .env.example
│   ├── scheduler.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
├── docs/
│   └── Detalles-Proyecto-Edificios.pdf
├── docker-compose.yaml
└── README.md
```

### Backend

El backend utiliza una separación simple:

```text
Routes → Controllers → Models → MongoDB
```

Las principales entidades son visitantes frecuentes, registros de visitas, paquetes, residencias, usuarios asociados a residencias, estacionamientos y configuración del temporizador.

### Frontend

El frontend es una Single Page Application en React. Las URLs hacia el backend se centralizan mediante `REACT_APP_API_URL`, evitando acoplar las vistas a una dirección local fija.

## Ejecución local

### Requisitos

- Node.js 22 o compatible.
- npm.
- MongoDB local, o Docker si se utiliza Docker Compose.
- Credenciales de Auth0 para autenticación.
- Configuración opcional de Locize y Mailgun.

### Variables de entorno

Crear los archivos reales a partir de los ejemplos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Backend:

```env
PORT=4000
MONG_URI=mongodb://127.0.0.1:27017/edireg
FRONTEND_URL=http://localhost:3000
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

Frontend:

```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_AUTH0_DOMAIN=
REACT_APP_AUTH0_CLIENT_ID=
REACT_APP_LOCIZE_PROJECT_ID=
REACT_APP_LOCIZE_API_KEY=
```

Las credenciales reales no deben versionarse.

### Ejecución con npm

Clonar el repositorio:

```bash
git clone https://github.com/benjamin-contreas/Proyecto-Fullstack-EdiReg.git
cd Proyecto-Fullstack-EdiReg
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend, en otra terminal:

```bash
cd frontend
npm install
npm start
```

La interfaz utiliza `http://localhost:3000` y la API `http://localhost:4000` por defecto.

### Ejecución con Docker Compose

Después de crear los archivos `.env`:

```bash
docker compose up --build
```

La configuración incluye tres servicios:

- MongoDB.
- Backend Express.
- Frontend React.

## Tests

El backend incluye una suite pequeña de pruebas de validación de modelos usando el runner nativo de Node.js, sin dependencias adicionales:

```bash
cd backend
npm test
```

Las pruebas cubren requisitos de datos, enums, valores por defecto y verifican que el modelo de usuario no almacene contraseñas.

## API REST

### Visitas

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/visits/searchRut?rut=...` | Buscar visitante frecuente por RUT |
| GET | `/api/visits/searchPlate?vehicleLicensePlate=...` | Buscar por patente |
| POST | `/api/visits/newFrequentVisitor` | Crear visitante frecuente |
| POST | `/api/visits/visitRegistry` | Registrar visita |
| PATCH | `/api/visits/:rut` | Actualizar visitante frecuente |
| DELETE | `/api/visits/:rut` | Eliminar visitante frecuente |

### Paquetes

| Método | Endpoint | Descripción |
| --- | --- | --- |
| POST | `/api/packages/createPackage` | Registrar paquete y procesar notificaciones configuradas |

### Estacionamientos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/parkingSpace/allSpaces` | Obtener estacionamientos |
| POST | `/api/parkingSpace/createSpace` | Crear estacionamiento |
| POST | `/api/parkingSpace/assignSpace` | Asignar espacio disponible |
| PATCH | `/api/parkingSpace/toggleUse/:id` | Cambiar estado de uso |

### Residencias

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/residence/:residenceNumber` | Obtener residencia |
| POST | `/api/residence` | Crear residencia |

### Temporizador

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/timerConfig/getConfig` | Obtener configuración |
| POST | `/api/timerConfig/updateConfig` | Actualizar configuración |

## Contexto del proyecto

El requerimiento original planteaba una plataforma para agilizar procesos de conserjería: recepción de paquetes, control de visitas frecuentes y ocasionales, registro de vehículos y administración del tiempo de permanencia en estacionamientos.

La implementación final priorizó una aplicación web end-to-end con persistencia en MongoDB y una API REST que conecta los distintos flujos.

**[Ver documento original de contexto y requerimientos](docs/Detalles-Proyecto-Edificios.pdf)**

## Decisiones y aprendizajes

Este proyecto me permitió trabajar de manera práctica en:

- diseño de APIs REST con Express;
- modelado de datos con MongoDB y Mongoose;
- integración entre frontend React y backend Node.js;
- diseño de una aplicación end-to-end;
- integración de autenticación y servicios externos;
- configuración mediante variables de entorno;
- Docker y separación de servicios;
- Git y GitHub para control de versiones.

## Alcance y mejoras futuras

El proyecto conserva algunas decisiones propias de su contexto académico. Las principales extensiones posibles serían:

- ampliar tests hacia controladores y endpoints;
- incorporar validación de payloads con un esquema dedicado;
- proteger también los endpoints del backend con autorización;
- reemplazar alertas del navegador por notificaciones dentro de la interfaz;
- completar el flujo de alertas de estacionamiento;
- incorporar notificaciones por WhatsApp;
- agregar lectura automática de datos desde cédulas;
- añadir soporte multi-condominio;
- desplegar la aplicación en infraestructura cloud.

Las notificaciones por WhatsApp y la lectura automática de cédulas formaban parte de ideas del requerimiento original, pero **no fueron implementadas** en la versión final.

## Autor

Desarrollado individualmente por **Benjamín Contreras** como proyecto del ramo **Programación Profesional** de Ingeniería Civil Informática en la Universidad Adolfo Ibáñez.
