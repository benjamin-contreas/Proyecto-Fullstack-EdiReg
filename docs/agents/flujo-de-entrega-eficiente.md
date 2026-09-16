# Flujo de entrega eficiente

Esta guía define cómo entregar mejoras de EdiReg con rapidez y con la calidad
necesaria para un proyecto de portafolio.

## Elegir el nivel de ejecución

### Ticket ligero

Usar `tdd` directamente cuando el ticket entrega una conducta verificable,
toca como máximo dos áreas principales y no cambia seguridad, transacciones ni
infraestructura. Ejecutar las pruebas focalizadas y revisar el diff antes de
abrir el pull request.

### Ticket integral

Usar `implement` cuando el cambio abarca un flujo entre interfaz y API, datos
persistentes, autorización, transacciones, Docker o despliegue. El flujo
incluye pruebas proporcionales y `code-review` antes del commit.

## Tamaño y alcance

Cada ticket debe entregar un único resultado visible y demoable. No combinar
un cambio de producto con un refactor amplio, infraestructura no necesaria o
documentación ajena al flujo. Dividir el trabajo cuando requiera tres o más
áreas principales: interfaz, API, persistencia e infraestructura.

Los tickets hijos son la unidad implementable; una épica conserva el contexto,
las decisiones y el avance agregado.

## Pruebas proporcionales

- Regla de dominio, validación o transformación: prueba unitaria.
- Endpoint, permisos, persistencia o integración externa simulada: prueba de
  integración.
- Flujo crítico entre interfaz, API y datos: un escenario E2E exitoso.
- Añadir un E2E de rechazo o reversión solo cuando cubra un riesgo relevante,
  como autorización o consistencia de datos.

## Revisión de código

Ejecutar `code-review` para tickets integrales o cambios que afecten
autorización, datos, Docker o despliegue. Para tickets ligeros, las pruebas
focalizadas y la revisión del diff son suficientes salvo que exista un riesgo
especial.

## Modelo recomendado

- `gpt-5.6-luna` con esfuerzo `medium`: tickets ligeros y bien especificados.
- `gpt-5.6-terra` con esfuerzo `medium`: tickets integrales o transversales.
- Mayor esfuerzo o un modelo superior: solo para diagnóstico difícil,
  decisiones arquitectónicas de alto impacto o revisión de seguridad.

## Higiene de contexto y Git

Trabajar cada ticket desde un contexto nuevo, una rama con prefijo `codex/` y
un worktree dedicado. Mantener el contexto de definición hasta publicar los
tickets; después, descartarlo entre implementaciones para no arrastrar detalle
innecesario.
