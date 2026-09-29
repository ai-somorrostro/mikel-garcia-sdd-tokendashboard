# Proposal

## Why

La tabla y las gráficas comparan modelos entre sí, pero ninguna vista reúne la ficha completa de un modelo: sus 9 métricas crudas, los derivados económicos (coste diario/semanal, cuota) y sus mini-gráficas individuales están dispersos en tres lugares distintos. El departamento de diseño necesita una vista de detalle por modelo accesible con un clic.

## What Changes

- Git: implementar en la rama `feature.mikel.garcia/vista-detalle`, nacida desde `mikel.garcia.develop`.
- Interacción: clic en cualquier fila del cuerpo de la tabla abre la vista extendida del modelo correspondiente.
- Vista de detalle como panel lateral (drawer) no modal a la derecha: cabecera con nombre del modelo y botón de cierre 'X', bloques de métricas extendidas (precios, TTFT, modalidades, consumos diario/semanal y derivados calculados: coste estimado día/semana, cuota del consumo total y ratio output/input), y mini-gráficas SVG individuales del modelo (barras in/out de precio y barras apiladas de consumo día/semana).
- Controles de cierre: botón 'X', tecla ESC y clic fuera del panel (en el fondo atenuado).
- Si el modelo con detalle abierto deja de estar visible por un cambio de filtros, el panel se cierra.
- Restricción: JavaScript Vanilla, CSS plano, SVG nativo. Sin librerías externas ni tests.

## Capabilities

### New Capabilities

- `vista-detalle`: panel lateral con la ficha extendida de un modelo (métricas, derivados y mini-gráficas), con apertura por clic en fila y triple cierre.

### Modified Capabilities

- Ninguna (`openspec/specs/` no contiene capabilities archivadas).

## Impact

- Archivos modificados: `index.html` (contenedor del drawer + fondo), `styles.css` (panel fijo, transiciones de deslizamiento, fondo atenuado, responsive a hoja inferior en móvil), `app.js` (estado de selección, `renderDetail`, handlers de apertura/cierre, reutilización de helpers SVG). `mock-data.json` no cambia (sin campos nuevos).
- Sin dependencias externas, sin cambios de API, sin migraciones.
- Rama de trabajo: `feature.mikel.garcia/vista-detalle` (desde `mikel.garcia.develop`).
