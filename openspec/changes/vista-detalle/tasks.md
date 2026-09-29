# Tasks

## 1. Rama Git

- [x] 1.1 Crear la rama `feature.mikel.garcia/vista-detalle` desde `mikel.garcia.develop` y verificar con `git branch --show-current` que la rama activa es `feature.mikel.garcia/vista-detalle`

## 2. Contenedor del drawer en index.html

- [x] 2.1 Añadir al final del `body` el fondo atenuado y el `aside` del drawer (`role="dialog"`, cabecera con título y botón 'X', contenedor del cuerpo vacío), y verificar que existe oculto sin alterar el layout visible inicial

## 3. Estilos y transición en styles.css

- [x] 3.1 Añadir estilos del drawer fijo a la derecha con transición por `transform` (clase `.open`), fondo atenuado sincronizado y variante a ancho completo en viewport estrecho, y verificar que abrir/cerrar desliza sin saltos y no rompe el layout en móvil ni escritorio
- [x] 3.2 Añadir estilos de filas clicables (`cursor: pointer`, foco visible en `tr`), bloques de la ficha y mini-gráficas reutilizando las clases de serie existentes, y verificar que las filas muestran affordance y el foco por teclado es visible

## 4. Apertura, ficha y cierre en app.js

- [x] 4.1 Marcar cada `tr` con `tabindex` y `data-name` en `render()` y conectar la apertura delegada (clic en `tbody`, Enter/Espacio por teclado) resolviendo el modelo por nombre, y verificar que pulsar cualquier fila abre el drawer con el modelo correcto
- [x] 4.2 Implementar `renderDetail(model)` con bloques de métricas crudas, derivados calculados (costes, cuota, ratios) y mini-gráficas SVG reutilizando `svgEl`/`miniBar` con máximos globales, y verificar que la ficha de DeepSeek-R1 muestra sus valores exactos y derivados coherentes
- [x] 4.3 Implementar el triple cierre ('X', ESC, clic fuera) con devolución de foco a la fila origen re-resuelta por nombre, más el cierre automático cuando el modelo sale de los visibles en `applyState()`, y verificar el ciclo completo incluyendo filtrar fuera con la ficha abierta

## 5. Verificación integrada

- [x] 5.1 Servir la raíz con un servidor estático local y verificar de extremo a extremo que abrir la ficha, cambiar de modelo sin cerrar, cerrar por las tres vías, filtrar fuera y navegar por teclado funcionan sin peticiones externas y sin errores en consola
