# EdiReg

**EdiReg** es una aplicación web full-stack para la gestión de recepción en edificios y condominios. Fue desarrollada de forma individual como proyecto académico para el ramo **Programación Profesional**, durante cuarto año de Ingeniería Civil Informática en la **Universidad Adolfo Ibáñez**.

El proyecto busca centralizar procesos habituales de conserjería, como el registro de visitas, la gestión de visitas frecuentes, la recepción de paquetes y el uso de estacionamientos de visita.

> **Estado del proyecto:** proyecto académico finalizado en 2024. El repositorio conserva la implementación desarrollada durante el curso, pero actualmente no se encuentra completamente funcional y algunas integraciones externas requieren reconfiguración.

## Descripción general

EdiReg fue diseñado como una aplicación **MERN** con una arquitectura frontend-backend separada.

El frontend está desarrollado con **React** y consume una API REST construida con **Node.js** y **Express**. La persistencia de datos se implementa con **MongoDB** y **Mongoose**.

El sistema permite gestionar distintos flujos de recepción de un edificio desde una interfaz web:

- registrar visitas;
- crear, consultar, actualizar y eliminar visitas frecuentes;
- buscar visitas frecuentes por RUT o patente;
- registrar paquetes recibidos;
- enviar notificaciones por correo electrónico a residentes cuando reciben un paquete;
- gestionar estacionamientos de visita;
- autenticar usuarios mediante Auth0;
- utilizar la interfaz en distintos idiomas.

El proyecto original también contemplaba funcionalidades como notificaciones mediante WhatsApp y extracción automática de datos desde cédulas de identidad. Estas funcionalidades quedaron fuera del alcance de la implementación final.

## Funcionalidades principales

### Gestión de visitas

El backend expone endpoints para registrar visitas y mantener un registro de visitantes frecuentes.

Entre las operaciones implementadas se encuentran:

- búsqueda de visitantes frecuentes por RUT;
- búsqueda por patente del vehículo;
- creación de visitantes frecuentes;
- actualización de sus datos;
- eliminación de visitantes frecuentes;
- registro de una nueva visita al edificio.

### Recepción de paquetes

El sistema permite registrar paquetes recibidos en conserjería y asociarlos a una residencia.

Cuando se registra un paquete, el backend puede enviar una notificación por correo electrónico a los residentes asociados utilizando **Mailgun**.

### Gestión de estacionamientos

La aplicación incluye lógica para registrar y administrar estacionamientos de visita, consultar espacios disponibles y cambiar su estado de uso.

El repositorio también contiene una implementación parcial de temporizadores y notificaciones en tiempo real asociadas al tiempo máximo de estacionamiento. Esta parte no se considera una funcionalidad completamente terminada dentro del proyecto.

### Autenticación e internacionalización

El frontend integra:

- **Auth0** para autenticación;
- **i18next / react-i18next** para internacionalización;
- **React Router** para navegación entre vistas.

## Tecnologías utilizadas

| Área | Tecnologías |
| --- | --- |
| Frontend | React, React Router, Axios, Styled Components |
| Backend | Node.js, Express |
| Base de datos | MongoDB, Mongoose |
| Autenticación | Auth0 |
| Comunicación en tiempo real | Socket.IO |
| Tareas programadas | node-cron |
| Email | Mailgun |
| Internacionalización | i18next, react-i18next, Locize |
| Contenedores | Docker, Docker Compose |
| Control de versiones | Git, GitHub |

## Arquitectura

El repositorio está dividido principalmente en dos aplicaciones:

```text
Proyecto-TICS420/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scheduler.js
│   ├── server.js
│   └── package.json
├── proyecto/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yaml
```

### Backend

El backend sigue una separación basada en:

```text
Routes → Controllers → Models → MongoDB
```

Las rutas de Express reciben las solicitudes HTTP, los controladores implementan la lógica de aplicación y los modelos de Mongoose representan las entidades persistidas en MongoDB.

Las principales entidades del backend incluyen:

- visitantes frecuentes;
- registros de visitas;
- paquetes;
- residencias;
- estacionamientos de visita;
- configuración de temporizadores.

### Frontend

El frontend está construido como una Single Page Application con React.

Las principales vistas incluyen:

- inicio;
- registro y búsqueda de visitas;
- gestión de visitas frecuentes;
- recepción de paquetes;
- gestión de estacionamientos.

El frontend se comunica con el backend mediante solicitudes HTTP y utiliza Socket.IO Client para la lógica experimental de notificaciones en tiempo real.

## Ejecución local

### Requisitos

Para ejecutar el proyecto localmente se necesita:

- Node.js;
- npm;
- MongoDB ejecutándose localmente;
- una aplicación configurada en Auth0;
- una cuenta/configuración de Mailgun para probar notificaciones por correo.

### Variables de entorno

Crear un archivo `.env` dentro de `backend/`:

