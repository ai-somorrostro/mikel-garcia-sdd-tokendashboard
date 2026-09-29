# Spec Delta

## Purpose

Añadir un bloque gráfico superior al dashboard con la comparativa visual de precios y consumos por modelo, sincronizado con los filtros y la ordenación de la tabla.

## ADDED Requirements

### Requirement: Bloque gráfico superior con dos visualizaciones

La página SHALL mostrar, justo encima de la tabla de modelos, un bloque gráfico con dos visualizaciones: un gráfico de barras de precios input vs output por modelo y mini-barras de consumo diario y semanal por modelo. Cada visualización SHALL tener un título que la identifique.

#### Scenario: Bloque visible sobre la tabla

- **WHEN** el usuario abre la página con datos cargados
- **THEN** el sistema muestra el bloque gráfico entre los filtros y la tabla, con el gráfico de precios y las mini-barras de consumo titulados

### Requirement: Gráfico de barras de precios input vs output

El gráfico de precios SHALL dibujar, por cada modelo visible, un grupo de dos barras (input y output) con altura proporcional al precio por token en escala lineal, con el nombre del modelo como etiqueta y el valor exacto disponible (etiqueta o tooltip nativo). Cada barra SHALL distinguirse por serie (input/output) mediante color y leyenda.

#### Scenario: Diez grupos de barras sin filtros

- **WHEN** no hay filtros activos y los 10 modelos están visibles
- **THEN** el gráfico muestra 10 grupos de dos barras, uno por modelo

#### Scenario: Proporcionalidad lineal con outlier

- **WHEN** el gráfico incluye a DeepSeek-R1 (output 2.19 $/1M) y a Phi-4 (output 0.14 $/1M)
- **THEN** la barra de R1 es proporcionalmente mayor (~15x) que la de Phi-4, sin compresión logarítmica

#### Scenario: Valor exacto por barra

- **WHEN** el usuario consulta una barra (tooltip o etiqueta)
- **THEN** el sistema muestra el precio por token exacto del JSON para esa serie y modelo

### Requirement: Mini-barras de consumo diario y semanal

Las mini-barras de consumo SHALL dibujar, por cada modelo visible, una barra apilada input+output del consumo diario y una barra apilada del consumo semanal, con longitudes proporcionales a los totales de tokens. Cada mini-barra SHALL identificar el modelo y el periodo.

#### Scenario: Dos barras apiladas por modelo

- **WHEN** los 10 modelos están visibles
- **THEN** el sistema muestra por cada modelo su barra diaria apilada (input+output del día) y su barra semanal apilada (input+output de la semana)

### Requirement: Sincronización con filtros y ordenación

Las gráficas SHALL representar exactamente los modelos visibles tras aplicar búsqueda, filtros de modalidad y ordenación, en el mismo orden que las filas de la tabla. Con cero resultados, el bloque gráfico SHALL mostrar el mensaje de ausencia de resultados en lugar de gráficos vacíos.

#### Scenario: Filtrar actualiza las gráficas

- **WHEN** el usuario escribe "deep" con 10 modelos cargados
- **THEN** ambas visualizaciones muestran únicamente DeepSeek-V3 y DeepSeek-R1, en el orden activo de la tabla

#### Scenario: Sin resultados no hay gráficos

- **WHEN** la combinación de filtros no coincide con ningún modelo
- **THEN** el bloque gráfico muestra el mensaje de ausencia de resultados y no dibuja barras

### Requirement: Accesibilidad de las visualizaciones

Cada gráfico SHALL exponerse como imagen con descripción textual (`role="img"` y título/descripción), de modo que un lector de pantalla anuncie qué representa y cuántos modelos incluye. La tabla principal SHALL seguir siendo la fuente exacta de los valores.

#### Scenario: Lector de pantalla ante el gráfico de precios

- **WHEN** un lector de pantalla recorre el bloque gráfico
- **THEN** anuncia la descripción del gráfico de precios incluyendo el número de modelos representados

### Requirement: Implementación nativa sin dependencias externas

Las gráficas SHALL dibujarse con tecnología estándar del navegador (SVG manipulado con JavaScript plano, HTML5 y CSS3), sin librerías de gráficos, frameworks ni peticiones a servicios de terceros.

#### Scenario: Renderizado sin conexión a CDNs

- **WHEN** el usuario carga la página sin acceso a CDNs ni paquetes externos
- **THEN** ambas visualizaciones se dibujan usando solo los recursos locales de la página
