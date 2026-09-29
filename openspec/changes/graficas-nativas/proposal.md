# Proposal

## Why

La tabla muestra cifras exactas pero no revela patrones de un vistazo: qué modelo se dispara en precio, cómo se reparten input y output, o qué modelos concentran el consumo. Un bloque gráfico superior convierte esas comparaciones en lectura inmediata para el departamento de diseño.

## What Changes

- Git: implementar en la rama `feature.mikel.garcia/graficas-nativas`, nacida desde `mikel.garcia.develop`.
- Bloque gráfico superior colocado justo encima de la tabla de modelos, con dos visualizaciones: gráfico de barras comparativo de precios input vs output por modelo (Top 10, es decir, los 10 modelos) y mini-barras de consumo diario y semanal por modelo.
- Las gráficas reaccionan a los filtros y la ordenación activos de la Feature 1: muestran los modelos visibles, en el mismo orden que la tabla.
- Escala lineal en precios (el dominio de DeepSeek-R1 sobre el resto es el dato, no un defecto a comprimir).
- Accesibilidad: cada gráfico con `role="img"` y descripción textual; la tabla principal sigue siendo la fuente de datos exacta de respaldo.
- Restricción: implementación nativa en JS Vanilla (SVG, decisión de diseño), HTML5 y CSS3. Sin frameworks, sin Chart.js, sin tests.

## Capabilities

### New Capabilities

- `graficas-nativas`: bloque gráfico superior con barras de precios input/output y mini-barras de consumo diario/semanal por modelo, sincronizado con filtros y ordenación.

### Modified Capabilities

- Ninguna (`openspec/specs/` no contiene capabilities archivadas).

## Impact

- Archivos modificados: `index.html` (sección de gráficas + contenedores SVG), `styles.css` (layout del bloque gráfico, colores de series, responsive), `app.js` (funciones de dibujo SVG y segundo sumidero del pipeline `applyState`). `mock-data.json` no cambia.
- Sin dependencias externas, sin cambios de API, sin migraciones.
- Rama de trabajo: `feature.mikel.garcia/graficas-nativas` (desde `mikel.garcia.develop`).