```env
MONG_URI=mongodb://127.0.0.1:27017/edireg
PORT=4000
MAILGUN_API_KEY=tu_api_key
```

El nombre `edireg` de la base de datos es solo un ejemplo y puede reemplazarse por cualquier base de datos MongoDB local.

Crear otro archivo `.env` dentro de `proyecto/`:

```env
REACT_APP_AUTH0_DOMAIN=tu-dominio.auth0.com
REACT_APP_AUTH0_CLIENT_ID=tu_client_id
```

No se deben subir credenciales reales al repositorio.

### 1. Clonar el repositorio

```bash
git clone https://github.com/benjamin-contreas/Proyecto-TICS420.git
cd Proyecto-TICS420
```

### 2. Instalar y ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

El backend escucha por defecto en:

```text
http://localhost:4000
```

### 3. Instalar y ejecutar el frontend

En otra terminal:

```bash
cd proyecto
npm install
npm start
```

El frontend se ejecuta en:

```text
http://localhost:3000
```

> Debido a que el proyecto fue finalizado en 2024 y actualmente no se mantiene como aplicación activa, puede ser necesario ajustar configuraciones de Auth0, Mailgun, MongoDB o URLs locales para volver a ejecutar todas las funcionalidades.

## API REST

El backend agrupa sus endpoints bajo `/api`.

### Visitas

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/visits/searchRut?rut=...` | Buscar visitante frecuente por RUT |
| GET | `/api/visits/searchPlate?vehicleLicensePlate=...` | Buscar visitante frecuente por patente |
| POST | `/api/visits/newFrequentVisitor` | Crear visitante frecuente |
| POST | `/api/visits/visitRegistry` | Registrar visita |
| PATCH | `/api/visits/:rut` | Actualizar visitante frecuente |
| DELETE | `/api/visits/:rut` | Eliminar visitante frecuente |

### Paquetes

| Método | Endpoint | Descripción |
| --- | --- | --- |
| POST | `/api/packages/createPackage` | Registrar paquete y procesar notificación por email |

### Estacionamientos

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/parkingSpace/allSpaces` | Obtener estacionamientos |
| POST | `/api/parkingSpace/createSpace` | Crear estacionamiento |
| POST | `/api/parkingSpace/assignSpace` | Asignar estacionamiento disponible |
| PATCH | `/api/parkingSpace/toggleUse/:id` | Cambiar estado de uso |

### Residencias

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/residence/:residenceNumber` | Obtener residencia |
| POST | `/api/residence` | Crear residencia |

### Configuración de temporizador

El repositorio también contiene endpoints para una funcionalidad de temporizador desarrollada parcialmente:

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/timerConfig/getConfig` | Obtener configuración |
| POST | `/api/timerConfig/updateConfig` | Actualizar configuración |

## Contexto del proyecto

La idea original de EdiReg nace de la necesidad de digitalizar procesos habituales en la recepción de edificios y condominios.

El requerimiento planteaba una plataforma capaz de centralizar la recepción de paquetes, registrar visitas frecuentes y ocasionales, gestionar vehículos y estacionamientos, y facilitar la comunicación entre conserjería y residentes.

La implementación final priorizó las funcionalidades principales de gestión de visitas, paquetes y estacionamientos mediante una arquitectura web full-stack.

Para revisar el documento original con los requerimientos y contexto del proyecto:

**[Ver documento de contexto del proyecto](docs/Detalles-Proyecto-Edificios.pdf)**

> El enlace estará disponible una vez que el PDF sea agregado al repositorio en `docs/Detalles-Proyecto-Edificios.pdf`.

## Aprendizajes

Este proyecto permitió aplicar de forma práctica varias áreas del desarrollo de software:

- diseño e implementación de APIs REST con Express;
- integración entre un frontend React y un backend Node.js;
- modelado y persistencia de datos con MongoDB y Mongoose;
- diseño de una aplicación web end-to-end;
- autenticación mediante un proveedor externo;
- integración de servicios externos como Mailgun;
- uso de Git y GitHub para control de versiones;
- organización de un backend mediante rutas, controladores y modelos.

## Mejoras futuras

Algunas mejoras que permitirían evolucionar el proyecto son:

- restaurar y actualizar las integraciones externas para volver a ejecutar la aplicación completa;
- agregar tests automatizados para frontend y backend;
- incorporar validación y manejo de errores más robustos;
- proteger los endpoints del backend mediante autorización;
- completar el sistema de alertas de estacionamiento;
- reemplazar las alertas del navegador por un sistema de notificaciones dentro de la interfaz;
- implementar notificaciones mediante WhatsApp;
- incorporar lectura automática de datos desde una cédula de identidad;
- agregar una configuración multi-condominio;
- desplegar frontend, backend y base de datos en infraestructura cloud.

## Autor

Proyecto desarrollado individualmente por **Benjamín Contreras** como parte del ramo **Programación Profesional** de Ingeniería Civil Informática en la Universidad Adolfo Ibáñez.
