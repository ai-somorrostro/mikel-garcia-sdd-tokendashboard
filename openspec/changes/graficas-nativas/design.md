# Design

## Context

Ver `proposal.md` (Why) y `specs/graficas-nativas/spec.md` (requisitos). Estado actual en `mikel.garcia.develop`: `app.js` con pipeline `applyState()` (filtrar → ordenar → `render(tbody)` + `updateSortIndicators()`), datos maestros en `allModels`, creación DOM con `createElement`/`textContent`. Datos: 10 modelos; precios output con outlier R1 (15.6x sobre el mínimo); consumo semana ≈ 7x día en todos los modelos.

## Goals / Non-Goals

**Goals:**

- Fijar la tecnología de dibujo (SVG nativo), la maquetación del bloque gráfico y los algoritmos de escalado y dibujo.
- Fijar la integración con el pipeline existente (segundo sumidero de `applyState`).

**Non-Goals:**

- Escala logarítmica, animaciones, interactividad avanzada (zoom, selección, cross-highlight tabla↔gráfico): fuera de alcance.
- Series temporales reales o persistencia: no hay datos de serie en `mock-data.json`.
- Tests automatizados (excluidos por restricción explícita).

## Decisions

### D1. SVG nativo en lugar de Canvas 2D

- **Qué:** ambas visualizaciones se construyen como elementos `<svg>` creados con `createElementNS("http://www.w3.org/2000/svg", …)` y `textContent` para etiquetas, con estilos por clase CSS (`fill`, fuentes heredadas) y `<title>` hijo por barra para tooltip nativo.
- **Por qué:** con 10 modelos el canvas no aporta rendimiento y cuesta accesibilidad (`role="img"` + `<title>`/`<desc>` gratis en SVG), nitidez (texto vectorial sin gestión de `devicePixelRatio`), tooltips (hit-testing manual en canvas) y coherencia con el CSS existente (el canvas exigiría replicar la paleta en JS). El patrón `createElement`/`textContent` ya usado en `app.js` se traslada tal cual al SVG.
- **Alternativa descartada:** Canvas 2D (permitido por el requisito, pero inferior en a11y, tooltips y estilo con este volumen de datos); Chart.js o cualquier librería (prohibida por restricción).

### D2. Bloque `<section class="charts">` entre filtros y tabla

- **Qué:** en `index.html`, nueva sección con `aria-label` tras `p#status` y antes de `.table-wrapper`, con dos figuras: `figure.chart` (título `figcaption`, `svg#price-chart` con `viewBox` y ancho 100%, leyenda input/output) y `figure.chart` (título, `div#consumption-minis` con una fila por modelo: etiqueta + 2 SVG mini apilados día/semana). Los SVG llevan `role="img"` y `<title>`/`<desc>` actualizados por JS con el conteo de modelos.
- **Por qué:** la ubicación "justo encima de la tabla" es requisito; `figure`/`figcaption` dan la titulación pedida con semántica; `viewBox` + 100% da responsive sin JS de resize.
- **Alternativa descartada:** un solo SVG para todo (mezcla dos escalas distintas —precio vs tokens— en un mismo sistema de coordenadas, fuente de errores).

### D3. Algoritmo de barras de precios: grupos input/output, escala lineal

- **Qué:** por cada modelo visible, un grupo con 2 `rect` (input, output). Escala: `maxV = max(outputPrice)` entre visibles; `altura = valor / maxV * alturaUtil`. Ancho de grupo repartido equitativamente; eje de etiquetas con nombres (rotados o truncados con `<title>` completo si no caben); valor exacto en `<title>` de cada `rect` ("Modelo · serie · valor $/token"). Colores por serie vía clases CSS (p. ej. tonos de la paleta existente `#2cb1bc` / `#243b53`). Sin filtros (10 visibles): 10 grupos × 2 barras.
- **Por qué:** escala lineal honesta (R1 domina = el dato, Non-Goal explícito el log); normalizar por el máximo de *visibles* mantiene el gráfico aprovechado al filtrar.
- **Alternativa descartada:** normalizar por el máximo global fijo (al filtrar, las barras se quedarían enanas); barras horizontales (más espacio para 10 nombres, pero cambia el layout del bloque; vertical agrupado es el estándar pedido).

### D4. Algoritmo de mini-barras: apiladas in+out por periodo

- **Qué:** por cada modelo visible, una fila con etiqueta y dos mini-SVG: barra día (segmento in + segmento out, longitudes proporcionales al total diario del modelo… corrección: proporcionales a escala común) y barra semana igual. Escala común por periodo entre visibles (`maxDia`, `maxSemana` separados, pues semana ≈ 7x día y una escala única invisibilizaría el día). Segmentos con 2 clases CSS (in/out) y `<title>` con cifras exactas.
- **Por qué:** el apilado muestra total y composición a la vez; escalas separadas día/semana evitan que la semana aplaste al día (hallazgo del explore: ratio ~7x constante).
- **Alternativa descartada:** escala única día+semana (barra diaria ilegible); 4 mini-barras separadas in/out/día/semana (más ruido, misma información).

### D5. Integración: `renderCharts(visible)` como segundo sumidero

- **Qué:** `applyState()` pasa a llamar `render(visible)` (tabla, existe) + `renderCharts(visible)` (nuevo: vacía ambos contenedores SVG y los repuebla; actualiza `<desc>` con "N modelos"; con 0 visibles muestra el mensaje de ausencia en el bloque). Sin estado nuevo: usa `visible` ya calculado (mismo conjunto y orden que la tabla). El `catch` de `fetch` también vacía/oculta el bloque gráfico ante error de carga.
- **Por qué:** cero estado adicional, sincronización tabla↔gráficos garantizada por construcción; el re-render del bloque no toca toolbar ni focos.
- **Alternativa descartada:** estado propio de las gráficas (divergencia tabla/gráfico) o dibujo único tras el fetch sin reaccionar a filtros (incumple el spec).

### D6. Rama `feature.mikel.garcia/graficas-nativas` desde `mikel.garcia.develop`

- **Qué:** `git checkout -b feature.mikel.garcia/graficas-nativas mikel.garcia.develop`; todo el trabajo se commitea ahí.
- **Por qué:** flujo del proyecto (feature desde integración).

## Risks / Trade-offs

- [Riesgo] Olvidar el namespace SVG (`createElement` en vez de `createElementNS` crea nodos muertos) → Mitigación: helper de creación con namespace y verificación contando `rect` en el DOM.
- [Riesgo] Etiquetas de 10 nombres largos solapadas en el eje → Mitigación: truncado visual con `<title>` completo; verificar a ancho de escritorio y con scroll si hiciera falta.
- [Riesgo] `fetch` sobre `file://` → Mitigación heredada: verificar con servidor estático local.
- [Trade-off] Re-normalizar por visibles hace que las alturas no sean comparables entre filtrados distintos → Asumido: el gráfico describe la vista actual, la tabla da los valores exactos comparables.
- [Trade-off] Sin tests, verificación manual + conteo de nodos → Asumido por restricción explícita.

## Migration Plan

Change aditivo: no hay despliegue ni migración. Rollback = revertir los commits de la feature. Sin impacto en `main` hasta fusionar `feature` → `mikel.garcia.develop` → `main` (fusión fuera del alcance de este change).

## Open Questions

- Ninguna que bloquee: el truncado exacto de etiquetas y los tonos de serie son detalles visuales que no cambian specs, enfoque ni tareas.
