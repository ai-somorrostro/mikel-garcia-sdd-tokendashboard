# Spec Delta

## Purpose

Permitir al usuario ordenar la tabla de modelos por cualquier columna y filtrarla por nombre y modalidades, para localizar y comparar modelos sin inspección visual fila a fila.

## ADDED Requirements

### Requirement: Ordenación por columna con alternancia ascendente y descendente

La tabla SHALL permitir ordenar por cualquier columna pulsando su cabecera: la primera pulsación ordena de forma ascendente, la siguiente sobre la misma columna ordena de forma descendente, y así alternativamente. Solo una columna SHALL estar activa como criterio de ordenación a la vez. La columna activa SHALL mostrar un indicador visual (▲ ascendente / ▼ descendente). Antes de la primera pulsación, la tabla SHALL mantener el orden original del fichero de datos sin indicador.

#### Scenario: Primera pulsación ordena ascendente con indicador

- **WHEN** el usuario pulsa la cabecera de una columna sin ordenación activa
- **THEN** las filas se reordenan de forma ascendente según esa columna y la cabecera muestra el indicador ▲

#### Scenario: Segunda pulsación invierte a descendente

- **WHEN** el usuario pulsa de nuevo la cabecera de la columna con orden ascendente activo
- **THEN** las filas se reordenan de forma descendente y la cabecera muestra el indicador ▼

#### Scenario: Cambio de columna mueve el criterio e indicador

- **WHEN** el usuario pulsa la cabecera de otra columna con una ordenación activa
- **THEN** la ordenación anterior se descarta, la nueva columna ordena de forma ascendente con su indicador ▲ y la columna anterior queda sin indicador

#### Scenario: Columnas numéricas se comparan como números

- **WHEN** el usuario ordena una columna numérica (precios por token, TTFT o consumos de tokens)
- **THEN** el sistema compara los valores numéricamente, de modo que `7e-08` ordena antes que `5.5e-07` en ascendente

#### Scenario: Columnas de texto ordenan alfabéticamente

- **WHEN** el usuario ordena la columna de nombre de modelo o de modalidades
- **THEN** las filas se ordenan alfabéticamente por el texto de la celda

### Requirement: Filtro por nombre de modelo

La página SHALL ofrecer un campo de texto que filtra las filas por subcadena del nombre del modelo, de forma case-insensitive. Vaciar el campo SHALL restaurar todas las filas (dentro de los demás filtros activos).

#### Scenario: Búsqueda por subcadena insensible a mayúsculas

- **WHEN** el usuario escribe "deep" en el campo de búsqueda
- **THEN** la tabla muestra únicamente DeepSeek-V3 y DeepSeek-R1

#### Scenario: Limpiar la búsqueda restaura filas

- **WHEN** el usuario vacía el campo de búsqueda
- **THEN** la tabla vuelve a mostrar todos los modelos compatibles con los demás filtros activos

### Requirement: Filtro por modalidad de entrada y salida

La página SHALL ofrecer controles de selección para filtrar por modalidad de entrada y por modalidad de salida, cada uno con una opción que no filtra (p. ej. "Todas"). Ambos filtros SHALL combinarse entre sí, con la búsqueda por nombre y con la ordenación activa.

#### Scenario: Filtrar por modalidad de entrada

- **WHEN** el usuario selecciona la modalidad de entrada `Text+Image`
- **THEN** la tabla muestra únicamente Mistral Small 3.1 y Gemma 3 27B

#### Scenario: Combinación de filtros y ordenación

- **WHEN** hay activos a la vez búsqueda por nombre, filtro de modalidad y una columna ordenada
- **THEN** la tabla muestra solo las filas que cumplen todos los filtros, ordenadas según la columna activa

### Requirement: Conteo de resultados y estado sin coincidencias

La página SHALL mostrar cuántos modelos están visibles respecto al total (p. ej. "N de 10 modelos") y SHALL mostrar un mensaje visible cuando ningún modelo coincida con los filtros activos.

#### Scenario: Contador actualizado al filtrar

- **WHEN** los filtros activos dejan 2 modelos visibles de 10
- **THEN** el sistema indica "2 de 10 modelos" (o texto equivalente)

#### Scenario: Sin coincidencias

- **WHEN** la combinación de filtros no coincide con ningún modelo
- **THEN** el cuerpo de la tabla queda vacío y se muestra un mensaje que explica que no hay resultados para los filtros activos

### Requirement: Funcionamiento autónomo sin dependencias externas

La ordenación y el filtrado SHALL funcionar con tecnologías estándar del navegador (HTML5, CSS3 y JavaScript plano), sin librerías, frameworks externos ni peticiones a servicios de terceros.

#### Scenario: Interacción sin conexión a CDNs

- **WHEN** el usuario ordena o filtra sin acceso a CDNs ni paquetes externos
- **THEN** todas las interacciones responden usando solo los recursos locales de la página
