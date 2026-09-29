# Design

## Context

Ver `proposal.md` (Why) para la motivación. Estado actual verificado en el explore: la raíz del proyecto solo contiene `.git/`, `.opencode/`, `mock-data.json` (untracked, 10 modelos con esquema homogéneo de 9 campos) y `openspec/` sin specs previas. No existen `index.html`, `styles.css` ni `app.js`. Restricción impuesta: HTML5 + CSS3 + JavaScript Vanilla plano, sin librerías, frameworks ni tests. Los requisitos de comportamiento están en `specs/dashboard-base/spec.md`.

## Goals / Non-Goals

**Goals:**

- Definir la maquetación HTML semántica, la hoja de estilos base y la lógica JS de renderizado para la tabla base.
- Fijar el contrato de datos entre `mock-data.json` y el DOM (qué campo va a qué columna).
- Fijar la estrategia de ramas Git para este change.

**Non-Goals:**

- Ordenación, filtrado, búsqueda, paginación o gráficos (futuros changes).
- Cálculos derivados (coste estimado día/semana, $/1M): no se recalculan ni se muestran en esta base; solo valores fieles del JSON.
- Diseño visual final del departamento de diseño; aquí solo tabla limpia funcional.
- Tests automatizados (excluidos por restricción explícita).

## Decisions

### D1. Tres archivos planos en la raíz: `index.html`, `styles.css`, `app.js`

- **Qué:** los tres ficheros viven junto a `mock-data.json` en la raíz, enlazados con `<link rel="stylesheet" href="styles.css">` y `<script src="app.js" defer>`.
- **Por qué:** es la estructura mínima pedida, sin build ni carpetas que esta base no necesita; la ruta `fetch('mock-data.json')` queda relativa y simple.
- **Alternativa descartada:** `src/` + `public/` + bundler (Vite): sobredimensionado para una tabla estática Vanilla y prohibido por la restricción de no usar tooling externo.

### D2. Maquetación HTML semántica con `thead` fijo y `tbody` poblado por JS

- **Qué:** `index.html` contiene `header` (título + subtítulo), `main` con `section` que envuelve `p#status` (estado de carga/error) y `table#models-table` con `thead` de 11 columnas y `tbody#models-body` vacío inicialmente:

  | # | Columna (`th`) | Fuente JSON |
  |---|---|---|
  | 1 | Modelo | `name` |
  | 2 | Input $/token | `inputPricePerToken` |
  | 3 | Output $/token | `outputPricePerToken` |
  | 4 | TTFT (ms) | `ttft_ms` |
  | 5 | Modalidad In | `inputModality` |
  | 6 | Modalidad Out | `outputModality` |
  | 7 | Tokens In Día | `inputTokensDay` |
  | 8 | Tokens Out Día | `outputTokensDay` |
  | 9 | Tokens In Semana | `inputTokensWeek` |
  | 10 | Tokens Out Semana | `outputTokensWeek` |
  | 11 | (estado) | `p#status` fuera de la tabla |

  Incluye `<meta charset="utf-8">`, `<meta name="viewport">` y `lang="es"`.
- **Por qué:** el `thead` estático garantiza que los encabezados sean visibles antes de la carga (requisito de estructura); el `tbody` vacío es el punto de inserción del JS.
- **Alternativa descartada:** generar también el `thead` desde JS: ocultaría las columnas hasta que el fetch resuelva y complicaría la validación visual de diseño.

### D3. Carga con `fetch('mock-data.json')` + renderizado por DOM API

- **Qué:** `app.js` sigue este flujo:
  1. Al `DOMContentLoaded`, escribe "Cargando modelos…" en `p#status`.
  2. `fetch('mock-data.json')` → comprobar `response.ok` → `response.json()` → validar que es un array.
  3. Por cada modelo, crear `tr` con 10 `td` mediante `document.createElement` + `textContent` (nunca `innerHTML` con datos), en el orden de columnas de D2. Los números se vuelcan tal cual (`String(valor)`), sin formateo.
  4. Al terminar: limpiar `p#status` (o mostrar "10 modelos cargados"). Ante cualquier error (`!ok`, JSON inválido, no array, excepción de red): escribir mensaje en `p#status` y dejar el `tbody` vacío.
- **Por qué:** `fetch` relativo es la forma estándar de carga dinámica sin backend; `createElement`/`textContent` evita inyección HTML aunque los datos sean hoy de confianza.
- **Alternativa descartada:** `XMLHttpRequest` (API legada) e `import` estático del JSON (acoplaría los datos al script y no sería "carga dinámica").

### D4. `styles.css` base: layout centrado, tabla legible, estados

- **Qué:** tipografía del sistema (`system-ui, sans-serif`); `body` con fondo neutro claro y `main` centrado con `max-width` amplia (~1200px) y respiración lateral; tabla a ancho completo con `border-collapse`, cabecera con fondo oscuro y texto claro, celdas con `padding` y borde inferior sutil, filas pares con fondo alterno (`tbody tr:nth-child(even)`); celdas numéricas alineadas a la derecha mediante clase; `p#status` con estilo de aviso; `overflow-x: auto` en el contenedor para pantallas estrechas (11 columnas).
- **Por qué:** cubre "tabla HTML limpia" sin imponer la identidad visual final de diseño; el scroll horizontal evita rotura del layout con tantas columnas.
- **Alternativa descartada:** adoptar un framework CSS o variables de marca: prohibido por la restricción y prematuro sin guía de diseño.

### D5. Estrategia de ramas: integración + feature

- **Qué:** `mikel.garcia.develop` creada desde `main` (`git checkout -b mikel.garcia.develop main`); `feature.mikel.garcia/dashboard-base` creada desde la anterior (`git checkout -b feature.mikel.garcia/dashboard-base mikel.garcia.develop`). Todo el trabajo de este change se commitea en la feature.
- **Por qué:** respeta el flujo pedido (integración personal antes de la feature) partiendo de la rama base `main`.
- **Alternativa descartada:** trabajar directo sobre `main` o sobre la `feature` existente sin crear `mikel.garcia.develop`: incumpliría el requisito Git explícito.

## Risks / Trade-offs

- [Riesgo] `fetch` sobre `file://` falla por CORS si se abre `index.html` con doble clic → Mitigación: documentar en `tasks.md` servir con un servidor estático local (p. ej. `python3 -m http.server`) para la verificación manual.
- [Riesgo] Precios con 8 decimales (`0.00000023`) poco legibles volcados en crudo → Mitigación aceptada: esta base los muestra fieles sin formateo (así lo exige el spec); el formateo ($/1M, compactos) queda para un change posterior de presentación.
- [Trade-off] Sin tests, la regresión solo se verifica abriendo la página → Asumido por restricción explícita; la verificación de `tasks.md` es manual y observable (10 filas, valores exactos, estado de error provocando un 404).
- [Riesgo] `mock-data.json` y el change están untracked → Mitigación: el primer commit de la feature debe incluirlos para no perder la fuente de datos.

## Migration Plan

No hay despliegue ni migración: change aditivo sobre repositorio vacío. Rollback = borrar los tres ficheros o revertir los commits de la feature. Sin impacto en `main` hasta que se fusionen `feature` → `mikel.garcia.develop` → `main` (fusión fuera del alcance de este change).

## Open Questions

- Ninguna que bloquee: el formateo de números, ordenación/filtros y la identidad visual final se difieren a changes posteriores sin invalidar este diseño.
