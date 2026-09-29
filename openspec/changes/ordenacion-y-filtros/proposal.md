# Proposal

## Why

La tabla base del dashboard muestra los 10 modelos en el orden fijo del fichero y sin forma de localizar un modelo concreto: con 10 columnas de métricas, encontrar el modelo más barato, el más rápido o uno por su nombre exige inspección visual fila a fila.

## What Changes

- Git: implementar en la rama `feature.mikel.garcia/ordenacion-y-filtros`, nacida desde `mikel.garcia.develop`.
- Ordenación: clic en cualquier cabecera (`th`) de la tabla alterna entre orden ascendente y descendente de esa columna, con indicador visual (▲ ascendente / ▼ descendente) en la columna activa.
- Filtros: campo de texto que filtra por nombre de modelo (case-insensitive, por subcadena) y controles de selección (select o checkboxes) para filtrar por modalidad de entrada y por modalidad de salida; los filtros se combinan entre sí y con la ordenación.
- Contador de resultados visibles (p. ej. "N de 10 modelos") y estado visible cuando ningún modelo coincide con los filtros activos.
- Restricción: solo HTML5 + CSS3 + JavaScript Vanilla puro. Sin dependencias externas ni tests.

## Capabilities

### New Capabilities

- `ordenacion-y-filtros`: ordenación por columna y filtrado por nombre y modalidades sobre la tabla de modelos del dashboard.

### Modified Capabilities

- Ninguna (`openspec/specs/` no contiene capabilities archivadas; `dashboard-base` se implementó pero no se archivó como spec).

## Impact

- Archivos modificados: `index.html` (barra de controles + cabeceras clicables), `styles.css` (estilos de controles e indicadores), `app.js` (estado de ordenación/filtros y pipeline filtrar → ordenar → pintar). `mock-data.json` no cambia.
- Sin dependencias externas, sin cambios de API, sin migraciones.
- Rama de trabajo: `feature.mikel.garcia/ordenacion-y-filtros` (desde `mikel.garcia.develop`).
