# Riesgos de dependencias pendientes

La actualización compatible de septiembre de 2026 reduce las vulnerabilidades
conocidas sin forzar cambios mayores de framework. Los lockfiles se actualizaron
con sus rangos semver existentes y se eliminaron dependencias backend que no se
usan en el código (`mailgun`, `mongodb` y `nodemailer`).

## Actualizaciones aplicadas

Las versiones declaradas en `package.json` ya permitían estas actualizaciones;
el cambio deliberado se registra en los lockfiles para que `npm ci` reproduzca
las versiones corregidas.

| Área | Paquetes directos actualizados dentro de rango |
| --- | --- |
| Frontend | `@auth0/auth0-react` 2.2.4 → 2.25.0, `@sentry/react` 8.7.0 → 8.55.2, `axios` 1.7.2 → 1.20.0, `react-router-dom` 6.22.3 → 6.30.6, `socket.io-client` 4.7.5 → 4.8.3 y `styled-components` 6.1.8 → 6.5.3. |
| Backend | `express` 4.19.2 → 4.22.3, `mongoose` 8.3.2 → 8.24.4, `socket.io` 4.7.5 → 4.8.3 y sus dependencias transitivas compatibles. |

Se verificó el resultado con `npm test` en `backend` (6 de 6 pruebas) y con
`docker compose build`. Este último ejecuta `npm ci` y `npm run build` del
frontend dentro de Node 22, la misma versión base usada por la imagen.

## Frontend

`npm audit` informa 32 vulnerabilidades restantes (14 altas, 9 moderadas y 9
bajas; ninguna crítica). Sus rutas de corrección requieren cambios mayores:

- `react-scripts` 5 no tiene una actualización compatible. Corregir su árbol de
  dependencias requiere reemplazar Create React App, migración explícitamente
  fuera del alcance de la incidencia #4.
- `react-router-dom` requiere la migración de la aplicación a React Router 7.
- `i18next-http-backend` requiere una actualización mayor. La integración de
  Locize también se eliminará como parte de la restauración de i18n posterior.

## Backend

Tras retirar `mailgun-js`, `npm audit` informa dos vulnerabilidades moderadas
restantes. Su resolución se evaluará en un ticket dedicado, sin forzar
actualizaciones masivas durante la restauración del flujo de paquetes.

Estas decisiones preservan el alcance: no se aplican actualizaciones masivas
forzadas ni una migración a Vite en este ticket.
