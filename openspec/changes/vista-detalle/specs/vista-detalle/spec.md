# Spec Delta

## Purpose

Mostrar la ficha extendida de un modelo en un panel lateral al pulsar su fila, reuniendo métricas crudas, derivados económicos y mini-gráficas individuales sin perder de vista la tabla.

## ADDED Requirements

### Requirement: Apertura del detalle por fila

Pulsar (clic o tecla Enter/Espacio con la fila enfocada) cualquier fila del cuerpo de la tabla SHALL abrir el panel de detalle del modelo de esa fila. Las filas del cuerpo SHALL ser enfocables por teclado y anunciar su acción.

#### Scenario: Clic abre la ficha correcta

- **WHEN** el usuario pulsa la fila de "Phi-4"
- **THEN** el sistema abre el panel lateral con la ficha de Phi-4

#### Scenario: Apertura por teclado

- **WHEN** el usuario enfoca una fila y pulsa Enter
- **THEN** el sistema abre el panel de detalle de ese modelo igual que con clic

#### Scenario: Cambio de modelo sin cerrar

- **WHEN** el panel está abierto con un modelo y el usuario pulsa otra fila visible
- **THEN** el panel muestra la ficha del nuevo modelo sin cerrarse

### Requirement: Contenido de la ficha extendida

El panel SHALL mostrar el nombre del modelo como cabecera, sus 9 métricas crudas agrupadas en bloques (precios input/output, TTFT, modalidades de entrada y salida, consumos de entrada/salida diarios y semanales) y los derivados calculados: coste estimado diario, coste estimado semanal, cuota del consumo diario total y ratio output/input de tokens diarios.

#### Scenario: Métricas y derivados de un modelo

- **WHEN** el panel muestra la ficha de DeepSeek-R1
- **THEN** presenta sus 9 valores exactos del JSON junto a su coste diario (~$6.14), su coste semanal (~$42.64), su cuota del total diario y su ratio de tokens, todos calculados sin redondeos que alteren el dato base

### Requirement: Mini-gráficas individuales del modelo

El panel SHALL incluir mini-gráficas SVG del modelo seleccionado: barras input/output de precio y barras apiladas input+output de consumo diario y semanal, con el valor exacto disponible por barra y normalizadas contra los máximos globales para ser comparables entre fichas.

#### Scenario: Gráficas de la ficha

- **WHEN** el panel muestra cualquier modelo
- **THEN** dibuja sus barras de precio y sus barras apiladas de consumo con proporciones coherentes con los valores de la ficha

### Requirement: Triple cierre del panel

El panel SHALL cerrarse con el botón 'X', con la tecla ESC y con clic fuera del panel (sobre el fondo atenuado). Al cerrar, el foco SHALL devolverse al elemento que lo abrió. Solo un panel SHALL estar abierto a la vez.

#### Scenario: Cierre por cada vía

- **WHEN** el panel está abierto y el usuario pulsa 'X', o pulsa ESC, o pulsa fuera del panel
- **THEN** el panel se cierra y el foco vuelve a la fila que lo abrió

### Requirement: Cierre al filtrar fuera el modelo

Si un cambio de búsqueda, filtros u ordenación deja al modelo del panel fuera de los visibles, el panel SHALL cerrarse.

#### Scenario: El modelo seleccionado desaparece por filtro

- **WHEN** el panel muestra a "Phi-4" y el usuario escribe "deep" en la búsqueda
- **THEN** el panel se cierra porque Phi-4 ya no está visible

### Requirement: Implementación nativa sin dependencias externas

El panel y sus gráficas SHALL funcionar con HTML5, CSS3 y JavaScript plano con SVG nativo, sin librerías, frameworks ni peticiones a servicios de terceros.

#### Scenario: Detalle sin conexión a CDNs

- **WHEN** el usuario abre y cierra fichas sin acceso a CDNs ni paquetes externos
- **THEN** todas las interacciones responden usando solo los recursos locales de la página
