# Proposal

## Why

El departamento de diseño necesita una base visual funcional del Dashboard de Modelos de IA para validar la presentación tabular de los 10 modelos de `mock-data.json`. Hoy el repositorio está vacío (sin `index.html`, sin estilos, sin lógica): no existe nadaFROM que renderice nombre, precios input/output, TTFT, modalidades y consumos diario/semanal.

## What Changes

- Git: crear la rama de integración `mikel.garcia.develop` basada en `main`, y desde ella crear la rama de trabajo `feature.mikel.garcia/dashboard-base`.
- Crear `index.html` con la maquetación base del dashboard: cabecera, contenedor principal y tabla HTML semántica (`thead`/`tbody`) vacía con columnas para todas las métricas.
- Crear `styles.css` con la hoja de estilos base: layout centrado, tipografía del sistema, tabla limpia con cabecera distinguible, filas alternas y estado de carga/error.
- Crear `app.js` en JavaScript Vanilla que cargue `mock-data.json` mediante `fetch`, recorra los 10 modelos y pueble dinámicamente el `tbody` con una fila por modelo.
- Renderizar por modelo: nombre, precio input por token, precio output por token, TTFT en ms, modalidad de entrada, modalidad de salida, tokens input/output diarios y tokens input/output semanales.
- Gestión mínima de estados: mensaje de carga mientras se hace `fetch` y mensaje de error visible si la carga falla.
- Restricción: solo HTML5 + CSS3 + JavaScript Vanilla plano. Sin librerías, sin frameworks, sin tests, sin tooling de build.

## Capabilities

### New Capabilities

- `dashboard-base`: tabla base del dashboard que carga `mock-data.json` vía `fetch` y renderiza las métricas por modelo (nombre, precios, TTFT, modalidades, consumos), con estados de carga y error.

### Modified Capabilities

- Ninguna (proyecto sin specs previas; `openspec/specs/` solo contiene `.gitkeep`).

## Impact

- Archivos nuevos en la raíz del proyecto: `index.html`, `styles.css`, `app.js`. Se reutiliza el `mock-data.json` existente como fuente de datos (sin modificar su esquema).
- Sin dependencias externas, sin cambios de API, sin migraciones.
- Ramas Git afectadas: `mikel.garcia.develop` (nueva, desde `main`) y `feature.mikel.garcia/dashboard-base` (nueva, desde la anterior).
