# Tasks

## 1. Ramas Git

- [x] 1.1 Crear la rama `mikel.garcia.develop` desde `main` y verificar con `git branch --show-current` que la rama activa es `mikel.garcia.develop`
- [x] 1.2 Crear la rama `feature.mikel.garcia/dashboard-base` desde `mikel.garcia.develop` y verificar con `git branch --show-current` que la rama activa es `feature.mikel.garcia/dashboard-base`

## 2. Maquetación HTML

- [x] 2.1 Crear `index.html` con cabecera, `p#status` y `table#models-table` con `thead` de 10 columnas de métricas más modelo y `tbody#models-body` vacío, y verificar abriendo el fichero que los encabezados de todas las columnas son visibles antes de cargar datos
- [x] 2.2 Enlazar `styles.css` y `app.js` (con `defer`) en `index.html` con `lang="es"` y metas `charset`/`viewport`, y verificar en el inspector del navegador que ambos recursos cargan sin errores 404

## 3. Hoja de estilos base

- [x] 3.1 Crear `styles.css` con layout centrado, tabla de ancho completo con cabecera distinguible, filas alternas y celdas numéricas alineadas a la derecha, y verificar visualmente que la tabla se lee como tabla limpia en ventana de escritorio
- [x] 3.2 Añadir estilo del estado `p#status` y scroll horizontal del contenedor de la tabla, y verificar reduciendo el ancho del navegador que la tabla no rompe el layout y el mensaje de estado es legible

## 4. Lógica JS de renderizado

- [x] 4.1 Implementar en `app.js` la carga con `fetch('mock-data.json')` mostrando "Cargando modelos…" en `p#status`, y verificar con un servidor estático local que el mensaje de carga aparece al recargar la página
- [x] 4.2 Implementar el poblado del `tbody` con una fila por modelo usando `createElement`/`textContent` en el orden de columnas del diseño, y verificar que la tabla muestra 10 filas con valores exactos del JSON sin redondeos
- [x] 4.3 Implementar el manejo de error de carga (respuesta no OK, JSON inválido o fallo de red) con mensaje visible en `p#status`, y verificar provocando un 404 temporal que el mensaje de error aparece y el `tbody` queda vacío con explicación

## 5. Verificación integrada

- [x] 5.1 Servir la raíz con un servidor estático local y verificar de extremo a extremo que la página carga sin dependencias externas, muestra las 10 filas con las 10 métricas y no hay peticiones a CDNs ni errores en consola
