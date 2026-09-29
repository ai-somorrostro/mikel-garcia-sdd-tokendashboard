# Design

## Context

Ver `proposal.md` (Why) y `specs/vista-detalle/spec.md` (requisitos). Estado actual en `mikel.garcia.develop`: `render()` construye cada `<tr>` con el objeto `model` en la mano; helpers SVG (`svgEl`, `svgTitle`, `miniBar`) y clases `.series-in/.out` de la Feature 2; pipeline `applyState()` que no debe perturbarse (el detalle es selección, no filtro). Sin campos nuevos en el JSON.

## Goals / Non-Goals

**Goals:**

- Fijar el contenedor del drawer, la transición CSS, los bloques de la ficha y los handlers de apertura/cierre.
- Fijar la reutilización de la lógica SVG y las fórmulas de derivados.

**Non-Goals:**

- Navegación anterior/siguiente dentro del drawer, deep-linking por URL, persistencia de selección: fuera de alcance.
- Campos nuevos en `mock-data.json` (descripción, proveedor…): fuera de alcance; la ficha reinterpreta lo existente.
- Tests automatizados (excluidos por restricción explícita).

## Decisions

### D1. Drawer lateral no-modal (`<aside>` + fondo) en lugar de `<dialog>` modal

- **Qué:** contenedor fijo a la derecha (`position: fixed; top: 0; right: 0; width: min(400px, 100%)`), `role="dialog"` + `aria-label` con el nombre del modelo, cabecera con título y botón 'X', cuerpo con scroll propio; fondo atenuado (`div` semitransparente) que cierra al clic; en viewport estrecho el panel ocupa todo el ancho (hoja inferior de facto).
- **Por qué:** el caso de uso es comparar modelos manteniendo la tabla visible; el modal taparía el contexto y obligaría a abrir/cerrar en bucle. Clic en otra fila cambia la ficha sin cerrar (requisito).
- **Alternativa descartada:** `<dialog>.showModal()` (a11y nativa gratis pero foco total incompatible con comparar); modal centrado clásico (mismo problema de contexto).

### D2. Apertura por fila con dato en mano + foco gestionado

- **Qué:** en `render()`, cada `tr` recibe `tabindex="0"`, `data-name` con el nombre del modelo y cursor pointer por CSS; un listener delegado en `tbody` (clic) más `keydown` (Enter/Espacio) resuelve el modelo desde `allModels` por nombre y llama a `openDetail(model, openerRow)`. Al abrir: foco al botón 'X'. Al cerrar: foco de vuelta a la fila origen (guardada). El `th` no colisiona (sus listeners son propios de cabecera).
- **Por qué:** delegar en `tbody` sobrevive a los re-renders (las filas se reconstruyen en cada `applyState`); resolver por nombre evita índices frágiles ante ordenación.
- **Alternativa descartada:** listeners por fila (se perderían en cada re-render salvo re-suscripción); botón "Detalle" por fila (más markup y más Tab-stops para la misma acción).

### D3. `renderDetail(model)`: bloques + derivados + SVG reutilizado

- **Qué:** función que vacía el cuerpo del drawer y lo repuebla: bloques `Precios` (in/out + ratio out/in), `Latencia` (TTFT + posición en ranking de `allModels`), `Modalidades`, `Consumo` (4 cifras + coste día/semana + cuota del total diario + ratio out/in diario) y mini-gráficas: 2 barras in/out de precio (misma geometría que `renderPriceChart` pero con `maxV` = máximo global de `allModels` para comparabilidad entre fichas) y `miniBar()` tal cual para día y semana (escalas globales día/semana de `allModels`, consistentes con el bloque superior cuando hay 10 visibles). Fórmulas: `costeDia = in*pin + out*pout`, `cuota = totalDia(modelo)/totalDia(todos)`.
- **Por qué:** reutilización máxima de la Feature 2; la normalización global (no por visibles) hace las fichas comparables entre sí.
- **Alternativa descartada:** normalizar por visibles también en ficha (las barras cambiarían según filtros, rompiendo la comparación entre fichas).

### D4. Transición CSS por clase + triple cierre

- **Qué:** el drawer vive siempre en el DOM con `transform: translateX(100%)`; abrir = añadir clase `.open` (`transform: none` con `transition`), cerrar = quitarla; el fondo aparece/desaparece con la misma clase en un wrapper. Cierres: clic en 'X', `keydown` Escape a nivel de documento (solo si hay ficha abierta), clic en el fondo. `applyState()` cierra el drawer si el modelo abierto ya no está en `visible` (comparación por nombre).
- **Por qué:** animar `transform` es barato (composición, sin reflow); el drawer permanente evita reconstruir listeners; cerrar al filtrar fuera evita ficha huérfana.
- **Alternativa descartada:** crear/destruir el nodo por apertura (más código de listeners y foco); animar `right`/`width` (reflow por frame).

### D5. Rama `feature.mikel.garcia/vista-detalle` desde `mikel.garcia.develop`

- **Qué:** `git checkout -b feature.mikel.garcia/vista-detalle mikel.garcia.develop`; todo el trabajo se commitea ahí.
- **Por qué:** flujo del proyecto (feature desde integración).

## Risks / Trade-offs

- [Riesgo] Filas clicables + `white-space: nowrap` + drawer abierto en escritorio estrecho → Mitigación: drawer a ancho completo bajo 640px; verificar sin solapes.
- [Riesgo] Foco perdido al cerrar si la fila origen se re-renderizó (nuevo nodo) → Mitigación: al devolver el foco, re-resolver la fila por `data-name` en el `tbody` actual; si ya no existe (filtrada), foco al buscador.
- [Riesgo] Doble `id` si se clonan nodos del bloque de gráficas → Mitigación: la ficha crea sus SVG desde cero con ids propios o sin id.
- [Trade-off] Drawer no-modal sin focus-trap: el Tab puede salir del panel → Asumido (patrón no-modal estándar); Esc + 'X' + clic fuera cubren el cierre.
- [Trade-off] Sin tests, verificación manual observable → Asumido por restricción explícita.

## Migration Plan

Change aditivo: no hay despliegue ni migración. Rollback = revertir los commits de la feature. Sin impacto en `main` hasta fusionar `feature` → `mikel.garcia.develop` → `main` (fusión fuera del alcance de este change).

## Open Questions

- Ninguna que bloquee: el ancho exacto del panel y el orden de los bloques son detalles visuales que no cambian specs, enfoque ni tareas.
