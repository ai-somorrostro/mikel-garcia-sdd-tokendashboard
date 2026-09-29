# Design

## Context

Ver `proposal.md` (Why) para la motivación y `specs/ordenacion-y-filtros/spec.md` para los requisitos. Estado actual (verificado en `mikel.garcia.develop`): `app.js` hace `fetch → forEach → appendChild` una sola vez y descarta los datos; no existe ningún estado de ordenación ni filtros. Ya existe el mapa `NUMERIC_COLUMNS` (7 columnas numéricas frente a 3 de texto), que distingue comparador numérico de alfabético. Datos reales: `inputModality` tiene 2 valores (`Text`, `Text+Image`), `outputModality` 1 solo (`Text`), precios en notación científica (`7e-08` … `2.19e-06`).

## Goals / Non-Goals

**Goals:**

- Definir los componentes visuales de control (barra de filtros, cabeceras clicables, contador, estado vacío) y el flujo de eventos en JavaScript Vanilla.
- Fijar el modelo de estado y el pipeline único filtrar → ordenar → pintar.

**Non-Goals:**

- Filtros por rango numérico (precios, TTFT, tokens): con 10 filas la ordenación cubre la necesidad; queda para un change futuro si el dataset crece.
- Persistencia de filtros (p. ej. `localStorage`), paginación, formateo de números ($/1M, compactos): fuera de alcance.
- Tests automatizados (excluidos por restricción explícita).

## Decisions

### D1. Estado central único + re-render total del `tbody`

- **Qué:** un objeto `state = { sortKey: null, sortDir: 'asc', search: '', inputModality: 'all', outputModality: 'all' }`, un array maestro `allModels` (inmutable, tal cual vino del `fetch`) y una función `applyState()` que filtra una copia, la ordena y llama a `render()`, que vacía el `tbody` (`tbody.textContent = ""`, patrón ya usado en el `catch`) y lo repuebla. Cada evento solo muta `state` y llama a `applyState()`. El toolbar nunca se reconstruye (solo el `tbody`), para no perder el foco mientras se escribe en la búsqueda.
- **Por qué:** 10 filas hacen el re-render total despreciable en coste y un único camino de pintado evita estados inconsistentes entre filtros y orden.
- **Alternativas descartadas:** reordenar/mover los `<tr>` existentes en el DOM (el estado quedaría implícito en el DOM, difícil de razonar al combinar 2+ filtros); estado distribuido en cada widget (combinar filtros exigiría leer N controles).

### D2. Comparadores bifurcados por `NUMERIC_COLUMNS`

- **Qué:** reutilizar el mapa existente: si la columna está en `NUMERIC_COLUMNS`, comparar con resta numérica (`a[key] - b[key]`); si no, con `String(a[key]).localeCompare(String(b[key]))`. `sortDir === 'desc'` invierte el signo. Con `sortKey === null` se conserva el orden original del JSON (orden estable, sin copiar de más).
- **Por qué:** los precios en notación científica se romperían con comparación lexicográfica (`"5.5e-07" < "7e-08"` como strings); la bifurcación ya preparada en la base lo evita.
- **Alternativa descartada:** comparador único de strings (incorrecto para 7 de 10 columnas).

### D3. Cabeceras clicables con `<button data-key>` + `aria-sort`

- **Qué:** cada `th` envuelve su texto en un `<button type="button" data-key="<campo>">`; el `th` porta `aria-sort` (`none` por defecto, `ascending`/`descending` en la activa) y el indicador ▲/▼ se pinta en el botón de la columna activa (texto o pseudo-elemento). Clic: si `state.sortKey !== key` → `{ sortKey: key, sortDir: 'asc' }`; si es la misma → alternar `asc ↔ desc` (ciclo de 2 estados, sin retorno al orden original salvo recarga, según requisito).
- **Por qué:** el `<button>` da teclado y foco gratis frente a un `th` con `tabindex` manual; `aria-sort` expone el estado a lectores de pantalla.
- **Alternativa descartada:** `th` clicable con `tabindex="0"` y `keydown` manual (reimplementa lo que el botón ya da).

### D4. Controles de filtro: search + dos selects; contador y vacío en `p#status`

- **Qué:** barra `.toolbar` encima de la tabla con `input[type="search"]` (evento `input`, filtra por subcadena de `name` con minúsculas en ambos lados), `select#filter-input-modality` (`Todas/Text/Text+Image`) y `select#filter-output-modality` (`Todas/Text`, aunque hoy solo tenga un valor efectivo: se incluye por requisito explícito y queda listo para futuras modalidades), ambos con evento `change`. `p#status` muestra "N de 10 modelos" tras cada `applyState()`; con 0 resultados el `tbody` queda vacío y `p#status` (con clase de aviso, no de error) explica que no hay coincidencias. El mensaje de carga inicial y el de error de `fetch` se conservan tal cual.
- **Por qué:** `select` es el control nativo más simple para 2–3 opciones (checkboxes aportarían lo mismo con más markup); reutilizar `p#status` evita un elemento nuevo y ya tiene `role="status"` + `aria-live`.
- **Alternativa descartada:** checkboxes por modalidad (equivalente funcional, más DOM); elemento separado para el contador (más nodos para la misma información).

### D5. Estilos solo aditivos + foco visible

- **Qué:** `.toolbar` en flex con `wrap` y `gap` (móvil primero); `thead th button` reseteado (hereda fuente/color, sin borde/fondo) con `cursor: pointer`; indicador ▲/▼ junto al texto; `:focus-visible` en botones, input y selects. Nada del CSS existente cambia.
- **Por qué:** la base no tiene ningún estilo de foco y esta feature introduce los primeros controles interactivos: sin foco visible no hay accesibilidad por teclado.
- **Alternativa descartada:** reestilizar la tabla (fuera de alcance; la identidad visual final es de diseño).

### D6. Rama `feature.mikel.garcia/ordenacion-y-filtros` desde `mikel.garcia.develop`

- **Qué:** `git checkout -b feature.mikel.garcia/ordenacion-y-filtros mikel.garcia.develop`; todo el trabajo se commitea ahí.
- **Por qué:** respeta el flujo del proyecto (feature desde integración).

## Risks / Trade-offs

- [Riesgo] `outputModality` con un único valor hace que su filtro no discrimine hoy → Mitigación aceptada: se incluye por requisito explícito; su opción "Todas" es el defecto y el control queda operativo para futuras modalidades.
- [Riesgo] Re-render en cada pulsación del buscador podría perder el foco → Mitigación: solo se reconstruye el `tbody`; el `input` nunca se toca.
- [Riesgo] `fetch` sobre `file://` falla igual que en la base → Mitigación heredada: verificar con servidor estático local.
- [Trade-off] Ciclo de 2 estados sin retorno al orden original del JSON salvo recarga → Asumido por requisito explícito (alternar asc/desc); documentado en el spec.
- [Trade-off] Sin tests, verificación manual observable (clics, conteos, 404 provocado) → Asumido por restricción explícita.

## Migration Plan

Change aditivo sobre la base: no hay despliegue ni migración. Rollback = revertir los commits de la feature. Sin impacto en `main` hasta fusionar `feature` → `mikel.garcia.develop` → `main` (fusión fuera del alcance de este change).

## Open Questions

- Ninguna que bloquee: el formato del texto del contador ("N de 10 modelos" u otro) es detalle de redacción que no cambia specs, enfoque ni tareas.
