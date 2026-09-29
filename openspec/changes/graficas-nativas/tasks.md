# Tasks

## 1. Rama Git

- [x] 1.1 Crear la rama `feature.mikel.garcia/graficas-nativas` desde `mikel.garcia.develop` y verificar con `git branch --show-current` que la rama activa es `feature.mikel.garcia/graficas-nativas`

## 2. Contenedores gráficos en index.html

- [x] 2.1 Añadir la sección `.charts` entre `p#status` y la tabla con dos `figure` tituladas (`figcaption`), el `svg#price-chart` con `viewBox` y `role="img"` más leyenda input/output, y el contenedor `div#consumption-minis`, y verificar que ambos títulos y contenedores son visibles sobre la tabla

## 3. Estilos del bloque gráfico en styles.css

- [x] 3.1 Añadir layout del bloque `.charts` (tarjetas con borde y radio coherentes con la tabla, apiladas en móvil y en paralelo en escritorio), clases de serie para barras (input/output, segmentos día/semana) y escalado `svg` al 100% del contenedor, y verificar que el bloque no rompe el layout en ventana estrecha ni ancha
- [x] 3.2 Añadir estilos de etiquetas del eje (tamaño legible, sin solapes a ancho de escritorio) y `:focus-visible` si algún elemento gráfico es enfocable, y verificar visualmente la legibilidad con los 10 modelos

## 4. Dibujo SVG e integración en app.js

- [x] 4.1 Implementar el helper de creación SVG con `createElementNS` y la función de dibujo del gráfico de precios (grupos input/output por modelo, escala lineal normalizada al máximo visible, `<title>` con valor exacto por barra), y verificar contando `rect` que hay 2 barras por modelo visible con alturas proporcionales
- [x] 4.2 Implementar la función de mini-barras de consumo (fila por modelo con barra diaria y semanal apiladas in+out, escalas separadas por periodo, `<title>` con cifras exactas), y verificar que cada modelo visible tiene sus 2 barras apiladas proporcionales
- [x] 4.3 Integrar `renderCharts(visible)` como segundo sumidero de `applyState()` (actualiza `desc` con el conteo, muestra mensaje con 0 resultados y vacía el bloque ante error de `fetch`), y verificar el ciclo completo: filtrar por "deep" deja 2 grupos de barras en el mismo orden que la tabla

## 5. Verificación integrada

- [x] 5.1 Servir la raíz con un servidor estático local y verificar de extremo a extremo que con 10 modelos hay 20 `rect` de precios con R1 dominando en lineal, las mini-barras cuadran con la tabla, no hay peticiones externas y la consola está sin errores
