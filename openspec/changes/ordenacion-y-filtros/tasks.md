# Tasks

## 1. Rama Git

- [x] 1.1 Crear la rama `feature.mikel.garcia/ordenacion-y-filtros` desde `mikel.garcia.develop` y verificar con `git branch --show-current` que la rama activa es `feature.mikel.garcia/ordenacion-y-filtros`

## 2. Controles y cabeceras en index.html

- [x] 2.1 Añadir la barra `.toolbar` con `input[type="search"]` de nombre y dos `select` de modalidad de entrada y salida (con opción "Todas"), y verificar que los tres controles son visibles y enfocables por teclado sobre la tabla
- [x] 2.2 Convertir cada `th` en cabecera clicable con `<button type="button" data-key="<campo>">` y `aria-sort="none"` inicial, y verificar que las 10 cabeceras muestran su texto y son activables con clic y con teclado

## 3. Estilos de controles e indicadores en styles.css

- [x] 3.1 Añadir estilos `.toolbar` (flex con wrap y gap), reseteo del botón dentro del `th` (hereda fuente y color, cursor pointer) e indicador ▲/▼ en la columna activa, y verificar visualmente que la barra no rompe el layout en ventana estrecha
- [x] 3.2 Añadir `:focus-visible` en botones, input y selects, y verificar con navegación por teclado que el foco es visible en todos los controles nuevos

## 4. Estado y pipeline en app.js

- [x] 4.1 Guardar los datos del `fetch` en el array maestro `allModels` y añadir el objeto `state` con `sortKey`, `sortDir`, `search` y modalidades, y verificar que la carga inicial sigue mostrando los 10 modelos en el orden original sin indicador
- [x] 4.2 Implementar `applyState()` (filtrar copia por nombre y modalidades, ordenar con comparador numérico o alfabético según `NUMERIC_COLUMNS`) y `render()` (vaciar y repoblar solo el `tbody`), y verificar que la tabla filtra y ordena sin perder el foco del campo de búsqueda
- [x] 4.3 Conectar los eventos (clic en cabeceras con alternancia asc/desc e indicador, `input` en búsqueda, `change` en selects) y el contador "N de 10 modelos" con mensaje de 0 resultados, y verificar el ciclo completo con clics y combinaciones de filtros

## 5. Verificación integrada

- [x] 5.1 Servir la raíz con un servidor estático local y verificar de extremo a extremo que la ordenación numérica respeta el valor real (p. ej. `7e-08` antes que `5.5e-07` en ascendente), los filtros combinados funcionan, no hay peticiones externas y la consola está sin errores
